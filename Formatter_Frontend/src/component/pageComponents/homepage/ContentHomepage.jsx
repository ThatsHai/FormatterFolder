import { useState } from "react";
import ThesisCard from "../../ThesisCard";
import PropTypes from "prop-types";

const ContentHomepage = ({ year = new Date().getFullYear() }) => {
  const [thesisList, setThesisList] = useState([
    {
      title: "De tai A",
      introduction: "Gioi thieu ve nhung thong tin lien quan den de tai A",
      status: "Đã duyệt",
    },
    {
      title: "De tai B",
      introduction: "Gioi thieu",
      status: "Chưa duyệt",
    },
  ]);

  return (
    <div className="bg-lightGray m-5 p-6 rounded-md">
      <p className="mb-3 text-2xl">Năm {year}</p>
      <div className="min-h-[400px]  rounded-md grid grid-cols-2 md:grid-cols-4 gap-3">
        {thesisList.map((thesis, index) => (
          <ThesisCard
            key={index}
            title={thesis.title}
            introduction={thesis.introduction}
            status={thesis.status}
          ></ThesisCard>
        ))}
      </div>
    </div>
  );
};

export default ContentHomepage;

ContentHomepage.propTypes = {
  year: PropTypes.number,
}