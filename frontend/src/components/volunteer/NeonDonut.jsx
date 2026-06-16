import React from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const NeonDonut = ({ value = 64, label = "Avg attendance" }) => {
  const data = {
    labels: ["Attendance", "Remaining"],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ["#00ffff", "#1a1a2e"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 🔑 important
    cutout: "70%",
    plugins: {
      legend: {
        labels: { color: "#ffffff" },
      },
    },
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* 🔽 SIZE CONTROLLER */}
      <div
        style={{
          width: "180px",
          height: "180px",
          margin: "0 auto",
        }}
      >
        <Doughnut data={data} options={options} />
      </div>

      <p style={{ marginTop: "10px", color: "#9ca3af" }}>
        {label}
      </p>
    </div>
  );
};

export default NeonDonut;
