import React, { useEffect, useState } from "react";
import VersionList from "./VersionList";
import FieldDiffView from "./FieldDiffView";
import api from "../../../services/api";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const DiffViewerPage = () => {
  const { formRecordId } = useParams();
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [diffs, setDiffs] = useState([]);

  useEffect(() => {
    api.get(`/formRecords/${formRecordId}/versions`).then((res) => {
      console.log("formRecordId:", formRecordId);
      console.log("Versions:", res.data.result);
      setVersions(res.data.result);
      if (res.data.result?.length > 0) {
        const latest = res.data.result[0].version;
        setSelectedVersion(latest);
      }
    });
  }, [formRecordId]);

  useEffect(() => {
    if (selectedVersion != null) {
      api
        .get(`/formRecords/${formRecordId}/diff/${selectedVersion}`)
        .then((res) => {
          setDiffs(res.data.result);
        });
    }
  }, [formRecordId, selectedVersion]);

  return (
    <div className="p-6 pt-5">
      <Link to={`/thesis/${formRecordId}`} onClick={() => {}}>
        <p>{"< Quay lại"}</p>
      </Link> 
      <div className="flex rounded-lg overflow-hidden border border-gray-300 m-6 mx-2 p-6">
        <VersionList
          versions={versions}
          selectedVersion={selectedVersion}
          onSelect={setSelectedVersion}
        />
        <FieldDiffView diffs={diffs} />
      </div>
    </div>
  );
};

export default DiffViewerPage;
DiffViewerPage.propTypes = {
  formRecordId: PropTypes.string,
};
