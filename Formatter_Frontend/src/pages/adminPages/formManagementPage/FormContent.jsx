import { useState, useEffect } from "react";
import api from "../../../services/api";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const FormCard = ({ form }) => {
  return (
    <Link to={`/admin/forms/${form.formId}`}>
      <div className="bg-white rounded-md border p-6 h-72 relative">
        <p className="font-headerFont text-2xl font-bold">{form.title}</p>
        <p className="py-3">{form.introduction}</p>
        <div className="flex items-end w-full justify-end absolute right-4 bottom-4">
          <button
            className={`text-end align-bottom font-semibold bg-white border-none text-base px-3 py-1 rounded-md  ${
              form.status == "Đã duyệt" ? "text-greenCorrect" : "text-redError"
            }`}
          >
            {form.status + " > "}
          </button>
        </div>
      </div>
    </Link>
  );
};

const FormContent = () => {
  const [formsList, setFormsList] = useState([]);

  useEffect(() => {
    const result = async () => {
      const result = await api.get("/forms");
      setFormsList(result.data.result);
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
      <div className="bg-lightGray m-5 p-6 rounded-md">
        {/* <p className="mb-3 text-2xl">Năm {year}</p> */}
        <div className="min-h-[400px]  rounded-md grid grid-cols-2 md:grid-cols-4 gap-3">
          {formsList.length > 0 &&
            formsList.map((form) => (
              <FormCard key={form.formId} form={form}></FormCard>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FormContent;

FormCard.propTypes = {
  form: PropTypes.object,
};
