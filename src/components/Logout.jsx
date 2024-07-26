import React from "react";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom";
import { CiPower } from "react-icons/ci";

const Logout = ({ handleLogout }) => {
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   window.sessionStorage.removeItem("token");
  //   window.sessionStorage.removeItem("clientdata");

  //   navigate("/login");
  // };

  return (
    <CiPower onClick={handleLogout} />
    //  <button style={{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.2vw"}} onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
