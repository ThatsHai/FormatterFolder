import { useState, useEffect } from "react";
import ThesisCard from "../../ThesisCard";
import PropTypes from "prop-types";
import api from "../../../services/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import DesignsListWindow from "../../DesignListWindow";

const ContentHomepage = ({
  year = new Date().getFullYear(),
  refreshTrigger,
}) => {

  const [thesisList, setThesisList] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate()

    const [selectedFormRecord, setSelectedFormRecord] = useState(null);
  const [showDesignWindow, setShowDesignWindow] = useState(false); 

  useEffect(() => {
    const result = async () => {
      if (user === null) {
        alert("Phiên đăng nhập hết hạn");
        navigate("/login");
      }
      const result = await api.get(`/formRecords/student?studentId=${user.userId}`);
      setThesisList(result.data.result);
      console.log(result);
    };
    result();
  }, [refreshTrigger]);

   const handleCardClick = (record) => {
    setSelectedFormRecord(record);
    setShowDesignWindow(true);
  };

  if (!thesisList) {
    return(
    <div className="bg-lightGray m-5 p-6 rounded-md">
      <p className="mb-3 text-2xl">Năm {year}</p>
    </div>);
  }

  return (
    <div className="bg-lightGray m-5 p-6 rounded-md">
      <p className="mb-3 text-2xl">Năm {year}</p>
      <div className="min-h-[400px]  rounded-md grid grid-cols-2 md:grid-cols-4 gap-3">
        {thesisList.map((thesis, index) => (
          <ThesisCard
            key={thesis.formRecordId}
            // title={thesis.topic.title}
            // introduction={thesis.topic.description}
            // status={thesis.status}
            formRecord={thesis}
            onClick={()=>handleCardClick(thesis)}
          ></ThesisCard>
          
        ))}
        
      {showDesignWindow && selectedFormRecord && (
        <DesignsListWindow
          formId={selectedFormRecord.topic.form.formId}
          formRecordId={selectedFormRecord.formRecordId}
          onDecline={() => setShowDesignWindow(false) }
        />
      )}
        
      </div>
    </div>
  );
};

export default ContentHomepage;

ContentHomepage.propTypes = {
  year: PropTypes.number,
  refreshTrigger: PropTypes.number,
};
