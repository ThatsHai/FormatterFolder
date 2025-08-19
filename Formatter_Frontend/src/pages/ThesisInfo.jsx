import { useState } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ThesisInfoButtons from "../component/pageComponents/thesisInfoPage/ThesisInfoButtons";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../services/api";

const ThesisInfo = ({ onDecline = () => {} }) => {
  // const currentYear = new Date().getFullYear();
  const { formRecordId } = useParams();
  const [formRecord, setFormRecord] = useState(null);
  console.log("recordid:", formRecordId);
  const [formData, setFormData] = useState(null);

  // const [fieldPages, setFieldPages] = useState(0);
  // const [currentPage, setCurrentPage] = useState(0); // 0 = trang thông tin chung
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [showStudentInfo, setShowStudentInfo] = useState(false);
  const [showTopicInfo, setShowTopicInfo] = useState(false);

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

  const stripPrefix = (value) => {
    const parts = value.split(":::");
    return parts.length > 1 ? parts.slice(1).join(":::") : value;
  };

  const applyTailwindToTable = (html) => {
    // Thêm &nbsp; để giữ chiều cao ô trống
    const filledHTML = html.replace(/<td>\s*<\/td>/g, "<td>&nbsp;</td>");

    return (
      filledHTML
        // style cho <table>
        .replace(
          /<table(?![^>]*class=)/g,
          '<table class="table-fixed border border-gray-300 border-collapse w-full text-sm text-left"'
        )
        // style cho <thead>
        .replace(
          /<thead(?![^>]*class=)/g,
          '<thead class="bg-gray-100 border-b border-gray-300"'
        )
        // style cho <th>
        .replace(
          /<th(?![^>]*class=)/g,
          '<th class="border border-gray-300 px-2 py-2 text-center font-semibold"'
        )
        // style cho <td>
        .replace(
          /<td(?![^>]*class=)/g,
          '<td class="border border-gray-300 px-2 py-2 align-top"'
        )
    );
  };

  if (!formData) return <div>Đang tải...</div>;

  return (
    <div className="p-6">
      <div className="m-6 mx-2 bg-lightGray p-6">
        <div className="bg-white rounded-md p-6">
          <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
            <h1 className="text-4xl font-headerFont text-darkBlue font-bold text-center mb-6">
              {formRecord.topic.form.title}
            </h1>
            {/* Title */}
            <div className="relative text-start font-textFont text-lg px-10 w-full grid grid-cols-3 items-center mb-3">
              <h3 className="text-black font-semibold">1. ĐỀ TÀI</h3>
              <p className="rounded-md col-span-2 bg-[#e4e4e4] px-6 py-1">
                {formData.title}
              </p>
            </div>
            {/* Teacher Information */}
            <div className="relative text-start font-textFont text-lg px-10 w-full grid grid-cols-3 items-center">
              <p className="text-black font-semibold">2. CÁN BỘ HƯỚNG DẪN</p>
              {formData.topic.teachers.length > 1 ? (
                <div className="rounded-md col-span-2 bg-[#e4e4e4] px-4 py-1">
                  {formData.topic.teachers?.map((teacher, index) => (
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
                  {formData.topic.teachers[0].name} -{" "}
                  {formData.topic.teachers[0].email}
                </p>
              )}
            </div>

            {/* Student Information */}
            <div className="flex items-center text-start w-full font-textFont text-lg px-10">
              <h3 className="text-black font-semibold">3. NGƯỜI THỰC HIỆN</h3>
              <IconButton
                color="black"
                aria-label="add"
                onClick={() => setShowStudentInfo((prev) => !prev)}
              >
                <AddIcon />
              </IconButton>
            </div>
            {showStudentInfo && (
              <div className="relative text-start w-full font-textFont text-lg px-10 ">
                {/* Student info */}
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Tên sinh viên</p>
                  <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                    {formData.student.studentName}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Khóa (MSSV)</p>
                  <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                    {formData.student.studentId}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Ngành</p>
                  <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                    {formData.student.major}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Đơn vị (Khoa/Bộ môn)</p>
                  <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                    {formData.student.department}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Khoa/Trường</p>
                  <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                    {formData.student.faculty}
                  </p>
                </div>
              </div>
            )}

            {/* Topic Information */}
            <div className="flex items-center text-start w-full font-textFont text-lg px-10">
              <h3 className="text-black font-semibold">
                4. THÔNG TIN GỢI Ý ĐỀ TÀI
              </h3>
              <IconButton
                color="black"
                aria-label="add"
                onClick={() => setShowTopicInfo((prev) => !prev)}
              >
                <AddIcon />
              </IconButton>
            </div>
            {showTopicInfo && (
              <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Giới thiệu</p>
                  <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                    {formData.topic.description || "Bỏ trống"}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Nội dung nghiên cứu</p>
                  <p className="col-span-2 rounded-md px-6 py-1 bg-[#e4e4e4]">
                    {formData.topic.researchContent}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Mục tiêu tổng quát</p>
                  <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                    {formData.topic.objective || "Bỏ trống"}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Mục tiêu cụ thể</p>
                  <div
                    className="col-span-2 bg-[#e4e4e4] min-h-[40px] text-lg rounded-md px-3 py-1 prose prose-sm max-w-none
                    prose-ul:list-disc prose-ol:list-decimal prose-li:ml-1 text-black  prose-li:marker:text-black"
                    dangerouslySetInnerHTML={{
                      __html: formData.topic.objectiveDetails,
                    }}
                  ></div>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Kinh phí</p>
                  <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                    {formData.topic.funding || "Bỏ trống"}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Thời gian thực hiện</p>
                  <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                    {formData.topic.time} - Bắt đầu từ{" "}
                    {formData.topic.implementationTime}
                  </p>
                </div>

                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p>Thông tin liên hệ về đề tài</p>
                  <p className="col-span-2 rounded-md bg-[#e4e4e4] px-6 py-1 ">
                    {formData.topic.contactInfo}
                  </p>
                </div>
                <div className="w-full grid grid-cols-3 items-center mb-3">
                  <p className="">Dành cho sinh viên ngành</p>
                  {formData.topic.majors.length > 1 ? (
                    <div className="rounded-md bg-[#e4e4e4] px-4 py-1 col-span-2">
                      {formData.topic.majors.map((major, index) => (
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
                      {formData.topic.majors[0].majorName}
                    </p>
                  )}
                </div>
              </div>
            )}
            <h1 className="text-4xl font-headerFont text-darkBlue font-bold text-center mb-6">
              Thông tin đã điền
            </h1>
            {formRecord.formRecordFields
              .sort((a, b) => a.formField.position - b.formField.position)
              .map((field, index) => (
                <div className="font-textFont text-lg mb-8 px-10" key={index}>
                  <h3 className="text-black font-semibold mb-3">
                    {index + 1}.{" "}
                    {field.formField?.fieldType === "TABLE"
                      ? (() => {
                          const [q, raw = ""] = (
                            field.formField?.fieldName || ""
                          ).split(":::");
                          const question = (q || "").trim();
                          if (question) return question;

                          // Extract headers from HTML <th>
                          const headers = [];
                          const thRegex = /<th\b[^>]*>(.*?)<\/th>/gi;
                          let m;
                          while ((m = thRegex.exec(raw)) !== null) {
                            headers.push(m[1].replace(/<[^>]+>/g, "").trim());
                          }

                          return (
                            <table className="inline-table border border-gray-400 border-collapse text-sm max-w-xs">
                              <thead>
                                <tr>
                                  {headers.map((header, idx) => (
                                    <th
                                      key={idx}
                                      className="border border-gray-400 px-2 py-1 font-semibold"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                            </table>
                          );
                        })()
                      : field.formField?.fieldName}
                  </h3>

                  {field.formField.fieldType === "QUILL_DATA" ? (
                    <div
                      className="rounded-md px-3 py-2 overflow-x-auto border"
                      dangerouslySetInnerHTML={{
                        __html: stripPrefix(field.value),
                      }}
                    />
                  ) : field.formField.fieldType === "TABLE" ? (
                    <div
                      className="overflow-x-auto mt-2"
                      dangerouslySetInnerHTML={{
                        __html: applyTailwindToTable(stripPrefix(field.value)),
                      }}
                    />
                  ) : (
                    <p className="rounded-md border px-6 py-1">{field.value}</p>
                  )}
                </div>
              ))}
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
