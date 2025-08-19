import { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
import ConfirmationPopup from "../../component/ConfirmationPopup";
import PageNumberFooter from "../../component/PageNumberFooter";
import api from "../../services/api";
import { Collapse, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // from MUI
import useBootstrapUser from "../../hook/useBootstrapUser";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const truncateWords = (str, charLimit, end = "…") => {
  if (!str) return "";
  if (charLimit <= 0) return end;
  return str.length > charLimit ? str.slice(0, charLimit) + end : str;
};

const MailList = ({
  userId = "",
  setSelectedMail = () => {},
  mailUrl = "received",
  currentPage,
  setCurrentPage,
}) => {
  const [mailList, setMailList] = useState([]);
  const [totalPages, setTotalPage] = useState(0);

  const fetchMail = async (page = currentPage) => {
    let result = {};
    if (mailUrl === "received") {
      result = await api.get(
        `/notifications?userId=${userId}&page=${page}&number=8`
      );
      setMailList(result.data.result.content);
      setTotalPage(result.data.result.totalPages);
    } else if (mailUrl == "sent") {
      result = await api.get(
        `/notifications/sent?userId=${userId}&page=${page}&number=8`
      );
      setMailList(result.data.result.content);
      setTotalPage(result.data.result.totalPages);

      console.log(result.data.result.totalPages);
    }
  };

  const markAsRead = async (mail) => {
    const result = api.put(
      `/notifications/markAsRead?notificationId=${mail.notificationId}`
    );
    console.log(result);
  };

  useEffect(() => {
    fetchMail();
  }, [currentPage, userId, mailUrl]);

  return (
    <>
      <main className="flex-1 p-6 w-full shadow-md mx-1 bg-white">
        <div className="min-h-[335px]">
          <h1 className="text-xl font-bold mb-4">Danh sách email</h1>
          {mailList.length <= 0 ? (
            <p>Chưa có mail</p>
          ) : (
            <div className="w-full flex flex-col ">
              {mailList.map((mail) => (
                <div
                  key={mail.notificationId}
                  className={`${
                    mail.read === false ? "font-bold" : ""
                  } p-1 px-2 w-full flex border-darkGray border-opacity-40 border-b-[1px]  hover:shadow bg-lightGray transform transition-transform duration-100 hover:scale-x-[1.005] hover:scale-y-[1.001] hover:cursor-default bg-opacity-40`}
                  onClick={() => {
                    setSelectedMail(mail);
                    if (!mail.read) {
                      markAsRead(mail);
                    }
                  }}
                >
                  <p className="pl-2 w-1/6">
                    {mailUrl == "received"
                      ? truncateWords(mail.senderName, 20, ".") || "HỆ THỐNG"
                      : truncateWords(mail.recipientNames?.[0] || "", 10, ".")}
                  </p>
                  <p className="pl-2 w-4/6">
                    {truncateWords(mail.title, 20, ".")} -{" "}
                    {truncateWords(mail.message, 30, ".")}
                  </p>
                  <p className="pl-2 w-1/6">
                    {new Date(mail.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <PageNumberFooter
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onPageChange={fetchMail}
          totalPages={totalPages}
        ></PageNumberFooter>
      </main>
    </>
  );
};

const Sidebar = ({
  setIsComposerOpen = () => {},
  setMailUrl = () => {},
  setCurrentPage = () => {},
  setSelectedMail = () => {},
}) => {
  return (
    <>
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col md:min-h-[450px]">
        <button
          onClick={() => setIsComposerOpen(3)}
          className="bg-lightBlue text-white rounded-md px-4 py-2 text-lg font-semibold mb-4 hover:shadow-sm"
        >
          Soạn thông báo
        </button>
        <ul className="text-gray-700 space-y-2">
          <li className="font-medium">Hộp thông báo</li>
          <li
            className="pl-3 py-1 hover:bg-lightGray rounded-md hover:cursor-pointer"
            onClick={() => {
              setCurrentPage(0);
              setMailUrl("received");
              setSelectedMail({});
            }}
          >
            Đã nhận
          </li>
          <li
            className="pl-3 py-1 hover:bg-lightGray rounded-md hover:cursor-pointer"
            onClick={() => {
              setCurrentPage(0);
              setMailUrl("sent");
              setSelectedMail({});
            }}
          >
            Đã gửi
          </li>
        </ul>
      </aside>
    </>
  );
};

const Composer = ({
  userId = "",
  isComposerOpen = 1,
  setIsComposerOpen = () => {},
}) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [recipientIdsList, setRecipientIdsList] = useState("");
  const [sendToGuidedStudents, setSendToGuidedStudents] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);
  const [confirmSendText, setConfirmSendText] = useState("");

  const titleOrMessageIsNull = () => {
    if (
      !title ||
      title.trim().length === 0 ||
      !message ||
      message.trim().length === 0
    ) {
      return true;
    }
    return false;
  };

  const handleSend = async () => {
    let recipientIds = recipientIdsList.split(" ");

    if (!sendToGuidedStudents) {
      try {
        let payload = {
          title: title,
          message: message,
          senderId: userId,
          recipientIds: recipientIds,
        };
        console.log(payload);
        setConfirmSend(false);
        await api.post("/notifications/user", payload);
        handleCloseComposer();
        alert("Gửi thành công.");
      } catch (error) {
        console.log(error);
        if (error.response.data.code == 400) {
          alert(error.response.data.message);
        } else {
          alert("Lỗi không gửi được thư, vui lòng thử lại sau.");
        }
      }
    } else {
      try {
        let payload = {
          title: title,
          message: message,
          senderId: userId,
        };
        console.log(payload);
        setConfirmSend(false);
        await api.post("/notifications/user/guidedStudent", payload);
        handleCloseComposer();
      } catch (error) {
        console.log(error);
        if (error.response.data.code == 400) {
          alert("Không có sinh viên đang hướng dẫn!");
        } else {
          alert("Lỗi không gửi được thư, vui lòng thử lại sau.");
        }
      }
    }
  };

  const handleCloseComposer = () => {
    setTitle("");
    setMessage("");
    setSendToGuidedStudents(false);
    setRecipientIdsList("");
    setIsComposerOpen(1);
  };

  const validateEmail = async () => {
    if (!recipientIdsList.trim() && sendToGuidedStudents === false) {
      alert("Vui lòng nhập id người nhận.");
      return;
    }
    if (!title || title.trim().length === 0) {
      if (!message || message.trim().length === 0) {
        alert("Không thể bỏ trống cả tiêu đề và nội dung.");
        return;
      }
    }
    setConfirmSend(true);
    if (titleOrMessageIsNull()) {
      setConfirmSendText("Gửi thư không tiêu đề hoặc nội dung?");
    } else {
      setConfirmSendText("Xác nhận gửi?");
    }
  };
  return (
    <>
      {isComposerOpen == 2 && (
        <div className="fixed bottom-0 right-0 w-[450px] bg-white shadow-lg border border-darkGray border-opacity-50 rounded-t-lg font-textFont">
          <div className="flex justify-between items-center p-3 bg-lightGray rounded-t-md">
            <div
              className="font-medium pl-1 text-xl w-full"
              onClick={() => setIsComposerOpen(3)}
            >
              Thông báo mới
            </div>
            <button
              className="text-darkGray"
              onClick={() => handleCloseComposer()}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {isComposerOpen == 3 && (
        <div className="fixed bottom-0 right-0 w-[450px] bg-white shadow-lg border border-darkGray border-opacity-50 rounded-t-lg font-textFont">
          <div className="flex justify-between items-center p-3 bg-lightGray rounded-t-md">
            <span className="font-medium pl-1 text-xl">Thông báo mới</span>
            <div className="flex gap-5">
              <button
                className="text-darkGray"
                onClick={() => setIsComposerOpen(2)}
              >
                &mdash;
              </button>
              <button
                className="text-darkGray"
                onClick={() => handleCloseComposer(1)}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="px-3 pt-2">
            <div className="flex items-end gap-2 mb-2">
              <input
                type="email"
                placeholder="Đến MSSV (Ngăn cách bằng dấu cách)"
                className="flex-1 p-2 border-b border-lightGray text-sm focus:outline-none disabled:opacity-50"
                value={recipientIdsList}
                disabled={sendToGuidedStudents}
                onChange={(e) => setRecipientIdsList(e.target.value)}
              />
              <span>Hoặc</span>
              <Tooltip
                title="Gửi đến các sinh viên đang được hướng dẫn"
                arrow
                placement="top"
                enterDelay={200}
              >
                <div className="flex items-end gap-1">
                  <Checkbox
                    size="small"
                    checked={sendToGuidedStudents}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      if (isChecked && recipientIdsList?.trim().length > 0) {
                        alert("Không thể gửi nhanh nếu mục đến MSSV có MSSV");
                        return;
                      }
                      setSendToGuidedStudents(isChecked);
                    }}
                    sx={{ padding: 0 }}
                  />

                  <span className="text-[12px]">Gửi nhanh</span>
                </div>
              </Tooltip>
            </div>

            <input
              type="text"
              placeholder="Tiêu đề"
              className="w-full p-2 mb-2 border-b-[1px] border-lightGray text-sm focus:outline-none focus:border-b-[1px]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Nội dung thông báo..."
              className="w-full p-2 rounded h-32 resize-none text-sm focus:outline-none focus:border-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-end p-3">
            <button
              onClick={validateEmail}
              className="bg-lightBlue text-white px-4 py-2 rounded"
            >
              Gửi
            </button>
          </div>
          <ConfirmationPopup
            isOpen={confirmSend}
            onConfirm={handleSend}
            onDecline={() => setConfirmSend(false)}
            text={confirmSendText}
          ></ConfirmationPopup>
        </div>
      )}
    </>
  );
};

const MailDetail = ({
  selectedMail = {},
  setSelectedMail = () => {},
  mailUrl = "received",
}) => {
  const [displayRecipients, setDisplayRecipients] = useState(false);
  return (
    <>
      <div className="flex-1 px-6 w-full min-h-screen mb-4">
        <div
          onClick={() => setSelectedMail({})}
          className="hover:cursor-pointer"
        >
          <p className="pb-6">{"< Quay lại"}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          {/* Title */}
          <p className="font-bold text-3xl text-gray-900 pb-3 border-b border-gray-200">
            {selectedMail.title}
          </p>

          {/* Sender */}
          <div className="flex items-center text-darkGray justify-between pt-3 pb-5 w-full">
            {mailUrl === "received" ? (
              <p className="text-sm italic">
                {selectedMail.senderName || "Từ HỆ THỐNG"}
              </p>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <Typography
                    variant="body1"
                    className="cursor-pointer"
                    onClick={() => setDisplayRecipients((prev) => !prev)}
                    sx={{ fontWeight: "bold" }}
                  >
                    Người nhận:
                    <ExpandMoreIcon
                      style={{
                        transform: displayRecipients
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s ease-in-out",
                      }}
                    />
                  </Typography>

                  <Typography variant="caption" className="text-gray-400">
                    {new Date(selectedMail.createdAt).toLocaleString("vi-VN")}
                  </Typography>
                </div>

                <Collapse in={displayRecipients}>
                  <ul className="text-sm italic list-disc list-inside mt-1">
                    {selectedMail.recipientNames?.map((recipient, index) => (
                      <li key={index}>{recipient}</li>
                    ))}
                  </ul>
                </Collapse>
              </div>
            )}
            {mailUrl === "received" && (
              <p className="text-xs text-gray-400">
                {new Date(selectedMail.createdAt).toLocaleString("vi-VN")}
              </p>
            )}
          </div>

          {/* Message */}
          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
            {selectedMail.message}
          </p>
        </div>
      </div>
    </>
  );
};

const TeacherNotificationPage = ({ userData }) => {
  const [isComposerOpen, setIsComposerOpen] = useState(1); //1 == none, 2 == minimize, 3 == yes
  const [selectedMail, setSelectedMail] = useState({});
  const [mailUrl, setMailUrl] = useState("received");
  const [currentPage, setCurrentPage] = useState(0);
  // const { loading } = useBootstrapUser(); // hydrates redux on mount
  const user = userData;
  const role = user?.role; // safe access
  const navigate = useNavigate();
  // if (loading) return null;
  if (!role) return null;
  if (role.name !== "TEACHER") {
    navigate("/notFound");
  }
  if (!user.userId) return null;

  return (
    <div className="flex bg-bgGray pt-6">
      {/* Sidebar */}
      <Sidebar
        setIsComposerOpen={setIsComposerOpen}
        setMailUrl={setMailUrl}
        setCurrentPage={setCurrentPage}
        setSelectedMail={setSelectedMail}
      ></Sidebar>

      {/* Main Content */}
      {Object.keys(selectedMail).length === 0 && (
        <MailList
          userId={user.userId}
          setSelectedMail={setSelectedMail}
          mailUrl={mailUrl}
          setMailUrl={setMailUrl}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        ></MailList>
      )}
      {Object.keys(selectedMail).length > 0 && (
        <MailDetail
          selectedMail={selectedMail}
          setSelectedMail={setSelectedMail}
          mailUrl={mailUrl}
        ></MailDetail>
      )}
      {/* Email Composer Popup */}
      <Composer
        isComposerOpen={isComposerOpen}
        setIsComposerOpen={setIsComposerOpen}
        userId={user.userId}
      ></Composer>
    </div>
  );
};

TeacherNotificationPage.propTypes = { userData: PropTypes.object };

MailList.propTypes = {
  userId: PropTypes.string,
  setSelectedMail: PropTypes.func,
  mailUrl: PropTypes.string,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
};

Composer.propTypes = {
  isComposerOpen: PropTypes.number,
  setIsComposerOpen: PropTypes.func,
  userId: PropTypes.string,
};

MailDetail.propTypes = {
  selectedMail: PropTypes.object,
  setSelectedMail: PropTypes.func,
  mailUrl: PropTypes.string,
};

Sidebar.propTypes = {
  setIsComposerOpen: PropTypes.func,
  setMailUrl: PropTypes.func,
  setCurrentPage: PropTypes.func,
  setSelectedMail: PropTypes.func,
};

export default TeacherNotificationPage;
