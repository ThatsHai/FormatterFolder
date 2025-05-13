import { useState } from "react";
import Button from "../component/Button";
import SubmitThesisForm from "../component/forms/SubmitThesisForm";
import ContentHomepage from "../component/pageComponents/homepage/ContentHomepage";

const HomePage = () => {
  const [thesisFormOpen, setIsThesisFormOpen] = useState(false);

  const handleFormToggle = () => {
    setIsThesisFormOpen(!thesisFormOpen);
    console.log(thesisFormOpen);
  };

  return (
    <div className="pt-6">
      <div className="flex justify-end">
        <div className="w-1/3 flex mr-3">
          <Button label="Tìm kiếm..."></Button>
          <Button label="Thêm đề tài" handleClick={handleFormToggle}></Button>
        </div>
      </div>

      <ContentHomepage year={2025}></ContentHomepage>
      {thesisFormOpen && (
          <SubmitThesisForm handleFormToggle={handleFormToggle} />
      )}
    </div>
  );
};

export default HomePage;
