import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'   
import './App.css'
import AutomatizacionEIa from './pages/AutomatizacionEIa/AutomatizacionEIa'
import About from './pages/About/About'
import CasosReales from './pages/CasosReales/CasosReales'
import DesarrolloAMedida from './pages/DesarrolloAMedida/DesarrolloAMedida'
import IntegracionZohoOne from './pages/IntegracionZohoOne/IntegracionZohoOne'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AutomatizacionEIa />} />
          <Route path="/about" element={<About />} />
          <Route path="/Real-life-cases" element={<CasosReales />} />
          <Route path="/Custom-development" element={<DesarrolloAMedida />} />
          <Route path="/integration-zoho-one" element={<IntegracionZohoOne />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
