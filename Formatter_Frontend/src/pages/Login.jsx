import { useState } from "react";
import FieldInfo from "../component/FieldInfo.jsx";

const Login = () => {
  const [formInfo, setFormInfo] = useState({});
  const [resetSignal, setResetSignal] = useState(0);

  const handleSubmit = () => {
    console.log(formInfo);
    setFormInfo({});
    setResetSignal((prev) => prev + 1);
  };
  return (
    <>
      <div className="px-16 py-5">
        <p
          className={`text-5xl text-darkBlue text-headerFont text-center font-bold`}
        >
          Đăng ký
        </p>
        <p className={`text-[1.8rem] text-gray mt-2 opacity-80`}>
          Hệ thống Đề cương luận văn luận án
        </p>
      </div>
      <div>
        <FieldInfo
          updateForm={setFormInfo}
          label="Tên sinh viên"
          resetSignal={resetSignal}
        ></FieldInfo>
        <FieldInfo
          updateForm={setFormInfo}
          label="Mã số sinh viên"
          resetSignal={resetSignal}
        ></FieldInfo>
        <FieldInfo
          updateForm={setFormInfo}
          label="Ngành"
          resetSignal={resetSignal}
        ></FieldInfo>
        <FieldInfo
          updateForm={setFormInfo}
          label="Đơn vị (Khoa/Bộ môn)"
          resetSignal={resetSignal}
        ></FieldInfo>
        <FieldInfo
          updateForm={setFormInfo}
          label="Khoa/Trường"
          resetSignal={resetSignal}
        ></FieldInfo>
        <FieldInfo
          updateForm={setFormInfo}
          label="Mật khẩu"
          resetSignal={resetSignal}
        ></FieldInfo>
        <FieldInfo
          updateForm={setFormInfo}
          label="Nhập lại mật khẩu"
          resetSignal={resetSignal}
        ></FieldInfo>
      </div>
      <button
        className="text-white text-xl py-2 px-4 rounded-md bg-gradient-to-r from-[#23A9E1] to-[#0249AE] w-full mb-10"
        onClick={() => handleSubmit()}
      >
        <p className="text-headerFont text-xl text-center">ĐĂNG KÝ</p>
      </button>
    </>
  );
};

export default Login;
