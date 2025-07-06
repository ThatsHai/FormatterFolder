import { useState, useEffect } from "react";
import ThesisCard from "../../ThesisCard";
import PropTypes from "prop-types";
import api from "../../../services/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import DesignsListWindow from "../../DesignListWindow";
import { use } from "react";
import ThesisInfo from "../../../pages/ThesisInfo";
import ThesisInfoLayout from "../../../layout/ThesisInfoLayout";
import PageNumberFooter from "../../PageNumberFooter";

const ContentHomepage = ({
  year = new Date().getFullYear(),
  refreshTrigger,
}) => {
  const [thesisList, setThesisList] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const result = async () => {
      if (user === null) {
        alert("Phiên đăng nhập hết hạn");
        navigate("/login");
      }
      let url = "";
      if (user.role.name === "STUDENT") {
        url = `/formRecords/student?studentId=${user.userId}&p=${currentPage}&n=4`;
      } else {
        url = `/formRecords/teacher?teacherId=${user.acId}&status=WAITING&p=${currentPage}&n=4`;
      }
      const result = await api.get(url);
      setThesisList(result.data.result.content || []);
      setTotalPages(result.data.result.totalPages || 1);
      console.log(result);
    };
    result();
  }, [refreshTrigger, currentPage]);

  if (!thesisList) {
    return (
      <div className="bg-lightGray m-5 p-6 rounded-md">
        <p className="mb-3 text-2xl">Năm {year}</p>
      </div>
    );
  }

  return (
    <div className="bg-lightGray m-5 p-6 rounded-md">
      <p className="mb-3 text-2xl">Năm {year}</p>
      <div className="min-h-[300px]  rounded-md grid grid-cols-2 md:grid-cols-4 gap-3 mb-0">
        {thesisList.map((thesis, index) => (
          <ThesisCard
            key={thesis.formRecordId}
            formRecord={thesis}
          ></ThesisCard>
        ))}
      </div>
      <PageNumberFooter
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ContentHomepage;

ContentHomepage.propTypes = {
  year: PropTypes.number,
  refreshTrigger: PropTypes.number,
};
