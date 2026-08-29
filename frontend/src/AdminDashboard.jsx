import { useState, useEffect } from "react";

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
    <div className="admin-panel" style={{ color: "white", padding: "20px" }}>
      <h1>Commission Dashboard</h1>

      {commissions.length === 0 ? (
        <p>No commissions yet.</p>
      ) : (
        <div
          className="commission-grid"
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            marginTop: "20px",
          }}
        >
          {commissions.map((comm) => (
            <div
              key={comm.id}
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "8px",
                padding: "20px",
                border: "1px solid #333",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              }}
            >
              {/* Header: Name and Status Badge */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#fff" }}>
                  {comm.client_name}
                </h3>
                <span
                  style={{
                    backgroundColor:
                      comm.status === "Pending" ? "#b45309" : "#15803d",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {comm.status}
                </span>
              </div>

              {/* Details */}
              <p
                style={{
                  margin: "0 0 10px 0",
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                }}
              >
                Discord: <span style={{ color: "#cbd5e1" }}>{comm.discord_tag}</span>
              </p>

              <p
                style={{
                  margin: "0 0 15px 0",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#4ade80",
                }}
              >
                ${comm.budget}
              </p>

              {/* Description */}
              <div
                style={{
                  flexGrow: 1,
                  backgroundColor: "#2d2d2d",
                  padding: "12px",
                  borderRadius: "6px",
                  marginBottom: "15px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#e5e7eb",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                  }}
                >
                  {comm.description}
                </p>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => handleDelete(comm.id)}
                style={{
                  padding: "10px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#dc2626")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
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