import PropTypes from "prop-types";
import DisableField from "./DisabledField.jsx";
import PasswordField from "../../PasswordField.jsx";
import SelectField from "../../SelectField.jsx";
import ShortAnswer from "./ShortAnswer.jsx";
import FieldInfo from "./../../FieldInfo.jsx";
import DateField from "./../../DateField.jsx";
import LongAnswer from "./../../LongAnswer.jsx";
import QuillData from "../../QuillData.jsx";
import DynamicTable from "../../../DynamicTable.jsx";

const FormField = ({ type = "text", ...rest }) => {
  const renderFieldByType = () => {
    switch (type) {
      case "password":
        return <PasswordField {...rest} />;
      case "select":
        return <SelectField {...rest} />;
      case "disabled":
        return <DisableField {...rest} />;
      case "fieldInfo":
        return <FieldInfo {...rest} />;
      case "date":
        return <DateField type="date" {...rest} />;
      case "LONG_ANSWER":
        return <LongAnswer {...rest} />;
      case "QUILL_DATA":
        return <QuillData {...rest} />;
      case "TABLE":
        return <DynamicTable {...rest} />;
      default:
        return <ShortAnswer {...rest} />;
    }
  };

  return renderFieldByType();
};

FormField.propTypes = {
  type: PropTypes.string,
};

export default FormField;
