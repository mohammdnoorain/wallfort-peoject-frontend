import React, { useRef, useEffect, useState } from "react";

import useAppContext from "../contextApi/useAppConext.jsx";

import { closeDialog } from "../utils/modalUtils.js";
import "./ViewDetailsModal.scss";
import SizeImg from "../imgs/sizeImg.png";
import AreaImg1 from "../imgs/AreaImg1.png";
import AreaImg2 from "../imgs/AreaImg2.png";
import Club from "../imgs/clubb.png";
import Garden from "../imgs/gardenn.png";
import Rupee from "../imgs/RupeeSymbol.png";
import RupeeW from "../imgs/RupeeW.png";
import RupeeB from "../imgs/RupeeB.png";
import Adamen from "../imgs/adamen4.png";

const ViewVisitorDetailsModal = ({ dialogRef, data }) => {
  const { visitorimagedata } = useAppContext();
  const [newData, setNewData] = useState(null);
  const [alldata, setAlldata] = useState({
    image: [],
    plotid: {},
  });

  useEffect(() => {
    const imagedata = visitorimagedata.map((e) => {
      if (e.plotid._id.toString() === data?._id.toString()) {
        setAlldata(e);
      }
    });

    // console.log("imagedata", imagedata,alldata,data);
  }, [data._id]);

  let amountt = alldata?.plotid.Rate * alldata?.plotid.PropertySize;

  let clubby = isNaN(alldata?.plotid.Club) ? 0 : Number(alldata?.plotid.Club);
  let maint = isNaN(alldata?.plotid.Maintainance)
    ? 0
    : Number(alldata?.plotid.Maintainance);
  let electr = isNaN(alldata?.plotid.Electricity)
    ? 0
    : Number(alldata?.plotid.Electricity);
  let carpP = isNaN(
    (alldata?.plotid?.PropertySize / alldata?.plotid?.Electricity) *
    alldata.plotid?.ElectricityRate
  )
    ? 0
    : Number(
      (alldata.plotid?.PropertySize / alldata.plotid?.Electricity) *
      alldata.plotid?.ElectricityRate
    );
  let plcy = isNaN(alldata?.plotid.Plc) ? 0 : Number(alldata?.plotid.Plc);
  let plcAmount = isNaN(alldata?.plotid.PlcAmount)
    ? 0
    : Number(alldata?.plotid.PlcAmount);
  let oth = isNaN(alldata?.plotid.Other) ? 0 : Number(alldata?.plotid.Other);
  let sum = clubby + maint + carpP + plcy + oth + plcAmount;

  // console.log("imagedata2",alldata,data);
  // console.log(alldata?.plotid.Plotnumber);
  return (
    <div>
      {/* { (alldata.image.length !==0) && */}
      <div className="viewDetail-box">
        <dialog ref={dialogRef} className="viewDetail-box-inn">
          {/* <h1>Plot Details</h1> */}

          <div
            className="property-card"
          // style={{
          //   width: '100vw',
          //   display: 'flex',
          //   justifyContent: 'space-evenly',
          //   alignItems: 'center',
          // }}
          >
            {/* <div className="cross-cancel"><span onClick={() => closeDialog(dialogRef)}>close</span></div> */}
            {/* <div className="chadar-bb" > <span onClick={() => closeDialog(dialogRef)}>X</span></div> */}
            <div className="plot-number-display">
              <h2>Plot No. {alldata?.plotid.Plotnumber}</h2>
            </div>
            <div className="gallery">
              {/* {(alldata?.image.length === 0) ? <img className="main-image" src={Adamen} alt="Property" />   : */}
              {/* <img className="main-image" src={`data:image/*;base64,${alldata.image[0]}`} alt="Property" /> */}
              {/* <img className="main-image" src={Adamen} alt="Property" />  */}
              <div className="first-img-cont">
                {alldata.image.length === 0 ? (
                  <img className="main-image" src={Adamen} alt="Property" />
                ) : (
                  <img
                    className="main-image"
                    src={alldata.image[0].imageUrl}
                    alt="Property"
                  />
                )}
              </div>
              {/* } */}
              <div className="thumbnail-container">
                {alldata?.image?.map((val, idx) => {
                  if (idx !== 0) {
                    return (
                      <div className="thumbnail-sub">
                        <img className="thumbnail" src={val.imageUrl} />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <div className="details">
              {/* <div className="detail-item">
      <span className="label"><img className="com-Imgg" src={SizeImg} alt="" />  Size</span>
      <span className="value1">40*60</span>
    </div> */}
              <div className="detail-item">
                <span className="label">
                  <img className="com-Imgg" src={AreaImg1} alt="" /> Area{" "}
                  <span style={{ fontSize: "0.7vw", color: "black" }}>
                    {" "}
                    (sqft.)
                  </span>
                </span>
                <span className="value1">
                  {alldata?.plotid.PropertySize || "PropertySize"}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">
                  <img className="com-Imgg" src={AreaImg2} alt="" /> Rate(Rs)
                </span>
                <span className="value1">
                  {alldata?.plotid.Rate || "AreaPrice"}
                </span>
              </div>
            </div>
            <div className="amounty">
              <span className="label">Basic Amount</span>
              <span className="value">
                <img src={RupeeW} alt="" className="rupee-white" />
                {amountt < 100000
                  ? amountt.toFixed(2)
                  : amountt >= 100000 && amountt < 10000000
                    ? `${(amountt / 100000).toFixed(2)} Lacs`
                    : amountt >= 10000000 &&
                    `${(amountt / 10000000).toFixed(2)}Cr`}
              </span>
            </div>
            <div className="facilities">
              <div className="facility-item1">
                <span className="ot-facilities1">Other Facilities</span>
              </div>
              <div className="facility-item">
                <span>
                  <img className="gden" src={Club} alt="" />
                  Club
                </span>
                <span>
                  <img className="newRupeew" src={RupeeB} alt="" />{" "}
                  {new Intl.NumberFormat().format(alldata?.plotid.Club)}
                </span>
              </div>
              <div className="facility-item">
                <span>
                  <img className="gden" src={Garden} alt="" />
                  Maintenance
                </span>
                <span>
                  <img className="newRupeew" src={RupeeB} alt="" />{" "}
                  {alldata?.plotid.Maintainance}
                </span>
              </div>
              <div className="facility-item">
                <span>
                  <img className="gden" src={Club} alt="" />
                  Electricity{" "}
                  <span style={{ fontSize: "0.7vw", color: "#949494" }}>
                    (sqft/Kw)
                  </span>
                </span>
                <span> {alldata?.plotid.Electricity} units</span>
              </div>
              <div className="facility-item">
                <span>
                  <img className="gden" src={Garden} alt="" />
                  Electricity Bill
                </span>
                <span>
                  <img className="newRupeew" src={RupeeB} alt="" />{" "}
                  {((alldata.plotid?.PropertySize /
                    alldata.plotid?.Electricity) *
                    alldata.plotid?.ElectricityRate).toFixed(3)}
                </span>
              </div>
              <div className="facility-item">
                <span>
                  <img className="gden" src={Garden} alt="" />
                  Plc
                </span>
                {/* <span style={{fontSize:"0.95vw"}}> {alldata?.plotid.Plc}</span> */}
                <span style={{ fontSize: "0.95vw" }}>
                  {" "}
                  {alldata.plotid.Plc?.length === 0
                    ? "None"
                    : alldata?.plotid?.Plc?.join(", ")}
                </span>
              </div>
              <div className="facility-item">
                <span>
                  <img className="gden" src={Garden} alt="" />
                  Plc Amount{" "}
                </span>
                <span>
                  <img className="newRupeew" src={RupeeB} alt="" />{" "}
                  {alldata?.plotid?.PlcAmount}
                </span>
              </div>
              <div className="facility-item">
                <span>
                  <img className="gden" src={Garden} alt="" />
                  Others
                </span>
                <span>
                  <img className="newRupeew" src={RupeeB} alt="" />{" "}
                  {new Intl.NumberFormat().format(alldata?.plotid.Other)}
                </span>
              </div>
            </div>
            <div className="total">
              <span className="label">Total Amount</span>
              <div className="value-cont">
                {/* <span className="value"><img className="rupee" src={Rupee} alt="" /> 2438</span> */}
                <span className="value">
                  <img className="rupee" src={Rupee} alt="" />{" "}
                  {amountt < 100000
                    ? `${(amountt + (isNaN(sum) ? 0 : sum)).toFixed(2)}`
                    : amountt + (isNaN(sum) ? 0 : sum) >= 100000 &&
                      amountt + (isNaN(sum) ? 0 : sum) < 10000000
                      ? `${((amountt + (isNaN(sum) ? 0 : sum)) / 100000).toFixed(
                        3
                      )} Lacs`
                      : amountt + (isNaN(sum) ? 0 : sum) >= 10000000 &&
                      `${((amountt + sum) / 10000000).toFixed(3)} Cr`}
                </span>
              </div>
            </div>
            <div className="btn-cont">
              <button
                className="contact-button"
                onClick={() => closeDialog(dialogRef)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      </div>

      {/* } */}
    </div>
  );
};

export default ViewVisitorDetailsModal;
