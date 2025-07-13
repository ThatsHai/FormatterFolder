import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PropTypes from "prop-types";
import api from "../../../services/api";

const DisplayObjectInfo = ({
  objectInfo = {},
  handleSelectFaculty = () => {},
  handleSelectDepartment = () => {},
  handleSelectMajor = () => {},
  handleSelectStudentClass = () => {},
  setUpdatingObject = () => {},
  setOpenAddForm = () => {},
}) => {
  const [showTable, setShowTable] = useState(true);

  if (!objectInfo || Object.keys(objectInfo).length === 0) return null;
  

  const handleEdit = (item) => {
    if (item.majorId) {
      handleSelectMajor(item);
    } else if (item.departmentId) {
      handleSelectDepartment(item);
    } else if (item.studentClassId) {
      handleSelectStudentClass(item);
    }
  };

  const getParentItem = async (item, level) => {
    try {
      if (level === "studentClass") {
        const resultMajor = await api.get(
          `/classes/getParents?classId=${item.id}`
        );
        const majorId = resultMajor.data.result.majorId;
        if (!majorId) throw new Error("Không tìm thấy major.");
        const response = await api.get(`/majors?majorId=${majorId}`);
        if (response.data.result.length === 0)
          throw new Error("Không tìm thấy major.");
        handleSelectMajor(response.data.result[0]);
        return response.data.result[0];
      }

      if (level === "major") {
        const resultDepartment = await api.get(
          `/majors/getParents?majorId=${item.id}`
        );
        const departmentId = resultDepartment.data.result.departmentId;
        if (!departmentId) throw new Error("Không tìm thấy department.");
        const response = await api.get(
          `/departments?departmentId=${departmentId}`
        );
        if (response.data.result.length === 0)
          throw new Error("Không tìm thấy department.");
        handleSelectDepartment(response.data.result[0]);
        return response.data.result[0];
      }

      if (level === "department") {
        const resultFaculty = await api.get(
          `/departments/getParents?departmentId=${item.id}`
        );
        const facultyId = resultFaculty.data.result.facultyId;
        if (!facultyId) throw new Error("Không tìm thấy faculty.");
        const response = await api.get(`/faculties?facultyId=${facultyId}`);
        if (response.data.result.length === 0)
          throw new Error("Không tìm thấy faculty.");
        handleSelectFaculty(response.data.result[0]);
        return response.data.result[0];
      }

      throw new Error("Unsupported level.");
    } catch (error) {
      console.error("Error in getParentItem:", error.message);
      alert(error.message);
      return null;
    }
  };

  const getLabel = (level) => {
    switch (level) {
      case "major":
        return "ngành";
      case "department":
        return "môn";
      case "faculty":
        return "khoa";
      case "studentClass":
        return "lớp";
      default:
        return "đơn vị";
    }
  };
  
  return (
    <div className="grid grid-cols-1 w-full justify-center text-center items-center font-textFont mt-4">
      <div className="flex justify-center items-center gap-2 mb-1 relative">
        <div
          onClick={() => getParentItem(objectInfo, objectInfo.level)}
          className="hover:cursor-pointer"
        >
          {objectInfo && objectInfo.level && objectInfo.level !== "faculty" && (
            <span className="mr-5 absolute top-1 left-5">{"<"}</span>
          )}
        </div>
        <span className="text-2xl font-semibold">{objectInfo.name}</span>
        <div onClick={() => setShowTable((prev) => !prev)}>
          {showTable ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </div>
      </div>
      <h1 className="text-md mb-3">Mã id: {objectInfo.id}</h1>

      {showTable && (
        <div className="w-full my-2">
          {objectInfo.content.length > 0 ? (
            <table className="w-5/6 border mx-auto text-left">
              <thead className="bg-lightBlue text-white">
                <tr>
                  <th className="border border-darkBlue py-1 text-center">
                    STT
                  </th>
                  <th className="border border-darkBlue py-1 text-center">
                    Mã đơn vị con
                  </th>
                  <th className="border border-darkBlue py-1 text-center">
                    Tên đơn vị con
                  </th>
                  <th className="border border-darkBlue py-1 text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {objectInfo.content.map((item, index) => (
                  <tr
                    key={
                      item.id ||
                      item.departmentId ||
                      item.majorId ||
                      item.studentClassId
                    }
                    className="hover:bg-gray-100"
                  >
                    <td className="border border-darkBlue py-1 text-center">{index + 1}</td>
                    <td className="border border-darkBlue py-1 text-center">
                      {item.studentClassId ||
                        item.departmentId ||
                        item.majorId ||
                        item.id}
                    </td>
                    <td className="border border-darkBlue py-1 text-center">
                      {item.studentClassName ||
                        item.departmentName ||
                        item.majorName ||
                        item.name}
                    </td>
                    <td className="border border-darkBlue py-1 text-center">
                      <IconButton size="small" onClick={() => handleEdit(item)}>
                        <ArrowForwardIcon fontSize="small" />
                      </IconButton>
                      {/* <IconButton
                        size="small"
                        onClick={() =>
                          handleRedirect(
                            item.departmentId || item.majorId || item.id
                          )
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton> */}
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
        <div className="w-5/6 flex justify-end gap-3">
          {/* <button
            className="border p-2 px-6 rounded-md mb-4 mt-2 hover:bg-lightGray"
            onClick={() => {
              setOpenAddForm(true);
              setUpdatingObject({});
            }}
          >
            Thêm {getLabel(objectInfo.level)} mới
          </button> */}
          <button
            className="text-white p-2 px-6 rounded-md mb-4 mt-2 bg-lightBlue font-semibold hover:bg-blue-500"
            onClick={() => {
              setOpenAddForm(true);
              setUpdatingObject(objectInfo);
            }}
          >
            Chỉnh sửa {getLabel(objectInfo.level)}
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
  handleSelectStudentClass: PropTypes.func,
  setUpdatingObject: PropTypes.func,
  setOpenAddForm: PropTypes.func,
};
