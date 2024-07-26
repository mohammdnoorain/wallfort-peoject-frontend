import React from 'react'
import {useState} from 'react'
import {openDialog} from "../utils/modalUtils.js"
import ForgetPasswordDialog from "../components/ForgetPasswordDialog.jsx"
import axios from "axios"
import { Form, Button, Container } from "react-bootstrap";
import { FaUser, FaLock } from "react-icons/fa";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";
import useAppContext from "../contextApi/useAppConext.jsx";
const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dialogRef3=React.useRef(null)
  const {setPrivateroutetoken}=useAppContext();
  const handleSubmit=(e)=>{
    e.preventDefault();


    axios
      .post(`${import.meta.env.VITE_API_URL}/login-client`, { email, password },  { withCredentials: true })
      .then((res) => {
        if(!res.data.success ){
          navigate("/login");
        }

        else if (res.data.success === true){
          setPrivateroutetoken(true);
          window.sessionStorage.setItem("token", res.data.token);
          navigate("/plot-details") 


        }

      })
      .catch((err) => console.log(err));

  }


  return (
    <Container className="mt-5" style={{border:"1px solid red",margin:"auto"}}>
      <div className="login-form-wrapper">
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FaUser />
              </span>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FaLock />
              </span>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Login
          </Button>
          <div className="text-center">

          </div>
          <p className="message">
            Recover your password{" "}
            <button onClick={()=>openDialog(dialogRef3)}>Forget Password</button>
            <ForgetPasswordDialog dialogRef={dialogRef3} />
          </p>
        </Form>

      </div>
    </Container>
  );

}



export default LoginPage
