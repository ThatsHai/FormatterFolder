import { Box, Typography, Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import api from "../../services/api";
import PageNumberFooter from "../../component/PageNumberFooter";
import PropTypes from "prop-types";
import PasswordInputForm from "../../component/pageComponents/profilePage/PasswordInputForm";
import LogoutButton from "../../component/LogoutButton";

const StudentProfile = ({ userData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [recordsList, setRecordsList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [openChangePasswordForm, setOpenChangePasswordForm] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await api.get(
        `/formRecords/accepted/student?studentId=${userData.userId}&p=${currentPage}&n=5`
      );
      setRecordsList(response.data.result.content);
      setTotalPages(response.data.result.totalPages);
    } catch (error) {
      alert("Tìm kiếm thất bại " + error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

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
                  {userData.role.name === "STUDENT" && (
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
                  <Field label="Năm sinh" value={userData.dateOfBirth} />
                  <Field
                    label="Lớp"
                    value={userData.studentClass?.studentClassName || "N/A"}
                  />
                  <Field
                    label="Chuyên ngành"
                    value={userData.studentClass?.major?.majorName}
                  />
                </div>
              </div>
            </div>
            <LogoutButton></LogoutButton>
          </div>
        </div>

        {recordsList && (
          <div className="border-b border-lightGray pb-4 max-w-4xl mx-auto shadow-md rounded-b-md bg-white p-6 px-10  gap-6">
            <p className=" text-xl font-bold">Danh sách đề tài</p>
            <div className=" border border-darkGray rounded-md p-4 my-5">
              <table className="w-full table-fixed mt-3 mb-2">
                <colgroup>
                  <col className="w-[15%]" />
                  <col className="w-[20%]" />
                  <col className="w-[35%]" />
                  <col className="w-[20%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="border p-1">STT</th>
                    <th className="border p-1">Tiêu đề</th>
                    <th className="border p-1">Mô tả</th>
                    <th className="border p-1">GVHD</th>
                    <th className="border p-1">Năm</th>
                  </tr>
                </thead>
                <tbody>
                  {recordsList.length > 0 ? (
                    recordsList.map((record, index) => (
                      <tr key={record.topicId}>
                        <td className="border p-1 text-center">{index + 1}</td>
                        <td className="border p-1">{record.topic?.title}</td>
                        <td
                          className={`border p-1 ${
                            record.topic.description.trim().length == 0
                              ? "italic"
                              : ""
                          }`}
                        >
                          {record.topic.description || "Không có mô tả"}
                        </td>
                        <td className="border p-1 text-center">
                          {record.topic?.teachers?.length > 0
                            ? record.topic.teachers
                                .map((t) => t.name)
                                .join(", ")
                            : "Chưa có"}
                        </td>
                        <td className="border p-1 text-center">
                          {record.topic?.year && record.topic?.semester
                            ? `${record.topic.year}-${record.topic.semester}`
                            : "Chưa rõ"}
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

export default StudentProfile;

StudentProfile.propTypes = {
  userData: PropTypes.object.isRequired,
};
