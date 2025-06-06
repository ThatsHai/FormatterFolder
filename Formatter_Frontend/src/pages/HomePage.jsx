import { useState } from "react";
import Button from "../component/Button";
import SubmitThesisForm from "../component/forms/SubmitThesisForm";
import ContentHomepage from "../component/pageComponents/homepage/ContentHomepage";
import SuccessPopup from "../component/SuccessPopup";

const HomePage = () => {
  const [thesisFormOpen, setIsThesisFormOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleFormToggle = () => {
    setIsThesisFormOpen((prev) => !prev);
  };

  return (
    <div className="pt-6">
      <div className="flex justify-end">
        <div className="w-1/3 flex mr-3">
          <Button label="Tìm kiếm..."></Button>
          <Button label="Thêm đề cương" handleClick={handleFormToggle}></Button>
        </div>
      </div>

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

      <SuccessPopup
        isOpen={showPopup}
        onClose={() => {
          setShowPopup(false);
          setIsThesisFormOpen(false);
        }}
      />
    </div>
  );
};

export default HomePage;
