import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../component/Button";
import SubmitThesisForm from "../../component/forms/SubmitThesisForm";
import ContentHomepage from "../../component/pageComponents/homepage/ContentHomepage";
import useBootstrapUser from "../../hook/useBootstrapUser"
import SuccessPopup from "../../component/SuccessPopup";
import api from "../../services/api";

const TeacherHomePage = () => {
  const [thesisFormOpen, setIsThesisFormOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const navigate = useNavigate();

  const { loading } = useBootstrapUser(); // hydrates redux on mount
  if (loading) return null;

  const handleFormToggle = async () => {
    setIsThesisFormOpen((prev) => !prev);
  };

  const handleSearch = async () => {
    const result = await api.get("/myInfo");
    const userId = result.data.result.useId;
    console.log(result.data.result.userId);
    if (userId === "") {
      alert("Phiên đăng nhập hết hạn");
      navigate("/login");
    }
    
  };

  return (
    <div className="pt-6">
      {/* <div className="flex justify-end">
        <div className="w-1/3 flex mr-3">
          <Button label="Tìm kiếm đề cương..." handleClick={handleSearch}></Button>
        </div>
      </div> */}
      <ContentHomepage
        year={2025}
        refreshTrigger={refreshCounter}
      ></ContentHomepage>
      {thesisFormOpen && (
        <SubmitThesisForm
          handleFormToggle={handleFormToggle}
          onSuccess={() => {
            setShowPopup(true);
            setRefreshCounter((prev) => prev + 1); //Trigger a new refresh
          }}
        />
      )}
      {/* <SuccessPopup
        isOpen={showPopup}
        onClose={() => {
          setShowPopup(false);
          setIsThesisFormOpen(false);
        }}
      /> */}
    </div>
  );
};

export default TeacherHomePage;
