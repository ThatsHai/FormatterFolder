import React, { useEffect } from "react";
import { use } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import TopicInfoButtons from "./TopicInfoButtons";
const TopicInfo = () => {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { topicId } = useParams();
  console.log("Topic ID:", topicId);
  const [formData, setFormData] = useState(null);
  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        const response = await api.get(`topics/${topicId}`);
        if (response.status === 200) {
          setFormData(response.data.result);
        } else {
          console.error("Failed to fetch topic data");
        }
      } catch (error) {
        console.error("Error fetching topic data:", error);
      }
    };
    fetchTopicData();
    console.log("Topic data:", formData);
  }, [topicId, refreshCounter]); // Re-fetch data when topicId or refreshCounter changes
  if (!formData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-6">
      <Link to="/teacher/topics">
        <p>{"< Quay lại"}</p>
      </Link>
      <div className="m-6 bg-lightGray p-6">
        <div className="bg-white rounded-md p-6">
          <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
            <h1 className="text-4xl font-headerFont text-darkBlue font-bold text-center mb-6">
              ĐỀ TÀI: {formData.title}
            </h1>

            <div className="relative text-start w-full font-textFont text-lg px-10 w-full grid grid-cols-3 items-center mb-3">
              <p className="text-black font-semibold">1. CÁN BỘ HƯỚNG DẪN</p>
              {formData.teachers.length > 1 ? (
                <div className="rounded-md col-span-2 bg-[#e4e4e4] px-4 py-1">
                  {formData.teachers?.map((teacher, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1.5rem_auto] gap-2"
                    >
                      <span className="text-right">{index + 1}.</span>
                      <span>
                        {teacher.name} - Email: {teacher.email}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                  {formData.teachers[0].name} - {formData.teachers[0].email}
                </p>
              )}
            </div>

            <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
              <h3 className="text-black font-semibold">
                2. THÔNG TIN GỢI Ý ĐỀ TÀI
              </h3>
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Giới thiệu</p>
                <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                  {formData.description || "Bỏ trống"}
                </p>
              </div>
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Nội dung nghiên cứu</p>
                <p className="col-span-2 rounded-md px-6 py-1 bg-[#e4e4e4]">
                  {formData.researchContent}
                </p>
              </div>
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Mục tiêu tổng quát</p>
                <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                  {formData.objective || "Bỏ trống"}
                </p>
              </div>
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Mục tiêu cụ thể</p>
                <div
                  className="col-span-2 bg-[#e4e4e4] rounded-md min-h-[40px] text-lg rounded-md px-4 py-1 prose prose-sm max-w-none
                    prose-ul:list-disc prose-ol:list-decimal prose-li:ml-1 text-black prose-li:marker:text-black prose-p:ml-4"
                  dangerouslySetInnerHTML={{
                    __html: formData.objectiveDetails,
                  }}
                ></div>
              </div>
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Kinh phí</p>
                <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                  {formData.funding || "Bỏ trống"}
                </p>
              </div>
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Thời gian thực hiện</p>
                <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                  {formData.time} - Bắt đầu từ {formData.implementationTime}
                </p>
              </div>

              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Thông tin liên hệ về đề tài</p>
                <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                  {formData.contactInfo}
                </p>
              </div>
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p className="">Dành cho sinh viên ngành</p>
                {formData.majors.length > 1 ? (
                  <div className="rounded-md bg-[#e4e4e4] px-4 py-1 col-span-2">
                    {formData.majors.map((major, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[1.5rem_auto] gap-2"
                      >
                        <span className="text-right">{index + 1}.</span>
                        <span>{major.majorName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="col-span-2 bg-[#e4e4e4] rounded-md px-6 py-1 ">
                    {formData.majors[0].majorName}
                  </p>
                )}
              </div>
            </div>
            {formData.students.length > 0 && (
              <div className="relative text-start w-full font-textFont text-lg px-10 w-full grid grid-cols-3 items-center mb-3">
                <p className="text-black font-semibold">3. NGƯỜI THỰC HIỆN</p>
                {formData.students.length > 1 ? (
                  <div className="rounded-md col-span-2 bg-[#e4e4e4] px-4 py-1">
                    {formData.students?.map((student, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[1.5rem_auto] gap-2"
                      >
                        <span className="text-right">{index + 1}.</span>
                        <span>
                          {student.name} - {student.userId} -{" "}
                          {student.studentClass.major.majorName}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                    {formData.students[0].name} - {formData.students[0].userId}{" "}
                    - {formData.students[0].studentClass.major.majorName}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <TopicInfoButtons
          topic={formData}
          onUpdated={() => setRefreshCounter(refreshCounter + 1)}
        ></TopicInfoButtons>
      </div>
    </div>
  );
};

export default TopicInfo;
