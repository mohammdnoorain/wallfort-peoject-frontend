import React, { useEffect, useState, useRef } from "react";
import "./visitorDetails.scss";
import { IoIosArrowDown } from "react-icons/io";

import axios from "axios";
import { openDialog } from "../../utils/modalUtils.js";
// import { useNavigate } from "react-router";
import useAppContext from "../../contextApi/useAppConext.jsx";
import { RxCross2 } from "react-icons/rx";

import ViewVisitorDetailsModal from "../../components/ViewVisitorDetailsModal.jsx";

// import Logout from "../../components/Logout.jsx";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import Pagination from "../../components/Paginate/pagination.jsx";
// import SimmerEffect from "../../helper/SimmerEffect.jsx";
function VisitorDetails() {
  // const dialogRef2 = React.useRef(null);
  const [userQuery, setUserQuery] = useState([]);
  const [queryToggle, setQueryToggle] = useState(false);
  const [isViewDisable, setIsViewDisable] = useState(false);

  const [word, setWord] = useState("");
  // const [searchText, setSearchText] = useState("");
  const [visitorplotdata, setvisitorplotdata] = useState({
    _id: "",
  });
  const [debounce, setdebounce] = useState("");
  // Initialize subUserData as null
  // const navigate = useNavigate();
  const viewDialogRef = React.useRef(null);
  // const editDetailsRef = useRef(null);

  const { visitordata, setVisitordata, setvisitorimagedata } = useAppContext();

  // const [currentPage, setCurrentPage] = useState(1);

  const [newpage, setNewpage] = useState(1);
  const [totalpage, settotalpage] = useState(0);
  const [inpVal, setInpVal] = useState(null);
  // const [visitorstatus, setvisitorstatus] = useState();
  const token = window.sessionStorage.getItem("token");
  // console.log("donnn", token);
  const getDetailsByid = (ref, data) => {
    openDialog(ref);
    setvisitorplotdata(data);
    // console.log("llllll", visitorplotdata)?.Plotnumber;
  };

  // const handleText = (text) => {
  //   const deb = debounce(() => setWord(text), 1000);
  //   setSearchText(text);
  //   deb();
  // };
  //
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
          }/searchingvisitorapicall/${word}?page=${newpage}`,
          {
            withCredentials: true, // Corrected option name
            headers: { Authorization: token },
          } // Authorization header
        )
        .then((res) => {
          // console.log("jgghgf", res.data.data);

          settotalpage(res.data.count);
          setVisitordata(res.data.data); // Assuming the data is inside a 'data' property
          // const stringifyData = JSON.stringify(res.data.data);
          // console.log("dataaaaa", res.data.count);
          // window.sessionStorage.setItem("visitordata", stringifyData);
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
          `${import.meta.env.VITE_API_URL}/visitor-details?page=${newpage}`,
          {
            withCredentials: true, // Corrected option name
            headers: { Authorization: token },
          } // Authorization header
        )
        .then((res) => {
          // setvisitorplotdata(res.data.data[0])

          // console.log("jgghgf", res.data.data);
          // console.log("mamuuuuu", res.data.data);
          // setClientdata(res.data.data);
          setvisitorimagedata(res.data.images);
          setVisitordata(res.data.data); // Assuming the data is inside a 'data' property
          // handleViewDetailButton();

          settotalpage(res.data.count);
          const stringifyData = JSON.stringify(res.data.data);

          window.sessionStorage.setItem("visitordata", stringifyData);
        })
        .catch((error) => {
          console.error("Error fetching client details:", error);
        });
    }
  }, [token, newpage, word]); // Include token and location.pathname as dependencies

  // console.log("khushiii", visitordata);

  const handleDelete = (id, l) => {
    if (token) {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/visitor-delete/${id}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          const updatedClientData = visitordata.filter(
            (user) => user._id !== id
          );

          setVisitordata(updatedClientData);
          // Update sessionStorage
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
  const handleStatuschange = (id, index) => {
    if (token && visitordata[index].visitorstatus == false) {
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/visitor-statuschange/${id}`,
          {},
          {
            headers: { Authorization: token },
          }
        )
        .then((res) => {
          // console.log("status", visitordata);
          // console.log("23", res.data.viewstatus.visitorstatus);
          const updatedClientData = visitordata.map((user) => {
            if (user._id === id) {
              user.visitorstatus = res.data.viewstatus.visitorstatus;
            }

            return user;
          });
          setVisitordata(updatedClientData);
          // console.log("1", updatedClientData);
          // Update sessionStorage
          window.sessionStorage.setItem(
            "visitordata",
            JSON.stringify(updatedClientData)
          );
          // console.log("1",visitordata)
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };
  useEffect(() => {
    // console.log("Updated visitordata:", visitordata);
  }, [visitordata]);

  // console.log(visitordata, "HHHHHHHHHHHHHHHHHHHHhhh")

  //

  const handleMessage = (e) => {
    // console.log(e);
    const data = visitordata.filter((item) => {
      return item._id === e;
    });

    setUserQuery(data);
    setQueryToggle(!queryToggle);
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

  return (
    <div className="message-container">
      <ViewVisitorDetailsModal
        dialogRef={viewDialogRef}
        data={visitorplotdata}
      />

      <div
        className="userQuery"
        style={{
          display: queryToggle && "block",
        }}
      >
        {userQuery.map((item) => {
          return (
            <div className="userData">
              <div
                className="closeQuery"
                onClick={() => setQueryToggle(!queryToggle)}
              >
                <RxCross2 />
              </div>
              <div className="userName">
                <p className="title">Name</p>
                <p className="title-fields">{item.name}</p>
              </div>
              <div className="userPhone">
                <p className="title">Phone Number</p>
                <p className="title-fields">{item.phone}</p>
              </div>
              <div className="userEmail">
                <p className="title">Email</p>
                <p className="title-fields">{item.email}</p>
              </div>
              <div className="userQueryy">
                <p className="title">Message</p>
                <p className="title-fields">{item.query}</p>
              </div>
            </div>
          );
        })}
      </div>
      <h2 className="h2">Query</h2>

      <div className="message-section">
        <div className="m-search">
          <IoSearchOutline />
          <input
            type="text"
            placeholder="Search by name"
            value={debounce}
            onChange={(e) => handleText(e.target.value)}
          />
        </div>
      </div>

      {/* {visitordata.length !== 1 ? ( */}
      <div className="message-data-wrapper">
        <div className="message-heading">
          <p className="sender-name">Name</p>
          <p className="sender-email">Email</p>
          <p className="sender-phone">Phone Number</p>
          <p className="sender-message">Messages</p>
          <p className="sender-status">Property Status</p>
          <p className="sender-activity">Activity</p>
        </div>
        <div className="message-datas">
          <div className="message-datas-inner">
            {visitordata?.map(
              (user, index) =>
                user && (
                  <div className="message-data" key={user._id}>
                    <div
                      className="data-name"
                      style={{
                        fontWeight: user.visitorstatus && "500",
                      }}
                    >
                      {user.name}
                    </div>
                    <div
                      className="data-email"
                      style={{
                        fontWeight: user.visitorstatus && "500",
                      }}
                    >
                      {user.email}
                    </div>
                    <div
                      className="data-phone"
                      style={{
                        fontWeight: user.visitorstatus && "500",
                      }}
                    >
                      {user.phone}
                    </div>
                    <div
                      className="data-message"
                      style={{
                        fontWeight: user.visitorstatus && "500",
                      }}
                    >
                      <span> {user.query} </span>
                      <IoIosArrowDown onClick={() => {
                        handleMessage(user._id);
                        handleStatuschange(user._id, index);
                      }} />
                    </div>

                    <div
                      className="data-status"
                      style={{
                        fontWeight: user.visitorstatus && "500",
                      }}
                    >
                      <button
                        className={
                          user.querytype ? "view-Disabled-Availability" : ""
                        }
                        style={{
                          backgroundColor:
                            user.plotid?.Availability === "Not for Sale"
                              ? "#FCBE2D"
                              : user.plotid?.Availability === "Mortgage"
                                ? "blue" : user.plotid?.Availability === "Sold"
                                  ? "#FD5454"
                                  : "",
                        }}
                      >
                        {user.querytype ? "N/A " : user.plotid?.Availability}
                      </button>
                    </div>
                    <div
                      className="message-activity"
                      style={{
                        fontWeight: user.visitorstatus && "500",
                      }}
                    >
                      <div className="a-view">
                        <MdOutlineRemoveRedEye />
                        <span
                          className={user.querytype ? "view-Disabled" : ""}
                          onClick={() => {
                            // handleStatuschange(user._id,index);
                            getDetailsByid(viewDialogRef, user.plotid);
                          }}
                        >
                          {/* {console.log("sahill",user.querytype)} */}
                          View Details
                        </span>
                      </div>
                      <div className="a-delete">
                        <RiDeleteBinLine />
                        <span onClick={() => handleDelete(user._id)}>
                          Delete
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
        <SimmerEffect />
      )} */}
      <div className="pagination-query">
        {totalpage > 0 ? (
          <Pagination
            currentPage={newpage}
            setCurrentPage={setNewpage}
            totalPage={totalpage}
          />
        ) : (
          ""
        )}
      </div>
      {/* <div className="paginate-query">
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
            </div> */}

      {/* <EditDetailsModal dialogRef={editDetailsRef} setClientdata={setClientdata} /> */}

      {/* {plotDetails.plotid?<ViewDetailsModal dialogRef={viewDialogRef} data={plotDetails} />:<p>loading</p>} */}
    </div>
  );
}

export default VisitorDetails;
