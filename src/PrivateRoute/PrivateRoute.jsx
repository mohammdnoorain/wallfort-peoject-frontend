

import { Outlet, Navigate  } from "react-router-dom";
import React, { useEffect } from "react"; // Add useEffect import here
import useAppContext from "../contextApi/useAppConext.jsx";

const PrivateRoutes = () => {
  const {Privateroutetoken } = useAppContext();

  return Privateroutetoken === null ? <>loading</> : Privateroutetoken === true ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;

