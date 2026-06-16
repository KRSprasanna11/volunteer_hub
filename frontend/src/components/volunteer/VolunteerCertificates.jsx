import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerCertificates.css";

const VolunteerCertificates = () => {
  const [certificates, setCertificates] = useState([]);

  // ✅ Preview Modal State (NEW)
  const [previewCert, setPreviewCert] = useState(null);

  // ✅ Get Volunteer Data from LocalStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // ==================================================
  // ✅ Load Certificates from Backend
  // ==================================================
  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:8080/api/certificates/volunteer/${user.id}`)
      .then((res) => {
        setCertificates(res.data);
      })
      .catch((err) => console.log("Certificate Fetch Error:", err));
  }, [user?.id]);

  // ==================================================
  // ✅ Preview Certificate Function (NEW)
  // ==================================================
  const previewCertificate = (cert) => {
    setPreviewCert(cert);
  };

  // ==================================================
  // ✅ UI
  // ==================================================
  return (
    <div className="cert-page">
      <h2 className="cert-title">🎓 My Certificates</h2>

      {/* ✅ No Certificates */}
      {certificates.length === 0 ? (
        <p className="no-cert">❌ No certificates generated yet.</p>
      ) : (
        <div className="cert-container">
          {certificates.map((cert) => (
            <div key={cert.id} className="cert-card">
              <h3>{cert.eventTitle}</h3>

              <p>
                <b>Organizer:</b> {cert.organizerName}
              </p>

              <p>
                <b>Volunteer:</b> {cert.volunteerName}
              </p>

              <p>
                <b>Issued Date:</b> {cert.issueDate}
              </p>

              {/* ✅ Preview Button (NEW) */}
              <button
                className="preview-btn"
                onClick={() => previewCertificate(cert)}
              >
                👁 Preview Certificate
              </button>

              {/* ✅ Download Button (Already Working) */}
              <button
                className="download-btn"
                onClick={() =>
                  window.open(
                    `http://localhost:8080/api/certificates/download/${cert.id}`,
                    "_blank"
                  )
                }
              >
                📄 Download Certificate
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================
          ✅ Preview Modal (NEW)
      ================================================== */}
      {previewCert && (
        <div className="preview-modal">
          <div className="preview-box">
            <h2>🎓 Certificate Preview</h2>

            <div className="certificate-preview">
              <h3>Certificate of Participation</h3>

              <p>This certificate is proudly awarded to</p>

              <h1>{previewCert.volunteerName}</h1>

              <p>For successfully participating in</p>

              <h2>{previewCert.eventTitle}</h2>

              <p>
                Organized by <b>{previewCert.organizerName}</b>
              </p>

              <p>Date: {previewCert.issueDate}</p>
            </div>

            {/* Close Button */}
            <div className="modal-actions">
              <button
                className="close-btn"
                onClick={() => setPreviewCert(null)}
              >
                ❌ Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerCertificates;
