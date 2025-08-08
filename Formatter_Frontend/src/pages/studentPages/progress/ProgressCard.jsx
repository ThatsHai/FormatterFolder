import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

const ProgressCard = ({ progress }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-md border p-6 h-72 relative"
      onClick={() => navigate(`/teacher/progresses/${progress.progressId}`)}
    >
      <p className="font-headerFont text-2xl font-bold">
        {progress.formRecord.topic.title}
      </p>
      <p className="py-3">Người thực hiện: {progress.formRecord.student.name}</p>
      <div className="flex items-end w-full justify-end absolute right-4 bottom-4 cursor-pointer">
        <button
          className={`text-end align-bottom font-semibold bg-white border-none text-base px-3 py-1 rounded-md text-redError`}
        > Xem tiến độ  
        </button>
      </div>
    </div>
    // </Link>
  );
};

export default ProgressCard;

ProgressCard.propTypes = {
  progress: PropTypes.object,
  // onClick: PropTypes.func,
};
