import React, { useEffect, useState } from "react";
import api from "../../../services/api";

const PDFViewer = ({ designId, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      const response = await api.get(`/designs/${designId}/downloadPdf`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setLoading(false);
    };
    fetchPdf();
  }, [designId]);

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
