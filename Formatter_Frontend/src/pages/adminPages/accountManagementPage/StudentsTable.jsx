import PropTypes from "prop-types";

const StudentsTable = ({ students }) => {
  return (
    <>
      <table className="table-fixed w-full border-collapse text-center">
        <thead>
          <tr>
            <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
              STT
            </th>
            <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
              Mã SV
            </th>
            <th
              className="border border-gray py-1 bg-lightBlue bg-opacity-70"
              colSpan="2"
            >
              Tên SV
            </th>
            <th
              className="border border-gray py-1 bg-lightBlue bg-opacity-70"
              colSpan="2"
            >
              Lớp
            </th>
            <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
              Chọn
            </th>
          </tr>
        </thead>
        <tbody className="bg-lightGray ">
          {students?.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td className="border border-gray py-1">{index + 1}</td>
                <td className="border border-gray py-1">{student.userId}</td>
                <td className="border border-gray py-1" colSpan="2">
                  {student.name}
                </td>
                <td className="border border-gray py-1" colSpan="2">
                  {student.studentClass?.studentClassName || "N/A"}
                </td>

                <td className="border border-gray py-1">
                  <input type="checkbox" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
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
export default StudentsTable;

StudentsTable.propTypes = {
  students: PropTypes.array,
};
