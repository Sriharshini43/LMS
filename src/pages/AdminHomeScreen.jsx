import { useNavigate } from "react-router-dom";
import { AiOutlineBook } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminHomeScreen() {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/borrow/requests")
      .then((response) => {
        const allRequests = response.data.borrowRequests;
        console.log("All Borrow Requests:", allRequests);

        const borrowReqs = allRequests.filter(req => req.status === "pending");
        const returnReqs = allRequests.filter(req => req.status === "return_requested");

        const updatedBorrowReqs = borrowReqs.map(borrowReq => {
          const matchingReturnReq = returnReqs.find(returnReq =>
            returnReq.book_name === borrowReq.book_name && returnReq.user_name === borrowReq.user_name
          );
          if (matchingReturnReq && matchingReturnReq.status === "return_requested") {
            return { ...borrowReq, status: "Borrowed" };
          }
          return borrowReq;
        });

        const uniqueBorrowReqs = updatedBorrowReqs.filter((req, index, self) =>
          index === self.findIndex(t =>
            t.book_name === req.book_name && t.user_name === req.user_name
          )
        );

        setBorrowRequests(uniqueBorrowReqs);
        setReturnRequests(returnReqs);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
      });
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");
    navigate("/login");
  };

  const navigateToBooks = () => navigate("/bookscrud");
  const navigateToUsers = () => navigate("/users");

  const handleApprove = (id, type) => {
    const endpoint = type === "borrow" ? `approve` : `return-approve`;
    axios.put(`http://localhost:3000/api/borrow/${endpoint}/${id}`)
      .then(() => {
        if (type === "borrow") {
          setBorrowRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status: "Borrowed" } : req
          ));

          setTimeout(() => {
            setBorrowRequests(prev => prev.filter(req => req.id !== id));
          }, 800);
        } else {
          setReturnRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status: "Return Approved" } : req
          ));

          setTimeout(() => {
            setReturnRequests(prev => prev.filter(req => req.id !== id));
          }, 500);
        }
      })
      .catch((error) => {
        console.error(`Error approving ${type} request:`, error);
      });
  };

  const hasPendingBorrow = borrowRequests.some(req => req.status === "pending");
  const hasPendingReturn = returnRequests.some(req => req.status === "return_requested");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{
        width: "80px",
        backgroundColor: "#333",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "20px",
        height: "100vh"
      }}>
        <AiOutlineBook
          size={32}
          color="white"
          style={{ marginBottom: "20px", cursor: "pointer" }}
          onClick={navigateToBooks}
        />
        <FaUsers
          size={32}
          color="white"
          style={{ marginBottom: "20px", cursor: "pointer" }}
          onClick={navigateToUsers}
        />
      </div>

      <div style={{
    flex: 1,
    textAlign: "center",
    padding: "10px",
    height: "100vh", /* Matches sidebar height */
    backgroundImage: "url('/pic1.jpg')",
    backgroundSize: "cover", /* Ensures image covers the entire div */
    backgroundPosition: "cover", /* Centers the image */
    backgroundRepeat: "no-repeat" /* Prevents image from repeating */
  }}>
        <h2 style={{ color:'#DAA520'}}>Welcome, Admin</h2>

        <h2 style={{ color:'#DAA520'}}>Borrow Requests</h2>
        <div className="table-container">
          <table className="borrow-requests-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>User</th>
                <th>Book</th>
                <th>Status</th>
                {hasPendingBorrow && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {borrowRequests.length > 0 ? (
                borrowRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.user_name}</td>
                    <td>{req.book_name}</td>
                    <td>{req.status === "pending" 
    ? "Pending" :req.status}</td>
                    {hasPendingBorrow && req.status !== "Borrowed" ? (
                      <td>
                        {req.status === "pending" && (
                          <button onClick={() => handleApprove(req.id, "borrow")}>Approve</button>
                        )}
                      </td>
                    ) : hasPendingBorrow && <td></td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={hasPendingBorrow ? "5" : "4"} className="no-data">No borrow requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 style={{ color:'#000080'}}>Return Requests</h2>
        <div className="table-container">
          <table className="borrow-requests-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>User</th>
                <th>Book</th>
                <th>Status</th>
                {hasPendingReturn && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {returnRequests.length > 0 ? (
                returnRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.user_name}</td>
                    <td>{req.book_name}</td>
                    <td>{req.status === "return_requested" 
    ? "Return Requested" :req.status}</td>
                    {hasPendingReturn && req.status === "return_requested" ? (
                      <td>
                        <button onClick={() => handleApprove(req.id, "return")}>Approve</button>
                      </td>
                    ) : hasPendingReturn && <td></td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={hasPendingReturn ? "5" : "4"} className="no-data">No return requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>
        {`
          .table-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }
          .borrow-requests-table {
            width: 80%;
            border-collapse: collapse;
            background-color: #fff;
          }
          .borrow-requests-table th, .borrow-requests-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .borrow-requests-table th {
            background-color: #3CB371;
            color: white;
          }
          .borrow-requests-table tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .borrow-requests-table tr:hover {
            background-color: #ddd;
          }
          .no-data {
            text-align: center;
            color: red;
          } 
          button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 5px;
          }
          button:hover {
            background-color: #45a049;
          }
        `}
      </style>
    </div>
  );
}

export default AdminHomeScreen;
