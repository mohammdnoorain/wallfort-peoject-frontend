import React, { useEffect, useState, useRef } from "react";
import "./plotDetails.scss";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { openDialog } from "../../utils/modalUtils.js";
import { useNavigate } from "react-router";
import useAppContext from "../../contextApi/useAppConext.jsx";
import EditDetailsModal from "../../components/EditDetailsModal.jsx";
import CopyDetailsModal from "../../components/CopyDetailsModal.jsx";
import ViewDetailsModal from "../../components/ViewDetailsModal.jsx";
import AddDetailsModal from "../../components/Addplot.jsx";
import jsPDF from "jspdf";
import VisitorDetails from "../VistorDetails/VisitorDetails.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";

import { FcViewDetails } from "react-icons/fc";
import Pagination from "../../components/Paginate/pagination.jsx";
import { parseInt } from "lodash";
function Plotdetails() {
  const storage = window.sessionStorage.getItem("clientdata");
  // console.log("hghjghjjhgh", storage);

  const location = useLocation();

  const dialogRef2 = React.useRef(null);
  const [plotDetails, setplotDetails] = useState({
    _id: "",
    image: [],
    plotid: {},
  });
  const [totalpage, settotalpage] = useState(0);
  const [word, setWord] = useState("");
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [flag, setFlag] = useState(false);
  // Initialize subUserData as null
  const navigate = useNavigate();
  const copyDialogRef = React.useRef(null);
  const viewDialogRef = React.useRef(null);
  const editDetailsRef = useRef(null);
  const { clientdata, setClientdata } = useAppContext();
  // const [addDetails, setAddDetails] = React.useState({});
  // const [currentPage, setCurrentPage] = useState(1);
  const token = window.sessionStorage.getItem("token");
  // console.log("donnn", token);
  const [newpage, setNewpage] = useState(1);
  const [inpVal, setInpVal] = useState(null);
  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(6);
  const [debounce, setdebounce] = useState("");
  const [logoutState, setLogoutState] = useState(false);
  // const [logoutState,setLogoutState]=useState(true);
  const getDetailsByid = (ref, data) => {
    openDialog(ref);
    setplotDetails(data);
  };

  // const handleText = (text) => {
  //   const deb = debounce(() => setWord(text), 5000);
  //   setSearchText(text);
  //   deb();
  //
  //
  // };
  //
  // console.log(plotDetails._id)
  const handleText = (text) => {
    setdebounce(text);
  };
  useEffect(() => {
    const t = setTimeout(() => {
      setNewpage(1);
      setWord(debounce);
    }, 3000);

    return () => {
      clearTimeout(t);
    };
  }, [debounce]);

  useEffect(() => {
    if (word.length !== 0) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL
          }/searchingapicall/${word}?page=${newpage}`,
          {
            withCredentials: true, // Corrected option name
            headers: { Authorization: token },
          } // Authorization header
        )
        .then((res) => {
          // setplotDetails(res.data.imagedata);

          settotalpage(() => res.data.count);
          // console.log("count-sahil", res.data.count);
          // console.log("uiuiui", res.data.imagedata);
          setClientdata(res.data.imagedata); // Assuming the data is inside a 'data' property
          // const stringifyData = JSON.stringify(res.data.imagedata);
          // console.log("dataaaaa", stringifyData);
          // window.sessionStorage.setItem("clientdata", stringifyData);
        })
        .catch((error) => {
          console.error("Error fetching client details:", error);
        });
    }
  }, [word, newpage]);

  useEffect(() => {
    if (word.length === 0) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/plot-details?page=${newpage}`,
          {
            withCredentials: true, // Corrected option name
            headers: { Authorization: token },
          } // Authorization header
        )
        .then((res) => {
          setClientdata(res.data.imagedata);
          settotalpage(res.data.count);
          // console.log("count", res.data.count);
        })
        .catch((error) => {
          console.error("Error fetching client details:", error);
        });
    }
  }, [token, newpage, word]); // Include token and location.pathname as dependencies

  const handleDelete = (id, l) => {
    if (token) {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/plot-delete/${id}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          const updatedClientData = clientdata.filter((user) => user._id !== l);
          setClientdata(updatedClientData);
          // Update sessionStorage
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

    doc.text(`Plotnumber: ${data.plotid.Plotnumber}`, 10, 10);
    doc.text(`Rate(per sq.feet): ${data.plotid.Rate}`, 10, 20);
    doc.text(
      `BasicAmount(Rs): ${data.plotid.PropertySize * data.plotid.Rate}`,
      10,
      30
    );
    doc.text(`Registery:At Actual`, 10, 40);
    // doc.text(Registery: ${new Date(data.plotid.Registery).toLocaleDateString()}, 10, 40); // Assuming Registery is a Date
    doc.text(`Address: Raipur`, 10, 50);
    doc.text(`PropertySize(sq.feet): ${data.plotid.PropertySize}`, 10, 60);
    doc.text(`Availability: ${data.plotid.Availability}`, 10, 70);
    doc.text(`Club(Rs): ${data.plotid.Club}`, 10, 80);
    doc.text(`Maintenance(Rs): ${data.plotid.Maintainance}`, 10, 90);
    doc.text(`Electricity(Kw): ${data.plotid.Electricity}`, 10, 100);
    doc.text(
      `Electricity Bill(Rs): ${data.plotid.Electricity * data.plotid.PropertySize
      }`,
      10,
      110
    );


    const plcValue = (Array.isArray(data.plotid?.Plc) && data.plotid.Plc.length > 0) ? data.plotid.Plc.join(', ') : "None";
    doc.text(`Plc: ${plcValue}`, 10, 120);


    doc.text(`PlcAmount(Rs): ${data.plotid.PlcAmount}`, 10, 130);
    doc.text(`Other(Legal): ${data.plotid.Other}`, 10, 140);
    doc.text(`Gst(%): Excluded`, 10, 150);

    doc.save(`plot_details_${data.plotid.plotnumber}.pdf`);
  };

  const handleInpSearch = (e) => {
    setTimeout(() => {
      setInpVal(e.target.value);
    }, 500);
  };

  const handleGo = () => {
    let num = parseInt(inpVal);
    setNewpage(num);
  };

  function handleLogout() {
    setLogoutState(true);
  }
  // function handleUnLogout(){
  //   setLogoutState(false);
  // }

  // console.log(clientdata, "Helloe client datttta");
  return (
    <div className="app-layout">
      <div className="sidebar-wrapper">
        <Sidebar handleLogout={handleLogout} />
      </div>
      <div className="app-dashboard">
        <div
          className="logout-page"
          style={{
            zIndex: logoutState ? "5" : "0",
            display: logoutState ? "" : "none",
          }}
        >
          <div className="logout-inner-page">
            <h1>Logout</h1>
            <h2>Are you sure you want to logout?</h2>
            <div className="logout-btns">
              <button
                onClick={() => {
                  window.sessionStorage.removeItem("token");
                  window.sessionStorage.removeItem("clientdata");
                  navigate("/login");
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setLogoutState(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div className="nav-wrapper">
          <Navbar />
        </div>
        {location.pathname === "/plot-details" ? (
          <div className="app-main">
            {/* <div className="logout-page" style={{zIndex: logoutState ? "5" : "0",display:logoutState ? '': 'none'}}>
  <div className="logout-inner-page">
    <h1>Logout</h1>
    <h2>Are you sure you want to logout?</h2>
    <div className="logout-btns">
      <button>Confirm</button>
      <button>Cancel</button>
    </div>
  </div>
</div> */}
            <div className="dashboard-container">
              <div className="h2">Dashboard</div>
              <div className="search-seciton">
                <div className="db-search">
                  <IoSearchOutline />
                  <input
                    type="text"
                    placeholder="Search by plot number.."
                    value={debounce}
                    onChange={(e) => handleText(e.target.value)}
                  />
                </div>
                <AddDetailsModal dialogRef={dialogRef2} flag={flag} />
                <button
                  className="add-plot"
                  onClick={() => {
                    openDialog(dialogRef2);
                    setFlag(!flag);
                  }}
                >
                  Add Plot
                </button>
              </div>

              {/* {clientdata.length !== 1 ? ( */}
              <div className="db-data-wrapper">
                <div className="data-heading">
                  <p className="plot-number">Plot No.</p>
                  <p className="location">Location</p>
                  <p className="time">Date</p>
                  <p className="status">Status</p>
                  <p className="activity">Activity</p>
                </div>
                <div className="db-datas">
                  <div className="db-datas-inner">
                    {clientdata?.map(
                      (user) =>
                        user && (
                          <div className="db-data" key={user._id}>
                            <div className="data-number">
                              {/* <input type="checkbox" /> */}
                              <p>{user.plotid?.Plotnumber}</p>
                            </div>
                            <div className="data-location">Raipur</div>
                            <div className="data-time">
                              {user.plotid?.updatedAt?.slice(0, 10)}
                            </div>
                            <div className="data-status">
                              <button
                                style={{
                                  backgroundColor:
                                    user.plotid?.Availability === "Not for Sale"
                                      ? "#FCBE2D"
                                      : user.plotid?.Availability === "Mortgage"
                                        ? "blue"
                                        : user.plotid?.Availability === "Sold"
                                          ? "#FD5454"
                                          : "",
                                }}
                              >
                                {/* {item.availability} */}
                                {user.plotid?.Availability}
                              </button>
                            </div>
                            {/* <p>Area:<br/> {user.plotid?.Area}</p> */}
                            {/* <p>AreaSize:<br/> {user.plotid?.AreaSize}</p> */}
                            {/* <p>AreaPrice:<br/> {user.plotid?.AreaPrice}</p> */}
                            {/* <p>Availability:<br/> {user.plotid?.Availability}</p> */}
                            <div className="data-activity">
                              {/* <div className="a-delete">
                              <RiDeleteBinLine />
                              <span
                                onClick={() =>
                                  handleDelete(user.plotid._id, user._id)
                                }
                              >
                                Delete
                              </span>
                            </div>  */}
                              <div className="a-update">
                                <GrDocumentUpdate />
                                <span
                                  onClick={() =>
                                    getDetailsByid(editDetailsRef, user)
                                  }
                                >
                                  Update
                                </span>
                              </div>

                              {/* <div className="a-copy">
                <LuClipboardCopy />
                <span
                  onClick={() =>
                    getDetailsByid(copyDialogRef, user)
                  }
                >
                  Copy
                </span>
              </div> */}
                              <div className="a-view">
                                <FcViewDetails />
                                <span
                                  onClick={() =>
                                    getDetailsByid(viewDialogRef, user)
                                  }
                                >
                                  View
                                </span>
                              </div>
                              <div className="a-download">
                                <MdOutlineFileDownload />
                                <span onClick={() => handleDownload(user)}>
                                  Download
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
              {/* ) : (
                <SimmerEffect/>
              )} */}
            </div>

            <div className="paginateDiv">
              {totalpage > 0 ? (
                <>
                  <Pagination
                    currentPage={newpage}
                    setCurrentPage={setNewpage}
                    totalPage={totalpage}
                  />
                  <div className="inpDiv">
                    <input type="number" onChange={handleInpSearch} min={0} />
                    <button onClick={handleGo}>Go</button>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {/* <div>
            <AddDetailsModal dialogRef={dialogRef2} />
            <Logout />
            <Link to="/visitor-details" className="nav-link">
              Visitor Details
            </Link>
          </div> */}
            <EditDetailsModal
              dialogRef={editDetailsRef}
              data={plotDetails}
              setClientdata={setClientdata}
              clientdata={clientdata}
            />
            <CopyDetailsModal
              dialogRef={copyDialogRef}
              data={plotDetails}
              setClientdata={setClientdata}
            />

            <ViewDetailsModal dialogRef={viewDialogRef} data={plotDetails} />
          </div>
        ) : location.pathname === "/visitor-details" ? (
          <div className="visitor-details">
            <VisitorDetails />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Plotdetails;
