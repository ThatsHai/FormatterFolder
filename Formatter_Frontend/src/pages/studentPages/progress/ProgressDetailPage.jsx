import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../../services/api";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import SuccessPopup from "../../../component/SuccessPopup";
import ConfirmationPopup from "../../../component/ConfirmationPopup";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
import FileUpload from "./FileUpload";

dayjs.extend(isSameOrAfter);

const ProgressDetailPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [progress, setProgress] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [files, setFiles] = useState(null);

  const [openFileUploadPage, setOpenFileUploadPage] = useState(false);

  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [showTaskOfMilestone, setShowTaskOfMilestone] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [displaySuccessPopup, setDisplaySuccessPopup] = useState(false);
  const [action, setAction] = useState("");
  const [successPopupText, setSuccesPopupText] = useState("");
  const [status, setStatus] = useState("200");
  useEffect(() => {
    const fetchProgress = async () => {
      const result = await api.get(`/progresses?studentId=${user.userId}`);
      setProgress(result.data.result || "");
      setMilestones(result.data.result.milestones || []);
      setStatus(result.data.code);
    };
    fetchProgress();
  }, [user, refreshTrigger]);

  const toggleTask = (milestoneId) => {
    setShowTaskOfMilestone((prevId) =>
      prevId === milestoneId ? null : milestoneId
    );
  };

  const markAsDone = async (taskId) => {
    try {
      const response = await api.put(`/tasks/${taskId}/markTaskComplete`);
      setDisplaySuccessPopup(true);
    } catch (e) {
      console.log(e);
    }
    setShowConfirmPopup(false);
  };

  const handleMarkAsDone = (taskId) => {
    setSelectedTask(taskId);
    setSuccesPopupText("Đã đánh dấu công việc hoàn thành");
    setShowConfirmPopup(true);
  };

  const handleUploadFile = (task) => {
    setFiles(task.taskFiles);
    setSelectedTask(task);
    setOpenFileUploadPage((prev) => !prev);
  };

  // const handleChangeFile = (task) => {
  //   setFiles(task.taskFiles);
  //   setSelectedTask(task);
  //   setOpenFileUploadPage((prev) => !prev);
  // };

  const onSuccessPopupClosed = () => {
    setShowConfirmPopup(false);
    setDisplaySuccessPopup(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const sortedMilestones = [...milestones].sort(
    (a, b) => a.position - b.position
  );

  // Tìm index của milestone hiện tại
  const currentPhaseIndex = sortedMilestones.findIndex(
    (milestone) =>
      !milestone.completedDate ||
      dayjs(milestone.dueDate).isSameOrAfter(dayjs(), "day") ||
      milestone.tasks.some((task) => task.completed)
  );

  return (
    <div className="">
      {openFileUploadPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-3xl p-6 relative">
            <FileUpload
              onFilesChange={() => {
                setRefreshTrigger((prev) => prev + 1);
              }}
              maxFiles={selectedTask.maxNumberOfFiles}
              handleToggle={() => {
                setOpenFileUploadPage((prev) => !prev);
                setRefreshTrigger((prev) => prev + 10);
              }}
              initialFiles={files}
              taskId={selectedTask.id}
            ></FileUpload>
          </div>
        </div>
      )}

      <div className="bg-lightGray m-5 p-6 rounded-md">
        {!progress ? (
          <p>
            {" "}
            {status === "404"
              ? "Bạn chưa được duyệt đề cương nào. Hãy quay lại sau!"
              : "Đang tải tiến độ!"}
          </p>
        ) : (
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow mt-10">
            <h2 className="text-center text-xl font-bold text-blue-700 mb-6">
              {progress?.formRecord?.topic?.title || "Tên đề tài"}
            </h2>
            {/* Tiến độ */}
            <div className="m-6">
              <h3 className="font-semibold mb-2">1. Tiến độ</h3>
              <div className="relative flex items-start justify-between px-8">
                {milestones
                  .slice()
                  .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                  .map((milestone, index) => (
                    <div
                      key={index}
                      className="relative flex flex-col items-center w-full"
                    >
                      {/* Đường nối – nằm phía sau icon */}
                      {index < milestones.length - 1 && (
                        <div className="absolute top-3 left-1/2 w-full h-0.5 bg-green-300 z-0" />
                      )}

                      {/* Icon */}
                      <Tooltip
                        title={
                          index < currentPhaseIndex
                            ? milestone.completed
                              ? "Đã hoàn thành mốc này"
                              : "Mốc này chưa hoàn thành"
                            : index === currentPhaseIndex
                            ? "Mốc hiện tại"
                            : "Mốc chưa đến"
                        }
                        arrow
                        placement="top"
                      >
                        <div className="z-10 bg-white rounded-full w-7 h-7 flex items-center justify-center">
                          {index < currentPhaseIndex ? (
                            milestone.completed ? (
                              <CheckCircleIcon
                                className="text-green-500"
                                fontSize="large"
                              />
                            ) : (
                              <CheckCircleIcon
                                className="text-red-500"
                                fontSize="large"
                              />
                            )
                          ) : index === currentPhaseIndex ? (
                            milestone.completed ? (
                              <CheckCircleIcon
                                className="text-green-500"
                                fontSize="large"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full border-2 border-green-500 bg-white" />
                            )
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-lightGray flex items-center justify-center">
                              <RadioButtonUncheckedIcon
                                className="text-gray"
                                fontSize="large"
                              />
                            </div>
                          )}
                        </div>
                      </Tooltip>

                      {/* Tên cột mốc */}
                      <div className="text-sm mt-2 text-center w-15 break-word leading-tight">
                        {milestone.name}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Công việc */}
            <div className="m-6">
              <h3 className="font-semibold mb-2">2. Công việc</h3>
              {milestones
                .slice()
                .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                .map((milestone, i) => (
                  <div
                    key={milestone.id}
                    className="border p-4 mb-3 rounded-md"
                  >
                    <div
                      className="flex justify-between items-center"
                      onClick={() => toggleTask(milestone.id)}
                    >
                      <div className="flex items-center gap-2">
                        <InfoOutlinedIcon fontSize="medium" />
                        <span className="font-medium">{milestone.name}</span>
                      </div>

                      <span className="text-sm text-gray-600">
                        Hoàn thành{" "}
                        {milestone.tasks?.filter((t) => t.completed).length}/
                        {milestone.tasks?.length}
                      </span>
                    </div>

                    <div className="relative">
                      {showTaskOfMilestone === milestone.id && (
                        <>
                          {milestone.tasks && milestone.tasks.length > 0 && (
                            <div className="mt-3 space-y-2 ">
                              {milestone.tasks.map((task, idx) => (
                                <div
                                  key={task.id}
                                  className="bg-gray-100 p-3 rounded border border-darkGray bg-lightGray flex justify-between items-center"
                                >
                                  <div className="mx-2 my-1">
                                    <p className="font-semibold">{task.name}</p>
                                    {task.completedDate ? (
                                      <p className="text-xs text-green-500 mt-2">
                                        Hoàn tất{" "}
                                        {dayjs(task.completedDate).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </p>
                                    ) : (
                                      <p className="text-xs text-red-500 mt-1">
                                        Chưa hoàn tất
                                      </p>
                                    )}
                                    {task.taskFiles &&
                                      task.taskFiles.length > 0 && (
                                        <div className="mt-1">
                                          {task.taskFiles.map((file, idx) => {
                                            const fileUrl = `http://localhost:8080/tasks/view?path=${encodeURIComponent(
                                              file.filePath.replace(/\\/g, "/")
                                            )}`;

                                            return (
                                              <p
                                                key={idx}
                                                className="text-xs text-blue-600 underline cursor-pointer hover:text-blue-800"
                                                onClick={() =>
                                                  window.open(fileUrl, "_blank")
                                                }
                                              >
                                                📎 {file.filename}
                                              </p>
                                            );
                                          })}
                                        </div>
                                      )}
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    {task.requireFile && !task.completed &&
                                      (task.fileSubmitted ? (
                                        <button
                                          className="p-2 rounded-md text-white bg-lightBlue text-sm flex items-center justify-center gap-1 hover:bg-darkBlue"
                                          onClick={() => handleUploadFile(task)}
                                        >
                                          <AddIcon fontSize="small" />
                                          Sửa file
                                        </button>
                                      ) : (
                                        <button
                                          className="p-2 rounded-md w-[100px] text-white bg-lightBlue text-sm flex items-center justify-center gap-1 hover:bg-darkBlue"
                                          onClick={() => handleUploadFile(task)}
                                        >
                                          <AddIcon fontSize="small" />
                                          Thêm File
                                        </button>
                                      ))}
                                    {!task.completed && (
                                      <button
                                        className="p-2 rounded-md w-[100px] text-white bg-green-500 text-sm flex items-center justify-center gap-1 hover:bg-green-600"
                                        onClick={() =>
                                          handleMarkAsDone(task.id)
                                        }
                                      >
                                        <CheckCircleIcon fontSize="small" />
                                        Hoàn tất
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      <div className="m-2 mt-3 flex items-center gap-3">
                        <p className="text-sm flex-1">
                          {dayjs(milestone.dueDate).isValid() ? (
                            <>
                              Ngày hết hạn:{" "}
                              {dayjs(milestone.dueDate).format("DD/MM/YYYY")}
                            </>
                          ) : (
                            "Chưa có ngày hết hạn"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      {showConfirmPopup && (
        <ConfirmationPopup
          isOpen={true}
          text={"Bạn có chắc muốn đánh dấu hoàn thành?"}
          onConfirm={() => {
            setShowConfirmPopup(false);
            markAsDone(selectedTask);
          }}
          onDecline={() => {
            setShowConfirmPopup(false);
          }}
        ></ConfirmationPopup>
      )}
      {displaySuccessPopup && (
        <SuccessPopup
          isOpen={true}
          successPopupText={successPopupText}
          onClose={onSuccessPopupClosed}
        />
      )}
    </div>
  );
};

export default ProgressDetailPage;
