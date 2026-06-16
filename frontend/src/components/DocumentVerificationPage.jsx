import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DocumentVerificationPage.css";

const DocumentVerificationPage = () => {
  const [status, setStatus] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState(null);

  // ✅ Get user safely
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;
  const role = user?.role;

  // Fetch status
  const fetchStatus = async () => {
    if (!userId || !role) return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/documents/status`,
        {
          params: { userId, role },
        }
      );

      if (res.data && res.data.status) {
        setStatus(res.data.status);
      }
    } catch (err) {
      console.log("No document found yet");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [userId, role]);

  // Upload document (URL or File)
  const handleUpload = async () => {
    if (!userId || !role) {
      alert("User not found. Please login again.");
      window.location.href = "/login";
      return;
    }

    if (!fileUrl && !file) {
      alert("Please enter URL or choose a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("role", role);

      if (fileUrl) {
        formData.append("documentUrl", fileUrl);
      }

      if (file) {
        formData.append("file", file);
      }

      await axios.post(
        `http://localhost:8080/api/documents/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Document uploaded successfully");
      setFile(null);
      setFileUrl("");
      fetchStatus();
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    }
  };

  // Redirect if approved
  useEffect(() => {
    if (status === "APPROVED") {
      if (role === "VOLUNTEER") {
        window.location.href = "/volunteer";
      } else if (role === "ORGANIZER") {
        window.location.href = "/organizer";
      }
    }
  }, [status, role]);

  return (
    <div className="verification-container">
      <div className="verification-card">
        <h2>Document Verification</h2>

        {/* Status Messages */}
        {status === "PENDING" && (
          <p className="pending">
            Your document is under review by admin.
          </p>
        )}

        {status === "REJECTED" && (
          <p className="rejected">
            Your document was rejected. Please re-upload.
          </p>
        )}

        {!status && (
          <p className="upload">
            Please upload your verification document.
          </p>
        )}

        {/* Upload Section */}
        {(status === null || status === "REJECTED") && (
          <>
            {/* URL input */}
            <input
              type="text"
              placeholder="Enter document URL"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />

            <p style={{ margin: "10px 0", color: "#aaa" }}>OR</p>

            {/* File input */}
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={handleUpload}>
              Upload Document
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentVerificationPage;
