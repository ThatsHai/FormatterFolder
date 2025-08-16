import React, { useEffect, useState } from "react";
import VersionList from "./VersionList";
import FieldDiffView from "./FieldDiffView";
import api from "../../../services/api";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import ConfirmationPopup from "../../ConfirmationPopup";
import SuccessPopup from "../../SuccessPopup";

const DiffViewerPage = () => {
  const { formRecordId } = useParams();
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [diffs, setDiffs] = useState([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [displaySuccessPopup, setDisplaySuccessPopup] = useState(false);

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

  const submitData = async() => {
    await api
      .post(`/formRecords/${formRecordId}/restore/${selectedVersion}`)
      .then(() => {
        // Refetch version list
        return api.get(`/formRecords/${formRecordId}/versions`);
      })
      .then((res) => {
        const newVersions = res.data.result;
        setVersions(newVersions);

        const latestVersion = newVersions[0].version;
        setSelectedVersion(latestVersion);
        setDisplaySuccessPopup(true);
      })
      .catch((err) => {
        console.error(err);
        alert("Khôi phục thất bại!");
      });

  }
  const onSuccessPopupClosed = () => {
    setShowConfirmPopup(false);
    setDisplaySuccessPopup(false);
  };

  const handleRestore = (versionToRestore) => {
    setSelectedVersion(versionToRestore);
    setShowConfirmPopup(true);
  };

  return (
    <div className=" relative p-6 pt-5">
      <Link to={`/thesis/${formRecordId}`} onClick={() => {}}>
        <p>{"< Quay lại"}</p>
      </Link>
      <div className=" flex rounded-lg overflow-hidden border border-gray-300 m-6 mx-2 p-6">
        <VersionList
          versions={versions}
          selectedVersion={selectedVersion}
          onSelect={setSelectedVersion}
        />
        <FieldDiffView diffs={diffs} />
      </div>
      {selectedVersion !== null && selectedVersion !== versions[0]?.version && (
        <div className="absolute top-6 right-8">
          <button
            onClick={() => handleRestore(selectedVersion)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-yellow-600 shadow"
          >
            Khôi phục phiên bản này
          </button>
        </div>
      )}
      {showConfirmPopup && (
        <ConfirmationPopup
          isOpen={true}
          text={
          "Bạn chắc chắn muốn khôi phục phiên bản này?"
          }
          onConfirm={() => {
            setShowConfirmPopup(false);
            submitData();
          }}
          onDecline={() => {
            setShowConfirmPopup(false);
          }}
        ></ConfirmationPopup>
      )}
      {displaySuccessPopup && (
        <SuccessPopup
          isOpen={true}
          successPopupText={"Khôi phục thành công!"}
          onClose={onSuccessPopupClosed}
        />
      )}
    </div>
  );
};

export default DiffViewerPage;
DiffViewerPage.propTypes = {
  formRecordId: PropTypes.string,
};
