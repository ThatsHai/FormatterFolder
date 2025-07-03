import PropTypes from "prop-types";
import { useState } from "react";
import { useEffect } from "react";
import PDFViewer from "./forms/SubmitThesisFormComponents/PDFViewer";
import api from "../services/api"
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

const DesignsListWindow = ({
  isOpen = true,
  text = "Danh sách mẫu",
  formId,
  formRecordId,
  onDecline = () => {},
}) => {
  const [designsList, setDesignsList] = useState();
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDesignId, setSelectedDesignId] = useState(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      let url = "";
      if (formId) {
        url = `/designs/search?formId=${formId}&n=3&p=${currentPage}`;
      } else return;

      console.log("formRecordId:",formRecordId);
      const result = await api.get(url);
      
      setDesignsList(result.data.result.content);
      setTotalPages(result.data.result.totalPages);
    };
    fetchDesigns();
  }, [formId, formRecordId, currentPage]);

  const handleDownloadPDF = async (design, formRecordId) => {
    try {
       let getUrl = "";
      if (!formRecordId) {
        getUrl = `/designs/${design.designId}/downloadPdf`;
      } else{
        getUrl = `/formRecords/${formRecordId}/downloadPdf/${design.designId}`;
      }
      const response = await api.get(
        getUrl,
        {
          responseType: "blob",
        }
      );
      console.log(response);
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", `${design.title}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.log("File download failed: " + e);
    }
  };

  if (!isOpen) return null;
  if (!designsList) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Modal Box */}
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full font-textFont relative">
        {/* X Button inside the modal box */}
        <button
          onClick={onDecline}
          className="absolute top-2 right-4 text-gray-500 hover:text-black font-bold text-lg"
        >
          X
        </button>

        <h2 className="text-lg font-semibold mb-4">{text}</h2>

        <div className="w-full justify-center items-center gap-5 min-h-[320px]">
          {designsList.map((design) => (
            <div key={design.designId} className="border px-2 rounded-md my-2">
              <p className="font-semibold text-left pt-1">{design.title}</p>
              <p className="text-left pb-1">
                {design.description || "Không có mô tả"}
              </p>
              <div className="flex justify-end">
                <button
                  className="text-white font-bold p-1 px-3 m-2 rounded-md bg-lightBlue"
                  onClick={() => setSelectedDesignId(design.designId)}
                >
                  Xem trước PDF
                </button>
                <button
                  className="text-white font-bold p-1 px-3 m-2 rounded-md bg-lightBlue"
                  onClick={() => handleDownloadPDF(design,formRecordId)}
                >
                  Tải PDF
                </button>

                {selectedDesignId && (
                  <PDFViewer
                    designId={selectedDesignId}
                    formRecordId={formRecordId||""}
                    onClose={() => setSelectedDesignId(null)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <PageNumberFooter
          totalPages={totalPages}
          maxPage={3}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DesignsListWindow;
DesignsListWindow.propTypes = {
  isOpen: PropTypes.bool,
  text: PropTypes.string,
  formId: PropTypes.string,
  formRecordId: PropTypes.string,
  onDecline: PropTypes.func,
};