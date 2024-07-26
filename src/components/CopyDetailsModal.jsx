import React, { useRef,useEffect } from 'react';
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { openDialog,closeDialog } from "../utils/modalUtils.js";
const CopyDetailsModal = ({dialogRef,data ,setClientdata}) => {
  const [copyDetails, setCopyDetails] = React.useState({})
  const token=window.sessionStorage.getItem("token")
  const navigate = useNavigate();
  const handlechange=(e)=>{
    const {name, value} = e.target;
    setCopyDetails({
      ...copyDetails,
      [name]: value
    });
  }
  const handleSubmit=(e)=>{
    e.preventDefault()

    axios.post(`${import.meta.env.VITE_API_URL}/copyaddress/${data.plotid._id}`, copyDetails, { headers: { Authorization: token }})
      .then(result => {
        if(result.data.success)
      {
          const copy=result.data.data;
          const data=copy.reduce((a,e)=>{
            const newobj={

              _id:'',
              image:[],
              plotid:e,
            }
            a.push(newobj);

            return a;
          },[])
          setClientdata(p=>[...p,...data])
        }

        closeDialog(dialogRef)

      })
      .catch(err => console.log(err));
    console.log(copyDetails)
  }
 
  return (
    <div>
      <dialog ref={dialogRef} style={{border:"none",padding:"1.5vw",margin:"auto",borderRadius:"1vw"}}>
        <p style={{fontSize:"1.1vw",border:"none",outline:"none",marginBottom:"1vw"}}>Number of Copies</p>
        <div>
          {/* <label>Plot No.</label> */}
          <input name="numberofcopy"  value={copyDetails.numberofcopy} style={{fontSize:"1.1vw",border:"1px solid gray",outline:"none",marginBottom:"1vw"}} onChange={handlechange}  />
        </div>
         <div style={{display:"flex",justifyContent:"space-evenly",width:"100%"}}>
        <button style={{background:"transparent",border:"1px solid gray",borderRadius:"0.25vw",fontSize:"1vw",padding:"0.35vw",cursor:"pointer"}} onClick={handleSubmit}>submit</button>
        <button style={{background:"transparent",border:"1px solid gray",borderRadius:"0.25vw",fontSize:"1vw",padding:"0.35vw",cursor:"pointer"}} onClick={()=>closeDialog(dialogRef)}>Close</button>
        </div>
      </dialog>
    </div>
  );
};

export default CopyDetailsModal;



