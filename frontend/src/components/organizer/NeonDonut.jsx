import React from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const NeonDonut = ({ value = 64, label = "Avg attendance" }) => {
  const data = {
    labels: ["Attendance", "Remaining"],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ["#00f0ff", "#1a1a2e"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 🔑 allows fixed sizing
    cutout: "70%",              // donut thickness (optional but recommended)
    plugins: {
      legend: {
        labels: { color: "#fff" },
      },
    },
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* 🔽 SIZE CONTROLLER */}
      <div
        style={{
          width: "180px",   // ✅ control size here
          height: "180px",
          margin: "0 auto",
        }}
      >
        <Doughnut data={data} options={options} />
      </div>

      <p style={{ marginTop: "10px", color: "#aaa" }}>
        {label}
      </p>
    </div>
  );
};

export default NeonDonut;
