import { Box, Typography, Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import api from "../../services/api";
import PageNumberFooter from "../../component/PageNumberFooter";
import PropTypes from "prop-types";
import PasswordInputForm from "../../component/pageComponents/profilePage/PasswordInputForm";
import LogoutButton from "../../component/LogoutButton";

const AdminProfilePage = ({ userData }) => {
  const [openChangePasswordForm, setOpenChangePasswordForm] = useState(false);

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
                    QUẢN TRỊ VIÊN
                  </Typography>
                  {userData.role.name === "ADMIN" && (
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
                  <Field label="Mã người dùng" value="123" />
                </div>
              </div>
            </div>
            <LogoutButton></LogoutButton>
          </div>
        </div>
      </div>
      {openChangePasswordForm && (
        <PasswordInputForm
          handleFormToggle={() => setOpenChangePasswordForm(false)}
        ></PasswordInputForm>
      )}
    </div>
  );
};

export default AdminProfilePage;

AdminProfilePage.propTypes = {
  userData: PropTypes.object.isRequired,
};
