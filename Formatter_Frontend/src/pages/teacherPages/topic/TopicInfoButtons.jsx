import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useState } from "react";

import ConfirmationPopup from "../../../component/ConfirmationPopup";
import api from "../../../services/api";
import SuccessPopup from "../../../component/SuccessPopup";
import { useNavigate } from "react-router-dom";
import TopicSuggestionPage from "../TopicSuggestionPage";
const TopicInfoButtons = ({ topic, onUpdated = () => {} }) => {
  const user = useSelector((state) => state.auth.user);

  const [openTopicForm, setIsTopicFormOpen] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [text, setText] = useState("");
  const [successPopupText, setSuccessPopupText] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  const handleFormToggle = async () => {
    // const result = await api.get("/myInfo");
    // const userId = result.data.result.useId;
    // console.log(result.data.result.userId);
    // if (userId === "") {
    //   alert("Phiên đăng nhập hết hạn");
    //   navigate("/login");
    // }
    console.log("Đã mở form chỉnh sửa đề tài");
    setIsTopicFormOpen((prev) => !prev);
  };

  // const sendRecord = async () => {
  //   await api.put(
  //     `/formRecords/${formRecord.formRecordId}/send`,
  //   );

  //   setShowSuccessPopup(true);
  //   setShowConfirmPopup(false);
  // };

  const deleteTopic = async () => {
    // await api.delete(`/formRecords/delete/${formRecord.formRecordId}`);

    setShowSuccessPopup(true);
    setShowConfirmPopup(false);
  };

  const publicTopic = async () => {
    // await api.delete(`/formRecords/delete/${formRecord.formRecordId}`);

    setShowSuccessPopup(true);
    setShowConfirmPopup(false);
  };

  const handlePublicTopic = () => {
    if (topic.status === "PUBLISHED") {
      alert("Đề tài đã được công khai trước đó");
      return;
    }
    setShowConfirmPopup(true);
    setText("Bạn chắc chắn muốn công khai đề tài");
    setSuccessPopupText("Đã công khai đề tài!");
    setConfirmAction("public");
  };
  const handleDeleteTopic = async () => {
    setShowConfirmPopup(true);
    setText("Bạn chắc chắn muốn xoá đề tài này?");
    setSuccessPopupText("Đã xoá đề tài!");
    setConfirmAction("delete");
  };
  const onSuccessPopupClosed = () => {
    setShowConfirmPopup(false);
    setShowSuccessPopup(false);
    if (confirmAction === "delete") {
      navigate("/teacher/topics");
    } else {
      onUpdated();
    }
  };

  if (!topic) return <div>Đang tải</div>;
  console.log("topic truyền vào:", topic);
  return (
    <div className="flex w-full justify-end my-5 gap-5">
      <div>
        <button
          className="border p-2 rounded-md px-5 bg-white"
          onClick={handleFormToggle}
        >
          Chỉnh sửa
        </button>
        <button
          className="border p-2 rounded-md px-5 bg-white"
          onClick={handleDeleteTopic}
        >
          Xoá
        </button>
        <button
          className="border p-2 rounded-md px-5 bg-white"
          onClick={handlePublicTopic}
        >
          Công khai
        </button>
        {openTopicForm && (
          <TopicSuggestionPage
            initialData={topic}
            handleFormToggle={handleFormToggle}
            onSuccess={() => {
              handleFormToggle();
              onUpdated();
            }}
          ></TopicSuggestionPage>
        )}

        <ConfirmationPopup
          isOpen={showConfirmPopup}
          text={text}
          onConfirm={() => {
            if (confirmAction === "public") {
              publicTopic();
            } else if (confirmAction === "delete") {
              deleteTopic();
            }
          }}
          onDecline={() => setShowConfirmPopup(false)}
        />
        <SuccessPopup
          isOpen={showSuccessPopup}
          successPopupText={successPopupText}
          onClose={onSuccessPopupClosed}
        />
      </div>
    </div>
  );
};

export default TopicInfoButtons;

TopicInfoButtons.propTypes = {
  topic: PropTypes.object,
  onUpdated: PropTypes.func,
};

//Thêm phần show popup thành công cho cả cập nhật và submit
