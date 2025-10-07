import React, { useState } from 'react';
import '../styles/metodos.css';
import { lcgLineal } from '../funciones/metCongruenciales.js';

// ===== Helpers =====
const isInt = (v) => Number.isInteger(v);
const isPrime = (num) => {
  const n = Math.floor(num);
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
};
const nextPrime = (n) => { let x = Math.max(2, Math.floor(n)); while (!isPrime(x)) x++; return x; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t; } return a; };

// ===== Inline icons (SVG, sin emojis) =====
const IconWarning = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill="currentColor" d="M12 2c.36 0 .7.19.89.5l9.04 15.66c.38.65-.09 1.47-.89 1.47H2.96c-.8 0-1.27-.82-.89-1.47L11.11 2.5c.19-.31.53-.5.89-.5zm0 6a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1zm0 9.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"/></svg>
);
const IconPlay = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
);
const IconBroom = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill="currentColor" d="M15.56 14.44 5 5l9.44 10.56zM4 5l4-4 3 3-4 4-3-3zm8.59 8.59-2.12-2.12 6.83-6.83a1.5 1.5 0 0 1 2.12 2.12l-6.83 6.83zM3 21h6l3-6H6z"/></svg>
);

const LinearAlgorithmGenerator = () => {
  const [inputs, setInputs] = useState({ x0: '', k: '', c: '', p: '', d: '' });
  const [results, setResults] = useState([]);
  const [calculatedParams, setCalculatedParams] = useState(null);
  const [modal, setModal] = useState({ open: false, issues: [], fix: null });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Solo permitir enteros (incluye vacío)
    if (value === '' || /^-?\d+$/.test(value)) {
      setInputs(prev => ({ ...prev, [name]: value }));
    }
  };

  // Reglas: m = P (convención actual), c debe ser primo
  const validate = (seed, kVal, cVal, pVal, dVal, nVal) => {
    const a = 1 + 4 * kVal;
    const m = pVal; // m = P
    const issues = [];

    if (!(isInt(seed) && isInt(kVal) && isInt(cVal) && isInt(pVal) && isInt(dVal) && isInt(nVal))) {
      issues.push('Todos los campos deben ser enteros.');
    }
    if (pVal <= 1) issues.push('P debe ser mayor que 1.');
    if (nVal <= 0) issues.push('n debe ser mayor que 0.');
    if (seed < 0 || seed >= m) issues.push('La semilla X₀ debe cumplir 0 ≤ X₀ < m (m = P).');
    if (!isPrime(cVal)) issues.push('El incremento c debe ser primo.');

    // Recomendaciones Hull–Dobell (no bloquean, solo aviso)
    if (gcd(cVal, m) !== 1) issues.push('Recomendación: c y m deberían ser coprimos.');
    if (m % 2 === 0 && (a - 1) % 2 !== 0) issues.push('Recomendación: si m es par, (a−1) debe ser múltiplo de los factores primos de m.');

    const hardFails = issues.filter(msg => (
      msg.includes('enteros') || msg.includes('P debe') || msg.includes('n debe') || msg.includes('La semilla') || msg.includes('incremento c')
    ));

    return { issues, hardFails, a, m };
  };

  const handleGenerar = () => {
    const seed = parseInt(inputs.x0, 10);
    const kVal = parseInt(inputs.k, 10);
    const cVal = parseInt(inputs.c, 10);
    const pVal = parseInt(inputs.p, 10);
    const dVal = parseInt(inputs.d, 10);

    // n: cantidad = m + 1 por defecto (puedes ajustar)
    const nVal = isInt(pVal) && pVal > 0 ? pVal + 1 : 10;

    const { issues, hardFails, a, m } = validate(seed, kVal, cVal, pVal, dVal, nVal);

    if (hardFails.length) {
      const fix = () => {
        const nextC = isPrime(cVal) ? cVal : nextPrime(cVal);
        const seedFixed = (seed >= 0 && seed < pVal) ? seed : ((seed % pVal) + pVal) % pVal;
        setInputs(prev => ({ ...prev, x0: String(seedFixed), c: String(nextC) }));
        setModal({ open: false, issues: [], fix: null });
      };
      setModal({ open: true, issues, fix });
      return;
    }

    const filas = lcgLineal({ x0: seed, k: kVal, c: cVal, p: pVal, d: dVal, n: nVal });

    const mapped = filas.map(r => ({
      i: r.i,
      xiPrev: r.xiPrev,
      operation: r.operacion,
      xi: r.xi,
      r: r.ri,
    }));

    setResults(mapped);

    // Parámetros mostrados (m = P, a = 1+4k, g = log2(P) si P es potencia de 2)
    const aShow = 1 + 4 * kVal;
    const mShow = pVal;
    const gShow = Number.isInteger(Math.log2(pVal)) ? Math.log2(pVal) : '-';
    setCalculatedParams({ a: aShow, c: cVal, g: gShow, m: mShow });
  };

  const handleLimpiar = () => {
    setInputs({ x0: '', k: '', c: '', p: '', d: '' });
    setResults([]);
    setCalculatedParams(null);
  };

  return (
    <div className="linear-algorithm-container">
      <div className="generator-content">
        <h2 className="title">
          <svg className="title-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 13h8v8H3zM13 3h8v8h-8zM13 13h8v8h-8zM3 3h8v8H3z"/></svg>
          Algoritmo Lineal
        </h2>
        <p className="subtitle">Xi+1 = (a·Xi + c) mod m, con a = 1 + 4k y m = P.</p>
        
        <div className="input-section">
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="x0">Semilla (X₀):</label>
              <input type="text" id="x0" name="x0" value={inputs.x0} onChange={handleInputChange} placeholder="Ingrese semilla inicial" />
            </div>
            <div className="input-group">
              <label htmlFor="k">K:</label>
              <input type="text" id="k" name="k" value={inputs.k} onChange={handleInputChange} placeholder="Ingrese valor K" />
            </div>
            <div className="input-group">
              <label htmlFor="c">c (primo):</label>
              <input type="text" id="c" name="c" value={inputs.c} onChange={handleInputChange} placeholder="Ingrese incremento c" />
            </div>
            <div className="input-group">
              <label htmlFor="p">P:</label>
              <input type="text" id="p" name="p" value={inputs.p} onChange={handleInputChange} placeholder="Ingrese valor P" />
            </div>
            <div className="input-group">
              <label htmlFor="d">Decimales (d):</label>
              <input type="text" id="d" name="d" value={inputs.d} onChange={handleInputChange} placeholder="Cantidad de decimales" />
            </div>
          </div>
          
          <div className="button-group">
            <button className="btn-generar" onClick={handleGenerar}><IconPlay /> Generar</button>
            <button className="btn-limpiar" onClick={handleLimpiar}><IconBroom /> Limpiar</button>
          </div>
        </div>

        {calculatedParams && (
          <div className="params-display">
            <h3>Parámetros Calculados</h3>
            <div className="params-grid">
              <div className="param-item"><span className="param-label">a:</span><span className="param-value">{calculatedParams.a}</span></div>
              <div className="param-item"><span className="param-label">c:</span><span className="param-value">{calculatedParams.c}</span></div>
              <div className="param-item"><span className="param-label">g:</span><span className="param-value">{calculatedParams.g}</span></div>
              <div className="param-item"><span className="param-label">m:</span><span className="param-value">{calculatedParams.m}</span></div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="results-section">
            <h3>Resultados Generados - Algoritmo Lineal</h3>
            <div className="table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Paso (i)</th>
                    <th>X₍ᵢ₋₁₎</th>
                    <th>Operación Xᵢ</th>
                    <th>Xᵢ</th>
                    <th>Random (r)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, index) => (
                    <tr key={index}>
                      <td>{row.i}</td>
                      <td>{row.xiPrev}</td>
                      <td className="operation-cell">{row.operation}</td>
                      <td>{row.xi}</td>
                      <td>{Number(row.r).toFixed(parseInt(inputs.d || '0', 10))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modal.open && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal">
            <div className="modal-header">
              <IconWarning size={22} />
              <h2 id="modal-title">Revisar parámetros</h2>
            </div>
            <ul className="modal-list">
              {modal.issues.map((msg, idx) => (<li key={idx}>{msg}</li>))}
            </ul>
            <div className="modal-actions">
              <button className="btn-generar" onClick={modal.fix}>Corregir automáticamente</button>
              <button className="btn-limpiar" onClick={() => setModal({ open: false, issues: [], fix: null })}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinearAlgorithmGenerator;