import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import api from "../../../services/api";

const MAX_FILE_SIZE_MB = 1;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

const FileUpload = ({
  taskId = "",
  maxFiles = 5,
  handleToggle,
  initialFiles = null,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialFiles && Array.isArray(initialFiles)) {
      const mappedFiles = initialFiles.map((f) => ({
        ...f,
        isUploaded: true,
        name: f.filename,
        filePath: f.filePath,
        url: getFilePreviewUrl(f.filePath),
      }));
      setSelectedFiles(mappedFiles);
    }
  }, [initialFiles]);

  const getFilePreviewUrl = (filePath) => {
    const normalizedPath = filePath.replace(/\\/g, "/");
    return `http://localhost:8080/tasks/view?path=${encodeURIComponent(
      normalizedPath
    )}`;
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    let updatedFiles = [...selectedFiles];

    for (const newFile of newFiles) {
      // Kiểm tra định dạng
      if (!ALLOWED_TYPES.includes(newFile.type)) {
        setError(`❌ File "${newFile.name}" không đúng định dạng.`);
        return;
      }

      // Kiểm tra dung lượng
      if (newFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`❌ File "${newFile.name}" vượt quá ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      // Ghi đè nếu file trùng tên
      const existingIndex = updatedFiles.findIndex(
        (f) => (f.name || f.filename) === newFile.name
      );
      if (existingIndex !== -1) {
        updatedFiles.splice(existingIndex, 1); // Xoá file cũ
      }

      updatedFiles.push(newFile);
    }

    if (updatedFiles.length > maxFiles) {
      setError(`❌ Chỉ được chọn tối đa ${maxFiles} file.`);
      return;
    }

    // Xoá lỗi nếu hợp lệ
    setError("");
    setSelectedFiles(updatedFiles);

    // Reset input (để có thể chọn lại cùng file lần nữa)
    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  const handleUploadAll = async () => {
    if (!taskId) {
      alert("Thiếu taskId");
      return;
    }

    const filesToUpload = selectedFiles.filter((f) => !f.isUploaded);

    const initialUploadedNames = (initialFiles ?? []).map((f) => f.filename);
    const currentUploadedNames = selectedFiles
      .filter((f) => f.isUploaded)
      .map((f) => f.filename);

    const deletedFileNames = initialUploadedNames.filter(
      (name) => !currentUploadedNames.includes(name)
    );

    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("deletedFileNames", JSON.stringify(deletedFileNames));

    try {
    const response = await api.post(`/tasks/${taskId}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Kiểm tra phản hồi từ BE
    if (response?.data?.code === "200") {
      alert("Tải lên thành công!");
      handleToggle();
    } else {
      throw new Error(response?.data?.message || "Phản hồi không hợp lệ");
    }
  } catch (error) {
    console.error("Lỗi khi tải lên:", error);
    alert("Tải lên thất bại: " + (error?.message || "Lỗi không xác định"));
  }
  };

  const renderFileCard = (file, index) => {
    const isImage =
      file.type?.startsWith("image/") || file.name?.match(/\.(jpg|jpeg|png)$/i);

    const fileUrl = file.isUploaded ? file.url : URL.createObjectURL(file);
    const fileName = file.filename || file.name;

    return (
      <Box
        key={index}
        sx={{
          width: 160,
          m: 2,
          border: "1px solid #ccc",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          boxShadow: 1,
          cursor: "pointer",
          "&:hover": {
            boxShadow: 3,
          },
        }}
        onClick={() => {
          if (file.filePath || !file.isUploaded) {
            window.open(fileUrl, "_blank");
          }
        }}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveFile(index);
          }}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            backgroundColor: "rgba(255,255,255,0.8)",
            zIndex: 2,
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>

        <Box
          sx={{
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          {isImage ? (
            <img
              src={fileUrl}
              alt={fileName}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <InsertDriveFileIcon fontSize="large" />
          )}
        </Box>

        <Box sx={{ p: 1, textAlign: "center" }}>
          <Tooltip title={fileName}>
            <Typography variant="body2" noWrap>
              {fileName}
            </Typography>
          </Tooltip>
          {file.size && (
            <Typography variant="caption" color="text.secondary">
              {(file.size / 1024).toFixed(1)} KB
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2, border: "1px dashed grey", borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Tải lên tệp</Typography>
        <IconButton onClick={handleToggle}>
          <CloseFullscreenIcon />
        </IconButton>
      </Box>

      <Tooltip
        title={`Chấp nhận PDF, Word, PNG, JPG. Kích thước tối đa mỗi file: 1MB. Số lượng tối đa: ${maxFiles}`}
        placement="top"
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Kích thước tối đa với một tập tin: 1MB, số lượng tối đa: {maxFiles}
        </Typography>
      </Tooltip>

      <Button variant="outlined" component="label" sx={{ mb: 2 }}>
        Chọn file
        <input
          type="file"
          hidden
          multiple
          onChange={handleFileChange}
          accept={ALLOWED_TYPES.join(",")}
        />
      </Button>
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <Box display="flex" flexWrap="wrap">
        {selectedFiles.map((file, index) => renderFileCard(file, index))}
      </Box>

      {selectedFiles.length > 0 && (
        <Box mt={2}>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleUploadAll}
          >
            Tải toàn bộ
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
