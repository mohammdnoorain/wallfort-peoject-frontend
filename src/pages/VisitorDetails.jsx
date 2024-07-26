import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { openDialog } from "../utils/modalUtils.js";
import { useNavigate } from "react-router";
import useAppContext from "../contextApi/useAppConext.jsx";

import ViewVisitorDetailsModal from "../components/ViewVisitorDetailsModal.jsx";

import { debounce } from "lodash";
import Logout from "../components/Logout.jsx";
function VisitorDetails() {
  
  const dialogRef2=React.useRef(null)

  const [word, setWord] = useState("")
  const [searchText, setSearchText] = useState('');
  const [visitorplotdata,setvisitorplotdata]=useState({

 _id:""

  })
  const navigate = useNavigate();
  const viewDialogRef = React.useRef(null);
  const editDetailsRef = useRef(null);

  const { visitordata, setVisitordata } = useAppContext();

  const [currentPage, setCurrentPage] = useState(1);
  const token = window.sessionStorage.getItem("token");
  console.log("donnn",token)
  const getDetailsByid=(ref,data)=>{
    openDialog(ref)
    setvisitorplotdata(data)
// console.log("llllll",visitorplotdata)
 }

  const handleText = (text) => {
    const deb = debounce(() => setWord(text), 1000);
    setSearchText(text);
    deb();
  };

  useEffect(() => {
    axios
      .get( `${import.meta.env.VITE_API_URL}/searchingvisitorapicall/${word}`, {
        withCredentials: true, 
        headers: { Authorization: token} }, 
      )
      .then((res) => {
               // console.log("jgghgf",res.data.data)

        setVisitordata(res.data.data)
        const stringifyData = JSON.stringify(res.data.data);
        // console.log("dataaaaa",stringifyData);
        window.sessionStorage.setItem("visitordata", stringifyData);
      })
      .catch((error) => {
        console.error("Error fetching client details:", error);
      });
  }, [word]);

  useEffect(() => {
 
     
      axios
        .get(`${import.meta.env.VITE_API_URL}/visitor-details`, {
          withCredentials: true, 
          headers: { Authorization: token} }, 
        )
        .then((res) => {
         
          // console.log("jgghgf",res.data.data)
                   setVisitordata(res.data.data)
          const stringifyData = JSON.stringify(res.data.data);
          // console.log("visitoralldata",stringifyData);
          window.sessionStorage.setItem("visitordata", stringifyData);
          window.sessionStorage.setItem("location", location.pathname);
        })
        .catch((error) => {
          console.error("Error fetching client details:", error);
        });
    
  }, [token]); 



  
  const handleDelete = (id,l) => {
    if (token){
      axios
        .delete(`${import.meta.env.VITE_API_URL}/visitor-delete/${id}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          const updatedClientData = visitordata.filter(
            (user) => user._id !== l
          );
          setVisitordata(updatedClientData);
                  window.sessionStorage.setItem(
            "visitordata",
            JSON.stringify(updatedClientData)
          );
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  //
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchText}
          onChange={(e) => handleText(e.target.value)}
        />
      </div>
    
      <ViewVisitorDetailsModal dialogRef={viewDialogRef} data={visitorplotdata}/>

      <h1>Visitor Details</h1>
      <ul>
        {visitordata?.map(
          (user) =>
            user && (
              <li key={user._id}>
                <div
                  style={{
                    width: "100vw",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <p>
                    Name:
                    <br /> {user.name}
                  </p>
                  <p>
                    Email:
                    <br /> {user.email}
                  </p>
                  <p>
                    Mobile:
                    <br /> {user.phone}
                  </p>
                  <p>
                    Message:
                    <br /> {user.query}
                  </p>

                  <p>
                    Plot Status:
                    <br />
                    {user.plotid?.Availability}
                  </p>

                  <button onClick={() => handleDelete(user._id)}>Delete</button>

                  <button
                    onClick={() => getDetailsByid(viewDialogRef, user.plotid)}
                  >
                    view details
                  </button>
                </div>



                            </li>
            )
        )}
      </ul>
    </div>
  );
}

export default VisitorDetails;
