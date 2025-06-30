import React, { useState } from "react";

const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      setPdfUrl(fileURL);
    } else {
      alert("Vui lòng chọn đúng file PDF.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chọn file PDF để hiển thị</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          style={{ marginTop: "20px", border: "1px solid #ccc" }}
          title="PDF Viewer"
        ></iframe>
      )}
    </div>
  );
};

export default PDFViewer;
