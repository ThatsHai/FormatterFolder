import PropTypes from "prop-types";
import NumberInput from "../../../component/NumberInput";

const TopicQuery = ({
  semester,
  schoolYear,
  setSemester,
  setSchoolYear,
  // teacherName,
  setTeacherName,
  // handleQueryCriteria,
  handleSearch,
}) => {
  const semesters = ["HK1", "HK2", "HK3"];

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
    // handleQueryCriteria(e);
  };

  const handleSchoolYearChange = (e) => {
    setSchoolYear(e.target.value);
    // handleQueryCriteria(e);
  };

  const handleTeacherNameChange = (e) => {
    setTeacherName(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-center w-full ">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 rounded-md mb-2">
          {/* Teacher Name Input */}
          <div className="flex flex-col px-8 md:col-span-2">
            <label className="font-semibold mb-1">Tên CB</label>
            <input
              type="text"
              className="border px-2 py-1 rounded-md"
              placeholder="Tên CB"
              name="name"
              onChange={handleTeacherNameChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>

          {/* School Year Input */}
          <div className="flex flex-col px-8 md:col-span-1">
            <label className="font-semibold mb-1">Năm học</label>
            <NumberInput
              min={2000}
              max={2300}
              name="schoolYear"
              placeholder="2025"
              className="border px-2 py-1 rounded-md"
              value={schoolYear}
              onChange={handleSchoolYearChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>

          {/* Semester Select */}
          <div className="flex flex-col px-8 md:col-span-2">
            <label className="font-semibold mb-1">Học kỳ</label>
            <select
              name="semester"
              className="border px-2 py-1 rounded-md"
              value={semester}
              onChange={handleSemesterChange}
            >
              <option value="">-- Chọn học kỳ --</option>
              {semesters.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {/* Search Button */}
          <div className="md:col-span-5 flex justify-end mr-8 ">
            <button
              type="button"
              className="bg-darkBlue text-white px-4 py-1 rounded-md shadow-md"
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicQuery;

TopicQuery.propTypes = {
  semester: PropTypes.string,
  schoolYear: PropTypes.number,
  setSemester: PropTypes.func,
  setSchoolYear: PropTypes.func,
  teacherName: PropTypes.string,
  setTeacherName: PropTypes.func,
  handleQueryCriteria: PropTypes.func,
  handleSearch: PropTypes.func,
};
