import { useState, useEffect } from "react";
import "./AdminDashboard.css"; // Link the new CSS file

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

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Commission Dashboard</h1>

      {commissions.length === 0 ? (
        <p className="empty-state">No commissions yet.</p>
      ) : (
        <div className="commission-grid">
          {commissions.map((comm) => (
            <div key={comm.id} className="commission-card">
              
              <div className="card-header">
                <h3 className="client-name">{comm.client_name}</h3>
                <span 
                  className={`status-badge ${comm.status === "Pending" ? "status-pending" : "status-active"}`}
                >
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

              <button
                onClick={() => handleDelete(comm.id)}
                className="delete-btn"
              >
                Delete Commission
              </button>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}