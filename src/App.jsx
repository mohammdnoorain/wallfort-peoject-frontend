import React from "react";
import "./app.scss";

// import LoginPage from "./pages/LoginPage.jsx"
// import RegisterPage from "./pages/RegisterPage.jsx";
// import Plotdetails from "../src/pages/Plotdetails.jsx"
import EditDetailsModal from "../src/components/EditDetailsModal.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import CopyDetailsModal from "../src/components/CopyDetailsModal.jsx";
import PrivateRoutes from "../src/PrivateRoute/PrivateRoute.jsx";
import VisitorDetails from "./pages/VistorDetails/VisitorDetails.jsx";
import Login from "./pages/Login/Login.jsx";
import Plotdetails from "./pages/PlotDetails/Plotdetails.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoutes />}>
          {/* <Route path="/register" element={<RegisterPage/>} /> */}
          {/**/}
          <Route path="/plot-details" element={<Plotdetails />} />
          <Route path="/visitor-details" element={<Plotdetails />} />
          <Route path="/update-details" element={<EditDetailsModal />} />
          <Route path="/copy-details/:id" element={<CopyDetailsModal />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
