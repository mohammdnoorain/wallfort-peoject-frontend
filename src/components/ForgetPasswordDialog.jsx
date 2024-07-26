
import React, { useRef } from "react";
import axios from "axios";
import "./forgetPass.scss";
import { openDialog, closeDialog } from "../utils/modalUtils.js";
import { useNavigate } from "react-router";

const ForgetPasswordDialog = ({ dialogRef, open, setOpen }) => {
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [newpassword, setNewpassword] = React.useState("");
  const [state, setState] = React.useState("email");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpSubmission = (e) => {
    setOtp(e.target.value);
  };

  const handleCreateNewPassword = (e) => {
    setNewpassword(e.target.value);
  };

  const handleSubmitEmail = (e) => {
    e.preventDefault();

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/forget`,
        { email },
        { withCredentials: true }
      )
      .then((res) => {
        if (!res.data.success) {
          closeDialog(dialogRef);
        } else if (res.data.success === true) {
          window.sessionStorage.setItem("forgetpassworduserid", res.data.userid);
          setState("otp");
        }
        setEmail("");  // Reset email after API call
      })
      .catch((err) => {
        alert("Invalid credentials")
        console.log(err);
        setEmail("");  // Reset email even if API call fails
      });
  };

  const handleSubmitOtp = (e) => {
    e.preventDefault();

    const id = window.sessionStorage.getItem("forgetpassworduserid");
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/verify-otp`,
        { otp, id },
        { withCredentials: true }
      )
      .then((res) => {
        if (!res.data.success) {
          closeDialog(dialogRef);
        } else if (res.data.success === true) {
          setState("");
        }
        setOtp("");  // Reset OTP after API call
      })
      .catch((err) => {
        console.log(err);
        setOtp("");  // Reset OTP even if API call fails
      });
  };

  const handleSubmitNewpassword = (e) => {
    e.preventDefault();
    const id = window.sessionStorage.getItem("forgetpassworduserid");
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/newpassword`,
        { newpassword, id },
        { withCredentials: true }
      )
      .then((res) => {
        if (!res.data.success) {
          closeDialog(dialogRef);
        } else if (res.data.success === true) {
          window.sessionStorage.setItem("token", res.data.token);
          closeDialog(dialogRef);
          navigate("/plot-details");
        }
        // Resetting newpassword is not required as it's already handled by setting newpassword state
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="forgetPass-div"
      style={{
        display: open && "block",
      }}
    >
      <div className="fpWrapper">
        {state === "email" ? (
          <>
            <p>Please enter your email</p>
            <input type="email" onChange={handleEmailChange} placeholder="hello@gmail.com" value={email} />
            <div className="btn-wrapper">
              <button onClick={handleSubmitEmail}> Submit </button>
              <button onClick={() => setOpen(!open)}>Close</button>
            </div>
          </>
        ) : state === "otp" ? (
          <>
            <p className="para-text">Please enter the OTP sent to your Email</p>
            <input type="otp" onChange={handleOtpSubmission} placeholder="012587" value={otp} />
            <div className="btn-wrapper">
              <button onClick={handleSubmitOtp}> Submit </button>
              <button onClick={() => setOpen(!open)}>Close</button>
            </div>
          </>
        ) : (
          <>
            <p>Please enter new password</p>
            <input type="newpassword" onChange={handleCreateNewPassword} placeholder="@31234" value={newpassword} />
            <div className="btn-wrapper">
              <button onClick={handleSubmitNewpassword}> Submit </button>
              <button onClick={() => setOpen(!open)}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPasswordDialog;

