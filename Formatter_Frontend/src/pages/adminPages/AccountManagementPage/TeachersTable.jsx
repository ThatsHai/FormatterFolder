import PropTypes from "prop-types";

const TeachersTable = ({ teachers }) => {
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
            <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
              Chọn
            </th>
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
                <td className="border border-gray py-1">
                  <input type="checkbox" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
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
};
