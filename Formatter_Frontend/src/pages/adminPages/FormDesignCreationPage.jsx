import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import GridBoard from "./designPage/GridBoard";
import RightSidebar from "./designPage/RightSideBar";
import ConfirmationPopup from "../../component/ConfirmationPopup";
import PropTypes from "prop-types";
import { useLocation } from "react-router";
import useBootstrapUser from "../../hook/useBootstrapUser";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Tooltip = () => {
  const [displayTooltip, setDisplayToolTip] = useState(false);

  return (
    <>
      <div className="relative">
        <div className="flex justify-end">
          <p
            className="border rounded-full text-gray border-gray px-2 mb-2"
            onMouseEnter={() => setDisplayToolTip(true)}
            onMouseLeave={() => setDisplayToolTip(false)}
          >
            ?
          </p>
        </div>
        {displayTooltip && (
          <div className="absolute z-50 top-0 right-10 border p-2 px-6 bg-white border-lightGray rounded-md text-sm ">
            <ul className="list-disc">
              <li>
                <p>Kéo thả các ô để tạo khung viền</p>
              </li>
              <li>
                <p>
                  Kéo dữ liệu trả lời từ thanh bên hoặc nhập ${"{{"}tên trường
                  {"}}"}
                </p>
              </li>
              <li>
                <p>Định dạng hoặc xóa ô bằng cách chọn ô</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

const DesignMainContent = ({ formData, fetchFormInfo }) => {
  const [designInfo, setDesignInfo] = useState({});
  const [emptyTitleError, setEmptyTitleError] = useState(false);
  const [displayConfirmationPopup, setDisplayConfirmationPopup] =
    useState(false);
  const [displaySuccessPopup, setDisplaySuccessPopup] = useState(false);
  const textareaRef = useRef(null);

  const gridSize = 12;
  const cellSize = 60;

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = Math.max(scrollHeight, 50) + "px"; // Min height ~50px
    }
  };

  const onUpdateDesignInfo = (fieldName, value) => {
    if (typeof fieldName !== "string") {
      console.warn(
        "Invalid fieldName passed to onUpdateDesignInfo:",
        fieldName
      );
      return;
    }

    setDesignInfo((prev) => {
      if (fieldName === "cells") {
        return {
          ...prev,
          cells: value,
        };
      }

      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  const handleSaveForm = () => {
    const title = designInfo?.title?.trim?.() || "";

    if (title === "") {
      setEmptyTitleError(true);
    } else {
      setEmptyTitleError(false);
      setDisplayConfirmationPopup(true);
    }
  };

  const handleSendFormData = async () => {
    try {
      if (Object.keys(formData).length === 0) {
        await fetchFormInfo();
      }

      // console.log(designInfo);
      // return;
      // console.log(formData);

      const latestDesignInfo = { ...designInfo, form: formData };
      const result = await api.post("/designs", latestDesignInfo);
      setDisplaySuccessPopup(true);
      console.log(result);

      setDesignInfo(latestDesignInfo);
    } catch (err) {
      const status = err.response?.status; // 409, 400, 500...
      const backendCode = err.response?.data?.code; // e.g. "DUPLICATE_NAME"
      setDisplayConfirmationPopup(false);
      setDisplaySuccessPopup(false);
      if (status === 409 || backendCode === "DUPLICATE_NAME") {
        alert("Tên thiết kế đã tồn tại");
      }
    }
  };

  const onSuccessPopupClosed = () => {
    setDisplayConfirmationPopup(false);
    setDisplaySuccessPopup(false);
    // navigate("/admin/forms");
  };

  return (
    <div className="flex items-center justify-center">
      <div>
        <textarea
          ref={textareaRef}
          placeholder="Tiêu đề thiết kế"
          className="w-full text-center text-3xl font-semibold text-darkBlue border-b border-gray focus:outline-none p-2 pt resize-none overflow-hidden leading-tight rounded-md placeholder:text-lightBlue"
          onInput={autoResize}
          rows={1}
          onChange={(e) => onUpdateDesignInfo(e.target.name, e.target.value)}
          name="title"
          value={designInfo.title || ""}
        />
        {emptyTitleError && (
          <p className="text-redError">Tên thiết kế không được để trống</p>
        )}
        <div className="mt-4">
          <label className="text-sm">Mô tả thiết kế:</label>
          <textarea
            placeholder="Mô tả thiết kế"
            className="w-full text-lg border border-gray rounded-md p-3 mb-3 focus:outline-none focus:ring-1 focus:ring-darkBlue resize-none overflow-hidden leading-tight"
            onInput={autoResize}
            rows={2}
            onChange={(e) => onUpdateDesignInfo(e.target.name, e.target.value)}
            name="description"
            value={designInfo.description || ""}
          />
        </div>
        <Tooltip></Tooltip>
        <GridBoard
          onUpdateDesignInfo={onUpdateDesignInfo}
          gridSize={gridSize}
          cellSize={cellSize}
          formData={formData}
        ></GridBoard>
        <div className="w-full flex justify-end font-textFont">
          <button
            className="bg-darkGray text-white font-semibold shadow-md py-2 px-4 z-50 mt-5 rounded-md"
            onClick={() => handleSaveForm()}
          >
            Lưu
          </button>
          <ConfirmationPopup
            isOpen={displayConfirmationPopup}
            text="Xác nhận lưu"
            onDecline={() => setDisplayConfirmationPopup(false)}
            onConfirm={() => handleSendFormData()}
            displaySuccessPopup={displaySuccessPopup}
            successPopupText={"Đã lưu"}
            onSuccessPopupClosed={() => onSuccessPopupClosed()}
          ></ConfirmationPopup>
        </div>{" "}
      </div>
    </div>
  );
};

const FormDesignCreationPage = () => {
  const location = useLocation();
  const formId = location.pathname.split("/").pop();
  const [formData, setFormData] = useState();

  useEffect(() => {
    fetchFormInfo();
  }, [formId]);

  const fetchFormInfo = async () => {
    const result = await api.get(`/forms/${formId}`);
    setFormData(result.data.result);
  };

  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const userData = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (loading) return null;
  if (userData.role.name !== "ADMIN") {
    navigate("/notFound");
  }

  return (
    <div className="p-6">
      <DesignMainContent
        formData={formData}
        fetchFormInfo={fetchFormInfo}
      ></DesignMainContent>
      <RightSidebar
        formData={formData}
        fetchFormInfo={fetchFormInfo}
      ></RightSidebar>
    </div>
  );
};

export default FormDesignCreationPage;

RightSidebar.propTypes = {
  formData: PropTypes.object,
};

DesignMainContent.propTypes = {
  formData: PropTypes.object,
  fetchFormInfo: PropTypes.func,
};
