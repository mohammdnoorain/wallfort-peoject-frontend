import React, { useEffect, useState,useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {openDialog} from "../utils/modalUtils.js"
import { useNavigate } from "react-router";
import useAppContext from "../contextApi/useAppConext.jsx";
import EditDetailsModal from "../components/EditDetailsModal.jsx"
import CopyDetailsModal from "../components/CopyDetailsModal.jsx"
import ViewDetailsModal from "../components/ViewDetailsModal.jsx"
import AddDetailsModal from "../components/Addplot.jsx"
import jsPDF from "jspdf";
import{debounce} from "lodash";
import Logout from "../components/Logout.jsx"
import VisitorDetails from "../pages/VisitorDetails.jsx"
function Plotdetails() {
  const storage = window.sessionStorage.getItem("clientdata");

  const dialogRef2=React.useRef(null)
  const [plotDetails, setplotDetails] = useState({

    _id:"",
    image:[],
    plotid:{

    }

  })

  const [word, setWord] = useState("")
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const navigate = useNavigate();
  const copyDialogRef=React.useRef(null)
  const viewDialogRef=React.useRef(null)
  const editDetailsRef = useRef(null)
  const { clientdata, setClientdata } = useAppContext();





  const [currentPage,setCurrentPage]=useState(1);
  const token = window.sessionStorage.getItem("token");
  console.log("donnn",token)
  const getDetailsByid=(ref,data)=>{
    openDialog(ref)
    setplotDetails(data)
  }

  const handleText=(text)=>{
    const deb=debounce(()=>setWord(text),1000);
    setSearchText(text);
    deb();

  }

  useEffect(()=>{

    axios
      .get( `${import.meta.env.VITE_API_URL}/searchingapicall/${word}`, {
        withCredentials: true, 
        headers: { Authorization: token} },
      )
      .then((res) => {
        setplotDetails(res.data.imagedata[0])

        // console.log("jgghgf",res.data.imagedata[0])

        setClientdata(res.data.imagedata);
        const stringifyData = JSON.stringify(res.data.imagedata);
        // console.log("dataaaaa",stringifyData);
        window.sessionStorage.setItem("clientdata", stringifyData);
      })
      .catch((error) => {
        console.error("Error fetching client details:", error);
      });


  },[word])

  useEffect(() => {
    const clientdata1 = window.sessionStorage.getItem("clientdata");


    axios
      .get(`${import.meta.env.VITE_API_URL}/plot-details`, {
        withCredentials: true, 
        headers: { Authorization: token} }, 
      )
      .then((res) => {
        setplotDetails(res.data.imagedata[1])
        //
        // console.log("jgghgf",res.data.imagedata[1])
        setClientdata(res.data.imagedata)
        const stringifyData = JSON.stringify(res.data.imagedata);
        // console.log("clientdatafrombackend",stringifyData);
        window.sessionStorage.setItem("clientdata", stringifyData);
      })
      .catch((error) => {
        console.error("Error fetching client details:", error);
      });

  }, [token, location.pathname]); 




  const handleDelete = (id,l) => {
    if (token){
      axios
        .delete(`${import.meta.env.VITE_API_URL}/plot-delete/${id}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          const updatedClientData = clientdata.filter((user) => user._id !== l);
          setClientdata(updatedClientData);
          window.sessionStorage.setItem(
            "clientdata",
            JSON.stringify(updatedClientData)
          );
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });

    }


  };


  const handleDownload = (data) => {
    const doc = new jsPDF();

    doc.text(`Plot Number: ${data.plotid.Plotnumber}`, 10, 10);
    doc.text(`Address: ${data.plotid.Address}`, 10, 20);
    doc.text(`Area: ${data.plotid.Area}`, 10, 30);
    doc.text(`AreaSize: ${data.plotid.AreaSize}`, 10, 40);
    doc.text(`AreaPrice: ${data.plotid.AreaPrice}`, 10, 50);
    doc.text(`Availability: ${data.plotid.Availability}`, 10, 60);
    doc.text(`Amenities: ${data.plotid.Amenities}`, 10, 70);


    doc.save(`plot_details_${data.plotid.plotnumber}.pdf`);
  };

  return (




    <div> 


      <div>

        <button onClick={()=>openDialog(dialogRef2)}>Add ONE</button>
        <AddDetailsModal dialogRef={dialogRef2} />
        <Logout />
        <Link to="/visitor-details" className="nav-link">
          Visitor Details
        </Link> 

        <input
          type="text"
          placeholder="Search by name"
          value={searchText}
          onChange={(e) => handleText(e.target.value)}
        />



      </div>
      <EditDetailsModal dialogRef={editDetailsRef} data={plotDetails} setClientdata={setClientdata} />
      <CopyDetailsModal dialogRef={copyDialogRef} data={plotDetails} setClientdata={setClientdata} />

      <ViewDetailsModal dialogRef={viewDialogRef} data={plotDetails} />

      <h1>Plot Details</h1>
      <ul>
        {clientdata?.map(
          (user) =>
            user && (




              <li key={user._id}>
                <div style={{width:"100vw",display:"flex",justifyContent:"space-evenly",alignItems:"center"}}>

                  <p>Plotnumber:<br/> {user.plotid?.Plotnumber}</p>
                  <p>Address:<br/> {user.plotid?.Address}</p>



                  <button onClick={() => handleDelete(user.plotid._id,user._id)}>Delete</button>

                  <button onClick={() => getDetailsByid(editDetailsRef,user)}>Update</button>
                  <button onClick={() =>getDetailsByid(copyDialogRef,user)}>Copy</button>
                  <button onClick={() =>getDetailsByid(viewDialogRef,user)}>view details</button>

                  <button onClick={() => handleDownload(user)}>Download</button>
                </div>



              </li>
            )
        )}
      </ul>


    </div>
  );
}

export default Plotdetails;
