import { useState, useEffect } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/commissions");
        if (response.ok) {
          const data = await response.json();
          setCommissions(data);
        }
      } catch (error) {
        console.error("Failed to fetch commissions:", error);
      }
    };

    fetchCommissions();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/commissions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCommissions(commissions.filter((comm) => comm.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete commission:", error);
    }
  };

  // 1. New function to handle the PATCH request
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/commissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state to reflect the change immediately
        setCommissions(
          commissions.map((comm) =>
            comm.id === id ? { ...comm, status: newStatus } : comm
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Helper function to assign dynamic classes based on status
  const getStatusClass = (status) => {
    if (status === "Pending") return "status-pending";
    if (status === "In Progress") return "status-progress";
    if (status === "Completed") return "status-completed";
    return "status-active"; 
  };

  // 1. Figures out the next status in the cycle
  const getNextStatus = (currentStatus) => {
    if (currentStatus === "Pending") return "In Progress";
    if (currentStatus === "In Progress") return "Completed";
    if (currentStatus === "Completed") return "Pending";
    return "Pending"; // Fallback
  };

  // 2. Changes the text on the button so you know what clicking it will do
  const getButtonText = (currentStatus) => {
    if (currentStatus === "Pending") return "Start Work";
    if (currentStatus === "In Progress") return "Mark Completed";
    if (currentStatus === "Completed") return "Reset to Pending";
    return "Update"; 
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Commission Dashboard</h1>

      <div className="stars-layer">
        <div className="star" style={{ top: '15%', left: '20%', width: '3px', height: '3px', animationDuration: '2s' }}></div>
        <div className="star" style={{ top: '65%', left: '10%', width: '2px', height: '2px', animationDuration: '3.5s' }}></div>
        <div className="star" style={{ top: '25%', left: '80%', width: '4px', height: '4px', animationDuration: '2.8s' }}></div>
        <div className="star" style={{ top: '80%', left: '75%', width: '3px', height: '3px', animationDuration: '4s' }}></div>
        <div className="star" style={{ top: '10%', left: '60%', width: '2px', height: '2px', animationDuration: '3s' }}></div>
        <div className="star" style={{ top: '50%', left: '90%', width: '3px', height: '3px', animationDuration: '2.2s' }}></div>
        <div className="star" style={{ top: '40%', left: '30%', width: '3px', height: '3px', animationDuration: '2.5s' }}></div>
      </div>

      {commissions.length === 0 ? (
        <p className="empty-state">No commissions yet.</p>
      ) : (
        <div className="commission-grid">
          {commissions.map((comm) => (
            <div key={comm.id} className="commission-card">
              
              <div className="card-header">
                <h3 className="client-name">{comm.client_name}</h3>
                {/* 2. Dynamic class for the badge */}
                <span className={`status-badge ${getStatusClass(comm.status)}`}>
                  {comm.status}
                </span>
              </div>

              <p className="discord-info">
                Discord: <span className="discord-tag">{comm.discord_tag}</span>
              </p>

              <p className="budget-info">${comm.budget}</p>

              <div className="description-box">
                <p className="description-text">{comm.description}</p>
              </div>

              {/* 3. Button layout for status updates and deletion */}
              <div className="card-actions">
                {/* One button to rule them all */}
                <button
                  onClick={() => handleStatusUpdate(comm.id, getNextStatus(comm.status))}
                  className="update-btn"
                >
                  {getButtonText(comm.status)}
                </button>

                <button
                  onClick={() => handleDelete(comm.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}