import { Navigate, Outlet } from "react-router-dom";
import { appRoutes } from "../../routes/appRoutes";
import { isTokenExpired } from "../../utils/isJwtExpired";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const token = Cookies.get("token");

  if (!token || isTokenExpired(token)) {
    Cookies.remove("token"); // remove token from cookie
    return <Navigate to={appRoutes.signIn} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
