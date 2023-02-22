import './App.css';
import DataTable from './components/DataTable';
import SampleData from "./data/sample.json"

function App() {

  const onRowSelect = (rowData) => {
    console.log(rowData);
  }
  return (
    <main className='App-container' >
      <div className="App">
        <DataTable rowData={SampleData.map((doc, index) => ({ ...doc, id: index + 1 }))} onRowSelect={onRowSelect} />
      </div>
    </main>

  );
}

export default App;
