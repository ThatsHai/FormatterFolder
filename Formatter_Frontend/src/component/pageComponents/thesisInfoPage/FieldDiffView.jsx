import PropTypes from "prop-types";

//Take TableName:::HTMLString return one of two
const getFieldPart = (fullString, getHTMLStringOrTableName) => {
  if (!fullString) return "Bảng";

  if (
    getHTMLStringOrTableName !== "HTMLString" &&
    getHTMLStringOrTableName !== "TableName"
  ) {
    return "Không rõ phần cần lấy";
  }

  const parts = fullString.split(":::");

  if (getHTMLStringOrTableName === "TableName") {
    const value = parts.length > 0 ? parts[0] : "";
    return value.trim() || "Bảng";
  } else if (getHTMLStringOrTableName === "HTMLString") {
    const value = parts.length > 1 ? parts[1] : "";
    return value.trim() || "Bảng";
  }
};


// Hàm áp style cho table
const applyTailwindToTable = (html) => {
  // Thêm &nbsp; để giữ chiều cao ô trống
  const filledHTML = html.replace(/<td>\s*<\/td>/g, "<td>&nbsp;</td>");

  return (
    filledHTML
      // style cho <table>
      .replace(
        /<table(?![^>]*class=)/g,
        '<table class="table-fixed border border-gray-300 border-collapse w-full text-sm text-left"'
      )
      // style cho <thead>
      .replace(
        /<thead(?![^>]*class=)/g,
        '<thead class="bg-gray-100 border-b border-gray-300"'
      )
      // style cho <th>
      .replace(
        /<th(?![^>]*class=)/g,
        '<th class="border border-gray-300 px-2 py-2 text-center font-semibold"'
      )
      // style cho <td>
      .replace(
        /<td(?![^>]*class=)/g,
        '<td class="border border-gray-300 px-2 py-2 align-top"'
      )
  );
};

// Hàm render theo loại field
const renderValue = (value, type) => {
  if (!value) return null;

  switch (type) {
    case "QUILL_DATA": // ReactQuill => render HTML
      return <div dangerouslySetInnerHTML={{ __html: value }} />;
    case "TABLE":
      return (
        <div
          dangerouslySetInnerHTML={{ __html: applyTailwindToTable(value) }}
        />
      );
    case "LONG_ANSWER":
    case "SHORT_ANSWER":
    default:
      return <div>{value}</div>;
  }
};

const FieldDiffView = ({ diffs }) => {
  console.log(diffs);
  return (
    <div className="w-5/6 pt-3 pl-6">
      {diffs
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((diff) => (
          <div key={diff.formFieldId} className="mb-6">
            <div className="font-semibold">
              {diff.position + 1}. {getFieldPart(diff.fieldName, "TableName")}
            </div>

            <div className="w-full flex flex-col gap-2">
              {diff.oldValue && (
                <div className="bg-red-200 p-2 rounded" title="Giá trị cũ">
                  {renderValue(getFieldPart(diff.oldValue, "HTMLString"), diff.fieldType)}
                </div>
              )}
              <div className="bg-green-200 p-2 rounded" title="Giá trị mới">
                {renderValue(getFieldPart(diff.newValue, "HTMLString"), diff.fieldType)}
              </div>
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
};

export default FieldDiffView;

FieldDiffView.propTypes = {
  diffs: PropTypes.arrayOf(
    PropTypes.shape({
      formFieldId: PropTypes.string.isRequired,
      fieldName: PropTypes.string.isRequired,
      fieldType: PropTypes.string.isRequired, // thêm loại field
      oldValue: PropTypes.string,
      newValue: PropTypes.string,
      position: PropTypes.number.isRequired,
      modifiedAt: PropTypes.string, // optional
    })
  ).isRequired,
};
