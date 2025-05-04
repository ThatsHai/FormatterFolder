import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const FieldInfo = ({
  label = "Tên trường",
  updateForm = () => {},
  resetSignal = false,
}) => {
  const [content, setContent] = useState("");

  const updateValue = (e) => {
    const { value, name } = e.target;
    setContent(value);
    if (updateForm) {
      updateForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (resetSignal) {
      setContent("");
    }
  }, [resetSignal]);
  return (
    <>
      <div className="my-14">
        <p className={`text-gray text-lg opacity-80 py-2`}>{label}</p>
        <div className="relative w-full after:content-[''] after:block after:w-full after:h-[1px] after:bg-darkBlue">
          <input
            className="text-xl w-full outline-none bg-transparent"
            value={content}
            onChange={(e) => updateValue(e)}
            name={label}
          />
        </div>
      </div>
    </>
  );
};

export default FieldInfo;

FieldInfo.propTypes = {
  label: PropTypes.string,
  updateForm: PropTypes.func,
  resetSignal: PropTypes.number,
};
