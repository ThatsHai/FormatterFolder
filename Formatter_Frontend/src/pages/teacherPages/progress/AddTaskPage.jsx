import { useState } from "react";
import api from "../../../services/api";
import ConfirmationPopup from "../../../component/ConfirmationPopup";
import SuccessPopup from "../../../component/SuccessPopup";

const AddTaskPage = ({
  handleFormToggle = () => {},
  onSuccess = () => {},
  initialMilestone,
}) => {
  const [name, setName] = useState("");
  const [hasAttachment, setHasAttachment] = useState(false);
  const [fileCount, setFileCount] = useState(1);
  const [description, setDescription] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [displaySuccessPopup, setDisplaySuccessPopup] = useState(false);

  const sendData = async () => {
    try {
      const data = {
        milestoneId: initialMilestone.id,
        title: name,
        requiredFile: hasAttachment,
        description,
        maxNumberOfFiles: hasAttachment ? fileCount : 0,
      };
      console.log("Task created:", data);
      const response = await api.post(`/tasks`, data);
      setDisplaySuccessPopup(true);
    } catch (e) {
      console.log(e);
    }
    setShowConfirmPopup(false);
  };

  const handleSubmit = () => {
    setShowConfirmPopup(true);
  };
    const onSuccessPopupClosed = () => {
    setShowConfirmPopup(false);
    setDisplaySuccessPopup(false);
    onSuccess();
  };


  return (
    <div>
      <button
        className="absolute -top-4 -right-4 px-3 py-1 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
        onClick={handleFormToggle}
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
        Thêm công việc
      </h2>

      <div className="m-4">
        <label className="block font-semibold mb-1">1. TÊN CÔNG VIỆC</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên công việc"
          className="w-full border-b border-blue-300 focus:outline-none py-1"
        />
      </div>
      <div className="m-4">
        <label className="block font-semibold mb-1">2. MÔ TẢ</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập mô tả công việc"
          className="w-full border-b border-blue-300 focus:outline-none py-1"
        />
      </div>

      <div className="m-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={hasAttachment}
            onChange={(e) => setHasAttachment(e.target.checked)}
            className="mr-2"
          />
          Có file đính kèm
        </label>
      </div>

      {hasAttachment && (
        <div className="m-4">
          <label className="block font-semibold mb-1">
            Số lượng file đính kèm tối đa
          </label>
          <select
            value={fileCount}
            onChange={(e) => setFileCount(Number(e.target.value))}
            className="border border-gray-400 px-3 py-1 rounded w-1/4"
          >
            {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="bg-darkBlue text-white px-6 py-2 rounded hover:bg-lightBlue disabled:opacity-50"
        >
          Thêm công việc
        </button>
      </div>
        {showConfirmPopup && (
              <ConfirmationPopup
                isOpen={true}
                text={"Bạn chắc chắn muốn thêm công việc này?"}
                onConfirm={() => {
                  setShowConfirmPopup(false);
                  sendData();
                }}
                onDecline={() => {
                  setShowConfirmPopup(false);
                }}
              ></ConfirmationPopup>
            )}
            {displaySuccessPopup && (
              <SuccessPopup
                isOpen={true}
                successPopupText={"Thêm công việc thành công!"}
                onClose={onSuccessPopupClosed}
              />
            )}
    </div>
  );
};

export default AddTaskPage;
