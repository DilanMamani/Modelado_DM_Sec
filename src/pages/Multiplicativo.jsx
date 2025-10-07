import React, { useState } from 'react';
import '../styles/metodos.css';
import { lcgMultiplicativo } from '../funciones/metCongruenciales.js';

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
const nextOddInRange = (x, m) => {
  let xi = ((x % m) + m) % m; // normaliza a [0, m)
  if (xi % 2 === 0) xi = (xi + 1) % m; // hazlo impar
  return xi;
};

// ===== Inline icons (SVG, no emojis) =====
const IconWarning = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill="currentColor" d="M12 2c.36 0 .7.19.89.5l9.04 15.66c.38.65-.09 1.47-.89 1.47H2.96c-.8 0-1.27-.82-.89-1.47L11.11 2.5c.19-.31.53-.5.89-.5zm0 6a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1zm0 9.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"/></svg>
);
const IconPlay = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
);
const IconBroom = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill="currentColor" d="M15.56 14.44 5 5l9.44 10.56zM4 5l4-4 3 3-4 4-3-3zm8.59 8.59-2.12-2.12 6.83-6.83a1.5 1.5 0 0 1 2.12 2.12l-6.83 6.83zM3 21h6l3-6H6z"/></svg>
);

const MultiplicativeAlgorithmGenerator = () => {
  const [inputs, setInputs] = useState({
    x0: '',
    k: '',
    p: '', // P (base del módulo)
    d: '', // D (exponente)
    n: '10', // cantidad a generar
    cOption: '3+8k', // a = 3+8k | 5+8k
  });

  const [results, setResults] = useState([]);
  const [calculatedParams, setCalculatedParams] = useState(null);
  const [modal, setModal] = useState({ open: false, issues: [], fix: null });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^-?\d+$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = (seed, kVal, pVal, dVal, nVal, opcionA) => {
    // m = P^D
    const m = Math.pow(pVal, dVal);
    const a = (opcionA === '5+8k' ? 5 : 3) + 8 * kVal;
    const issues = [];

    if (!(isInt(seed) && isInt(kVal) && isInt(pVal) && isInt(dVal) && isInt(nVal))) {
      issues.push('Todos los campos deben ser enteros.');
    }
    if (pVal <= 1) issues.push('P debe ser mayor que 1.');
    if (dVal < 1) issues.push('D debe ser mayor o igual a 1.');
    if (nVal <= 0) issues.push('n debe ser mayor que 0.');

    // Rango de semilla y paridad
    if (seed < 0 || seed >= m) issues.push('La semilla X₀ debe cumplir 0 ≤ X₀ < m (m = P^D).');
    if (seed % 2 === 0) issues.push('La semilla X₀ debe ser impar.');

    // Recomendaciones típicas (no bloquean): si P=2, entonces a ≡ 3 (mod 8) o 5 (mod 8) ya lo garantizamos con 3+8k/5+8k
    if (pVal === 2 && !['3+8k','5+8k'].includes(opcionA)) {
      issues.push('Recomendación: con P=2, use a = 3+8k o a = 5+8k.');
    }

    const hardFails = issues.filter((msg) => (
      msg.includes('enteros') || msg.includes('P debe') || msg.includes('D debe') || msg.includes('n debe') || msg.includes('La semilla')
    ));

    return { issues, hardFails, a, m };
  };

  const handleGenerar = () => {
    const seed = parseInt(inputs.x0, 10);
    const kVal = parseInt(inputs.k, 10);
    const pVal = parseInt(inputs.p, 10); // P
    const dVal = parseInt(inputs.d, 10); // D
    const nVal = parseInt(inputs.n, 10); // cantidad
    const opcionA = inputs.cOption; // '3+8k' | '5+8k'

    const { issues, hardFails, a, m } = validate(seed, kVal, pVal, dVal, nVal, opcionA);

    if (hardFails.length) {
      const fix = () => {
        // Corrige X0 al rango y a impar
        const seedFixed = nextOddInRange(Number.isFinite(seed) ? seed : 1, m);
        setInputs((prev) => ({ ...prev, x0: String(seedFixed) }));
        setModal({ open: false, issues: [], fix: null });
      };
      setModal({ open: true, issues, fix });
      return;
    }

    const filas = lcgMultiplicativo({ x0: seed, k: kVal, p: pVal, d: dVal, n: nVal, opcionA });
    setResults(filas.map((r) => ({ ...r, ri: Number(r.ri) })));

    // g mostrado: si P = 2, g = D; si no, '-'
    const g = pVal === 2 ? dVal : '-';
    setCalculatedParams({ a, g, m });
  };

  const handleLimpiar = () => {
    setInputs({ x0: '', k: '', p: '', d: '', n: '10', cOption: '3+8k' });
    setResults([]);
    setCalculatedParams(null);
  };

  return (
    <div className="linear-algorithm-container">
      <div className="generator-content">
        <h2 className="title">
          {/* small inline icon before title */}
          <svg className="title-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/></svg>
          Algoritmo Multiplicativo
        </h2>

        <div className="input-section">
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="x0">Semilla (X₀) impar:</label>
              <input type="text" id="x0" name="x0" value={inputs.x0} onChange={handleInputChange} placeholder="Ingrese semilla impar" />
            </div>

            <div className="input-group">
              <label htmlFor="k">K:</label>
              <input type="text" id="k" name="k" value={inputs.k} onChange={handleInputChange} placeholder="Ingrese valor K" />
            </div>

            <div className="input-group">
              <label>Opción a:</label>
              <div>
                <label>
                  <input type="radio" name="cOption" value="3+8k" checked={inputs.cOption === '3+8k'} onChange={(e) => setInputs(prev => ({ ...prev, cOption: e.target.value }))} />
                  (3 + 8k)
                </label>
              </div>
              <div>
                <label>
                  <input type="radio" name="cOption" value="5+8k" checked={inputs.cOption === '5+8k'} onChange={(e) => setInputs(prev => ({ ...prev, cOption: e.target.value }))} />
                  (5 + 8k)
                </label>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="p">P (base del módulo):</label>
              <input type="text" id="p" name="p" value={inputs.p} onChange={handleInputChange} placeholder="Ej: 2, 3, 5..." />
            </div>

            <div className="input-group">
              <label htmlFor="d">D (exponente):</label>
              <input type="text" id="d" name="d" value={inputs.d} onChange={handleInputChange} placeholder="Ej: 10" />
            </div>

            <div className="input-group">
              <label htmlFor="n">Cantidad a generar (n):</label>
              <input type="text" id="n" name="n" value={inputs.n} onChange={handleInputChange} placeholder="Ej: 10, 20..." />
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
              <div className="param-item"><span className="param-label">g:</span><span className="param-value">{calculatedParams.g}</span></div>
              <div className="param-item"><span className="param-label">m:</span><span className="param-value">{calculatedParams.m}</span></div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="results-section">
            <h3>Resultados Generados - Algoritmo Multiplicativo</h3>
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
                  {results.map((row) => (
                    <tr key={row.i}>
                      <td>{row.i}</td>
                      <td>{row.xiPrev}</td>
                      <td className="operation-cell">{row.operacion}</td>
                      <td>{row.xi}</td>
                      <td>{row.ri.toFixed(4)}</td>
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

export default MultiplicativeAlgorithmGenerator;