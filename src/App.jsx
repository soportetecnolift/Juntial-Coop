import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import AutomatizacionEIa from './pages/AutomatizacionEIa/AutomatizacionEIa'
import About from './pages/About/About'
import CasosReales from './pages/CasosReales/CasosReales'
import DesarrolloAMedida from './pages/DesarrolloAMedida/DesarrolloAMedida'
import IntegracionZohoOne from './pages/IntegracionZohoOne/IntegracionZohoOne'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/Real-life-cases" element={<CasosReales />} />
          <Route path="/Custom-development" element={<DesarrolloAMedida />} />
          <Route path="/automation-ai" element={<AutomatizacionEIa />} />
          <Route path="/integration-zoho-one" element={<IntegracionZohoOne />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
