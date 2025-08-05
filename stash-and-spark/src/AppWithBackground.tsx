
import React, { useEffect, useState, ChangeEvent, MouseEvent } from 'react';
import FaultyTerminal from './components/FaultyTerminal';

type HistoryEntry = { amount: number; time: string };

export default function AppWithBackground() {
  const [total, setTotal] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [goal, setGoal] = useState<number>(1000);
  const [goalInput, setGoalInput] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const totalRes = await fetch('http://localhost:3001/api/total');
      const totalData = await totalRes.json();
      setTotal(totalData.total);

      const historyRes = await fetch('http://localhost:3001/api/history');
      const historyData = await historyRes.json();
      setHistory(historyData.history || []);

      const savedGoal = localStorage.getItem('goal');
      if (savedGoal) setGoal(parseFloat(savedGoal));
    } catch (err) {
      setStatus('❌ Error loading data');
    }
  };

  const handleSave = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setStatus('❌ Invalid amount');
      return;
    }
    await fetch('http://localhost:3001/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: value }),
    });
    setAmount('');
    setStatus(`✅ Saved ₹${value}`);
    loadData();
  };

  const handleClear = async () => {
    if (!window.confirm('Clear all data?')) return;
    await fetch('http://localhost:3001/api/clear', { method: 'POST' });
    setStatus('🧹 Cleared');
    loadData();
  };

  const handleDownloadCSV = () => {
    if (history.length === 0) {
      alert('Nothing to download');
      return;
    }
    let csv = 'Amount,Date\n';
    history.forEach(entry => {
      csv += `${entry.amount},${entry.time}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'studentstash_history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSetGoal = () => {
    const value = parseFloat(goalInput);
    if (isNaN(value) || value <= 0) {
      setStatus('❌ Enter a valid goal');
      return;
    }
    setGoal(value);
    localStorage.setItem('goal', value.toString());
    setGoalInput('');
    setStatus(`🎯 Goal set to ₹${value}`);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();
  const percent = Math.min(100, Math.floor((total / goal) * 100));

  const buttonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const hoverEffect: React.CSSProperties = {
    boxShadow: '0px 0px 12px rgba(255,255,255,0.5)',
    transform: 'scale(1.05)'
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Animated background, fixed and behind all UI */}
      <FaultyTerminal
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Main UI overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          maxWidth: 600,
          margin: '0 auto',
          background: 'rgba(30,41,59,0.7)',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          padding: 32,
          marginTop: 32,
          marginBottom: 32,
        }}
      >
        <h1 style={{ color: '#a78bfa', textAlign: 'center', fontSize: '2.5rem' }}>💰 StudentStash</h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
          <strong>Total Saved:</strong> ₹{total}
        </p>

        {/* Goal Tracker */}
        <div style={{ margin: '2rem 0', background: 'rgba(49,46,129,0.7)', padding: '1rem', borderRadius: '10px' }}>
          <p style={{ fontSize: '1.1rem' }}>🎯 Goal: ₹{goal}</p>
          <div style={{ height: 20, background: 'rgba(30,41,59,0.7)', borderRadius: 5 }}>
            <div style={{
              width: `${percent}%`,
              height: '100%',
              background: percent >= 100 ? 'rgba(34,197,94,0.85)' : 'rgba(59,130,246,0.85)',
              borderRadius: 5,
              transition: 'width 0.5s ease'
            }} />
          </div>
          <p>{percent}% of goal reached</p>
        </div>

        {/* Goal Input */}
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <input
            type="number"
            placeholder="Set your goal (₹)"
            value={goalInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGoalInput(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: 8,
              border: 'none',
              outline: 'none',
              width: '200px'
            }}
          />
          <button
            onMouseOver={(e: MouseEvent<HTMLButtonElement>) => Object.assign(e.currentTarget.style, hoverEffect)}
            onMouseOut={(e: MouseEvent<HTMLButtonElement>) => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'scale(1)' })}
            onClick={handleSetGoal}
            style={{
              ...buttonStyle,
              marginLeft: 10,
              background: 'rgba(99,102,241,0.85)',
              color: 'white'
            }}
          >
            Set Goal
          </button>
        </div>

        {/* Saving Actions */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <input
            type="number"
            value={amount}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            placeholder="Amount"
            style={{
              padding: '0.5rem',
              borderRadius: 8,
              border: 'none',
              outline: 'none',
              width: '200px'
            }}
          />
          <button
            onMouseOver={(e: MouseEvent<HTMLButtonElement>) => Object.assign(e.currentTarget.style, hoverEffect)}
            onMouseOut={(e: MouseEvent<HTMLButtonElement>) => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'scale(1)' })}
            onClick={handleSave}
            style={{
              ...buttonStyle,
              marginLeft: 10,
              background: 'rgba(16,185,129,0.85)',
              color: 'white'
            }}
          >
            Save
          </button>
          <button
            onMouseOver={(e: MouseEvent<HTMLButtonElement>) => Object.assign(e.currentTarget.style, hoverEffect)}
            onMouseOut={(e: MouseEvent<HTMLButtonElement>) => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'scale(1)' })}
            onClick={handleClear}
            style={{
              ...buttonStyle,
              marginLeft: 10,
              background: 'rgba(239,68,68,0.85)',
              color: 'white'
            }}
          >
            Clear
          </button>
          <button
            onMouseOver={(e: MouseEvent<HTMLButtonElement>) => Object.assign(e.currentTarget.style, hoverEffect)}
            onMouseOut={(e: MouseEvent<HTMLButtonElement>) => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'scale(1)' })}
            onClick={handleDownloadCSV}
            style={{
              ...buttonStyle,
              marginLeft: 10,
              background: 'rgba(59,130,246,0.85)',
              color: 'white'
            }}
          >
            Download CSV
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#94a3b8' }}>{status}</p>

        {/* History */}
        <h2 style={{ color: '#a78bfa', marginTop: '2rem' }}>📜 History</h2>
        {history.length === 0 ? (
          <p>No history yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {history.map((h, i) => (
              <li key={i} style={{
                background: 'rgba(49,46,129,0.7)',
                padding: '0.5rem',
                borderRadius: 6,
                marginBottom: '0.5rem'
              }}>
                ₹{h.amount} on {formatDate(h.time)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}