import PropTypes from "prop-types";

const MajorsTable = ({
  majors,
  setSelectedMajors,
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
              Mã ngành
            </th>
            <th
              className="border border-gray py-1 bg-lightBlue bg-opacity-70"
              colSpan="2"
            >
              Tên ngành
            </th>
            {selectable ? (
              <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
                Chọn
              </th>
            ) : deleteable ? (
              <th className="border border-gray py-1 bg-lightBlue bg-opacity-70">
                Xoá ngành
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="bg-lightGray">
          {majors?.length > 0 ? (
            majors.map((major, index) => (
              <tr key={index}>
                <td className="border border-gray py-1">{index + 1}</td>
                <td className="border border-gray py-1">{major.majorId}</td>
                <td className="border border-gray py-1" colSpan="2">
                  {major.majorName}
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
                          setSelectedMajors((prev) => [...prev, major]);
                        } else {
                          setSelectedMajors((prev) =>
                            prev.filter((t) => t.majorId !== major.majorId)
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
                        setSelectedMajors((prev) => 
                        prev.filter((t)=> t.majorId !== major.majorId));
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
                colSpan={deleteable || selectable ? 5 : 4}
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
export default MajorsTable;

MajorsTable.propTypes = {
  majors: PropTypes.array,
  setSelectedMajors: PropTypes.func,
  selectable: PropTypes.bool,
};
