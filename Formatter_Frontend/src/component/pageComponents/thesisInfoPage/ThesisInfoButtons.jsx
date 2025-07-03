import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useState } from "react";
import DesignsListWindow from "../../DesignListWindow";
const ThesisInfoButtons = ({formRecord}) => {
  const user = useSelector((state) => state.auth.user);

  const [showDesignWindow, setShowDesignWindow] = useState(false);
  const handleCardClick = () => {
    setShowDesignWindow(true);
  };
  
  if (!formRecord) return (<div>Đang tải</div>);
  console.log("record truyền vào:", formRecord)
  return (
    <div className="flex w-full justify-end my-5 gap-5">
      <div>
        <button className="border p-2 rounded-md px-5 bg-white" onClick={handleCardClick}>
          Xuất file PDF
        </button>
        {user.role.name === "STUDENT" ? (
          <>
            <button className="border p-2 rounded-md px-5 bg-white">
              Xem lịch sử sửa
            </button>
            <button className="border p-2 rounded-md px-5 bg-white">
              Chỉnh sửa
            </button>
            <button className="border p-2 rounded-md px-5 bg-white">
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
        {
          showDesignWindow && (
            <DesignsListWindow
              formId={formRecord.topic.form.formId}
              formRecordId={formRecord.formRecordId}
              onDecline={()=>setShowDesignWindow(false)}
            >
            </DesignsListWindow>
          )
        }
      </div>
    </div>
  );
};

export default ThesisInfoButtons;

ThesisInfoButtons.propTypes = {
  formRecord: PropTypes.object,
};
