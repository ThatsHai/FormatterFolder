import PropTypes from "prop-types";

const MajorQuery = ({ name, setName, handleSearch }) => {
  const handleChange = (e) => {
    setName(e.target.value);
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
        placeholder="Nhập tên ngành cần tìm..."
        value={name}
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

MajorQuery.propTypes = {
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default MajorQuery;
