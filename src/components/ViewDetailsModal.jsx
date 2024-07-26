
import React, { useRef, useEffect, useState } from 'react';
import { closeDialog } from '../utils/modalUtils.js';
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

const ViewDetailsModal = ({ dialogRef, data }) => {
  // const [first, setfirst] = useState(false)
let amountt=(data?.plotid.Rate)*data?.plotid.PropertySize;
  
  let clubby=isNaN(data?.plotid.Club) ? 0 : Number(data?.plotid.Club);
  let maint=isNaN(data?.plotid.Maintainance) ? 0 : Number(data?.plotid.Maintainance);
  let electr=isNaN(data?.plotid.Electricity) ? 0 : Number(data?.plotid.Electricity);
  let carpP=isNaN(((data.plotid.PropertySize / data.plotid.Electricity) * data.plotid?.ElectricityRate)) ? 0 : Number(((data.plotid.PropertySize / data.plotid.Electricity) * data.plotid?.ElectricityRate));
  let plcy=isNaN(data?.plotid.Plc) ? 0 : Number(data?.plotid.Plc);
  let plcAmount=isNaN(data?.plotid.PlcAmount) ? 0 : Number(data?.plotid.PlcAmount);
  let oth=isNaN(data?.plotid.Other) ? 0 : Number(data?.plotid.Other);
  let sum=clubby + maint + carpP + plcy + oth + plcAmount;

  // console.log(data,sum,data.plotid.Plc,"kjgigijbjbkjb");

  return (
    <div className='viewDetail-box' >
    <dialog ref={dialogRef} className='viewDetail-box-inn'>
      {/* <h1>Plot Details</h1> */}
    
                        <div
                       className='property-card'
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
              <h2>Plot No. {data?.plotid.Plotnumber}</h2>
            </div>
                   <div className="gallery">
                   <div className="first-img-cont">
    {(data.image.length === 0) ? <img className="main-image" src={Adamen} alt="Property" />   :<img className="main-image" src={data.image[0].imageUrl} alt="Property" />}</div>
    <div className="thumbnail-container">
      {data?.image?.map((val,idx)=>{
        if(idx !==0){
         return(
          <div className="thumbnail-sub">
         <img className='thumbnail' src={val.imageUrl} />
         </div>)
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
      <span className="label"><img className="com-Imgg" src={AreaImg1} alt="" /> Area  <span style={{fontSize:"0.7vw",color:"black"}}> (sqft.)</span></span>
      <span className="value1">{data?.plotid.PropertySize || "PropertySize"}</span>
    </div>
    <div className="detail-item">
      <span className="label"><img className="com-Imgg" src={AreaImg2} alt="" /> Rate <span style={{fontSize:"0.7vw",color:"black"}}/> (Rs) </span>
      <span className="value1">{data?.plotid.Rate || "Rate"}</span>
    </div>
  </div>  
  <div className="amounty">
      <span className="label" >Basic Amount</span>
      <span className="value"><img src={RupeeW} alt="" className='rupee-white'/>{amountt < 100000 ? amountt.toFixed(2) : (amountt >=100000 && amountt < 10000000) ?  `${(amountt/100000).toFixed(2)} Lacs` : amountt >=10000000 && `${(amountt/10000000).toFixed(2)}Cr`}</span>
  </div>
  <div className="facilities">
  <div className="facility-item1">
      <span className="ot-facilities1">Other Facilities</span>
    </div>

     <div className="facility-item">
      <span><img className="gden" src={Club} alt=""/>Club</span>
      <span><img className='newRupeew' src={RupeeB} alt="" /> {(data?.plotid.Club === undefined || data?.plotid.Club === "") ? 0 : (new Intl.NumberFormat().format(data?.plotid.Club))}</span>
    </div>
    <div className="facility-item">
      <span><img className="gden" src={Garden} alt="" />Maintenance</span>
      <span><img className='newRupeew' src={RupeeB} alt="" /> {(data?.plotid.Maintainance === undefined || data?.plotid.Maintainance === "") ? 0 : 
      (data?.plotid.Maintainance)}</span>
    </div>
    <div className="facility-item">
      <span><img className="gden" src={Club} alt="" />Electricity <span style={{fontSize:"0.7vw",color:"#949494"}}>(sqft/Kw)</span></span>
      <span> {data?.plotid.Electricity} </span>
    </div>
    <div className="facility-item">
      <span><img className="gden" src={Garden} alt="" />Electricity Bill</span>
      <span><img className='newRupeew' src={RupeeB} alt="" /> {((data.plotid.PropertySize / data.plotid.Electricity) * data.plotid?.ElectricityRate).toFixed(3)}</span>
    </div>
    <div className="facility-item">
      <span><img className="gden" src={Garden} alt="" />Plc </span>
      <span style={{fontSize:"0.95vw"}}> {data.plotid.Plc?.length === 0 ? "None":data?.plotid.Plc?.join(", ")}</span>
    </div>
    <div className="facility-item">
      <span><img className="gden" src={Garden} alt="" />Plc Amount </span>
      <span><img className='newRupeew' src={RupeeB} alt="" /> {data?.plotid?.PlcAmount}</span>
    </div>
    <div className="facility-item">
      <span><img className="gden" src={Garden} alt="" />Others</span>
      <span><img className='newRupeew' src={RupeeB} alt="" /> {(new Intl.NumberFormat().format(data?.plotid.Other))}</span>
    </div>
  
   
    
    
  </div>
  <div className="total">
    <span className="label">Total Amount</span>
    <div className="value-cont">
    {/* <span className="value"><img className="rupee" src={Rupee} alt="" /> {((data?.plotid.Rate*data?.plotid.PropertySize)/1000)+sum}</span> */}
    <span className="value"><img className="rupee" src={Rupee} alt="" /> {(amountt < 100000) ? `${(amountt + (isNaN(sum) ? 0 : sum)).toFixed(2)}` : ((amountt + (isNaN(sum) ? 0 : sum)) >=100000 && (amountt + (isNaN(sum) ? 0 : sum)) < 10000000) ? `${((amountt + (isNaN(sum) ? 0 : sum))/100000).toFixed(3)} Lacs` : (amountt + (isNaN(sum) ? 0 : sum) >=10000000) && `${((amountt +  sum)/10000000).toFixed(3)} Cr`}</span>
    </div>
  </div>
  <div className="btn-cont">
  <button className="contact-button"  onClick={() => closeDialog(dialogRef)}>Close</button>
  </div>
                 
        </div>
                
                   
      {/* <button className="view-cloose-btn" onClick={() => closeDialog(dialogRef)}>x</button> */}
    </dialog>
  </div>
  );
};

export default ViewDetailsModal;

