import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import "./editplot.scss";
import DIcon from "../imgs/dwndIcon.png";
import { useNavigate } from "react-router-dom";
import { openDialog, closeDialog } from "../utils/modalUtils.js";

import { MdDelete, MdEdit, MdOutlineClose } from "react-icons/md";

const formData = new FormData();

const EditDetailsModal = ({
  dialogRef,
  data,
  setClientdata,
  clientdata,
  setplotDetails,
}) => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  // const [error, setError] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [editimageindex, setEditimageindex] = useState(null);
  const [electricityBill, setElectricityBill] = useState(
    Number(((data.plotid.PropertySize / data.plotid.Electricity) * data.plotid?.ElectricityRate)).toFixed(3)
    // 0
  );

  const fileInputRef = useRef(null);

  const [basicAmount, setBasicAmount] = useState(
    data.plotid.PropertySize * data.plotid.Rate
  );
  const [summ, setSumm] = useState(
    data.plotid.Club +
    data.plotid.Maintainance +
    data.plotid.Electricity +
    data.plotid.CarParking +
    data.plotid.PlcAmount +
    data.plotid.Other
  );

  const [editedDetails, seteditedDetails] = React.useState({
    Plotnumber: data.plotid.Plotnumber,
    Rate: data.plotid.Rate,

    Registery: data.plotid.Registery,
    Address: data.plotid.Address,
    PropertySize: data.plotid.PropertySize,
    Availability: data.plotid.Availability,
    Club: data.plotid.Club,
    Maintainance: data.plotid.Maintainance,
    Electricity: data.plotid.Electricity,
    ElectricityRate: data.plotid.ElectricityRate,
    CarParking: data.plotid.CarParking,
    Plc: data.plotid.Plc,
    Other: data.plotid.Other,
    Gst: data.plotid.Gst,
  });

  useEffect(() => {
    setBasicAmount(data.plotid.PropertySize * data.plotid.Rate);
    setElectricityBill(((data.plotid.PropertySize / data.plotid.Electricity) * data.plotid?.ElectricityRate));
    setSumm(
      Number(data.plotid.Club) +
      Number(data.plotid.Maintainance) +
      Number(((data.plotid.PropertySize / data.plotid.Electricity) * data.plotid?.ElectricityRate)) +
      // Number(data.plotid.CarParking)
      +Number(data.plotid.PlcAmount) +
      Number(data.plotid.Other)
    );
    // setSumm(Number((isNaN(editedDetails.Club))?0:editedDetails.Club) + Number((isNaN(editedDetails.Maintainance))?0:editedDetails.Maintainance) + Number((isNaN(editedDetails.Electricity))? 0:editedDetails.Electricity) + Number((isNaN(editedDetails.CarParking))? 0:editedDetails.CarParking) + Number(isNaN(editedDetails.Plc)?0 :editedDetails.Plc) + Number(isNaN(editedDetails.Other)?0:editedDetails.Other));
    setImages(data.image);

    seteditedDetails({
      Plotnumber: data.plotid.Plotnumber,
      Rate: data.plotid.Rate,
      Registery: data.plotid.Registery,
      Address: data.plotid.Address,
      PropertySize: data.plotid.PropertySize,
      Availability: data.plotid.Availability,
      Club: data.plotid.Club,
      Maintainance: data.plotid.Maintainance,
      Electricity: data.plotid.Electricity,
      ElectricityRate: data.plotid.ElectricityRate,
      CarParking: data.plotid.CarParking,
      Plc: data.plotid.Plc,
      Other: data.plotid.Other,
      Gst: data.plotid.Gst,
    });

    // console.log(summ,"plotid wala");
  }, [data]);

  useEffect(() => {
    if (
      editedDetails.Rate?.length !== 0 &&
      editedDetails.Availability?.length !== 0 && editedDetails.ElectricityRate?.length !== 0 && editedDetails.Electricity?.length !== 0
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [editedDetails]);
  // console.log("nasir",editedDetails);

  const token = window.sessionStorage.getItem("token");

  const handlechange = (e) => {
    const { name, value } = e.target;
    if (value < 0) {
      seteditedDetails({
        ...editedDetails,
        [name]: 0,
      });
    }
    else {

      seteditedDetails({
        ...editedDetails,
        [name]: value,
      });
    }

    if (name === "PropertySize") {
      setBasicAmount(
        value * (editedDetails.Rate ? editedDetails.Rate : data.plotid.Rate)
      );
      // console.log(summ,"propertySize");
    }
    if (name === "Rate") {
      if (value > 0) {
        setBasicAmount(
          value *
          (editedDetails.PropertySize
            ? editedDetails.PropertySize
            : data.plotid.PropertySize)
        );
      }
      else {
        setBasicAmount(0)
      }
    }

    if (name === "Club") {
      setSumm(
        Number(value) +
        Number(
          editedDetails.Maintainance === undefined
            ? data.plotid.Maintainance
            : editedDetails.Maintainance === ""
              ? 0
              : editedDetails.Maintainance
        ) +

        + Number(electricityBill).toFixed(3) +
        Number(
          // editedDetails.Plc === undefined
          //   ? data.plotid.Plc
          //   : editedDetails.Plc === ""
          //   ? 0
          //   : editedDetails.Plc
          data.plotid.PlcAmount
        ) +
        Number(
          editedDetails.Other === undefined
            ? data.plotid.Other
            : editedDetails.Other === ""
              ? 0
              : editedDetails.Other
        )
      );
    }

    if (name === "Maintainance") {
      setSumm(
        Number(
          editedDetails.Club === undefined
            ? data.plotid.Club
            : editedDetails.Club === ""
              ? 0
              : editedDetails.Club
        ) +
        Number(value) +

        +Number(electricityBill).toFixed(3) +
        Number(
          data.plotid.PlcAmount
        ) +
        Number(
          editedDetails.Other === undefined
            ? data.plotid.Other
            : editedDetails.Other === ""
              ? 0
              : editedDetails.Other
        )
      );
    }

    if (name === "Electricity") {
      setElectricityBill(
        (
          ((editedDetails.PropertySize
            ? editedDetails.PropertySize
            : data.plotid.PropertySize) / value) * Number(editedDetails.ElectricityRate
              ? editedDetails.ElectricityRate
              : data.plotid.ElectricityRate)
        )
        // ,"Hello trials"
      );
      setSumm(
        Number(
          editedDetails.Club === undefined
            ? data.plotid.Club
            : editedDetails.Club === ""
              ? 0
              : editedDetails.Club
        ) +
        Number(
          editedDetails.Maintainance === undefined
            ? data.plotid.Maintainance
            : editedDetails.Maintainance === ""
              ? 0
              : editedDetails.Maintainance
        ) +

        +Number(
          (((editedDetails.PropertySize
            ? editedDetails.PropertySize
            : data.plotid.PropertySize) / value) * (editedDetails.ElectricityRate
              ? editedDetails.ElectricityRate
              : data.plotid.ElectricityRate))
        ) +
        Number(data.plotid.PlcAmount) +
        Number(
          editedDetails.Other === undefined
            ? data.plotid.Other
            : editedDetails.Other === ""
              ? 0
              : editedDetails.Other
        )
      );
    }

    if (name === "ElectricityRate") {
      setElectricityBill(
        (
          ((editedDetails.PropertySize
            ? editedDetails.PropertySize
            : data.plotid.PropertySize) / (editedDetails.Electricity
              ? editedDetails.Electricity
              : data.plotid.Electricity)) * Number(value)
          // ,"Hello trials"
        ));
      setSumm(
        Number(
          editedDetails.Club === undefined
            ? data.plotid.Club
            : editedDetails.Club === ""
              ? 0
              : editedDetails.Club
        ) +
        Number(
          editedDetails.Maintainance === undefined
            ? data.plotid.Maintainance
            : editedDetails.Maintainance === ""
              ? 0
              : editedDetails.Maintainance
        ) +

        +Number(
          (
            ((editedDetails.PropertySize
              ? editedDetails.PropertySize
              : data.plotid.PropertySize) / (editedDetails.Electricity
                ? editedDetails.Electricity
                : data.plotid.Electricity)) * Number(value)
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
          editedDetails.Other === undefined
            ? data.plotid.Other
            : editedDetails.Other === ""
              ? 0
              : editedDetails.Other
        )
      );
    }
    if (name === "CarParking") {
      setSumm(
        Number(
          editedDetails.Club === undefined
            ? data.plotid.Club
            : editedDetails.Club === ""
              ? 0
              : editedDetails.Club
        ) +
        Number(
          editedDetails.Maintainance === undefined
            ? data.plotid.Maintainance
            : editedDetails.Maintainance === ""
              ? 0
              : editedDetails.Maintainance
        ) +
        // Number((editedDetails.Electricity === undefined)?data.plotid.Electricity:(editedDetails.Electricity ==="") ? 0 :editedDetails.Electricity)
        Number(electricityBill).toFixed(3) +
        Number(
          // editedDetails.Plc === undefined
          //   ? data.plotid.Plc
          //   : editedDetails.Plc === ""
          //   ? 0
          //   : editedDetails.Plc
          data.plotid.PlcAmount
        ) +
        Number(
          editedDetails.Other === undefined
            ? data.plotid.Other
            : editedDetails.Other === ""
              ? 0
              : editedDetails.Other
        )
      );
    }

    if (name === "Plc") {
      setSumm(
        Number(
          editedDetails.Club === undefined
            ? data.plotid.Club
            : editedDetails.Club === ""
              ? 0
              : editedDetails.Club
        ) +
        Number(
          editedDetails.Maintainance === undefined
            ? data.plotid.Maintainance
            : editedDetails.Maintainance === ""
              ? 0
              : editedDetails.Maintainance
        ) +

        Number(electricityBill).toFixed(3) +
        Number(value) +
        Number(
          editedDetails.Other === undefined
            ? data.plotid.Other
            : editedDetails.Other === ""
              ? 0
              : editedDetails.Other
        )
      );

      // console.log(editedDetails.Other,data.plotid.Other,"This is PLC");
    }

  };

  const handleDelete = async (e) => {
    try {
      const updatedImages = images.filter((ele) => ele._id !== e._id);
      setImages(updatedImages);
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/delete/image/${e._id}`,
        {
          headers: {
            Authorization: token,
          },

          data: { blobName: e.blobName }
        },
      )
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }







  const handleSubmit = (e) => {
    if (isDisabled) {
      alert("Please fill all the required fields");
      // setError(true);
    } else {
      e.preventDefault();
      images.forEach((element, index) => {
        formData.append("image_file" + index, element);
      });

      formData.append("Plotnumber", editedDetails.Plotnumber);
      formData.append("Rate", editedDetails.Rate);

      formData.append("BasicAmount", editedDetails.BasicAmount);

      formData.append("Registery", editedDetails.Registery);

      formData.append("Address", editedDetails.Address);

      formData.append("PropertySize", editedDetails.PropertySize);
      formData.append("Availability", editedDetails.Availability);

      formData.append("Club", editedDetails.Club);
      formData.append("Maintainance", editedDetails.Maintainance);
      formData.append("Electricity", editedDetails.Electricity);
      formData.append("ElectricityRate", editedDetails.ElectricityRate);


      formData.append("CarParking", editedDetails.CarParking);
      formData.append("Plc", editedDetails.Plc);
      formData.append("Other", editedDetails.Other);
      formData.append("Gst", editedDetails.Gst);

      axios
        .post(
          `${import.meta.env.VITE_API_URL}/updateaddress/${data.plotid._id}`,
          { ...editedDetails, editedimage: images },
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        )
        .then((result) => {
          if (result.data.success === true) {
            const newPlots = clientdata.map((plot) => {
              if (plot.plotid._id === result.data.data._id) {
                plot.plotid = result.data.data;
                plot.image = images;
              }
              return plot;
            });
            console.log(newPlots);
            setClientdata(newPlots);
            seteditedDetails({});
          }
        });
      closeDialog(dialogRef)?.catch((err) => console.log(err));

      console.log(editedDetails);
    }
  };

  // const handleDelete = (index) => {
  //
  // };
  const handleButtonClick2 = (index) => {
    setEditimageindex(index);
    fileInputRef.current.click();
    // console.log(index,editimageindex,"Hello index");
  };

  const handleImageChangeAndUpload = async (e) => {
    try {
      const formData = new FormData()
      const imageUrlFromUploadedImage = URL.createObjectURL(e.target.files[0])
      formData.append("image", e.target.files[0])
      formData.append("imageId", data._id)
      formData.append("plotId", data.plotid._id)
      if (
        editimageindex == null &&
        images.length + e.target.files.length < 5
      ) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/upload/image`, formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            }
          })
        setImages([...res.data.data.image]);
      } else if (
        e.target.files.length == 1 &&
        images.length < 5 &&
        editimageindex < 4
      ) {
        formData.append("plotNumber", data.plotid.Plotnumber)
        formData.append("blobName", images[editimageindex].blobName)
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/edit/image/${images[editimageindex]._id}`, formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            }
          })
        console.log("rango", res.data)
        setImages(images.map((e, i) => {
          if (i == editimageindex) {
            e.imageUrl = imageUrlFromUploadedImage;
          }
          return e;
        }));
      }
      setEditimageindex(null);
    } catch (error) {
      console.log(error);
    }
  }
  const submitImage = () => {
    console.log("japan");
    fileInputRef.current.click();
  };

  // console.log(data,basicAmount,summ,"This is dataaaaaaa");
  return (
    <div>
      <dialog ref={dialogRef} className="edit-plot-main-cont">
        {/* <p>EDIT DETAILS</p> */}
        <div className="containere">
          <div className="headere">
            {/* <h6>Property Details</h6> */}
            <div className="close-icone" onClick={() => closeDialog(dialogRef)}>
              <MdOutlineClose className="sp1e" />
            </div>
          </div>
          <div className="image-containere">
            {images?.length !== 0 &&
              images?.map((image, index) => (
                <div className="image-boxe" key={index}>
                  <img
                    className="edit-imggs"
                    src={image.imageUrl}
                  />
                  <div className="black-imgg-chad">
                    <MdDelete
                      className="md-del"
                      onClick={() => handleDelete(image)}
                    />
                    <MdEdit
                      className="md-edit"
                      onClick={() => handleButtonClick2(index)}
                    />
                  </div>
                </div>
              ))}
          </div>
          <div className="disclaimer">
            <span className="asterisk">* </span>{" "}
            <p className="disclaimer-txt">
              {" "}
              indicates mandatory fields to be filled
            </p>
          </div>
          <div className="form-sectione">
            <div className="form-box1e">
              <div className="form-rowe">
                <div className="form-groupe">
                  <label>Plot Number</label>
                  <input
                    type="text"
                    name="Plotnumber"
                    placeholder="Enter plot number"
                    value={editedDetails.Plotnumber}
                    onChange={handlechange}
                    disabled
                  />
                </div>
                <div className="form-groupe">
                  <label>Registry </label>
                  <input
                    type="text"
                    name="Registery"
                    placeholder="At Actual"
                    value={"At Actual"}
                    onChange={handlechange}
                    disabled
                  />
                  {/* {editedDetails.Registery?.length === 0 && <p style={{ color: 'red',fontSize:"0.9vw" }}>This is a mandatory field</p>} */}
                </div>
              </div>
              <div className="form-rowe">
                <div className="form-groupe">
                  <label>
                    Rate <span className="asterisk">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price per square feet"
                    name="Rate"
                    value={editedDetails.Rate}
                    onChange={handlechange}
                  />
                  {/* {editedDetails.Rate?.length=== 0 ? <p style={{ color: 'red',fontSize:"0.9vw" }}>This is a mandatory field</p>:<p style={{ opacity:0,fontSize:"0.9vw" }}>Hello</p>} */}
                  {editedDetails.Rate?.length === 0 && (
                    <p style={{ color: "red", fontSize: "0.9vw" }}>
                      This is a mandatory field
                    </p>
                  )}
                </div>

                <div className="form-groupe">
                  <label>Property Size </label>
                  <input
                    type="number"
                    name="PropertySize"
                    placeholder="Enter area in square feet"
                    value={editedDetails.PropertySize}
                    onChange={handlechange}
                    disabled
                  />
                  {/* {editedDetails.PropertySize?.length === 0 && <p style={{ color: 'red',fontSize:"0.9vw" }}>This is a mandatory field</p>} */}
                </div>
              </div>
              <div className="form-rowe">
                <div className="form-groupe">
                  <label>Basic Amount</label>
                  <input
                    type="number"
                    name="BasicAmount"
                    placeholder="Enter amount"
                    value={basicAmount}
                    onChange={handlechange}
                    disabled
                  />
                </div>
                <div className="form-groupe">
                  <label>
                    Select Availability <span className="asterisk">*</span>
                  </label>
                  <select
                    className="select-btne"
                    name="Availability"
                    value={editedDetails.Availability}
                    onChange={handlechange}
                  >
                    <option value="" disabled selected>
                      Select availability
                    </option>
                    <option value="Available">Available</option>
                    <option value="Not for Sale">Not for Sale</option>
                    <option value="Mortgage">Mortgage</option>
                    <option value="Sold">Sold</option>
                  </select>
                  {editedDetails.Availability?.length === 0 && (
                    <p style={{ color: "red", fontSize: "0.9vw" }}>
                      This is a mandatory field
                    </p>
                  )}
                </div>
              </div>
              <div className="form-rowe">
                <div className="form-groupe">
                  <label>GST </label>
                  <input
                    type="number"
                    name="Gst"
                    placeholder="Excluded"
                    value={editedDetails.Gst}
                    onChange={handlechange}
                    disabled
                  />
                </div>
                <div className="form-groupe">
                  <label>Address</label>
                  <input
                    type="text"
                    name="Address"
                    placeholder="Enter address"
                    value={"Raipur"}
                    onChange={handlechange}
                    disabled
                  />
                  {editedDetails.Address?.length === 0 && (
                    <p style={{ color: "red", fontSize: "0.9vw" }}>
                      This is a mandatory field
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="form-box2e">
              <div className="amenitiese">
                <label>Other Facilities</label>
                <div className="amenities-rowe">
                  <div className="amenitye">
                    <label className="ap1e"> Club </label>
                    <input
                      className="ap11e"
                      type="number"
                      placeholder="Enter price"
                      name="Club"
                      value={editedDetails.Club}
                      onChange={handlechange}
                    />
                  </div>
                  <div className="amenitye">
                    <label className="ap1e"> Maintenance </label>
                    <input
                      className="ap11e"
                      type="number"
                      placeholder="Enter price"
                      name="Maintainance"
                      value={editedDetails.Maintainance}
                      onChange={handlechange}
                    />
                  </div>
                  <div className="amenitye">
                    <label className="ap1e"> Electricity Rate <span className="asterisk">*</span> </label>
                    <input
                      className="ap11e"
                      type="number"
                      placeholder="Enter price"
                      name="ElectricityRate"
                      value={editedDetails.ElectricityRate}
                      onChange={handlechange}

                    />

                  </div>
                  {editedDetails.ElectricityRate?.length === 0 && <p style={{ color: 'red', fontSize: "0.8vw", paddingLeft: "0.7vw" }}>This is a mandatory field</p>}
                  <div className="amenitye">
                    <label className="ap1e">  Electricity <span style={{ fontSize: "0.75vw" }}> (sqft/Kw)</span><span className="asterisk">*</span> </label>
                    <input
                      className="ap11e"
                      type="number"
                      placeholder="Enter units"
                      name="Electricity"
                      value={editedDetails.Electricity}
                      onChange={handlechange}
                    />
                  </div>
                  {editedDetails.Electricity?.length === 0 && <p style={{ color: 'red', fontSize: "0.8vw", paddingLeft: "0.7vw" }}>This is a mandatory field</p>}
                  <div className="amenitye">
                    <label className="ap1e"> Electricity Bill </label>
                    <input
                      className="ap11e"
                      type="number"
                      placeholder="Enter price"
                      name="CarParking"
                      value={Number(electricityBill).toFixed(3)}
                      onChange={handlechange}
                      disabled
                    />
                  </div>
                  <div className="amenitye">
                    <label className="ap1e" style={{ padding: "0.5vw", paddingLeft: "1vw" }}> PLC </label>

                    <div className="ap11e plcce" style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", borderRadius: "0.7vw", paddingLeft: "0.75vw" }}>
                      {data.plotid?.Plc?.length === 0 ? <span className="plcc-spane">None</span> : data.plotid?.Plc?.map((val, idx) => { return <span key={idx} className="plcc-spane">{val}</span> })}
                    </div>
                  </div>
                  <div className="amenitye ">
                    <label className="ap1e"> PLC Amount</label>
                    <input
                      className="ap11e"
                      type="number"
                      placeholder="Enter price"
                      name="Plc"
                      value={data.plotid.PlcAmount}
                      onChange={handlechange}
                      disabled
                    />
                  </div>
                  <div className="amenitye">
                    <label className="ap1e"> Others(Legal) </label>
                    <input
                      className="ap11e"
                      type="number"
                      placeholder="Enter price"
                      name="Other"
                      value={editedDetails.Other}
                      onChange={handlechange}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-box3e">
              <div className="formB3-innere">
                <img className="dwndIcone" src={DIcon} alt="" />
                <p className="browse-txte">Browse files to Upload </p>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleImageChangeAndUpload}

                />
                <div className="browse-btn-conte">
                  <button className="browse-btne" onClick={submitImage}>
                    Browse
                  </button>
                  {/* <input className='select-file-imgsse' name="image" type="file" placeholder='Upload or add images' onChange={onSelectFile} multiple   /> */}
                </div>
                <p className="max-img-uploade">
                  Maximum 4 images can be uploaded
                </p>
              </div>
            </div>
          </div>

          <div className="actionse">
            {/* disabled={isDisabled} style={{cursor:isDisabled && "not-allowed"}} */}
            <div className="form-groupe">
              <label>Total Amount</label>
              <input
                type="number"
                name="Total Amount"
                placeholder="Enter amount"
                value={Number(basicAmount) + Number(summ)}
                onChange={handlechange}
                disabled
              />
            </div>
            <button className="save" onClick={handleSubmit}>
              Save
            </button>
          </div>
          {/* <button onClick={handleSubmit}>submit</button> */}
          {/* <button onClick={() => closeDialog(dialogRef)}>Close</button> */}
        </div>
      </dialog>
    </div>
  );
};

export default EditDetailsModal;
