import { useState } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PropTypes from "prop-types";

const DisplayObjectInfo = ({
  objectInfo,
  setObjectInfo,
  handleSelectFaculty,
  handleSelectDepartment,
  handleSelectMajor,
}) => {
  const [showTable, setShowTable] = useState(true);

  if (!objectInfo || Object.keys(objectInfo).length === 0) return null;

  const handleRedirect = (itemId) => {
    console.log("Deleting item with ID:", itemId);
    // You can call your API to delete the item here
  };

  const handleEdit = (item) => {
    if (item.majorId) {
      handleSelectMajor(item);
    } else if (item.departmentId) {
      handleSelectDepartment(item);
    }
  };

  return (
    <div className="grid grid-cols-1 w-full justify-center text-center items-center font-textFont mt-4">
      <div
        className="flex justify-center items-center gap-2 cursor-pointer"
        onClick={() => setShowTable((prev) => !prev)}
      >
        <span className="text-2xl font-semibold">{objectInfo.name}</span>
        {showTable ? <ExpandMoreIcon /> : <ChevronRightIcon />}
      </div>
      <h1 className="text-md">Mã id: {objectInfo.id}</h1>

      {showTable && (
        <div className="w-full my-2">
          {objectInfo.content.length > 0 ? (
            <table className="w-5/6 border mx-auto text-left">
              <thead className="bg-lightBlue text-white">
                <tr>
                  <th className="border border-darkGray py-1 text-center">
                    STT
                  </th>
                  <th className="border border-darkGray py-1 text-center">
                    Mã đơn vị con
                  </th>
                  <th className="border border-darkGray py-1 text-center">
                    Tên đơn vị con
                  </th>
                  <th className="border border-darkGray py-1 text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {objectInfo.content.map((item, index) => (
                  <tr
                    key={item.id || item.departmentId || item.majorId}
                    className="hover:bg-gray-100"
                  >
                    <td className="border py-1 text-center">{index + 1}</td>
                    <td className="border py-1 text-center">
                      {item.departmentId || item.majorId || item.id}
                    </td>
                    <td className="border py-1 text-center">
                      {item.departmentName || item.majorName || item.name}
                    </td>
                    <td className="border py-1 text-center">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleRedirect(
                            item.departmentId || item.majorId || item.id
                          )
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 mt-2">Không có dữ liệu con.</p>
          )}
        </div>
      )}
      <div className="w-full flex justify-center">
        <div className="w-5/6 flex justify-end">
          <button className="border p-2 px-6 rounded-md mb-4 mt-2 hover:bg-lightGray">
            Thêm trường mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayObjectInfo;

DisplayObjectInfo.propTypes = {
  objectInfo: PropTypes.object,
  setObjectInfo: PropTypes.func,
  handleSelectFaculty: PropTypes.func,
  handleSelectDepartment: PropTypes.func,
  handleSelectMajor: PropTypes.func,
};
