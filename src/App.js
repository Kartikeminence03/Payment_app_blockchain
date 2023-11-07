import './App.css';
import Navbar from './components/navbar/Navbar';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from './pages/home/Home';

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
