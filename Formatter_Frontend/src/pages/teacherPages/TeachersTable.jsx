import PropTypes from "prop-types";

const TeachersTable = ({
  teachers,
  selectedTeachers,
  setSelectedTeachers,
  selectable = false,
}) => {
  return (
    <>
      <table className="table-fixed w-full border-collapse text-center">
        <thead>
          <tr>
            <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
              STT
            </th>
            <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
              Mã CB
            </th>
            <th
              className="border border-gray py-1 bg-lightBlue bg-opacity-70"
              colSpan="2"
            >
              Tên CB
            </th>
            {selectable && (
              <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
                Chọn
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-lightGray">
          {teachers?.length > 0 ? (
            teachers.map((teacher, index) => (
              <tr key={index}>
                <td className="border border-gray py-1">{index + 1}</td>
                <td className="border border-gray py-1">{teacher.userId}</td>
                <td className="border border-gray py-1" colSpan="2">
                  {teacher.name}
                </td>
                {selectable && (
                  <td className="border border-gray py-1">
                    <input
                      type="checkbox"
                      // checked={selectedTeachers.some(
                      //   (t) => t.userId === teacher.userId
                      // )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTeachers((prev) => [...prev, teacher]);
                        } else {
                          setSelectedTeachers((prev) =>
                            prev.filter((t) => t.userId !== teacher.userId)
                          );
                        }
                      }}
                    />
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={selectable ? 5 : 4}
                className="bg-lightGray py-2 text-center text-gray-500"
              >
                <p>Không có dữ liệu</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};
export default TeachersTable;

TeachersTable.propTypes = {
  teachers: PropTypes.array,
  selectedTeachers: PropTypes.array,
  setSelectedTeachers: PropTypes.func,
  selectable: PropTypes.bool,
};
