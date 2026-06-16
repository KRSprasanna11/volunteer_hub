  import React from "react";
  import "chart.js/auto";
  import { Line } from "react-chartjs-2";
  import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

  ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

  const NeonLineChart = ({ points }) => {
    const data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Events Created",
          data: points,
          borderColor: "#00f0ff",
          backgroundColor: "rgba(0,240,255,0.2)",
          tension: 0.4,
          pointBackgroundColor: "#00f0ff",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#fff" }, grid: { color: "#333" } },
        y: { ticks: { color: "#fff" }, grid: { color: "#333" } },
      },
    };

    return <Line data={data} options={options} />;
  };

  export default NeonLineChart;