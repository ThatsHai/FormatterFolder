import { useState, useEffect } from "react";
import api from "../../../services/api";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../../../component/Button";
import TopicForm from "../TopicSuggestionPage";
import { useNavigate } from "react-router-dom";
const TopicCard = ({ topic }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-md border p-6 h-72 relative"
      onClick={() => navigate(`/teacher/topic/${topic.topicId}`)}
    >
      <p className="font-headerFont text-2xl font-bold">{topic.title}</p>
      <p className="py-3">{topic.description}</p>
      <div className="flex items-end w-full justify-end absolute right-4 bottom-4">
          <button
            className={`text-end align-bottom font-semibold bg-white border-none text-base px-3 py-1 rounded-md  ${
              topic.status == "PUBLISHED" ? "text-greenCorrect" : "text-redError"
            }`}
          >
            {topic.status === "PUBLISHED"
            ? "Đã công khai"
            : topic.status === "UNPUBLISHED"
            ? "Chưa công khai"
            : "Không rõ trạng thái"}{" "}
          
          </button>
        </div>
    </div>
  );
};

const TopicContent = () => {
  const [topicsList, setTopicsList] = useState([]);
  const [topicFormOpen, setIsTopicFormOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  useEffect(() => {
    const result = async () => {
      const result = await api.get(`/topics/teacher?teacherId=${user.acId}`);
      setTopicsList(result.data.result);
      console.log(result);
    };
    result();
  }, [refreshTrigger, user]);

  const handleFormToggle = async () => {
    setIsTopicFormOpen((prev) => !prev);
  };
  return (
    <div className="pt-6">
      <div className="flex justify-end">
        <div className="w-1/3 flex mr-3">
          <Button label="Tìm kiếm..."></Button>
          <Button label="Thêm đề tài" handleClick={handleFormToggle}></Button>
        </div>
      </div>
      <div className="bg-lightGray m-5 p-6 rounded-md">
        <p className="mb-3 text-2xl">ĐỀ TÀI CỦA BẠN</p>
        <div className="min-h-[400px]  rounded-md grid grid-cols-2 md:grid-cols-4 gap-3">
          {topicsList?.length > 0 ? (
            topicsList.map((t) => <TopicCard topic={t}></TopicCard>)
          ) : (
            <p>Chưa có đề tài nào</p>
          )}
        </div>
        {topicFormOpen && (
          <TopicForm
            handleFormToggle={handleFormToggle}
            onSuccess={() => {
              handleFormToggle();
              setRefreshTrigger((prev) => prev + 1);
            }}
          ></TopicForm>
        )}
        {/* <SuccessPopup
          isOpen={showPopup}
          onClose={() => {
            setShowPopup(false);
            setIsTopicFormOpen(false);
          }}
        /> */}
      </div>
    </div>
  );
};

export default TopicContent;

TopicCard.propTypes = {
  topic: PropTypes.object,
};
