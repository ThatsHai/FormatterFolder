import { useState, useEffect, useRef } from "react";

import CustomizableInput from "../../../component/CustomizableInput";
import { CustomToolbar } from "../../../component/CustomizableInput";
import PropTypes from "prop-types";

const GridBoard = ({ onUpdateDesignInfo = () => {}, gridSize = 12, cellSize = 50 }) => {
  
  const editorRefs = useRef({});

  const [startCell, setStartCell] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);
  const [mergeRegions, setMergeRegions] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(null);

  useEffect(() => console.log(focusedIndex), [focusedIndex]);

  useEffect(() => {
    function handleGlobalMouseUp() {
      if (!startCell) return;
      setStartCell(null);
      setHoverCell(null);
    }
    if (startCell) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [startCell]);

  const handleMouseDown = (row, col) => {
    setStartCell({ row, col });
    setHoverCell(null);
  };

  const handleMouseEnter = (row, col) => {
    if (startCell) {
      setHoverCell({ row, col });
    }
  };

  const handleMouseUp = (row, col) => {
    if (!startCell) return;

    const top = Math.min(startCell.row, row);
    const left = Math.min(startCell.col, col);
    const bottom = Math.max(startCell.row, row);
    const right = Math.max(startCell.col, col);

    const newRegion = {
      top,
      left,
      width: right - left + 1,
      height: bottom - top + 1,
      text: "",
      fromDrag: false,
    };

    const overlaps = mergeRegions.some((region) =>
      regionsOverlap(region, newRegion)
    );

    if (!overlaps) {
      setMergeRegions((prev) => [...prev, newRegion]);
      handlePrintData();
    }

    setStartCell(null);
    setHoverCell(null);
  };

  const regionsOverlap = (a, b) => {
    return !(
      a.left + a.width - 1 < b.left ||
      b.left + b.width - 1 < a.left ||
      a.top + a.height - 1 < b.top ||
      b.top + b.height - 1 < a.top
    );
  };

  const isCovered = (row, col) => {
    return mergeRegions.some((region) => {
      return (
        row >= region.top &&
        row < region.top + region.height &&
        col >= region.left &&
        col < region.left + region.width
      );
    });
  };

  const isInSelection = (row, col) => {
    if (!startCell || !hoverCell) return false;
    const top = Math.min(startCell.row, hoverCell.row);
    const left = Math.min(startCell.col, hoverCell.col);
    const bottom = Math.max(startCell.row, hoverCell.row);
    const right = Math.max(startCell.col, hoverCell.col);
    return row >= top && row <= bottom && col >= left && col <= right;
  };

  // Main function to generate print data with filling gaps
  const generateOptimizedCellData = () => {
    const visited = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(false)
    );

    const gridMap = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(null)
    );

    mergeRegions.forEach((region, index) => {
      for (let r = region.top; r < region.top + region.height; r++) {
        for (let c = region.left; c < region.left + region.width; c++) {
          gridMap[r][c] = index;
        }
      }
    });

    const result = [];

    for (let r = gridSize - 1; r >= 0; r--) {
      for (let c = gridSize - 1; c >= 0; c--) {
        if (visited[r][c]) continue;

        const regionIndex = gridMap[r][c];

        // If it's part of a merged region
        if (regionIndex !== null) {
          const region = mergeRegions[regionIndex];
          const isTopLeft = region.top === r && region.left === c;

          if (isTopLeft) {
            result.push({
              text: region.text || "",
              colspan: region.width,
              rowspan: region.height,
              top: r,
              left: c,
            });

            // Mark visited
            for (let rr = region.top; rr < region.top + region.height; rr++) {
              for (
                let cc = region.left;
                cc < region.left + region.width;
                cc++
              ) {
                visited[rr][cc] = true;
              }
            }
          } else {
            visited[r][c] = true;
          }
        } else {
          // Empty, unmerged cell — try to span it
          let minCol = c;
          while (
            minCol - 1 >= 0 &&
            !visited[r][minCol - 1] &&
            gridMap[r][minCol - 1] === null
          ) {
            minCol--;
          }

          const spanWidth = c - minCol + 1;

          let minRow = r;
          let canExpand = true;
          while (canExpand && minRow - 1 >= 0) {
            for (let cc = minCol; cc <= c; cc++) {
              if (visited[minRow - 1][cc] || gridMap[minRow - 1][cc] !== null) {
                canExpand = false;
                break;
              }
            }
            if (canExpand) minRow--;
          }

          const spanHeight = r - minRow + 1;

          // Mark all as visited
          for (let rr = minRow; rr <= r; rr++) {
            for (let cc = minCol; cc <= c; cc++) {
              visited[rr][cc] = true;
            }
          }

          result.push({
            text: "",
            colspan: spanWidth,
            rowspan: spanHeight,
            top: minRow,
            left: minCol,
          });

          // Skip over already processed left-side cells
          c = minCol;
        }
      }
    }

    return result;
  };

  const handlePrintData = () => {
    const data = generateOptimizedCellData();
    data.reverse();
    console.log("Grid Print Data:", data);
    data.pop();
    onUpdateDesignInfo("cells", data);
    console.log("Grid Print Data:", data);
  };

  const getToolbarPosition = () => {
    if (focusedIndex === null) return { display: "none" };

    const region = mergeRegions[focusedIndex];
    if (!region) return { display: "none" };

    // Position toolbar 5px right of the merged cell block, aligned top with the cell block
    const top = region.top * cellSize;
    const left = (region.left + region.width) * cellSize + 5;

    return {
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 1000,
      backgroundColor: "white",
      border: "1px solid #ccc",
      padding: "4px",
      borderRadius: "4px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    };
  };

  const handleDeleteRegion = (index) => {
    setMergeRegions((prev) => prev.filter((_, i) => i !== index));
    setFocusedIndex(null);
    handlePrintData();
  };

  const handleFormat = (format, value) => {
    if (focusedIndex === null) return;
    const editor = editorRefs.current[focusedIndex];
    if (!editor) return;

    const quill = editor.getEditor();
    const currentFormat = quill.getFormat();

    if (format === "list") {
      if (currentFormat.list === value) {
        // If already the same list type, toggle off
        quill.format("list", false);
      } else {
        // Switch or apply new list type
        quill.format("list", value);
      }
    } else if (format === "align") {
      if (currentFormat.align === value) {
        // Toggle off alignment (reset)
        quill.format("align", false);
      } else {
        quill.format("align", value);
      }
    } else {
      // Other formats toggle true/false as before
      const isActive = currentFormat[format] === true;
      quill.format(format, !isActive);
    }
  };

  return (
    <>
      <div
        className="grid gap-[1px] relative select-none justify-center"
        style={{
          width: gridSize * cellSize + "px",
          height: gridSize * cellSize + "px",
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        }}
      >
        {/* Render merged regions */}
        {mergeRegions.map((region, index) => (
          <CustomizableInput
            key={`merged-${index}`}
            text={region.text}
            ref={(el) => (editorRefs.current[index] = el)}
            className="font-textFont text-2xl"
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            readOnly={region.fromDrag}
            onChange={(newText) => {
              setMergeRegions((prev) => {
                const copy = [...prev];
                copy[index] = { ...copy[index], text: newText };
                return copy;
              });
            }}
            onDrop={(e) => {
              e.preventDefault();
              const data = e.dataTransfer.getData("text/plain");
              if (!data) return;
              const droppedField = JSON.parse(data);

              setMergeRegions((prev) => {
                const copy = [...prev];
                copy[index] = {
                  ...copy[index],
                  text: "Dữ liệu từ {" + droppedField.fieldName + "}",
                  fromDrag: true,
                };
                return copy;
              });
            }}
            style={{
              gridColumn: `${region.left + 1} / span ${region.width}`,
              gridRow: `${region.top + 1} / span ${region.height}`,
              // backgroundColor:  region.fromDrag ? "#D9D9D9" : "#fff",
              border: "2px solid #3b82f6",
              fontFamily: "'BaiJamjuree', sans-serif",
              lineHeight: "2rem",
            }}
          />
        ))}
        {focusedIndex !== null && (
          <div style={getToolbarPosition()}>
            <CustomToolbar
              onFormat={handleFormat}
              onDelete={() => handleDeleteRegion(focusedIndex)}
            />
          </div>
        )}

        {/* Render individual cells */}
        {[...Array(gridSize)].flatMap((_, row) =>
          [...Array(gridSize)].map((_, col) => {
            if (isCovered(row, col)) return null;

            const isSelected = isInSelection(row, col);

            return (
              <div
                key={`${row}-${col}`}
                onMouseDown={() => handleMouseDown(row, col)}
                onMouseEnter={() => handleMouseEnter(row, col)}
                onMouseUp={() => handleMouseUp(row, col)}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  backgroundColor: isSelected ? "#dbeafe" : "#f0f0f0",
                  border: "1px dashed #ccc",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  zIndex: 1,
                }}
              />
            );
          })
        )}
      </div>

      {/* Print Data Button */}
      <button
        onClick={handlePrintData}
        style={{
          marginTop: 10,
          padding: "6px 12px",
          backgroundColor: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Print Grid Data
      </button>
    </>
  );
};

export default GridBoard;

GridBoard.propTypes = {
  onUpdateDesignInfo: PropTypes.func,
};
