import React from "react";

const NeonCircular = ({ value, label }) => {
  const circleStyle = {
    background: `conic-gradient(#00f0ff ${value}%, #1a1a2e ${value}%)`,
    borderRadius: "50%",
    width: "150px",
    height: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    boxShadow: "0 0 12px #00f0ff",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={circleStyle}>
        <span>{value}%</span>
      </div>
      <p style={{ marginTop: "10px", color: "#aaa" }}>{label}</p>
    </div>
  );
};

export default NeonCircular;