import FormContent from "./formManagementPage/FormContent";
import Button from "../../component/Button";
import { useNavigate } from "react-router-dom";
import useBootstrapUser from "../../hook/useBootstrapUser";
import { useSelector } from "react-redux";

const FormManagementPage = () => {
  const navigate = useNavigate();
  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const userData = useSelector((state) => state.auth.user);
  if (loading) return null;
  if (userData.role.name !== "ADMIN") {
    navigate("/notFound");
  }
  
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
