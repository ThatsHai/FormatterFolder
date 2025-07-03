import React, { useEffect, useState} from "react";
import api from "../../../services/api";

const PDFViewer = ({ designId, formRecordId, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let url=null;
    const fetchPdf = async () => {
      let getUrl="";
      if (formRecordId) {
        getUrl = `/formRecords/${formRecordId}/downloadPdf/${designId}`;
      } else {
        getUrl = `/designs/${designId}/downloadPdf`;
      }
      console.log("url ds:",getUrl);
      const response = await api.get(getUrl, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setLoading(false);
    };
    fetchPdf();
    return () => {
    if (url) {
      URL.revokeObjectURL(url); // giải phóng blob khi component unmount hoặc re-render
    }
  };
  }, [designId,formRecordId]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-[9999] flex flex-col pt-16">
      <button
        onClick={onClose}
        className="text-white text-lg font-medium px-4 py-2 absolute top-4 left-4 bg-gray-700 rounded hover:bg-gray-600"
      >
        ← Quay lại
      </button>

      {loading ? (
        <p className="text-white text-center mt-10">Đang tải PDF...</p>
      ) : (
        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          className="w-full flex-1"
        />
      )}
    </div>
  );
};

export default PDFViewer;
