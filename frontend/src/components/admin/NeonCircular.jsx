import React from "react";

const NeonCircular = ({
  value = 72,
  label = "Progress",
  color = "#00ffff",
  bgColor = "#1a1a2e",
}) => {
  const clamped = Math.max(0, Math.min(100, value));

  const circleStyle = {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    background: `conic-gradient(
      ${color} ${clamped}%,
      ${bgColor} ${clamped}% 100%
    )`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 0 16px ${color}99`,
    position: "relative",
  };

  const innerStyle = {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "#020617",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontWeight: "700",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={circleStyle}>
        <div style={innerStyle}>
          <div style={{ fontSize: "22px" }}>{clamped}%</div>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeonCircular;
