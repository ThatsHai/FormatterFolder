import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

const ThesisCard = ({ formRecord}) => {
  const navigate = useNavigate();
  return (
    // <Link to="/thesis">
      <div className="bg-white rounded-md border p-6 h-72 relative" onClick={()=>navigate(`/thesis/${formRecord.formRecordId}`)}>
        <p className="font-headerFont text-2xl font-bold">{formRecord.topic.form.title}</p>
        <p className="py-3">{formRecord.topic.title}</p>
        <div className="flex items-end w-full justify-end absolute right-4 bottom-4 cursor-pointer">
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
  // onClick: PropTypes.func,
};
