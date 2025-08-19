import { Box, Typography, Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import api from "../../services/api";
import PageNumberFooter from "../../component/PageNumberFooter";
import NumberInput from "../../component/NumberInput";
import PropTypes from "prop-types";
import PasswordInputForm from "../../component/pageComponents/profilePage/PasswordInputForm";
import LogoutButton from "../../component/LogoutButton";
import useBootstrapUser from "../../hook/useBootstrapUser";

const TeacherProfilePage = ({ userData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [thesisList, setThesisList] = useState([]);

  const semesters = ["HK1", "HK2", "HK3"];
  const [semester, setSemester] = useState(semesters[0]);
  const [schoolYear, setSchoolYear] = useState(new Date().getFullYear());
  const [totalPages, setTotalPages] = useState(1);

  const [openChangePasswordForm, setOpenChangePasswordForm] = useState(false);

  const handleSearch = async () => {
    if (schoolYear.length == 0) {
      alert("Vui lòng nhập năm.");
      return;
    }
    try {
      const response = await api.get(
        `/topics/getBySemesterAndYear?acId=${userData.acId}&year=${schoolYear}&semester=${semester}&p=${currentPage}&numberOfRecords=5`
      );
      setThesisList(response.data.result.content);
      setTotalPages(response.data.result.totalPages);
    } catch (error) {
      alert("Tìm kiếm thất bại " + error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
  };

  const handleSchoolYearChange = (e) => {
    setSchoolYear(e.target.value);
  };

  const Field = ({ label, value }) => (
    <Grid item xs={12} sm={6}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        pl={3}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {value}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );

  Field.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.node,
    ]).isRequired,
  };

  const { loading } = useBootstrapUser(); // hydrates redux on mount
  if(loading) return null;

  return (
    <div className="">
      <div className="p-4 bg-bgGray min-h-screen font-textFont">
        <div className="max-w-4xl mx-auto mt-6 shadow-md rounded-t-md bg-white p-10 pb-5">
          {/* Info Section */}
          <p className=" text-xl font-bold pb-3">Thông tin cơ bản</p>
          <div className="border p-4 rounded-md border-darkGray">
            <div className="flex justify-center">
              <div className="w-full md:w-[90%]">
                <div className="flex items-center2 mb-4">
                  <Typography variant="h5" fontWeight={600}>
                    {userData.name}
                  </Typography>
                  {userData.role.name === "TEACHER" && (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setOpenChangePasswordForm(true)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Mã người dùng" value={userData.userId} />
                  <Field label="Giới tính" value={userData.gender} />
                  <Field label="Email" value={userData.email} />
                  <Field
                    label="Bộ môn"
                    value={userData.department?.departmentName || "N/A"}
                  />
                  <Field label="Học hàm học vị" value={userData.degree || "Chưa có dữ liệu"} />
                  <Field label="Vị trí công tác" value={userData.position || "Chưa có dữ liệu"} />
                </div>
              </div>
            </div>
            <LogoutButton></LogoutButton>
          </div>
        </div>

        {thesisList && (
          <div className="border-b border-lightGray pb-4 max-w-4xl mx-auto shadow-md rounded-b-md bg-white p-6 px-10  gap-6">
            <p className=" text-xl font-bold">Danh sách đề tài</p>
            <div className=" border border-darkGray rounded-md p-4 pt-0 my-5">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 rounded-md mb-2">
                {/* School Year Input */}
                <div className="flex flex-col px-8 md:col-span-1">
                  <label className="font-semibold mb-1">Năm học</label>
                  <NumberInput
                    min={2000}
                    max={2300}
                    name="schoolYear"
                    placeholder="2025"
                    className="border px-2 py-1 rounded-md"
                    value={schoolYear}
                    onChange={handleSchoolYearChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                </div>

                {/* Semester Select */}
                <div className="flex flex-col px-8 md:col-span-2">
                  <label className="font-semibold mb-1">Học kỳ</label>
                  <select
                    name="semester"
                    className="border px-2 py-1 rounded-md"
                    value={semester}
                    onChange={handleSemesterChange}
                  >
                    <option value="">-- Chọn học kỳ --</option>
                    {semesters.map((s, index) => (
                      <option key={index} value={s}>
                        {s}
                      </option>
                    ))}
                    <option value="Cả năm">Cả năm</option>
                  </select>
                </div>
                {/* Search Button */}
                <div className="md:col-span-1 flex items-end">
                  <button
                    type="button"
                    className="bg-darkBlue text-white px-4 py-1 rounded-md shadow-md"
                    onClick={handleSearch}
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
              <div>
                <table className="w-full table-fixed mt-3 mb-2">
                  <colgroup>
                    <col className="w-[15%]" />
                    <col className="w-[20%]" />
                    <col className="w-[35%]" />
                    <col className="w-[15%]" />
                    <col className="w-[15%]" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="border p-1">STT</th>
                      <th className="border p-1">Tiêu đề</th>
                      <th className="border p-1">Mô tả</th>
                      <th className="border p-1">Học kỳ</th>
                      <th className="border p-1">Năm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {thesisList.length > 0 ? (
                      thesisList.map((thesis, index) => (
                        <tr key={thesis.topicId}>
                          <td className="border p-1 text-center">
                            {index + 1}
                          </td>
                          <td className="border p-1">{thesis.title}</td>
                          <td
                            className={`border p-1 ${
                              thesis.description.trim().length == 0
                                ? "italic"
                                : ""
                            }`}
                          >
                            {thesis.description || "Không có mô tả"}
                          </td>
                          <td className="border p-1 text-center">
                            {thesis.semester}
                          </td>
                          <td className="border p-1 text-center">
                            {thesis.year}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="border text-center">
                          <p className="text-gray-500 w-full p-1">
                            Không có dữ liệu.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <PageNumberFooter
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handleSearch}
                setCurrentPage={setCurrentPage}
              ></PageNumberFooter>
            </div>
          </div>
        )}
      </div>
      {openChangePasswordForm && (
        <PasswordInputForm
          handleFormToggle={() => setOpenChangePasswordForm(false)}
          userData={userData}
        ></PasswordInputForm>
      )}
    </div>
  );
};

export default TeacherProfilePage;

TeacherProfilePage.propTypes = {
  userData: PropTypes.object.isRequired,
};
