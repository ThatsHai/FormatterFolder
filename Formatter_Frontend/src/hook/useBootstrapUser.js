import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { loginSuccess, logout } from "../redux/authSlice";

export function useBootstrapUser({
  redirectOnFail = true,
  loginPath = "/login",
} = {}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((s) => s.auth.user);
  const reduxAccessToken = useSelector((s) => s.auth.accessToken);
  const storedAccessToken =
    reduxAccessToken || sessionStorage.getItem("accessToken");

  const [loading, setLoading] = useState(!user && !!storedAccessToken);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      // 1) No token at all -> optionally redirect
      if (!storedAccessToken) {
        if (redirectOnFail) navigate(loginPath);
        return;
      }

      // 2) Already have user in redux -> nothing to do
      if (user) {
        setLoading(false);
        return;
      }

      // 3) Fetch /myInfo and save to redux
      try {
        setLoading(true);
        const res = await api.get("/myInfo");
        const fetchedUser = res?.data?.result;

        if (!fetchedUser?.userId) {
          throw new Error("NO_USER");
        }

        if (!isMounted) return;

        dispatch(
          loginSuccess({
            user: fetchedUser,
            accessToken: storedAccessToken, // keep the one we have
          })
        );
      } catch (e) {
        if (!isMounted) return;
        setError(e);
        dispatch(logout());
        if (redirectOnFail) navigate(loginPath);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate, user, storedAccessToken, redirectOnFail, loginPath]);

  return { loading, error, user };
}

export default useBootstrapUser;
