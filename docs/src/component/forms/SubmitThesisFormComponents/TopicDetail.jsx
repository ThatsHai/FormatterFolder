import { useState } from "react";
import api from "../../../services/api";
import DisabledField from "./DisabledField";
import PropTypes from "prop-types";
import { useEffect } from "react";
import TeachersTable from "../../../pages/teacherPages/TeachersTable";
import MajorsTable from "../../../pages/teacherPages/major/MajorsTable";
const TopicDetail = ({ topic, onChange, formErrors }) => {
  const [selectedTopic, setSelectedTopic] = useState(topic?.topicId || "");

  // const [topic,setTopic] = useState({
  //     topicId: selectedTopic,
  //     title: "",
  //     description: "",
  //     objectives: "",
  //     funding: "",
  //     fundingSource: "",
  //     contact: "",
  //     implementationTime:"",
  //     teachers: [],
  //     majors: [],
  // });

  useEffect(() => {
    setSelectedTopic(topic?.topicId || "");
  }, [topic]);

  return (
    <div>
      <div className="my-1">
        <div>
          <DisabledField title="Tên đề tài" value={topic.title}></DisabledField>
          <DisabledField
            title="Mô tả"
            value={topic.description}
          ></DisabledField>
          <div className="w-full grid grid-cols-3 items-start mb-3">
            <label className="text-black">Mục tiêu</label>
            <div
              className="col-span-2 bg-[#e4e4e4] text-[#686868] rounded-md px-4 py-1 min-h-[40px] text-lg
               pointer-events-none prose prose-sm 
               prose-ul:list-disc prose-ol:list-decimal prose-li:ml-5 
               prose-li:marker:text-[#686868] prose-p:text-[#686868]"
              dangerouslySetInnerHTML={{ __html: topic.objective || "" }}
            />
          </div>

          <DisabledField
            title="Nguồn kinh phí"
            value={topic.funding}
          ></DisabledField>
          <DisabledField
            title="Nguồn kinh phí (nếu có)"
            value={topic.fundingSource}
          ></DisabledField>
          <DisabledField
            title="Thời gian thực hiện"
            value={topic.implementationTime}
          ></DisabledField>
          <DisabledField
            title="Thông tin liên hệ"
            value={topic.contactInfo}
          ></DisabledField>
          <DisabledField
            title="Thời điểm tạo đề tài"
            value={topic.semester + " - năm " + topic.year}
          ></DisabledField>
          <div>
            <p className="mb-3">Cán bộ hướng dẫn</p>
            <TeachersTable
              title="Cán bộ hướng dẫn"
              teachers={topic.teachers || []}
              deleteable={false}
            />
          </div>

          <div>
            <p className="mb-3 mt-5">Dành cho sinh viên ngành</p>
            <MajorsTable
              title="Dành cho sinh viên ngành"
              majors={topic.majors || []}
              deleteable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopicDetail;

TopicDetail.propTypes = {
  topic: PropTypes.shape({
    topicId: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    objective: PropTypes.string,
    funding: PropTypes.string,
    fundingSource: PropTypes.string,
    contactInfo: PropTypes.string,
    implementationTime: PropTypes.string,
    teachers: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string,
        name: PropTypes.string,
      })
    ),
    majors: PropTypes.arrayOf(
      PropTypes.shape({
        majorId: PropTypes.string,
        majorName: PropTypes.string,
      })
    ),
  }),
  onChange: PropTypes.func.isRequired,
  formErrors: PropTypes.object,
};
