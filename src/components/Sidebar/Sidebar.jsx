import React from "react";
import "./sidebar.scss";
import SBLogo from "../../imgs/wallfort-logo.png";
import { IoGrid } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import { CiPower } from "react-icons/ci";
import Logout from "../../components/Logout.jsx"
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({handleLogout}) => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location);

  return (
    <div className="sidebar-main">
      <img src={SBLogo} alt="" className="sb-logo" />

      <div className="sb-dashboard" onClick={() => navigate("/plot-details")}>
        <IoGrid    style={{
            color: location.pathname === "/plot-details" ? "#00817f" : "",
          }}/>
      </div>

      <div className="sb-message" onClick={() => navigate("/visitor-details")}>
        <AiFillMessage
          style={{
            color: location.pathname === "/visitor-details" ? "#00817f" : "",
          }}
        />
      </div>

      <div className="sb-logout">
      {/* <CiPower onClick={handleLogout}/> */}
        <Logout handleLogout={handleLogout}/>
      </div>
    </div>
  );
};

export default Sidebar;
