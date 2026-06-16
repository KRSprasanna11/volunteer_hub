import React from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const NeonDonut = ({
  values = [64, 36], // flexible data
  labels = ["Attendance", "Remaining"],
  colors = ["#00ffff", "#1a1a2e"],
  label = "Avg attendance",
}) => {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        labels: { color: "#ffffff" },
      },
    },
  };

  return (
    <div style={{ textAlign: "center" }}>
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
