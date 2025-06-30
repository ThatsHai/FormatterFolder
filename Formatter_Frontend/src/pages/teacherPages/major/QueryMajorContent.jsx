import { useState } from "react";
import MajorsTable from "./MajorsTable";
import MajorQuery from "./MajorQuery";
import api from "../../../services/api";
import PropTypes from "prop-types";

const QueryMajorContent = ({ selectedMajors, setSelectedMajors }) => {
  const [name, setName] = useState("");
  const [majors, setMajors] = useState([]);

  const handleSearch = async () => {
    if (!name.trim()) {
      setMajors([]);
      return;
    }
    try {
      const res = await api.get("/majors/search", {
        params: { name },
      });
      const newMajors = res.data.result;

      const updatedMajors = [
        ...selectedMajors,
        ...newMajors.filter(
          (nm) => !selectedMajors.some((m) => m.majorId === nm.majorId)
        ),
      ];
      setMajors(updatedMajors);
    } catch (err) {
      console.error("Search majors failed:", err);
    }
  };

  return (
    <div className="w-full border-lightBlue rounded-md border mx-1 p-2 font-textFont">
      <h2 className="border-b border-b-darkBlue text-xl font-medium mb-2">
        Thêm ngành
      </h2>
      <MajorQuery name={name} setName={setName} handleSearch={handleSearch} />
      <MajorsTable
        majors={majors}
        // selectedMajors={selectedMajors}
        setSelectedMajors={setSelectedMajors}
        selectable
      />
    </div>
  );
};

QueryMajorContent.propTypes = {
  selectedMajors: PropTypes.array.isRequired,
  setSelectedMajors: PropTypes.func.isRequired,
};

export default QueryMajorContent;
