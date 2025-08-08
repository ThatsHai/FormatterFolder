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
    await api.put(`/formRecords/${formRecord.formRecordId}/send`);

    setShowSuccessPopup(true);
    setShowConfirmPopup(false);
  };

  const approveRecord = async () => {
    await api.put(`/formRecords/${formRecord.formRecordId}/approve`);

    setShowSuccessPopup(true);
    setShowConfirmPopup(false);
  };

  const denyRecord = async () => {
    await api.put(`/formRecords/${formRecord.formRecordId}/deny`);

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
    setText(
      "Bạn chắc chắn muốn gửi bản ghi cho giảng viên? (Mọi thay đổi sau này sẽ tự động cập nhật cho giảng viên xem!)"
    );
    setSuccessPopupText("Đã gửi bản ghi cho giảng viên!");
    setConfirmAction("send");
  };

  const handleApproveRecord = () => {
    if (formRecord.status === "ACCEPTED") {
      alert("Bản ghi đã được duyệt trước đó, không thể duyệt lại");
      return;
    }
    if (formRecord.topic.students!=null && formRecord.topic.students.every((student)=>student.userId!==formRecord.student.userId)){
      alert("Đề tài này đã có sinh viên khác thực hiện! Không thể duyệt!");
      return;
    }
    setShowConfirmPopup(true);
    setText(
      "Bạn chắc chắn muốn duyệt đề cương này? Thông báo duyệt sẽ được gửi đến sinh viên!"
    );
    setSuccessPopupText("Đã duyệt!");
    setConfirmAction("approve");
  };
  const handleDenyRecord = () => {
    if (formRecord.status === "DENIED") {
      alert("Bản ghi đã bị từ chối trước đó, không thể từ chối lại");
      return;
    }
    setShowConfirmPopup(true);
    setText(
      "Bạn chắc chắn muốn từ chối đề cương này? Thông báo từ chối sẽ được gửi đến sinh viên!"
    );
    setSuccessPopupText("Đã từ chối!");
    setConfirmAction("deny");
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
    <div className="flex w-full justify-end my-5 gap-10">
      <div>
        <button
          className="p-2 mx-1 rounded-md text-white bg-lightBlue tx-lg gap-2 hover:bg-darkBlue"
          onClick={handleCardClick}
        >
          Xuất file PDF
        </button>
        {user.role.name === "STUDENT" ? (
          <>
            <button
              className="p-2 mx-1 rounded-md text-white bg-lightBlue tx-lg gap-1 hover:bg-darkBlue"
              onClick={() =>
                navigate(`/diff-viewer/${formRecord.formRecordId}`)
              }
            >
              Xem lịch sử sửa
            </button>
            <button
              className="p-2 mx-1 rounded-md text-white bg-lightBlue tx-lg gap-1 hover:bg-darkBlue"
              onClick={handleFormToggle}
            >
              Chỉnh sửa
            </button>
            {formRecord.status != "ACCEPTED" && (
              <button
                className="p-2 mx-1 rounded-md text-white bg-lightBlue tx-lg gap-1 hover:bg-darkBlue"
                onClick={handleDeleteRecord}
              >
                Xoá
              </button>
            )}
            {formRecord.status == "PENDING" && (
              <button
                className="p-2 mx-1 rounded-md text-white bg-green-500 tx-lg gap-1 hover:bg-green-600"
                onClick={handleSendRecord}
              >
                Gửi bài
              </button>
            )}
          </>
        ) : (
          (formRecord.status === "WAITING" || formRecord.status === "DENIED") && (
            <>
              <button
                className="p-2 mx-1 rounded-md text-white bg-green-500 tx-lg gap-1 hover:bg-green-600"
                onClick={handleApproveRecord}
              >
                Phê duyệt
              </button>
              {formRecord.status === "WAITING" && (
                <button
                  className="p-2 mx-1 rounded-md text-white bg-red-400 tx-lg gap-1 hover:bg-red-500"
                  onClick={handleDenyRecord}
                >
                  Từ chối
                </button>
              )}
            </>
          )
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
            } else if (confirmAction === "approve") {
              approveRecord();
            } else if (confirmAction === "deny") {
              denyRecord();
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