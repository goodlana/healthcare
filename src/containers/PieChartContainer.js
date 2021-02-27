import React from "react";
import PieChart from "../components/PieChart";

function PieChartContainer() {
  return (
    <div className="pie-charts">
      <PieChart chartKey={`gender_source_value`} />
      <PieChart chartKey={`race_source_value`} />
      <PieChart chartKey={`ethnicity_source_value`} />
    </div>
  );
}

export default PieChartContainer;
