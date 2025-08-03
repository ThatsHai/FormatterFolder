import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PageNumberFooter from "../../component/PageNumberFooter";
import api from "../../services/api";
import { Collapse, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // from MUI

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
      <main className="flex-1 p-6 w-full mx-6 mb-6 shadow-md bg-white">
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

const MailDetail = ({
  selectedMail = {},
  setSelectedMail = () => {},
  mailUrl = "received",
}) => {
  const [displayRecipients, setDisplayRecipients] = useState(false);
  return (
    <>
      <div className="flex-1 px-6 w-full min-h-[100vh]">
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

const StudentNotificationPage = ({ userData }) => {
  const [selectedMail, setSelectedMail] = useState({});
  const [mailUrl, setMailUrl] = useState("received");
  const [currentPage, setCurrentPage] = useState(0);
  const user = userData;
  const role = user?.role; // safe access

  if (!role) return null;
  if (!user.userId) return null;

  return (
    <div className="flex bg-bgGray pt-6">
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
    </div>
  );
};

StudentNotificationPage.propTypes = { userData: PropTypes.object };

MailList.propTypes = {
  userId: PropTypes.string,
  setSelectedMail: PropTypes.func,
  mailUrl: PropTypes.string,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
};

MailDetail.propTypes = {
  selectedMail: PropTypes.object,
  setSelectedMail: PropTypes.func,
  mailUrl: PropTypes.string,
};

export default StudentNotificationPage;
