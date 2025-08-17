import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import DesignsListWindow from "../../component/DesignListWindow";

const fieldTypeLabels = {
  SHORT_ANSWER: "Trả lời ngắn",
  LONG_ANSWER: "Trả lời dài",
  BULLETS: "Kiểu liệt kê",
  SELECT: "Bảng chọn",
  TABLE: "Bảng",
  DATE: "Ngày",
};

const enumToLabel = (fieldType) => fieldTypeLabels[fieldType];

const FormInfoPage = () => {
  const [form, setForm] = useState({});
  const [sortedFields, setSortedFields] = useState([]);
  const [openDesignsListWindow, setOpenDesignsListWindow] = useState(false);
  const { formId } = useParams();

  const closeDesignsListWindow = () => {
    setOpenDesignsListWindow(false);
  };

  const displayDesignsListWindow = () => {
    setOpenDesignsListWindow(true);
  };

  useEffect(() => {
    const fetchFormData = async () => {
      const result = await api.get(`/forms/${formId}`);
      setForm(() => result.data.result);
    };
    fetchFormData();
  }, [formId]);

  useEffect(() => {
    if (form.formFields) {
      setSortedFields(
        [...form.formFields].sort((a, b) => a.position - b.position)
      );
    }
  }, [form]);

  return (
    <div className="p-6">
      <Link to="/admin/forms">
        <p>{"< Quay lại"}</p>
      </Link>
      <div className="m-6 bg-lightGray p-6">
        <div className="bg-white rounded-md p-6 pb-0">
          <div className="relative text-start w-full font-textFont text-lg mb-8 ">
            <h1 className="text-4xl font-headerFont text-darkBlue font-bold text-center mb-6">
              {form.title}
            </h1>
            {form.introduction && (
              <div className="relative text-start w-full font-textFont text-lg">
                <h3 className="text-black font-semibold mb-2">Mô tả</h3>
                <p className="w-full">{form.introduction}</p>
              </div>
            )}
          </div>
          <div className=" rounded-lg font-textFont pb-6">
            <h2 className="text-lg font-bold mb-4">Trường dữ liệu</h2>

            {sortedFields.length === 0 ? (
              <p className="text-gray-500">Không có trường dữ liệu</p>
            ) : (
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead className="text-center">
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">
                      Tên câu hỏi
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Mô tả</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Dạng câu hỏi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFields.map(
                    ({ formFieldId, fieldName, description, fieldType }) => (
                      <tr key={formFieldId} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {fieldType === "TABLE"
                            ? (() => {
                                const [q, raw = ""] = (fieldName || "").split(
                                  ":::"
                                );
                                const question = (q || "").trim();
                                if (question) return question;

                                // Extract headers from HTML <th>
                                const headers = [];
                                const thRegex = /<th\b[^>]*>(.*?)<\/th>/gi;
                                let m;
                                while ((m = thRegex.exec(raw)) !== null) {
                                  headers.push(
                                    m[1].replace(/<[^>]+>/g, "").trim()
                                  );
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
                            : fieldName}
                        </td>

                        <td className="border border-gray-300 px-4 py-2">
                          {description || (
                            <span className="italic text-gray-400">
                              Không có mô tả
                            </span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {enumToLabel(fieldType) || (
                            <span className="italic text-gray-400">
                              Chưa định nghĩa
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>

          {sortedFields.length > 0 && (
            <div className="flex justify-end w-full text-lg">
              <Link to={`/admin/designs/${formId}`}>
                <button className="border px-4 py-1 my-2 mx-2 mb-4 rounded-md">
                  Tạo mẫu thiết kế
                </button>
              </Link>
              <button
                className="border px-4 py-1 my-2 ml-2 mb-4 rounded-md bg-lightBlue text-white hover:bg-blue-600"
                onClick={displayDesignsListWindow}
              >
                Tải file
              </button>
            </div>
          )}
        </div>
      </div>

      {openDesignsListWindow && (
        <DesignsListWindow
          formId={formId}
          onDecline={closeDesignsListWindow}
        ></DesignsListWindow>
      )}
    </div>
  );
};

export default FormInfoPage;
