import { useState, useEffect } from "react";
import api from "../../../services/api";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../../../component/Button"

const TopicCard = ({ topic }) => {
  return (
    <Link to={``}>
      <div className="bg-white rounded-md border p-6 h-72 relative">
        <p className="font-headerFont text-2xl font-bold">{topic.title}</p>
        <p className="py-3">{topic.description}</p>
        {/* <div className="flex items-end w-full justify-end absolute right-4 bottom-4">
          <button
            className={`text-end align-bottom font-semibold bg-white border-none text-base px-3 py-1 rounded-md  ${
              form.status == "Đã duyệt" ? "text-greenCorrect" : "text-redError"
            }`}
          >
            {form.status + " > "}
          </button>
        </div> */}
      </div>
    </Link>
  );
};

const TopicContent = () => {
  const [topicsList, setTopicsList] = useState([]);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    const result = async () => {
      const result = await api.get(`/topics/teacher?teacherId=${user.acId}`);
      setTopicsList(result.data.result);
      console.log(result);
    };
    result();
  }, []);

  // if (!formsList) {
  //   <div className="bg-lightGray m-5 p-6 rounded-md">
  //     <p className="mb-3 text-2xl">Năm {year}</p>
  //   </div>;
  // }

  return (
    <div className="pt-6">
      <div className="flex justify-end">
              <div className="w-1/3 flex mr-3">
                <Button label="Tìm kiếm..." ></Button>
                <Button label="Thêm đề tài" ></Button>
              </div>
            </div>
      <div className="bg-lightGray m-5 p-6 rounded-md">
        {/* <p className="mb-3 text-2xl">Năm {year}</p> */}
        <div className="min-h-[400px]  rounded-md grid grid-cols-2 md:grid-cols-4 gap-3">
          {topicsList.length > 0 &&
            topicsList.map((t) => (
              <TopicCard topic={t}></TopicCard>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TopicContent;

TopicCard.propTypes = {
  topic: PropTypes.object,
};
