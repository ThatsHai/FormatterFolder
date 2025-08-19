import { useState, useMemo } from "react";
import PropTypes from "prop-types";

const DynamicTable = ({ html, value, handleChange, name }) => {
  const [rows, setRows] = useState(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(value || html, "text/html");

    console.log(html);
    const headers = Array.from(doc.querySelectorAll("table thead th")).map(
      (th) => th.textContent.trim()
    );

    const parsedRows = Array.from(doc.querySelectorAll("table tbody tr")).map(
      (tr) => {
        const cells = Array.from(tr.querySelectorAll("td"));
        const row = {};
        headers.forEach((h, i) => {
          row[h] = cells[i]?.textContent.trim() || "";
        });
        return row;
      }
    );

    // Nếu không có hàng nào, tạo hàng trống
    if (parsedRows.length === 0) {
      const emptyRow = {};
      headers.forEach((h) => (emptyRow[h] = ""));
      return [emptyRow];
    }

    return parsedRows;
  });

  const headers = useMemo(() => {
    if (!html) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll("table thead th")).map((th) =>
      th.textContent.trim()
    );
  }, [html]);

  const generateTableHTML = (dataRows = rows) => {
    const thead = `<thead><tr>${headers
      .map((h) => `<th>${h}</th>`)
      .join("")}</tr></thead>`;
    const tbody = `<tbody>${dataRows
      .map(
        (row) =>
          `<tr>${headers.map((h) => `<td>${row[h] || ""}</td>`).join("")}</tr>`
      )
      .join("")}</tbody>`;
    return `<table>${thead}${tbody}</table>`;
  };

  const emitChange = (updatedRows) => {
    const htmlValue = generateTableHTML(updatedRows);
    const prefix = html.split(":::")[0] || "";
    const attachQuestion = prefix + (":::") + htmlValue;
    const syntheticEvent = {
      target: {
        name,
        value: attachQuestion,
      },
    };
    handleChange(syntheticEvent);
  };

  const handleCellChange = (rowIndex, header, value) => {
    const updatedRows = rows.map((row, i) =>
      i === rowIndex ? { ...row, [header]: value } : row
    );
    setRows(updatedRows);
    emitChange(updatedRows);
  };

  const addRowAbove = (index) => {
    const newRow = {};
    headers.forEach((h) => (newRow[h] = ""));
    const updated = [...rows.slice(0, index), newRow, ...rows.slice(index)];
    setRows(updated);
    emitChange(updated);
  };

  const addRowBelow = (index) => {
    const newRow = {};
    headers.forEach((h) => (newRow[h] = ""));
    const updated = [
      ...rows.slice(0, index + 1),
      newRow,
      ...rows.slice(index + 1),
    ];
    setRows(updated);
    emitChange(updated);
  };

  const deleteRow = (index) => {
    if (rows.length === 1) return;
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    emitChange(updated);
  };

  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (e, rowIndex) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
      rowIndex,
    });
  };
  const autoResize = (e) => {
    e.target.style.height = "auto"; // reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // set to scroll height
  };

  return (
    <div className="p-4 relative">
      <div className="flex justify-end mb-2 relative">
        <p className="font-semibold text-lg w-[100%] text-left">
          {html.split(":::")[0] || ""}
        </p>
        <div className="group relative cursor-pointer">
          <span className="text-blue-600 text-sm">ℹ️</span>
          <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-300 rounded shadow-md p-2 text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            Đây là bảng nhập liệu động. Bạn có thể thêm, xoá hoặc chỉnh sửa các
            hàng bằng chuột phải.
          </div>
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="border border-gray-300 p-2 text-center">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onContextMenu={(e) => handleContextMenu(e, rowIndex)}
              className="hover:bg-gray-50"
            >
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="border px-2">
                  <textarea
                    value={row[header] || ""}
                    onChange={(e) => {
                      handleCellChange(rowIndex, header, e.target.value);
                      autoResize(e);
                    }}
                    className="w-full p-1 outline-none resize-none overflow-hidden"
                    style={{ height: "auto" }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {contextMenu && (
        <div
          className="fixed bg-white border shadow-md rounded-md p-2 z-50 flex gap-2"
          style={{
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
          }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            className="px-2 py-1 bg-blue-600 text-white rounded"
            onClick={(e) => {
              e.preventDefault();
              addRowAbove(contextMenu.rowIndex);
            }}
          >
            + Trên
          </button>
          <button
            className="px-2 py-1 bg-sky-500 text-white rounded"
            onClick={(e) => {
              e.preventDefault();
              addRowBelow(contextMenu.rowIndex);
            }}
          >
            + Dưới
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded"
            onClick={(e) => {
              e.preventDefault();
              deleteRow(contextMenu.rowIndex);
            }}
          >
            Xoá
          </button>
        </div>
      )}
    </div>
  );
};

DynamicTable.propTypes = {
  html: PropTypes.string.isRequired,
  value: PropTypes.array,
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default DynamicTable;
