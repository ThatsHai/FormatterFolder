import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";


const TableEditor = () => {
  const [columns, setColumns] = useState(["Cột 1", "Cột 2", "Cột 3"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextIndex, setContextIndex] = useState(null);

  const handleContextMenu = (event, index) => {
    event.preventDefault();
    setContextIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setContextIndex(null);
  };

  const addColumn = (direction) => {
    const insertIndex = direction === "left" ? contextIndex : contextIndex + 1;
    const newCols = [...columns];
    newCols.splice(insertIndex, 0, `Cột ${columns.length + 1}`);
    setColumns(newCols);
    handleCloseMenu();
  };

  const deleteColumn = () => {
    if (columns.length === 1) return;
    const newCols = columns.filter((_, i) => i !== contextIndex);
    setColumns(newCols);
    handleCloseMenu();
  };

  const updateColumnName = (index, value) => {
    const newCols = [...columns];
    newCols[index] = value;
    setColumns(newCols);
  };

  return (
    <div className="overflow-x-auto text-darkGray border-lightGray">
      <table className="table-auto w-full border-collapse border">
        <thead className="bg-lightGray">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                onContextMenu={(e) => handleContextMenu(e, index)}
                className="p-2 border border-lightGray relative cursor-context-menu"
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
          <AddIcon fontSize="small" className="mr-2" />
          Thêm cột bên trái
        </MenuItem>
        <MenuItem onClick={() => addColumn("right")}>
          <AddIcon fontSize="small" className="mr-2" />
          Thêm cột bên phải
        </MenuItem>
        <MenuItem onClick={deleteColumn} disabled={columns.length <= 1}>
          <DeleteIcon fontSize="small" className="mr-2 text-red-500" />
          Xoá cột này
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TableEditor;