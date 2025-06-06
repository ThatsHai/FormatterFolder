import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const RightSidebar = ({ formData }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!formData || Object.keys(formData).length === 0) {
    return null;
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-50 font-textFont ${
          isOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold">{formData.title}</h2>
          <p className="text-sm text-gray">
            {formData.introduction || "Không có mô tả"}
          </p>
          <div className="pt-4 grid grid-cols-1 gap-3">
            {formData.formFields.length > 0 &&
              formData.formFields.map((formField) => (
                <div
                  key={formField.formFieldId}
                  className="border p-2 rounded-md"
                >
                  <div className="flex">
                    <p>{formField.fieldName}</p>
                  </div>
                  <p className="text-sm text-gray">
                    {formField.description || "Không có mô tả"}
                  </p>
                  <div className="w-full items-end justify-end flex">
                    <p className="inline-block border px-2 rounded-md bg-greenCorrect">
                      {formField.fieldType || "Chưa chọn"}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        className={`fixed top-1/2 transform ease-in-out duration-300 -translate-y-1/2 z-50 bg-white rounded-l-full px-2 py-1 ${
          isOpen ? "right-64 shadow-sm" : "right-0 shadow-md"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? ">" : "<"}
      </button>
    </>
  );
};

const FormDesignCreationPage = ({
  formId = "f9e059d1-f7f1-4bae-8c7b-c7d90b454280",
}) => {
  const [formData, setFormData] = useState();

  useEffect(() => {
    const fetchFormInfo = async () => {
      const result = await api.get(`/forms/${formId}`);
      setFormData(result.data.result);
      console.log(result);
    };
    fetchFormInfo();
  }, [formId]);

  return (
    <div className="p-6 h-[200vh]">
      <RightSidebar formData={formData}></RightSidebar>
    </div>
  );
};

export default FormDesignCreationPage;
