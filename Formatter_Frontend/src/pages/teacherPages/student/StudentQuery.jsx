import PropTypes from "prop-types";

const StudentQuery = ({ id, setId, handleSearch }) => {
  const handleChange = (e) => {
    setId(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 items-center mb-4">
      <input
        type="text"
        className="flex-1 px-3 py-2 border border-gray-300 rounded"
        placeholder="Nhập MSSV cần tìm..."
        value={id}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        className="px-4 py-2 bg-darkBlue text-white rounded"
        onClick={handleSearch}
        type="button"
      >
        Tìm kiếm
      </button>
    </div>
  );
};

StudentQuery.propTypes = {
  id: PropTypes.string.isRequired,
  setId: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default StudentQuery;
