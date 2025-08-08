import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

const truncateWords = (str, charLimit, end = "…") => {
  if (!str) return "";
  if (charLimit <= 0) return end;
  return str.length > charLimit ? str.slice(0, charLimit) + end : str;
};

const ThesisCard = ({ formRecord }) => {
  const navigate = useNavigate();
  return (
    // <Link to="/thesis">
    <div
      className="bg-white rounded-md border p-6 h-72 relative"
      onClick={() => navigate(`/thesis/${formRecord.formRecordId}`)}
    >
      <p className="font-headerFont text-2xl font-bold">
        {truncateWords(formRecord.topic.title, 30)}
      </p>
      <p className="py-3">{truncateWords(formRecord.topic.description, 20)}</p>
      <p className="py-3">Người thực hiện: {formRecord.student.name}</p>
      <div className="flex items-end w-full justify-end absolute right-4 bottom-4 cursor-pointer">
        <button
          className={`text-end align-bottom font-semibold bg-white border-none text-base px-3 py-1 rounded-md  ${
            formRecord.status == "ACCEPTED"
              ? "text-greenCorrect"
              : "text-redError"
          }`}
        >
          {formRecord.status === "ACCEPTED"
            ? "Đã duyệt"
            : formRecord.status === "PENDING"
            ? "Chưa gửi"
            : formRecord.status === "WAITING"
            ? "Đang chờ duyệt"
            : formRecord.status === "DENIED"
            ? "Bị từ chối"
            : formRecord.status === "DELETED"
            ? "Đã xóa"
            : "Không rõ trạng thái"}{" "}
        </button>
      </div>
    </div>
    // </Link>
  );
};

export default ThesisCard;

ThesisCard.propTypes = {
  formRecord: PropTypes.object,
  // onClick: PropTypes.func,
};
