import { useState, useEffect, useRef } from "react";

import CustomizableInput from "../../../component/CustomizableInput";
import { CustomToolbar } from "../../../component/CustomizableInput";
import PropTypes from "prop-types";

const GridBoard = ({
  onUpdateDesignInfo = () => {},
  col = 12,
  row = 12,
  cellSize = 50,
  formData = {},
}) => {
  const editorRefs = useRef({});

  const [startCell, setStartCell] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);
  const [mergeRegions, setMergeRegions] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [rowSize, setRowSize] = useState(row);
  const [colSize, setColSize] = useState(col);

  useEffect(() => console.log(focusedIndex), [focusedIndex]);

  useEffect(() => {
    setMergeRegions((prevRegions) => {
      let hasChanged = false;

      const updated = prevRegions.map((region) => {
        const placeholders = region.text?.match(/\${{\s*[^}]+\s*}}/g);
        const cleaned = placeholders
          ? placeholders.map((m) => m.replace(/\${{|}}/g, "").trim())
          : [];

        const matches = cleaned.some((p) =>
          formData?.formFields?.some((field) => field.fieldName === p)
        );

        if (region.fromDataSource !== matches) {
          hasChanged = true;
          return { ...region, fromDataSource: matches };
        }

        return region;
      });

      return hasChanged ? updated : prevRegions;
    });
    onUpdateDesignInfo("cells", handlePrintData());
  }, [formData, mergeRegions]);

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

    const topPos = Math.min(startCell.row, row);
    const leftPos = Math.min(startCell.col, col);
    const bottom = Math.max(startCell.row, row);
    const right = Math.max(startCell.col, col);

    const newRegion = {
      topPos,
      leftPos,
      width: right - leftPos + 1,
      height: bottom - topPos + 1,
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
      a.leftPos + a.width - 1 < b.leftPos ||
      b.leftPos + b.width - 1 < a.leftPos ||
      a.topPos + a.height - 1 < b.topPos ||
      b.topPos + b.height - 1 < a.topPos
    );
  };

  const isCovered = (row, col) => {
    return mergeRegions.some((region) => {
      return (
        row >= region.topPos &&
        row < region.topPos + region.height &&
        col >= region.leftPos &&
        col < region.leftPos + region.width
      );
    });
  };

  const isInSelection = (row, col) => {
    if (!startCell || !hoverCell) return false;
    const topPos = Math.min(startCell.row, hoverCell.row);
    const leftPos = Math.min(startCell.col, hoverCell.col);
    const bottom = Math.max(startCell.row, hoverCell.row);
    const right = Math.max(startCell.col, hoverCell.col);
    return row >= topPos && row <= bottom && col >= leftPos && col <= right;
  };

  // Main function to generate print data with filling gaps
  const generateOptimizedCellData = () => {
    if (mergeRegions.length === 0) return [];

    const visited = Array.from({ length: rowSize }, () =>
      Array(colSize).fill(false)
    );

    const gridMap = Array.from({ length: rowSize }, () =>
      Array(colSize).fill(null)
    );

    // Fill gridMap with region indices
    mergeRegions.forEach((region, index) => {
      for (let r = region.topPos; r < region.topPos + region.height; r++) {
        for (let c = region.leftPos; c < region.leftPos + region.width; c++) {
          gridMap[r][c] = index;
        }
      }
    });

    // ⬇️ Determine which rows are partially merged
    const partiallyMergedRows = new Set();
    for (let r = 0; r < rowSize; r++) {
      let hasRegion = false;
      let hasEmpty = false;
      for (let c = 0; c < colSize; c++) {
        if (gridMap[r][c] !== null) hasRegion = true;
        else hasEmpty = true;
      }
      if (hasRegion && hasEmpty) {
        partiallyMergedRows.add(r);
      }
    }

    const result = [];

    for (let r = rowSize - 1; r >= 0; r--) {
      for (let c = colSize - 1; c >= 0; c--) {
        if (visited[r][c]) continue;

        const regionIndex = gridMap[r][c];

        if (regionIndex !== null) {
          const region = mergeRegions[regionIndex];
          const isTopLeft = region.topPos === r && region.leftPos === c;

          if (isTopLeft) {
            result.push({
              text: region.text || "",
              colSpan: region.width,
              rowSpan: region.height,
              topPos: r,
              leftPos: c,
              fromDataSource: region.fromDataSource || false,
              fromDrag: region.fromDrag || false,
            });

            for (
              let rr = region.topPos;
              rr < region.topPos + region.height;
              rr++
            ) {
              for (
                let cc = region.leftPos;
                cc < region.leftPos + region.width;
                cc++
              ) {
                visited[rr][cc] = true;
              }
            }
          } else {
            visited[r][c] = true;
          }
        } else {
          // ⚠️ Only allow filling empty cells in partially merged rows
          if (!partiallyMergedRows.has(r)) continue;

          // Empty cell — try to expand
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

          // Mark all visited
          for (let rr = minRow; rr <= r; rr++) {
            for (let cc = minCol; cc <= c; cc++) {
              visited[rr][cc] = true;
            }
          }

          result.push({
            text: "",
            colSpan: spanWidth,
            rowSpan: spanHeight,
            topPos: minRow,
            leftPos: minCol,
            fromDataSource: false,
            fromDrag: false,
          });

          c = minCol;
        }
      }
    }

    return result;
  };

  const handlePrintData = () => {
    const data = generateOptimizedCellData();
    data.reverse();
    // console.log("Grid Print Data:", data);
    // data.pop();
    onUpdateDesignInfo("cells", data);
    data.reverse();
    console.log("Grid Print Data:", data);
    //Array of data will filled cells
    return data;
  };

  const extractPlaceholders = (text) => {
    const matches = text?.match(/\${{\s*[^}]+\s*}}/g);
    return matches ? matches.map((m) => m.replace(/\${{|}}/g, "").trim()) : [];
  };

  const hasMatchingPlaceholder = (text) => {
    if (!formData?.formFields) return false;
    const placeholders = extractPlaceholders(text);
    return placeholders.some((p) =>
      formData.formFields.some((field) => field.fieldName === p)
    );
  };

  const getToolbarPosition = () => {
    if (focusedIndex === null) return { display: "none" };

    const region = mergeRegions[focusedIndex];
    if (!region) return { display: "none" };

    // Position toolbar 5px right of the merged cell block, aligned topPos with the cell block
    const topPos = region.topPos * cellSize;
    const leftPos = (region.leftPos + region.width) * cellSize + 5;

    return {
      position: "absolute",
      top: `${topPos}px`,
      left: `${leftPos}px`,
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

  const handleInsertRow = (insertAtRow) => {
    setRowSize((prev) => prev + 1);

    setMergeRegions((prevRegions) =>
      prevRegions.map((region) => {
        if (region.topPos >= insertAtRow + 1) {
          return { ...region, topPos: region.topPos + 1 };
        }
        return region;
      })
    );
  };

  const handleDeleteRow = (rowIdx) => {
    setRowSize((prev) => Math.max(1, prev - 1));
    setMergeRegions(
      (prevRegions) =>
        prevRegions
          .map((region) => {
            const { topPos, height } = region;

            // Case 1: Region ends before deleted row → keep unchanged
            if (topPos + height - 1 < rowIdx) return region;

            // Case 2: Region starts after deleted row → shift upward
            if (topPos > rowIdx) {
              return { ...region, topPos: topPos - 1 };
            }

            // Case 3: Region spans the deleted row
            if (topPos <= rowIdx && topPos + height - 1 >= rowIdx) {
              // Remove region if it's 1 row tall and that row is deleted
              if (height === 1) return null;

              // Shrink height by 1 if it spans the deleted row
              return { ...region, height: height - 1 };
            }

            return region;
          })
          .filter(Boolean) // remove nulls (deleted regions)
    );
  };

  return (
    <>
      <div
        className="grid gap-[1px] relative select-none justify-center"
        style={{
          width: colSize * cellSize + "px",
          height: rowSize * cellSize + "px",
          gridTemplateColumns: `repeat(${colSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rowSize}, ${cellSize}px)`,
        }}
      >
        {/* Render merged regions */}
        {mergeRegions.map((region, index) => (
          <CustomizableInput
            key={`merged-${index}`}
            region={region}
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
                  text: "Dữ liệu từ ${{" + droppedField.fieldName + "}}",
                  fromDrag: true,
                };
                return copy;
              });
            }}
            style={{
              gridColumn: `${region.leftPos + 1} / span ${region.width}`,
              gridRow: `${region.topPos + 1} / span ${region.height}`,
              // backgroundColor:  region.fromDrag ? "#D9D9D9" : "#fff",
              border: hasMatchingPlaceholder(region.text)
                ? "2px dashed #3b82f6"
                : "2px solid #3b82f6",

              fontFamily: "'BaiJamjuree', sans-serif",
              lineHeight: "2rem",
            }}
          />
        ))}

        {/* Row-side insert buttons */}
        <div
          className="absolute top-0 left-0"
          style={{
            width: `${colSize * cellSize}px`,
            height: `${rowSize * cellSize}px`,
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          {[...Array(rowSize)].map((_, rowIdx) => (
            <div
              key={`row-hover-${rowIdx}`}
              className="absolute group"
              style={{
                top: `${rowIdx * cellSize}px`,
                left: "0px",
                height: `${cellSize}px`,
                width: `${colSize * cellSize}px`,
                pointerEvents: "none",
              }}
            >
              <div
                className="absolute flex flex-col items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  top: `0px`,
                  left: `${colSize * cellSize}px`, // Position just outside right edge
                  height: `${cellSize}px`,
                  minWidth: "150px",
                  marginLeft: "10px",
                  pointerEvents: "auto",
                  textAlign: "left", // align text inside buttons to the left
                }}
              >
                <div
                  onClick={() => handleInsertRow(rowIdx - 1)}
                  className="text-xs px-2 bg-darkBlue text-white rounded cursor-pointer"
                >
                  + Thêm hàng trên
                </div>
                <div
                  onClick={() => handleInsertRow(rowIdx)}
                  className="text-xs px-2 bg-lightBlue text-white rounded cursor-pointer"
                >
                  + Thêm hàng dưới
                </div>
                <div
                  onClick={() => handleDeleteRow(rowIdx)}
                  className="text-xs px-2 bg-red-500 text-white rounded cursor-pointer"
                >
                  - Xóa hàng này
                </div>
              </div>
            </div>
          ))}
        </div>

        {focusedIndex !== null && (
          <div style={getToolbarPosition()}>
            <CustomToolbar
              onFormat={handleFormat}
              onDelete={() => handleDeleteRegion(focusedIndex)}
            />
          </div>
        )}

        {/* Render individual cells */}
        {[...Array(rowSize)].flatMap((_, row) =>
          [...Array(colSize)].map((_, col) => {
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
      {/* <button
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
      <button onClick={() => setRowSize((prev) => prev + 1)}>Add row</button> */}

    </>
  );
};

export default GridBoard;

GridBoard.propTypes = {
  onUpdateDesignInfo: PropTypes.func,
};
