import { Routes, Route } from 'react-router-dom';
import './App.css'

//Pages
import ResultPage from './pages/ResultsPage/ResultPage';
import InputPage from './pages/InputPage/InputPage';

function App() {

  return (
    <div className='app'>
        <Routes>
          <Route path="/" element={<InputPage/>}/>
          <Route path="/results" element={<ResultPage/>}/>
        </Routes>
    </div>
  )
}

export default App
