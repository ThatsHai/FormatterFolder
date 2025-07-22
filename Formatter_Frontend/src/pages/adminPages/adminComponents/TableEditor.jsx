import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const TableEditor = ({ onChange }) => {
  const [columns, setColumns] = useState(["Cột 1", "Cột 2"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const html = generateTableHTML();
    onChange(html);
  }, [columns]);

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
    setSelectedIndex(index);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const addColumn = (position) => {
    const newColumns = [...columns];
    const newLabel = `Cột ${columns.length + 1}`;
    if (position === "left") newColumns.splice(selectedIndex, 0, newLabel);
    else newColumns.splice(selectedIndex + 1, 0, newLabel);
    setColumns(newColumns);
    handleCloseMenu();
  };

  const deleteColumn = () => {
    if (columns.length <= 1) return;
    const newColumns = columns.filter((_, idx) => idx !== selectedIndex);
    setColumns(newColumns);
    handleCloseMenu();
  };

  const updateColumnName = (index, value) => {
    const updated = [...columns];
    updated[index] = value;
    setColumns(updated);
  };

  const generateTableHTML = () => {
    const headers = columns.map((col) => `<th>${col}</th>`).join("");
    return `<table><thead><tr>${headers}</tr></thead></table>`;
  };

  return (
    <div className="overflow-x-auto text-darkGray border border-lightGray">
      <table className="table-auto w-full border-collapse">
        <thead className="bg-lightGray">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                onContextMenu={(e) => handleContextMenu(e, index)}
                className="p-2 relative cursor-context-menu"
              >
                <input
                  className="w-full px-2 py-1 border rounded-md text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={col}
                  onChange={(e) => updateColumnName(index, e.target.value)}
                />
              </th>
            ))}
          </tr>
        </thead>
      </table>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={() => addColumn("left")}>
          <AddIcon fontSize="small" className="mr-2 text-darkBlue" />
          Thêm cột bên trái
        </MenuItem>
        <MenuItem onClick={() => addColumn("right")}>
          <AddIcon fontSize="small" className="mr-2 text-darkBlue" />
          Thêm cột bên phải
        </MenuItem>
        <MenuItem onClick={deleteColumn} disabled={columns.length <= 1}>
          <DeleteIcon fontSize="small" className="mr-2 text-redError" /> Xoá cột
        </MenuItem>
      </Menu>
    </div>
  );
};

TableEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default TableEditor;
