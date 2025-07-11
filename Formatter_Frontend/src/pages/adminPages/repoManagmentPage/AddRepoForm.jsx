import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../../../services/api";

const AddRepoForm = ({
  isOpen = false,
  objectInfo = {},
  onClose,
  setRefreshKey = () => {},
  initialData = {}, // Expected format: { id, name, level }
}) => {
  const [formData, setFormData] = useState({ id: "", name: "", parentId: "" });
  const [parentList, setParentList] = useState([]);

  const currentLevel = initialData.level || objectInfo.level;

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

  // Preload formData (adding or updating)
  useEffect(() => {
    if (isOpen && !initialData.id) {
      setFormData({
        id: "",
        name: "",
        parentId: objectInfo.parentId || "", // Preselect parent
      });
    } else if (isOpen && initialData && initialData.id) {
      setFormData({
        id: initialData.id || "",
        name: initialData.name || "",
        parentId: "", // Will be fetched later
      });
    } else {
      setFormData({ id: "", name: "", parentId: "" });
    }
  }, [isOpen, initialData, objectInfo]);

  // Fetch parent and preselect it if updating
  useEffect(() => {
    const fetchParent = async () => {
      try {
        if (!initialData || !initialData.id) return;

        if (initialData.level === "studentClass") {
          const response = await api.get(
            `/classes/getParents?classId=${initialData.id}`
          );
          const majorId = response.data.result?.majorId;
          if (majorId) {
            setFormData((prev) => ({ ...prev, parentId: majorId }));
          }
        } else if (initialData.level === "major") {
          const response = await api.get(
            `/majors/getParents?majorId=${initialData.id}`
          );
          const departmentId = response.data.result?.departmentId;
          if (departmentId) {
            setFormData((prev) => ({ ...prev, parentId: departmentId }));
          }
        } else if (initialData.level === "department") {
          const response = await api.get(
            `/departments/getParents?departmentId=${initialData.id}`
          );
          const facultyId = response.data.result?.facultyId;
          if (facultyId) {
            setFormData((prev) => ({ ...prev, parentId: facultyId }));
          }
        }
      } catch (error) {
        console.error("Error fetching parent item", error);
      }
    };

    if (isOpen && initialData && initialData.id) {
      fetchParent();
    }
  }, [isOpen, initialData]);

  // Fetch parent list for dropdown
  useEffect(() => {
    const fetchParentList = async () => {
      try {
        if (currentLevel === "department") {
          const response = await api.get("/faculties");
          setParentList(response.data.result);
        } else if (currentLevel === "major") {
          const response = await api.get("/departments");
          setParentList(response.data.result);
        } else if (currentLevel === "studentClass") {
          const response = await api.get("/majors");
          setParentList(response.data.result);
        } else {
          setParentList([]);
        }
      } catch (error) {
        console.error("Error fetching parent list:", error);
      }
    };

    if (
      isOpen &&
      (currentLevel === "department" ||
        currentLevel === "major" ||
        currentLevel === "studentClass")
    ) {
      fetchParentList();
    } else {
      setParentList([]);
    }
  }, [isOpen, currentLevel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    if (
      !formData.id ||
      !formData.name ||
      (needsParent() && !formData.parentId)
    ) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      let payload = {};
      let endpoint = "";

      if (objectInfo.level === "faculty") {
        payload = { facultyId: formData.id, facultyName: formData.name };
        endpoint = "/faculties";
      } else if (objectInfo.level === "department") {
        payload = {
          departmentId: formData.id,
          departmentName: formData.name,
          faculty: { facultyId: formData.parentId },
        };
        endpoint = "/departments";
      } else if (objectInfo.level === "major") {
        payload = {
          majorId: formData.id,
          majorName: formData.name,
          department: { departmentId: formData.parentId },
        };
        endpoint = "/majors";
      } else if (objectInfo.level === "studentClass") {
        payload = {
          studentClassId: formData.id,
          studentClassName: formData.name,
          major: { majorId: formData.parentId },
        };
        endpoint = "/classes";
      }

      try {
        await api.post(endpoint, payload);
        alert("Thêm thành công.");
        setFormData({ id: "", name: "", parentId: "" });
        setRefreshKey((prev) => prev + 1);
        onClose();
      } catch (e) {
        if (
          e.response?.data?.code === "1009" &&
          e.response?.data?.message === "Duplicate key"
        ) {
          alert("Id đã tồn tại.");
        } else {
          alert("Có lỗi xảy ra.");
        }
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Thêm thất bại.");
    }
  };

  const needsParent = () => {
    return (
      currentLevel === "department" ||
      currentLevel === "major" ||
      currentLevel === "studentClass"
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[400px] text-black relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-black font-bold text-lg"
        >
          X
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {initialData && initialData.id ? "Cập nhật" : "Thêm"}{" "}
          {getLabel(currentLevel)}{" "}
          {initialData && initialData.id ? "hiện tại" : "mới"}
        </h2>

        {needsParent() && (
          <select
            className="border rounded-md px-3 py-1 w-full mb-4"
            name="parentId"
            value={formData.parentId}
            onChange={handleChange}
          >
            <option value="">
              {currentLevel === "department"
                ? "Chọn khoa"
                : currentLevel === "major"
                ? "Chọn môn"
                : "Chọn ngành"}
            </option>

            {parentList.map((parent) => (
              <option
                key={parent.facultyId || parent.departmentId || parent.majorId}
                value={
                  parent.facultyId || parent.departmentId || parent.majorId
                }
              >
                {parent.facultyName ||
                  parent.departmentName ||
                  parent.majorName}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          className="border rounded-md px-3 py-1 w-full mb-4"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder={`Nhập mã ${getLabel(currentLevel)}`}
        />

        <input
          type="text"
          className="border rounded-md px-3 py-1 w-full mb-4"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={`Nhập tên ${getLabel(currentLevel)}`}
        />

        <div className="flex justify-center gap-4">
          <button
            onClick={handleAdd}
            className="bg-darkBlue text-white px-4 py-1 rounded-md hover:bg-blue-700"
          >
            Lưu
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-1 rounded-md hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRepoForm;

AddRepoForm.propTypes = {
  isOpen: PropTypes.bool,
  objectInfo: PropTypes.object,
  onClose: PropTypes.func,
  setRefreshKey: PropTypes.func,
  initialData: PropTypes.object,
};
