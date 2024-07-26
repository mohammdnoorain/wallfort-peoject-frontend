import CreateAppContext from "./CreateAppContext.jsx";
import {useState,useEffect} from 'react'
import React from 'react'
import axios from "axios"
import {useNavigate} from 'react-router-dom'
const ConetxtProvider= ({children}) => {
  const navigate = useNavigate();

  const token = window.sessionStorage.getItem("token");

  const [login, setLogin] = React.useState(null);
  const [visitorimagedata, setvisitorimagedata] = useState([]);
  const [clientdata, setClientdata] = React.useState([
    {
      plotid:{},
      image:[],
    }
  ])
  const [visitordata, setVisitordata] = React.useState([{
    plotid:{}
  }])
  const [Privateroutetoken, setPrivateroutetoken] = useState(null)
  useEffect(()=>{
    if(token){

      axios
        .post(`${import.meta.env.VITE_API_URL}/verify-token`, {

          withCredentials: true,
          headers: { Authorization: token }
        })
        .then((res) => {
          console.log("race",res)
          if (!res.data.success) {
            console.log(" token not verified", res.data.data);
            navigate("/login");
          } else {


            // axios
            //   .get(`${import.meta.env.VITE_API_URL}/plot-details`, {
            //     withCredentials: true, 
            //     headers: { Authorization: token} }, 
            //   )
            //   .then((res) => {
            //     setClientdata(res.data.imagedata)
            //     const stringifyData = JSON.stringify(res.data.imagedata);
            //
            //
            //   })
            //   .catch((error) => {
            //     console.error("Error fetching client details:", error);
            //   });
            //
            //
            //

         
            setPrivateroutetoken(true);

          }
        }) 
        .catch((error) => {
          console.error("Error  hai:", error);
        });


    }


  },[])

  const values={
    login,
    setLogin,
    clientdata,
    setClientdata,
    setPrivateroutetoken,
    Privateroutetoken,
    setVisitordata,
    visitordata,visitorimagedata, setvisitorimagedata
  }

  return (
    <CreateAppContext.Provider value={values}>
      {children}
    </CreateAppContext.Provider>
  )
}

export default ConetxtProvider



