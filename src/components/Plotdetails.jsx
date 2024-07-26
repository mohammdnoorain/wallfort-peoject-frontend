import React, { useEffect, useState, useRef } from "react";
import "./plotDetails.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { openDialog } from "../../utils/modalUtils.js";
import { useNavigate } from "react-router";
import useAppContext from "../../contextApi/useAppConext.jsx";
import EditDetailsModal from "../../components/EditDetailsModal.jsx";
import CopyDetailsModal from "../../components/CopyDetailsModal.jsx";
import ViewDetailsModal from "../../components/ViewDetailsModal.jsx";
import AddDetailsModal from "../../components/Addplot.jsx";
import jsPDF from "jspdf";
import { debounce } from "lodash";
import Logout from "../../components/Logout.jsx";
import VisitorDetails from "../VisitorDetails.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { IoSearchOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuClipboardCopy } from "react-icons/lu";
import { MdOutlineFileDownload } from "react-icons/md";
function Plotdetails() {
  const storage = window.sessionStorage.getItem("clientdata");

  const dialogRef2 = React.useRef(null);
  const [plotDetails, setplotDetails] = useState({
    _id: "",
    image: [],
    plotid: {},
  });

  const [word, setWord] = useState("");
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  // Initialize subUserData as null
  const navigate = useNavigate();
  const copyDialogRef = React.useRef(null);
  const viewDialogRef = React.useRef(null);
  const editDetailsRef = useRef(null);
  const { clientdata, setClientdata } = useAppContext();

  const [currentPage, setCurrentPage] = useState(1);
  const token = window.sessionStorage.getItem("token");
  console.log("donnn", token);
  const getDetailsByid = (ref, data) => {
    openDialog(ref);
    setplotDetails(data);
  };

  const handleText = (text) => {
    const deb = debounce(() => setWord(text), 1000);
    setSearchText(text);
    deb();
  };

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/searchingapicall/${word}`,
        {
          withCredentials: true, // Corrected option name
          headers: { Authorization: token },
        } // Authorization header
      )
      .then((res) => {
        setplotDetails(res.data.imagedata[0]);

        console.log("jgghgf", res.data.imagedata[0]);

        setClientdata(res.data.imagedata); // Assuming the data is inside a 'data' property
        const stringifyData = JSON.stringify(res.data.imagedata);
        console.log("dataaaaa", stringifyData);
        window.sessionStorage.setItem("clientdata", stringifyData);
      })
      .catch((error) => {
        console.error("Error fetching client details:", error);
      });
  }, [word]);

  useEffect(() => {
    const clientdata1 = window.sessionStorage.getItem("clientdata");

    // console.log("bosss", clientdata1);
    // console.log("bosss", token);

    // if (clientdata1) {
    //   const parseData = JSON.parse(clientdata1);
    //   setClientdata(parseData);
    // } else
    {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/plot-details`,
          {
            withCredentials: true, // Corrected option name
            headers: { Authorization: token },
          } // Authorization header
        )
        .then((res) => {
          setplotDetails(res.data.imagedata[1]);

          console.log("jgghgf", res.data.imagedata[1]);
          // console.log("mamuuuuu", res.data.data);
          // setClientdata(res.data.data);
          setClientdata(res.data.imagedata); // Assuming the data is inside a 'data' property
          const stringifyData = JSON.stringify(res.data.imagedata);
          console.log("kamil", stringifyData);
          window.sessionStorage.setItem("clientdata", stringifyData);
          window.sessionStorage.setItem("location", location.pathname);
        })
        .catch((error) => {
          console.error("Error fetching client details:", error);
        });
    }
  }, [token, location.pathname]); // Include token and location.pathname as dependencies

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
    <div className="app-layout">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="app-dashboard">
        <div className="nav-wrapper">
          <Navbar />
        </div>
        <div className="app-main">
          <div className="dashboard-container">
            <div className="h2">Dashboard</div>
            <div className="search-seciton">
              <div className="db-search">
                <IoSearchOutline />
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchText}
                  onChange={(e) => handleText(e.target.value)}
                />
              </div>
              <AddDetailsModal dialogRef={dialogRef2} />
              <button
                className="add-plot"
                onClick={() => openDialog(dialogRef2)}
              >
                Add Plot
              </button>
            </div>

            <div className="db-data-wrapper">
              <div className="data-heading">
                <p className="plot-number">Plot Number</p>
                <p className="location">Location</p>
                <p className="time">Date - Time</p>
                <p className="status">Status</p>
                <p className="activity">Activity</p>
              </div>
              <div className="db-datas">
                {clientdata?.map(
                  (user) =>
                    user && (
                      <div className="db-data" key={user._id}>
                        <div
                          className="data-number"
                          // style={{
                          //   width: "100vw",
                          //   display: "flex",
                          //   justifyContent: "space-evenly",
                          //   alignItems: "center",
                          // }}
                        >
                          <input type="checkbox" />
                          <p>{user.plotid?.Plotnumber}</p>
                        </div>
                        <div className="data-location">
                          {user.plotid?.Address}
                        </div>
                        <div className="data-time">12.09.2019 - 12.53 PM</div>
                        <div className="data-status">
                          <button
                            style={{
                              backgroundColor:
                                user.plotid?.Availability === "pending"
                                  ? "#FCBE2D"
                                  : user.plotid?.Availability === "sold"
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
                          <div className="a-delete">
                            <RiDeleteBinLine />
                            <span
                              onClick={() =>
                                handleDelete(user.plotid._id, user._id)
                              }
                            >
                              Delete
                            </span>
                          </div>

                          <button
                            onClick={() => getDetailsByid(editDetailsRef, user)}
                          >
                            Update
                          </button>
                          <div className="a-copy">
                            <LuClipboardCopy />
                            <button
                              onClick={() =>
                                getDetailsByid(copyDialogRef, user)
                              }
                            >
                              Copy
                            </button>
                          </div>
                          <button
                            onClick={() => getDetailsByid(viewDialogRef, user)}
                          >
                            view details
                          </button>
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
          />
          <CopyDetailsModal
            dialogRef={copyDialogRef}
            data={plotDetails}
            setClientdata={setClientdata}
          />

          <ViewDetailsModal dialogRef={viewDialogRef} data={plotDetails} />
        </div>{" "}
      </div>
    </div>
  );
}

export default Plotdetails;
