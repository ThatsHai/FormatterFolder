import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ThesisInfoButtons from "../component/pageComponents/thesisInfoPage/ThesisInfoButtons";

const TopicInfo = () => {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    title: "Tên đề tài",
    studentName: "Nguyễn Văn A",
    studentId: "B2111111",
    department: "Tên ngành",
    unit: "Tên đơn vị",
    school: "Tên Khoa/Trường",
    year: currentYear,
    teachersList: [
      {
        Khoa: "Trường CNTT",
        MaBM: "Khoa CNTT",
        TenCB: "Nguyen V",
        MaCB: "0111",
      },
      {
        Khoa: "Trường CNTT",
        MaBM: "Khoa CNTT",
        TenCB: "Nguyen Y",
        MaCB: "0122",
      },
    ],
    introduction: "Giới thiệu chi tiết về nội dung đề tài đã nộp",
  });
  return (
    <div className="p-6">
      <Link to="/">
        <p>{"< Quay lại"}</p>
      </Link>
      <div className="m-6 bg-lightGray p-6">
        <div className="bg-white rounded-md p-6">
          <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
            <h1 className="text-4xl font-headerFont text-darkBlue font-bold text-center mb-6">
              Đề cương
            </h1>
            {/* Title */}
            <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
              <h3 className="text-black font-semibold mb-2">1. TÊN ĐỀ TÀI</h3>
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
                  {formData.studentName}
                </p>
              </div>
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Khóa (MSSV)</p>
                <p className="col-span-2 rounded-md px-4 py-1 ">
                  {formData.studentId}
                </p>
              </div>
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Ngành</p>
                <p className="col-span-2 rounded-md px-4 py-1 ">
                  {formData.department}
                </p>
              </div>
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Đơn vị (Khoa/Bộ môn)</p>
                <p className="col-span-2 rounded-md px-4 py-1 ">
                  {formData.unit}
                </p>
              </div>
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Khoa/Trường</p>
                <p className="col-span-2 rounded-md px-4 py-1 ">
                  {formData.school}
                </p>
              </div>
              {/* Year */}
              <div className="w-full grid grid-cols-3 items-center mb-3">
                <p>Năm</p>
                <p className="col-span-2 px-4 py-1 w-1/4">{formData.year}</p>
              </div>
            </div>

            {/* Teacher */}
            <div className="relative text-start w-full font-textFont text-lg mb-6 px-10">
              <div className="items-center mb-2">
                <h3 className="text-black font-semibold mb-3">
                  3. CÁN BỘ HƯỚNG DẪN
                </h3>

                <ul className="list-disc ml-5 space-y-1">
                  {formData.teachersList?.map((teacher, index) => (
                    <li key={index}>
                      <div className="flex justify-between items-center">
                        <span>
                          {teacher.TenCB} ({teacher.MaCB}) - {teacher.Khoa},{" "}
                          {teacher.MaBM}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Introduction */}
            <div className="relative text-start w-full font-textFont text-lg mb-8 px-10">
              <h3 className="text-black font-semibold mb-2">4. GIỚI THIỆU</h3>
              <p
                name="introduction"
                id=""
                className="w-full px-3 rounded-md resize-none"
              >
                {formData.introduction}
              </p>
            </div>
          </div>
        </div>
        <div>
          {/* Buttons */}
          <ThesisInfoButtons></ThesisInfoButtons>
        </div>
      </div>
    </div>
  );
};

export default TopicInfo;
