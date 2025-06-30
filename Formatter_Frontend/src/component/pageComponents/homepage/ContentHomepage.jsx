import { useState, useEffect } from "react";
import ThesisCard from "../../ThesisCard";
import PropTypes from "prop-types";
import api from "../../../services/api";
import { useSelector } from "react-redux";

const ContentHomepage = ({
  year = new Date().getFullYear(),
  refreshTrigger,
}) => {
  const [thesisList, setThesisList] = useState([]);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    const result = async () => {
      const result = await api.get(`/formRecords/student?acId=${user.acId}`);
      setThesisList(result.data.result);
      console.log(result);
    };
    result();
  }, [refreshTrigger]);

  if (!thesisList) {
    <div className="bg-lightGray m-5 p-6 rounded-md">
      <p className="mb-3 text-2xl">Năm {year}</p>
    </div>;
  }

  return (
    <div className="bg-lightGray m-5 p-6 rounded-md">
      <p className="mb-3 text-2xl">Năm {year}</p>
      <div className="min-h-[400px]  rounded-md grid grid-cols-2 md:grid-cols-4 gap-3">
        {thesisList.map((thesis, index) => (
          <ThesisCard
            key={index}
            title={thesis.topic.title}
            introduction={thesis.topic.description}
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
  refreshTrigger: PropTypes.number,
};