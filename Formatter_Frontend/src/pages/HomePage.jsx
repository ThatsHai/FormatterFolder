import { useState } from "react";
import Button from "../component/Button";
import SubmitThesisForm from "../component/forms/SubmitThesisForm";

const ContentHomepage = () => {
  return <div className="min-h-[400px] bg-lightGray m-5 rounded-md"></div>
}

const HomePage = () => {
  const [thesisFormOpen, setIsThesisFormOpen] = useState(false);

  const handleFormToggle = () => {
    setIsThesisFormOpen(!thesisFormOpen);
    console.log(thesisFormOpen)
  }


  return (
    <div className="pt-6">
      <div className="flex justify-end">
        <div className="w-1/3 flex mr-3">
          <Button label="Tìm kiếm..."></Button>
          <Button label="Thêm đề tài" handleClick={handleFormToggle}></Button>
        </div>
      </div>

      <ContentHomepage></ContentHomepage>
      {thesisFormOpen && <SubmitThesisForm handleFormToggle={handleFormToggle}/>}
    </div>
  );
};

export default HomePage;
