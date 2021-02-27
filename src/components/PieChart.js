import React from "react";
import { chartColors } from "../module/colors";
import { person } from "../synthea_cdm_json/person.json";
import { Pie } from "react-chartjs-2";

const pieOptions = {
  legend: {
    display: true,
    position: "right"
  },
  elements: {
    arc: {
      borderWidth: 2
    }
  }
};

function PieChart({ chartKey }) {
  const labels = [...new Set(person.map(p => p[chartKey]))];
  const data = labels.map(
    label => person.filter(p => label === p[chartKey]).length
  );

  const pieData = {
    maintainAspectRatio: false,
    responsive: false,
    labels,
    datasets: [
      {
        data,
        backgroundColor: chartColors,
        hoverBackgroundColor: chartColors
      }
    ]
  };
  return (
    <div className="pie-chart-wrapper">
      <Pie data={pieData} options={pieOptions} />
    </div>
  );
}

export default PieChart;
