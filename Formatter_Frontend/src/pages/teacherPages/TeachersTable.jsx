import PropTypes from "prop-types";

const TeachersTable = ({
  teachers,
  selectedTeachers,
  setSelectedTeachers,
  selectable = false,
  deleteable = true,
  swapTeachers,
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
            {swapTeachers && teachers.length > 1 && (
              <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
                Đổi chỗ
              </th>
            )}
            {selectable ? (
              <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
                Chọn
              </th>
            ) : deleteable ? (
              <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
                Xoá CBHD
              </th>
            ) : null}
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
                {swapTeachers && teachers.length > 1 && (
                  <td className="border border-gray py-1">
                    {index === teachers.length - 1 ? (
                      <button
                        type="button"
                        className="mr-1 px-2 py-1 rounded bg-gray-200"
                        title="Lên"
                        disabled={index === 0}
                        onClick={() => swapTeachers(index, index - 1)}
                      >
                        ↑
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-2 py-1 rounded bg-gray-200"
                        title="Xuống"
                        disabled={index === teachers.length - 1}
                        onClick={() => swapTeachers(index, index + 1)}
                      >
                        ↓
                      </button>
                    )}
                  </td>
                )}
                {selectable ? (
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
                ) : deleteable ? (
                  <td className="border border-gray py-1">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setSelectedTeachers((prev) =>
                          prev.filter((t) => t.userId !== teacher.userId)
                        );
                      }}
                    >
                      Xoá
                    </button>
                  </td>
                ) : null}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  swapTeachers && teachers.length > 1
                    ? 6
                    : selectable || deleteable
                    ? 5
                    : 4
                }
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
  swapTeachers: PropTypes.func,
};
