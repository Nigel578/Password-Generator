import { useState } from 'react';
import './App.css';

function generatePassword(length, options) {
  const sets = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };
  let pool = '';
  Object.keys(options).forEach((key) => {
    if (options[key]) pool += sets[key];
  });
  if (!pool) return '';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += pool[Math.floor(Math.random() * pool.length)];
  }
  return password;
}

function getStrength(length, options) {
  const activeSets = Object.values(options).filter(Boolean).length;
  const score = activeSets * (length / 4);
  if (score < 6) return { label: 'Weak', pct: 30 };
  if (score < 12) return { label: 'Moderate', pct: 60 };
  return { label: 'Strong', pct: 95 };
}

export default function App() {
  const [length, setLength] = useState(14);
  const [options, setOptions] = useState({
    lower: true,
    upper: true,
    numbers: true,
    symbols: false,
  });
  const [password, setPassword] = useState(generatePassword(14, {
    lower: true, upper: true, numbers: true, symbols: false,
  }));
  const [copied, setCopied] = useState(false);

  const strength = getStrength(length, options);

  const handleGenerate = () => {
    setPassword(generatePassword(length, options));
    setCopied(false);
  };

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="vault">
      <div className="vault-card">
        <p className="eyebrow">key generator</p>
        <h1>Forge a Password</h1>

        <div className="display" onClick={handleCopy}>
          <span className="display-text">{password || 'select an option'}</span>
          <span className="copy-hint">{copied ? 'copied' : 'click to copy'}</span>
        </div>

        <div className="strength-row">
          <span>{strength.label}</span>
          <div className="strength-track">
            <div
              className={`strength-fill fill-${strength.label.toLowerCase()}`}
              style={{ width: `${strength.pct}%` }}
            />
          </div>
        </div>

        <div className="length-row">
          <label htmlFor="length">Length</label>
          <input
            id="length"
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
          <span className="length-value">{length}</span>
        </div>

        <div className="options-grid">
          {Object.entries({
            lower: 'a-z',
            upper: 'A-Z',
            numbers: '0-9',
            symbols: '!@#',
          }).map(([key, label]) => (
            <button
              key={key}
              className={`option-chip ${options[key] ? 'active' : ''}`}
              onClick={() => toggleOption(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <button className="generate-btn" onClick={handleGenerate}>
          Generate
        </button>
      </div>
    </div>
  );
}

