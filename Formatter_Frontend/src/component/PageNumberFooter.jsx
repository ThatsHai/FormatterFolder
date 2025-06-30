import PropTypes from "prop-types";

const PageNumberFooter = ({
  totalPages = 1,
  maxPage = 3,
  onPageChange = () => {},
  currentPage = 0,
  setCurrentPage = () => {},
}) => {
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };

  // Calculate the range of page numbers to show
  const startPage = Math.floor(currentPage / maxPage) * maxPage;
  const endPage = Math.min(startPage + maxPage, totalPages);

  return (
    <div className="w-full flex justify-center items-center gap-2 my-4">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Trang trước
      </button>

      {Array.from({ length: endPage - startPage }, (_, index) => {
        const page = startPage + index;
        return (
          <button
            key={page}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => goToPage(page)}
          >
            {page + 1}
          </button>
        );
      })}

      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Trang sau
      </button>
    </div>
  );
};

export default PageNumberFooter;

PageNumberFooter.propTypes = {
  totalPages: PropTypes.number,
  maxPage: PropTypes.number,
  onPageChange: PropTypes.func,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
};
