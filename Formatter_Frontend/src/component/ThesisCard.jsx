import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ThesisCard = ({ title, introduction, status }) => {
  return (
    <Link to="/thesis">
      <div className="bg-white rounded-md border p-6 h-72 relative">
        <p className="font-headerFont text-2xl font-bold">{title}</p>
        <p className="py-3">{introduction}</p>
        <div className="flex items-end w-full justify-end absolute right-4 bottom-4">
          <button
            className={`text-end align-bottom font-semibold bg-white border-none text-base px-3 py-1 rounded-md  ${
              status == "Đã duyệt" ? "text-greenCorrect" : "text-redError"
            }`}
          >
            {status + " > "}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ThesisCard;

ThesisCard.propTypes = {
  title: PropTypes.string,
  introduction: PropTypes.string,
  status: PropTypes.string,
};
