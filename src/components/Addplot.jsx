import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./Addplot.scss";
import DIcon from "../imgs/dwndIcon.png";
import { openDialog, closeDialog } from "../utils/modalUtils.js";
import { useNavigate, useLocation } from "react-router-dom";
import useAppContext from "../contextApi/useAppConext.jsx";
import { MdDelete, MdEdit, MdOutlineClose } from "react-icons/md";

const AddDetailsModal = ({ dialogRef, data,flag }) => {
  const navigate = useNavigate();
  const formData = new FormData();
  const [selectedImages, setSelectedImages] = useState([]);
  const [moreTFour, setMoreTFour] = useState(false);
  // const [flag,setFlag]=useState(false);
  const [selectedfile, setSelectedfile] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [electricityBill, setElectricityBill] = useState(0);
  const [basicAmount, setBasicAmount] = useState(0);
  const [summ, setSumm] = useState(0);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  const [addDetails, setAddDetails] = React.useState({});
  const { clientdata, setClientdata } = useAppContext();
  const [plcState,setPlcState]=useState([{
    id:1,
    name:"Corner",
    selected:false
  },{
    id:2,
    name:"Garden Facing",
    selected:false
  },{
    id:3,
    name:"Road Facing",
    selected:false
  }])
  const [plcCount,setPlcCount]=useState(0);

  // console.log(formData); // nothing in form data

  const token = window.sessionStorage.getItem("token");
  
  useEffect(() => {
    if (
      addDetails.PropertySize !== undefined &&
      addDetails.PropertySize?.length !== 0 &&
      addDetails.Rate !== undefined &&
      addDetails.Rate?.length !== 0 &&
      addDetails.Availability !== undefined &&
      addDetails.Availability?.length !== 0 &&
      addDetails.Availability !== "Select Availability" &&
      addDetails.Plotnumber !== undefined &&
      addDetails.Plotnumber?.length !== 0 &&
      addDetails.ElectricityRate !== undefined && 
      addDetails.ElectricityRate?.length!== 0 &&
      addDetails.Electricity !== undefined && 
      addDetails.Electricity?.length !== 0 &&
      addDetails.Other !== undefined && 
      addDetails.Other?.length !== 0
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [addDetails]);

useEffect(()=>{
  let county=0;
plcState.map((val)=>{
  if(val.selected){
    county++;
  }
  
  })
  
  // console.log(county, "I am inside val")
  setPlcCount(county);
},[plcState])

useEffect(()=>{
  setSumm(
    Number(
      addDetails.Club === undefined || addDetails.Club === ""
        ? 0
        : addDetails.Club
    ) +
      Number(
        addDetails.Maintainance === undefined ||
          addDetails.Maintainance === ""
          ? 0
          : addDetails.Maintainance
      ) +
   
      electricityBill +
      Number((plcCount === 0 ? 0 : ((basicAmount*plcCount)/10))) +
      Number(
        addDetails.Other === undefined || addDetails.Other === ""
          ? 0
          : addDetails.Other
      )
  );
},[plcCount])

useEffect(() => {
 

setSelectedImages([]) 
  setSelectedfile([])
  setAddDetails({
    Plotnumber: "",
    Rate: "",
    PropertySize: "",
    Availability: "Select Availability",
    Club: "",
    Maintainance: "",
    Electricity: "",
    ElectricityRate:"",
    PlcAmount:"",
    Other: "",
    Gst: "",
  });
   setBasicAmount(0);
   setElectricityBill(0);
   setPlcState([{
    id:1,
    name:"Corner",
    selected:false
  },{
    id:2,
    name:"Garden Facing",
    selected:false
  },{
    id:3,
    name:"Road Facing",
    selected:false
  }])
  // console.log(summ,"plotid wala");
  setSelectedImages([]);
  setSelectedfile([]);
}, [flag]);


// const validateInput = (value) => {
//   // Regex to match a valid number (integer or decimal)
//   const validNumberPattern = /^-?\d+(\.\d+)?$/;
//   return validNumberPattern.test(value);
// };

  const handlechange = (e) => {
    
    const { name, value } = e.target;
    // console.log(name,value,"inside handle change")
    // if(e.target.value <10000){
    if(value<0){
      setAddDetails({
        ...addDetails,
        [name]:0
      })
    }
    else{
    setAddDetails({
      ...addDetails,
      [name]: value,
    });
  }

    if (name === "PropertySize") {
      if(value >0){
      setBasicAmount(
        value * (addDetails.Rate ? addDetails.Rate : data.plotid.Rate)
      );}
      else{
        setBasicAmount(0)
      }
    }
    if (name === "Rate") {
      if(value>0){
      setBasicAmount(
        value *
          (addDetails.PropertySize
            ? addDetails.PropertySize
            : data.plotid.PropertySize)
      );
    }
    else{
      setBasicAmount(0);
    }
    }

    if (name === "Club") {
      setSumm(
        Number(value === undefined || value === "" ? 0 : value) +
          Number(
            addDetails.Maintainance === undefined ||
              addDetails.Maintainance === ""
              ? 0
              : addDetails.Maintainance
          ) +
     
          +electricityBill +
          Number(
            // addDetails.Plc === undefined || addDetails.Plc === ""
            //   ? 0
            //   : addDetails.Plc

            (plcCount === 0 ? 0 : ((basicAmount*plcCount)/10))
          ) +
          Number(
            addDetails.Other === undefined || addDetails.Other === ""
              ? 0
              : addDetails.Other
          )
      );
    // }
    }

    if (name === "Maintainance") {
      setSumm(
        Number(
          addDetails.Club === undefined || addDetails.Club === ""
            ? 0
            : addDetails.Club
        ) +
          Number(value === undefined || value === "" ? 0 : value) +
       
          +electricityBill +
          Number(
            // addDetails.Plc === undefined || addDetails.Plc === ""
            //   ? 0
            //   : addDetails.Plc

            (plcCount === 0 ? 0 : ((basicAmount*plcCount)/10))
          ) +
          Number(
            addDetails.Other === undefined || addDetails.Other === ""
              ? 0
              : addDetails.Other
          )
      );

    }

    if (name === "Electricity") {
      setElectricityBill(
        (
          ((addDetails.PropertySize
          ? addDetails.PropertySize
          : data.plotid.PropertySize) / value)* Number(addDetails.ElectricityRate
            ? addDetails.ElectricityRate
            : data.plotid.ElectricityRate)
          )
          // ,"Hello trials"
    );
      setSumm(
        Number(
          addDetails.Club === undefined || addDetails.Club === ""
            ? 0
            : addDetails.Club
        ) +
          Number(
            addDetails.Maintainance === undefined ||
              addDetails.Maintainance === ""
              ? 0
              : addDetails.Maintainance
          ) +
         
          +Number(
            (((addDetails.PropertySize
              ? addDetails.PropertySize
              : data.plotid.PropertySize) / value)*(addDetails.ElectricityRate
                ? addDetails.ElectricityRate
                : data.plotid.ElectricityRate))
          ) +
          Number(
            // addDetails.Plc === undefined || addDetails.Plc === ""
            //   ? 0
            //   : addDetails.Plc

            (plcCount === 0 ? 0 : ((basicAmount*plcCount)/10))
          ) +
          Number(
            addDetails.Other === undefined || addDetails.Other === ""
              ? 0
              : addDetails.Other
          )
      );
    }

    if (name === "ElectricityRate") {
      setElectricityBill(
          (
            ((addDetails.PropertySize
            ? addDetails.PropertySize
            : data.plotid.PropertySize) /(addDetails.Electricity
              ? addDetails.Electricity
              : data.plotid.Electricity) )* Number(value)
            // ,"Hello trials"
      ));
      setSumm(
        Number(
          addDetails.Club === undefined
            ? data.plotid.Club
            : addDetails.Club === ""
            ? 0
            : addDetails.Club
        ) +
          Number(
            addDetails.Maintainance === undefined
              ? data.plotid.Maintainance
              : addDetails.Maintainance === ""
              ? 0
              : addDetails.Maintainance
          ) +
        
          +Number(
            (
              ((addDetails.PropertySize
              ? addDetails.PropertySize
              : data.plotid.PropertySize) /(addDetails.Electricity
                ? addDetails.Electricity
                : data.plotid.Electricity) )* Number(value)
              // ,"Hello trials"
        )
          ) +
          Number(
            // editedDetails.Plc === undefined
            //   ? data.plotid.Plc
            //   : editedDetails.Plc === ""
            //   ? 0
            //   : editedDetails.Plc
            data.plotid.PlcAmount
          ) +
          Number(
            addDetails.Other === undefined
              ? data.plotid.Other
              : addDetails.Other === ""
              ? 0
              : addDetails.Other
          )
      );
    }
    if (name === "Plc") {
      setSumm(
        Number(
          addDetails.Club === undefined || addDetails.Club === ""
            ? 0
            : addDetails.Club
        ) +
          Number(
            addDetails.Maintainance === undefined ||
              addDetails.Maintainance === ""
              ? 0
              : addDetails.Maintainance
          ) +
       
          electricityBill +
          Number((plcCount === 0 ? 0 : ((basicAmount*plcCount)/10))) +
          Number(
            addDetails.Other === undefined || addDetails.Other === ""
              ? 0
              : addDetails.Other
          )
      );

    }

    if (name === "Other") {
      setSumm(
        Number(
          addDetails.Club === undefined || addDetails.Club === ""
            ? 0
            : addDetails.Club
        ) +
          Number(
            addDetails.Maintainance === undefined ||
              addDetails.Maintainance === ""
              ? 0
              : addDetails.Maintainance
          ) +
          
          electricityBill +
          Number(
            // addDetails.Plc === undefined || addDetails.Plc === ""
            //   ? 0
            //   : addDetails.Plc
            (plcCount === 0 ? 0 : ((basicAmount*plcCount)/10))
          ) +
          Number(value === undefined || value === "" ? 0 : value)
      );
      // console.log("this is summm");
    }
  };

  const onSelectFile=(event)=>{
    const selectedFiles=event.target.files;
    if((event.target.files.length + selectedImages.length)<5  ){
      // console.log(selectedfile.length,selectedImages.length,"I am khushi gpt");
  if((selectedfile.length )<5){
    // console.log("I am a good question");


        setSelectedfile([...selectedfile,...selectedFiles])
        const selectedFilesArray=Array.from(selectedFiles);
        const imagesArray=selectedFilesArray.map(file=>{
          // console.log(formData) //got value here
          return URL.createObjectURL(file);
        });
        setSelectedImages([...selectedImages,...imagesArray])

      }
      }
      else{
        setMoreTFour(true);
      }
  }

  const handleSubmit = (e) => {
    if (isDisabled) {
      alert("Please fill all the required fields");
      // setError(true);
    } 
    // else if(!isValid){
    // alert("Please fill a valid number");
    // }
    else {
      e.preventDefault();

      formData.append("Plotnumber", addDetails.Plotnumber);
      formData.append("Rate", addDetails.Rate);

      formData.append("BasicAmount", addDetails.BasicAmount);

      // formData.append("Registery", addDetails.Registery);

      // formData.append("Address", addDetails.Address);

      formData.append("PropertySize", addDetails.PropertySize);
      formData.append("Availability", addDetails.Availability);

      formData.append("Club", addDetails.Club);
      formData.append("Maintainance", addDetails.Maintainance);
      formData.append("Electricity", addDetails.Electricity);
      formData.append("ElectricityRate",addDetails.ElectricityRate);

      // formData.append("CarParking", addDetails.CarParking);
      const plcarr=plcState.reduce((acc,val)=>{
       if(val.selected){
       acc.push(val.name);
       }  

       return acc;
      },[])
      // console.log(plcarr,"This is plcArrr");
      formData.append("Plc", JSON.stringify(plcarr));
      formData.append("PlcAmount", (plcCount === 0 ? 0 : ((basicAmount*plcCount)/10)));
      formData.append("Other", addDetails.Other);
      formData.append("Gst", addDetails.Gst);
      selectedfile.forEach((element, index) => {
      formData.append("image_file" + index, element);
        
      });
      
      axios
        .post(`${import.meta.env.VITE_API_URL}/registeraddress`, formData, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        })

        .then((result) => {
          if (result.status === 207) {
            alert(result.data.message);
          }
          if (result.data.success) {
            closeDialog(dialogRef);
            result.data.saveimage.plotid = result.data.result;

            if(clientdata.length <6){
            setClientdata([...clientdata, result.data.saveimage]);
            }

            // console.log("noorain", result.data.saveimage);
            // navigate("/plot-details");
            
            setAddDetails({});
            // const p=new Promise((resolve, reject) => {
            //   setTimeout(()=>{
                
            //     resolve();
            //   },5000)

            // })
            // p.then(() => {
            //   setSelectedImages([]); // Clear selected images after the dialog is closed
            // });
            // setFlag(!flag);
          }
        })
        .catch((err) => {
          alert(err.message);
          //  console.log(err.message)
        });
      
    }
    // console.log(addDetails,data, "Hello add details");
    
  };

  const handleButtonClick = () => {
    const fileInput = document.querySelector(".select-file-imgss");
    fileInput.click();
    setMoreTFour(false);
  };

  // console.log(selectedImages,"selectedImages");
  const handleDeleteImage = (index, image) => {
    setSelectedImages(selectedImages.filter((e) => e !== image));
    setSelectedfile(selectedfile.filter((e, i) => i !== index));
  };
  // console.log(plcState,"ashoka")
  // console.log(addDetails,data, "Hello add details");
  return (
    <div>
      {/* <div className="blackky-chad" style={{background:(dialogRef.current?.open == undefined) && "rgba(0,0,0,0.5)" }}></div> */}

      <dialog ref={dialogRef} className="add-plot-main-cont">
        <div className="container">
          <div className="header">
            {/* <h6>Property Details</h6> */}
            <div className="header-message">
              
                {moreTFour ? (
                  <p style={{ color: "red", fontSize: "1.1vw" }}>
                    You cannot upload more than 4 images!
                  </p>
                ) : (
                  <button
                    onClick={() => {
                      // console.log("UPLOAD IMAGES");
                    }}
                    style={{
                      fontSize: "1vw",
                      marginTop: "-1vw",
                      marginLeft: "40%",
                      fontWeight: "bold",
                      background: "transparent",
                      padding: "0.5vw",
                      border: "1px solid gray",
                      outline: "none",
                      borderRadius: "0.5vw",
                    }}
                  >
                    UPLOADED {selectedImages.length} IMAGE
                    {selectedImages.length === 1 ? "" : "S"}
                  </button>
                )}
            </div>
            <div className="close-icon" onClick={() => closeDialog(dialogRef)}>
              <MdOutlineClose className="sp1" />
            </div>
          </div>
          <div className="image-container">
            {selectedImages.length !== 0 &&
              selectedImages?.map((image, index) => (
                <div className="image-box" key={index}>
                  <img className="edit-imggse" src={image} alt="" />
                  <div className="black-imgg-chade">
                    <MdDelete
                      className="md-dele"
                      onClick={() => handleDeleteImage(index, image)}
                    />
                    {/* <MdEdit className="md-edite" /> */}
                  </div>
                </div>
              ))}
          </div>
          <div className="disclaimere">
            <span className="asteriske">* </span>{" "}
            <p className="disclaimer-txte">
              {" "}
              indicates mandatory fields to be filled
            </p>
          </div>
          <div className="form-section">
            <div className="form-box1">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Plot Number <span className="asteriske">*</span>
                  </label>
                  <input
                    type="text"
                    name="Plotnumber"
                    placeholder="Enter plot number"
                    value={addDetails.Plotnumber}
                    onChange={handlechange}
                  />
                  {addDetails?.Plotnumber?.length === 0 && (
                    <p style={{ color: "red", fontSize: "0.9vw" }}>
                      This is a mandatory field
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label>Registry</label>
                  <input
                    type="text"
                    name="Registery"
                    placeholder="At Actual"
                    value={addDetails.Registery}
                    onChange={handlechange}
                    disabled
                  />
                  {/* {addDetails?.Registery?.length === 0 && <p style={{ color: 'red',fontSize:"0.9vw" }}>This is a mandatory field</p>} */}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Rate
                     <span className="asteriske">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price per square feet"
                    name="Rate"
                    value={addDetails.Rate}
                    onChange={handlechange}
                  />
                  {addDetails?.Rate?.length === 0 && (
                    <p style={{ color: "red", fontSize: "0.9vw" }}>
                      This is a mandatory field
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Property Size 
                    {/* <span className="asteriske">*</span> */}
                  </label>
                  <input
                    type="number"
                    name="PropertySize"
                    placeholder="Enter area in square feet"
                    value={addDetails.PropertySize}
                    onChange={handlechange}
                    min="0"
                  />
                  {addDetails?.PropertySize?.length === 0 && (
                    <p style={{ color: "red", fontSize: "0.9vw" }}>
                      This is a mandatory field
                    </p>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Basic Amount</label>
                  <input
                    type="text"
                    name="BasicAmount"
                    placeholder="Basic Amount"
                    value={basicAmount}
                    onChange={handlechange}
                    disabled
                  />
                  {/* <span>{addDetails.Rate*addDetails.PropertySize}</span> */}
                </div>
                <div className="form-group">
                  <label>
                    Select Availability <span className="asteriske">*</span>
                  </label>

                  <select
                    className="select-btn"
                    name="Availability"
                    value={addDetails.Availability}
                    onChange={handlechange}
                  >
                    <option value="Select Availability" disabled selected>
                      Select availability
                    </option>
                    <option value="Available">Available</option>
                    <option value="Not for Sale">Not for Sale</option>
                    <option value="Mortgage">Mortgage</option>
                    <option value="Sold">Sold</option>
                  </select>
                  {(addDetails?.Availability === undefined ||
                    addDetails?.Availability?.length === 0 || addDetails.Availability === "Select Availability") && (
                    <p style={{ color: "red", fontSize: "0.9vw" }}>
                      This is a mandatory field
                    </p>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>GST </label>
                  <input
                    type="text"
                    name="Gst"
                    placeholder="Excluded"
                    value={addDetails.Gst}
                    onChange={handlechange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Address </label>
                  <input
                    type="text"
                    name="Address"
                    placeholder="Raipur"
                    value={addDetails.Address}
                    onChange={handlechange}
                    disabled
                  />
                  {/* {(addDetails?.Address?.length === 0 )&& <p style={{ color: 'red',fontSize:"0.9vw" }}>This is a mandatory field</p>} */}
                </div>
              </div>
            
            </div>
            <div className="form-box2">
              <div className="amenities">
                <label>Other Facilities</label>
                <div className="amenities-row">
                  <div className="amenity">
                    <label className="ap1"> Club </label>
                    <input
                      className="ap11"
                      type="number"
                      placeholder="Enter price"
                      name="Club"
                      value={addDetails.Club}
                      onChange={handlechange}
                    />
                  </div>
                  <div className="amenity">
                    <label className="ap1"> Maintenance </label>
                    <input
                      className="ap11"
                      type="number"
                      placeholder="Enter price"
                      name="Maintainance"
                      value={addDetails.Maintainance}
                      onChange={handlechange}
                    />
                  </div>
                  <div className="amenity">
                      <label className="ap1"> Electricity Rate <span className="asteriske">*</span></label>
                      <input
                        className="ap11"
                        type="number"
                        placeholder="Enter price"
                        name="ElectricityRate"
                        value={addDetails.ElectricityRate}
                        onChange={handlechange}
                        />
                    </div>
                    {addDetails.ElectricityRate?.length === 0 && <p style={{ color: 'red',fontSize:"0.8vw",paddingLeft:"0.7vw" }}>This is a mandatory field</p>}
                  <div className="amenity">
                    <label className="ap1"> Electricity <span style={{fontSize:"0.75vw"}}> (sqft/Kw)</span> <span className="asteriske">*</span> </label>
                    <input
                      className="ap11"
                      type="number"
                      placeholder="Enter units"
                      name="Electricity"
                      value={addDetails.Electricity}
                      onChange={handlechange}
                    />
                  </div>
                  {addDetails.Electricity?.length === 0 && <p style={{ color: 'red',fontSize:"0.8vw",paddingLeft:"0.7vw" }}>This is a mandatory field</p>}
                  <div className="amenity">
                    <label className="ap1"> Electricity Bill </label>
                    <input
                      className="ap11"
                      type="number"
                      placeholder="Enter price"
                      name="CarParking"
                      value={Number(electricityBill).toFixed(3)}
                      onChange={handlechange}
                      disabled
                    />
                  </div>
                  <div className="amenity ">
                    <label className="ap1"> PLC </label>
      <div className="ap11 plcc">
      {plcState.map((val,idx)=>{
       
          return(
        <span key={idx} className="plcc-span" style={{backgroundColor:val.selected ? "rgb(21, 207, 21)" : "rgb(255, 67, 67)"}} onClick={() => {
          setPlcState(plcState.map((item, i) => 
            item.id === val.id ? { ...item, selected: !item.selected } : item
          ));
        
      }}>{val.name}</span>
        )
      })}
                   </div>
                  </div>
                  <div className="amenity plcc">
                    <label className="ap1"> PLC Amount</label>
                    <input
                      className="ap11"
                      type="number"
                      placeholder="Enter price"
                      name="Plc"
                      value={(plcCount === 0 ? 0 : ((basicAmount*plcCount)/10))}
                      disabled
                    /> 
                    </div>
                  <div className="amenity">
                    <label className="ap1"> Others(Legal) <span className="asteriske">*</span> </label>
                    <input
                      className="ap11"
                      type="number"
                      placeholder="Enter price"
                      name="Other"
                      value={addDetails.Other}
                      onChange={handlechange}
                    />
                  </div>
                  {addDetails.Other?.length === 0 && <p style={{ color: 'red',fontSize:"0.8vw",paddingLeft:"0.7vw" }}>This is a mandatory field</p>}
                </div>
              </div>
            </div>
            <div className="form-box3">
              <div className="formB3-inner">
                <img className="dwndIcon" src={DIcon} alt="" />
                <p className="browse-txt">Browse files to Upload </p>
                <div className="browse-btn-cont">
                  <button className="browse-btn" onClick={handleButtonClick}>
                    Browse
                  </button>
                  <input
                    className="select-file-imgss"
                    name="image"
                    type="file"
                    placeholder="Upload or add images"
                    onChange={onSelectFile}
                    multiple
                  />
                </div>
                <p className="max-img-upload">
                  Maximum 4 images can be uploaded
                </p>
              </div>
            </div>
          </div>
          <div className="actions">
            <div className="form-group">
              <label>Total Amount</label>
              <input
                type="number"
                name="Total Amount"
                placeholder="Enter amount"
                value={Number(basicAmount) + Number(summ.toFixed(3))}
                onChange={handlechange}
                disabled
              />
            </div>
            <button className="save" onClick={handleSubmit}>
              Save
            </button>
           
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddDetailsModal;
