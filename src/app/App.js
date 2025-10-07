import '../app/App.css';
import Header from '../components/Header/Header';
import Home from '../pages/Home';
import Lineal from '../pages/Lineal';
import Multiplicativo from '../pages/Multiplicativo';
import Azucar from '../pages/Azucar';
import Tienda from '../pages/Tienda';
import Dados from '../pages/Dados';
import Huevos from '../pages/Huevos';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* Ruta por defecto "/" redirige a "/inicio" */}
          <Route path="/" element={<Navigate to="/inicio" replace />} />

          {/* Tus páginas */}
          <Route path="/inicio" element={<Home />} />
          <Route path="/lineal" element={<Lineal />} />
          <Route path="/multiplicativo" element={<Multiplicativo />} />
          <Route path="/azucar" element={<Azucar />} />

          <Route path="/tienda" element={<Tienda />} />
          <Route path="/dados" element={<Dados />} />
          <Route path="/huevos" element={<Huevos />} />
        </Routes>
      </main>
    </Router>
  );
}
