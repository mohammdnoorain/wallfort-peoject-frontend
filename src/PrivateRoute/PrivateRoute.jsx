

import { Outlet, Navigate  } from "react-router-dom";
import React, { useEffect } from "react"; // Add useEffect import here
import useAppContext from "../contextApi/useAppConext.jsx";

const PrivateRoutes = () => {
  const {Privateroutetoken } = useAppContext();

  return Privateroutetoken === null ? <>you are not allowed to access this page :(</> : Privateroutetoken === true ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;

