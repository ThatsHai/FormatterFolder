import React from "react";
import PropTypes from "prop-types";

const FieldDiffView = ({ diffs }) => (
  <div className="w-3/4 p-4">
    {diffs.map((diff) => (
      <div key={diff.formFieldId} className="mb-4">
        <div className="font-semibold">{diff.fieldName}</div>
        <div className="w-full">
          {diff.oldValue && (

            <div className="bg-red-200 p-2 flex-1 mr-2 w-full">{diff.oldValue}</div>
          )}
          <div className="bg-green-200 p-2 flex-1 w-full">{diff.newValue}</div>
        </div>
        {diff.modifiedAt && (
          <div className="text-xs text-gray-500 mt-1">
            Sửa lúc: {new Date(diff.modifiedAt).toLocaleString()}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default FieldDiffView;

FieldDiffView.propTypes = {
  diffs: PropTypes.arrayOf(
    PropTypes.shape({
      formFieldId: PropTypes.string.isRequired,
      fieldName: PropTypes.string.isRequired,
      oldValue: PropTypes.string.isRequired,
      newValue: PropTypes.string.isRequired,
      modifiedAt: PropTypes.string, // optional
    })
  ).isRequired,
};
