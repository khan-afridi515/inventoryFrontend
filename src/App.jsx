import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./home";
import Sidebar from './component/sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
       <Route path="/" element={<Home/>} />
       <Route path="/sidebar" element={<Sidebar/>} />
        
     
      </Routes>

    </Router>
    </>
  )
}

export default App
