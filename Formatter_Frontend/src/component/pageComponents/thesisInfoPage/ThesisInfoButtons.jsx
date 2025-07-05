import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useState } from "react";
import DesignsListWindow from "../../DesignListWindow";
import SubmitThesisForm from "../../forms/SubmitThesisForm";
import ConfirmationPopup from "../../ConfirmationPopup";
import api from "../../../services/api";
import SuccessPopup from "../../SuccessPopup";
const ThesisInfoButtons = ({ formRecord, onUpdated = () => {} }) => {
  const user = useSelector((state) => state.auth.user);

  const [showDesignWindow, setShowDesignWindow] = useState(false);
  const [openThesisForm, setIsThesisFormOpen] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [text, setText] = useState("");
  const [successPopupText, setSuccessPopupText] = useState("");

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
      `/formRecords/status?formRecordId=${formRecord.formRecordId}&status=WAITING`
    );

    setShowSuccessPopup(true);
    setShowConfirmPopup(false);
  };

  const handleSendRecord = () => {
    setShowConfirmPopup(true);
    setText("Bạn chắc chắn muốn gửi bản ghi cho giảng viên?");
    setSuccessPopupText("Đã gửi bản ghi cho giảng viên!");
  };
  const onSuccessPopupClosed = () => {
    setShowConfirmPopup(false);
    setShowSuccessPopup(false);
    // onUpdated();
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
            <button className="border p-2 rounded-md px-5 bg-white">
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
            sendRecord();
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
