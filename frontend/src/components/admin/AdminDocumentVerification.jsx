import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDocumentVerification.css";
import "./AdminDashboard.css";

const AdminDocumentVerification = () => {
  const [documents, setDocuments] = useState([]);

  // Fetch all documents
  const fetchDocuments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/documents/admin/all"
      );
      setDocuments(res.data);
    } catch (err) {
      console.error("Error fetching documents", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Approve document
  const approve = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/documents/admin/${id}/approve`
      );
      fetchDocuments();
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  // Reject document
  const reject = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/documents/admin/${id}/reject`
      );
      fetchDocuments();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  return (
    <div className="ad-content">
      <h2>Document Verification</h2>

      {documents.length === 0 ? (
        <p>No documents found</p>
      ) : (
        <div className="doc-card-container">
          {documents.map((doc) => (
            <div className="doc-card" key={doc.id}>
              <div className="doc-header">
                <h3>{doc.user ? doc.user.name : "Unknown"}</h3>
                <span
                  className={`status-badge status-${doc.status.toLowerCase()}`}
                >
                  {doc.status}
                </span>
              </div>

              <p>
                <strong>User ID:</strong> {doc.userId}
              </p>
              <p>
                <strong>Role:</strong> {doc.role}
              </p>

              <a
                className="doc-link"
                href={`http://localhost:8080${doc.documentUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </a>

              {doc.status === "PENDING" && (
                <div className="doc-actions">
                  <button
                    className="approve-btn"
                    onClick={() => approve(doc.id)}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => reject(doc.id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDocumentVerification;
