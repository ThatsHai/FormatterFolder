import React from "react";
import PropTypes from "prop-types";

const FieldDiffView = ({ diffs }) => (
  <div className="w-5/6 pt-3 pl-6">
    {diffs.slice().sort((a, b) => a.position - b.position)
    .map((diff) => (
      <div key={diff.formFieldId} className="mb-4">
        <div className="font-semibold">{diff.position+1}. {diff.fieldName}</div>
        <div className="w-full">
          {diff.oldValue && (

            <div className="bg-red-200 p-2 flex-1 mr-2 w-full" title="Giá trị cũ">{diff.oldValue}</div>
          )}
          <div className="bg-green-200 p-2 flex-1 w-full" title="Giá trị mới">{diff.newValue}</div>
        </div>
        {diff.modifiedAt && (
          <div className="text-s text-gray-500 mt-1"  >
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
      position: PropTypes.number.isRequired,
      modifiedAt: PropTypes.string, // optional
    })
  ).isRequired,
};
