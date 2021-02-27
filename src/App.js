import PersonTable from "./components/PersonTable";
import PieChartContainer from "./containers/PieChartContainer";

function App() {
  return (
    <div className="container">
      <div className="contents-wrapper">
        <PieChartContainer />
        <PersonTable className="person-table" />
      </div>
    </div>
  );
}

export default App;
