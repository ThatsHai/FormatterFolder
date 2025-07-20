import PropTypes from "prop-types";

const StudentsTable = ({
  students,
  setSelectedStudents,
  selectable = false,
  deleteable = true,
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
              Mã số sinh viên
            </th>
            <th
              className="border border-gray py-1 bg-lightBlue bg-opacity-70"
              colSpan="2"
            >
              Tên sinh viên
            </th>
            <th
              className="border border-gray py-1 bg-lightBlue bg-opacity-70"
              colSpan="2"
            >
              Ngành
            </th>
            {selectable ? (
              <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
                Chọn
              </th>
            ) : deleteable ? (
              <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
                Xoá
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="bg-lightGray">
          {students?.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td className="border border-gray py-1">{index + 1}</td>
                <td className="border border-gray py-1">{student.userId}</td>
                <td className="border border-gray py-1" colSpan="2">
                  {student.name}
                </td>
                <td className="border border-gray py-1" colSpan="2">
                  {student.studentClass.major.majorName}
                </td>
                {selectable ? (
                  <td className="border border-gray py-1">
                    <input
                      type="checkbox"
                      // checked={selectedTeachers.some(
                      //   (t) => t.majorId === teacher.userId
                      // )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents((prev) => [...prev, student]);
                        } else {
                          setSelectedStudents((prev) =>
                            prev.filter((t) => t.userId !== student.userId)
                          );
                        }
                      }}
                    />
                  </td>
                ) : deleteable ? (
                  <td className="border border-gray py-1">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setSelectedStudents((prev) => 
                        prev.filter((t)=> t.userId !== student.userId));
                      }}
                    >
                      Xoá
                    </button>
                  </td>
                ): null}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={deleteable || selectable ? 7 : 6}
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
  setSelectedStudents: PropTypes.func,
  selectable: PropTypes.bool,
};
