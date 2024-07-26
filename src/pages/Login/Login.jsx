import React, { useEffect, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAppContext from "../../contextApi/useAppConext.jsx";
import { openDialog } from "../../utils/modalUtils.js";
import ForgetPasswordDialog from "../../components/ForgetPasswordDialog.jsx";

const Login = () => {
  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
  });
  const [open, setOpen] = useState(false);
  const { setPrivateroutetoken } = useAppContext();
  const navigate = useNavigate();
  const dialogRef3 = React.useRef(null);
  const handleInput = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/login-client`,
        { email: loginData.email, password: loginData.password },
        { withCredentials: true }
      )
      .then((res) => {
        if (!res.data.success) {
          navigate("/login");
        } else if (res.data.success === true) {
          setPrivateroutetoken(true);
          window.sessionStorage.setItem("token", res.data.token);
          window.sessionStorage.setItem("userName", res.data.user.name);
          navigate("/plot-details");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login-main">
      <div className="login-card">
        <div className="lheading">Login to Account</div>
        <p>Please enter your email and password to continue</p>
        <div className="inp-box">
          <div className="email-box">
            <span>Email address</span>
            <input
              type="email"
              placeholder="abc@gmail.com"
              name="email"
              value={loginData.email}
              onChange={handleInput}
            />
          </div>
          <div className="password-box">
            <span>Password</span>
            <input
              type="password"
              placeholder="*****"
              name="password"
              value={loginData.password}
              onChange={handleInput}
            />
          </div>
          <div className="password-extra">
            {/* <div className="pe-left">
              <input type="checkbox" />
              <span>Remember Password</span>
            </div> */}
            <div className="pe-right" onClick={() => setOpen(!open)}>
              <span ref={openDialog(dialogRef3)}>Forget Password</span>
            </div>
          </div>
        </div>

        <div className="login-btn">
          <button onClick={handleLogin}>Login</button>
        </div>
        {/* <div className="go-to-register">
          <p>
            Don't have account ? <Link to="/register"> Register</Link>
          </p>
        </div> */}
      </div>
      <ForgetPasswordDialog
        dialogRef={dialogRef3}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default Login;
