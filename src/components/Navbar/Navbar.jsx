import React, { useEffect, useState } from "react";
import "./navbar.scss";
import ProfileImg from "../../imgs/profile.jpg";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [userName, setUserName] = useState(
    window.sessionStorage.getItem("userName")
  );
  // const getUserName = () => {
  //   const name = window.sessionStorage.getItem("userName");
  //   setUserName(name);
  // };

  // useEffect(() => {
  //   getUserName();
  // }, []);

  return (
    <nav className="nav-main">
      <h2 className="welcome-text">
        Welcome <span>{userName}</span>
      </h2>
      <div className="user-details">
        {/* <span className="user-language">En</span> */}
        <Link to="/visitor-details">  <IoIosNotificationsOutline />     </Link>
        <div className="user-img">
          {/* <img src={ProfileImg} alt="" /> */}
          <FaUserCircle />
        </div>
        <div className="user-name">
          <span className="span1">{userName}</span>
          <span className="span2">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
