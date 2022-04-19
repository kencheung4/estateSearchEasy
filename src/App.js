import logo from './logo.svg';
import './App.css';
import AreaDropDown from './components/AreaDropDown';
import SearchBar from './components/SearchBar';

function App() {
  return (
    <div className="App">
      <div className="flex bg-slate-100 px-4 py-2 items-center">
        <SearchBar />
        <AreaDropDown />
      </div>
    </div>
  );
}

export default App;
