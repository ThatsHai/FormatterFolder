import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ThesisCard = ({ formRecord, onClick }) => {
  return (
    // <Link to="/thesis">
      <div className="bg-white rounded-md border p-6 h-72 relative" onClick={onClick}>
        <p className="font-headerFont text-2xl font-bold">{formRecord.topic.title}</p>
        <p className="py-3">{formRecord.topic.description}</p>
        <div className="flex items-end w-full justify-end absolute right-4 bottom-4">
          <button
            className={`text-end align-bottom font-semibold bg-white border-none text-base px-3 py-1 rounded-md  ${
              formRecord.status == "Đã duyệt" ? "text-greenCorrect" : "text-redError"
            }`}
          >
            {formRecord.status + " > "}
          </button>
        </div>
      </div>
    // </Link>
  );
};

export default ThesisCard;

ThesisCard.propTypes = {
  formRecord: PropTypes.object,
  onClick: PropTypes.func,
};
