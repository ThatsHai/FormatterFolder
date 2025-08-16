import FormContent from "./formManagementPage/FormContent";
import Button from "../../component/Button";
import { useNavigate } from "react-router-dom";

const FormManagementPage = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="flex justify-end">
        <div className="w-1/6 flex mr-3">
          {/* <Button label="Tìm kiếm..." handleClick={() => {}}></Button> */}
          <Button
            label="Thêm biểu mẫu"
            handleClick={() => navigate("/admin/forms/create")}
          ></Button>
        </div>
      </div>
      <FormContent></FormContent>
    </div>
  );
};

export default FormManagementPage;
