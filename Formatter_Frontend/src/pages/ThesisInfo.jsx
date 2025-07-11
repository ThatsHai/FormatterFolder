import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ThesisInfoButtons from "../component/pageComponents/thesisInfoPage/ThesisInfoButtons";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../services/api";
import PageNumberFooter from "../component/PageNumberFooter";
import FormRecordFieldsPaginated from "../component/forms/SubmitThesisFormComponents/FormRecordFieldsPaginated";

const ThesisInfo = ({ onDecline = () => {} }) => {
  const currentYear = new Date().getFullYear();
  const { formRecordId } = useParams();
  const [formRecord, setFormRecord] = useState(null);
  console.log("recordid:", formRecordId);
  const [formData, setFormData] = useState(null);

  const [fieldPages, setFieldPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 0 = trang thông tin chung
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const fetchRecord = async () => {
      const response = await api.get(`/formRecords/${formRecordId}`);
      const record = response.data.result;
      setFormRecord(record);
      console.log("reocrd: ", record);
      setFormData({
        title: record.topic?.title,
        student: {
          studentName: record.student?.name,
          studentId: record.student?.userId,
          major: record.student?.studentClass.major.majorName,
          department:
            record.student?.studentClass.major.department.departmentName,
          faculty:
            record.student?.studentClass.major.department.faculty.facultyName,
        },
        topic: record.topic,
      });
    };
    fetchRecord();
  }, [formRecordId, refreshCounter]);
  if (!formData) return <div>Đang tải...</div>;

  return (
    <div className="p-6">
      <Link to="/student" onClick={onDecline}>
        <p>{"< Quay lại"}</p>
      </Link>
      <div className="m-6 mx-2 bg-lightGray p-6">
        <div className="bg-white rounded-md p-6">
          {currentPage === 0 && (
            <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
              <h1 className="text-4xl font-headerFont text-darkBlue font-bold text-center mb-6">
                {formRecord.topic.form.title}
              </h1>
              {/* Title */}
              <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
                <h3 className="text-black font-semibold mb-2">1. ĐỀ TÀI</h3>
                <p className="w-full">{formData.title}</p>
              </div>

              {/* Student Information */}
              <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
                <h3 className="text-black font-semibold mb-3">
                  2. NGƯỜI THỰC HIỆN
                </h3>
                {/* Student info */}
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Tên sinh viên</p>
                  <p className="col-span-2 rounded-md px-4 py-1 ">
                    {formData.student.studentName}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Khóa (MSSV)</p>
                  <p className="col-span-2 rounded-md px-4 py-1 ">
                    {formData.student.studentId}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Ngành</p>
                  <p className="col-span-2 rounded-md px-4 py-1 ">
                    {formData.student.major}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Đơn vị (Khoa/Bộ môn)</p>
                  <p className="col-span-2 rounded-md px-4 py-1 ">
                    {formData.student.department}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Khoa/Trường</p>
                  <p className="col-span-2 rounded-md px-4 py-1 ">
                    {formData.student.faculty}
                  </p>
                </div>
                {/* Year */}
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Năm</p>
                  <p className="col-span-2 px-4 py-1 w-1/4">{2025}</p>
                </div>
              </div>

              {/* Topic Information */}
              <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
                <h3 className="text-black font-semibold mb-3">
                  3. THÔNG TIN GỢI Ý ĐỀ TÀI
                </h3>
                {/* Student info */}
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Tên đề tài</p>
                  <p className="col-span-2 rounded-md px-4 py-1 ">
                    {formData.topic.title}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Mô tả</p>
                  <p className="col-span-2 rounded-md px-4 py-1 ">
                    {formData.topic.description}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Mục tiêu đề tài</p>
                  <div
                    className="col-span-1 bg-[#e4e4e4] rounded-md min-h-[40px] text-lg rounded-md px-4 py-1 prose prose-sm 
                    prose-ul:list-disc prose-ol:list-decimal prose-li:ml-1 text-black  prose-li:marker:text-black"
                    dangerouslySetInnerHTML={{
                      __html: formData.topic.objective,
                    }}
                  ></div>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Kinh phí</p>
                  <p className="col-span-2 rounded-md px-4 py-1 ">
                    {formData.topic.funding}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Nguồn kinh phí</p>
                  <p className="col-span-2 rounded-md px-4 py-1 ">
                    {formData.topic.fundingSource}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Thời gian thực hiện</p>
                  <p className="col-span-2 rounded-md px-4 py-1 ">
                    {formData.topic.implementationTime}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p className="self-start">Cán bộ hướng dẫn</p>
                  <div className="rounded-md bg-[#e4e4e4] px-4 py-1">
                    {formData.topic.teachers.map((teacher, index) => (
                      <div key={index}>
                        {index + 1}. {teacher.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Thông tin liên hệ</p>
                  <p className="col-span-2 rounded-md px-4 py-1 ">
                    {formData.topic.contactInfo}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p className="self-start">Dành cho sinh viên ngành</p>
                  <div className="rounded-md bg-[#e4e4e4] px-4 py-1">
                    {formData.topic.majors.map((major, index) => (
                      <div key={index}>
                        {index + 1}. {major.majorName}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Các trang chứa FormRecordFields */}
          {/* {currentPage > 0 && formRecord && (
            <FormRecordFieldsPaginated
              formRecordFields={formRecord.formRecordFields}
              externalPage={currentPage - 1} // offset 1 do page 0 là thông tin chung
              onTotalPageChange={(num) => setFieldPages(num)}
              forceRerenderOnPageChange={currentPage}
            />
          )} */}

          {currentPage > 0 &&
            [...formRecord.formRecordFields]
              .sort((a, b) => a.formField.position - b.formField.position)
              .map((field, index) => (
                <div className="flex items-center font-textFont text-lg mb-8 px-10">
                  <h3 className="w-1/3 text-black font-semibold">
                    {index + 1}. {field.formField.fieldName}
                  </h3>

                  <p className="w-2/3 rounded-md px-4 py-1">{field.value}</p>
                </div>
              ))}
          <div className="mt-4">
            <PageNumberFooter
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={2 + fieldPages} // 1 là trang đầu
            />
          </div>
        </div>
        <div>
          {/* Buttons */}
          <ThesisInfoButtons
            formRecord={formRecord}
            onUpdated={() => setRefreshCounter((prev) => prev + 1)}
          ></ThesisInfoButtons>
        </div>
      </div>
    </div>
  );
};

export default ThesisInfo;

ThesisInfo.prototype = {
  formRecord: PropTypes.object,
  onDecline: PropTypes.func,
};
