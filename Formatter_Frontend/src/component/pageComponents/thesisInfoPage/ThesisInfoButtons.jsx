import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useState } from "react";
import DesignsListWindow from "../../DesignListWindow";
import SubmitThesisForm from "../../forms/SubmitThesisForm";
import ConfirmationPopup from "../../ConfirmationPopup";
import api from "../../../services/api";
import SuccessPopup from "../../SuccessPopup";
import { useNavigate } from "react-router-dom";
const ThesisInfoButtons = ({ formRecord, onUpdated = () => {} }) => {
  const user = useSelector((state) => state.auth.user);

  const [showDesignWindow, setShowDesignWindow] = useState(false);
  const [openThesisForm, setIsThesisFormOpen] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [text, setText] = useState("");
  const [successPopupText, setSuccessPopupText] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = () => {
    setShowDesignWindow(true);
  };

  const handleFormToggle = async () => {
    // const result = await api.get("/myInfo");
    // const userId = result.data.result.useId;
    // console.log(result.data.result.userId);
    // if (userId === "") {
    //   alert("Phiên đăng nhập hết hạn");
    //   navigate("/login");
    // }
    setIsThesisFormOpen((prev) => !prev);
  };

  const sendRecord = async () => {
    await api.put(
      `/formRecords/${formRecord.formRecordId}/send`,
    );

    setShowSuccessPopup(true);
    setShowConfirmPopup(false);
  };

  const deleteRecord = async () => {
    await api.delete(`/formRecords/delete/${formRecord.formRecordId}`);

    setShowSuccessPopup(true);
    setShowConfirmPopup(false);
  };

  const handleSendRecord = () => {
    if (formRecord.status === "WAITING") {
      alert("Bản ghi đã được gửi và đang chờ duyệt, không thể gửi lại");
      return;
    }
    setShowConfirmPopup(true);
    setText("Bạn chắc chắn muốn gửi bản ghi cho giảng viên?");
    setSuccessPopupText("Đã gửi bản ghi cho giảng viên!");
    setConfirmAction("send");
  };
  const handleDeleteRecord = async () => {
    setShowConfirmPopup(true);
    setText("Bạn chắc chắn muốn xoá bản ghi này?");
    setSuccessPopupText("Đã xoá bản ghi!");
    setConfirmAction("delete");
  };
  const onSuccessPopupClosed = () => {
    setShowConfirmPopup(false);
    setShowSuccessPopup(false);
    if (confirmAction === "delete") {
    navigate("/student");
  } else {
    onUpdated();
  }
  };

  if (!formRecord) return <div>Đang tải</div>;
  console.log("record truyền vào:", formRecord);
  return (
    <div className="flex w-full justify-end my-5 gap-5">
      <div>
        <button
          className="border p-2 rounded-md px-5 bg-white"
          onClick={handleCardClick}
        >
          Xuất file PDF
        </button>
        {user.role.name === "STUDENT" ? (
          <>
            <button
              className="border p-2 rounded-md px-5 bg-white"
              onClick={() =>
                navigate(`/diff-viewer/${formRecord.formRecordId}`)
              }
            >
              Xem lịch sử sửa
            </button>
            <button
              className="border p-2 rounded-md px-5 bg-white"
              onClick={handleFormToggle}
            >
              Chỉnh sửa
            </button>
            <button
              className="border p-2 rounded-md px-5 bg-white"
              onClick={handleDeleteRecord}
            >
              Xoá
            </button>
            <button
              className="border p-2 rounded-md px-5 bg-white"
              onClick={handleSendRecord}
            >
              Gửi bài
            </button>
          </>
        ) : (
          <>
            <button className="border p-2 rounded-md px-5 bg-white">
              Phê duyệt
            </button>
          </>
        )}
        {showDesignWindow && (
          <DesignsListWindow
            formId={formRecord.topic.form.formId}
            formRecordId={formRecord.formRecordId}
            onDecline={() => setShowDesignWindow(false)}
          ></DesignsListWindow>
        )}
        {openThesisForm && (
          <SubmitThesisForm
            initialData={formRecord}
            handleFormToggle={handleFormToggle}
            onSuccess={() => {
              handleFormToggle();
              onUpdated();
            }}
          />
        )}

        <ConfirmationPopup
          isOpen={showConfirmPopup}
          text={text}
          onConfirm={() => {
            if (confirmAction === "send") {
              sendRecord();
            } else if (confirmAction === "delete") {
              deleteRecord();
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

export default ThesisInfoButtons;

ThesisInfoButtons.propTypes = {
  formRecord: PropTypes.object,
  onUpdated: PropTypes.func,
};

//Thêm phần show popup thành công cho cả cập nhật và submit
