import PropTypes from "prop-types";
import React from "react";

const VersionList = ({ versions, selectedVersion, onSelect }) => (
  <div className="w-1/6 border-r">
    {versions.map((v) => (
      <div
        key={v.version}
        className={`p-3 cursor-pointer ${
          v.version === selectedVersion
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-100"
        }`}
        onClick={() => onSelect(v.version)}
      >
        <div className="font-bold">Version {v.version}</div>
        {v.version == versions[0].version && <div>Phiên bản hiện tại</div>}
        <div>{v.modifiedAt.trim()}</div>
      </div>
    ))}
  </div>
);

export default VersionList;

VersionList.propTypes = {
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      version: PropTypes.number.isRequired,
      modifiedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedVersion: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};
