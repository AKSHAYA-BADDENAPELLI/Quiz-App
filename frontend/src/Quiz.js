import React, { useEffect, useState } from 'react';
import { API } from './api';

export default function Quiz({ user, onLogout }) {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`${API}/quiz/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    })
      .then(res => res.json())
      .then(setQuestions);
  }, [user.email]);

  const submit = () => {
    const answers = Object.entries(selected).map(([qid, ans]) => ({ qid, ans }));
    fetch(`${API}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
      .then(res => res.json())
      .then(data => setScore(data.score));
  };

  const retake = async () => {
    await fetch(`${API}/quiz/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    });
    window.location.reload();
  };

  const currentQuestion = questions[current];

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 700, margin: 'auto' }}>
      {/* Header with buttons only */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        {score !== null && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={retake}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: 5,
                cursor: 'pointer'
              }}
            >
              Retake
            </button>
            <button
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: 5,
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Score or Quiz Body */}
      {score !== null ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h2>Your Score: {score} / 10</h2>
        </div>
      ) : (
        <div>
          {currentQuestion && (
            <div style={{
              marginTop: 30,
              padding: 20,
              border: '1px solid #ccc',
              borderRadius: 10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#f9f9f9'
            }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                Q{current + 1}. {currentQuestion.question}
              </p>
              {currentQuestion.options.map(o => (
                <label
                  key={o}
                  style={{
                    display: 'block',
                    margin: '10px 0',
                    padding: '8px 12px',
                    border: selected[currentQuestion._id] === o ? '2px solid #4CAF50' : '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor: selected[currentQuestion._id] === o ? '#e6ffe6' : '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name={currentQuestion._id}
                    value={o}
                    checked={selected[currentQuestion._id] === o}
                    onChange={() =>
                      setSelected({ ...selected, [currentQuestion._id]: o })
                    }
                    style={{ marginRight: 10 }}
                  />
                  {o}
                </label>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => setCurrent(prev => Math.max(prev - 1, 0))}
              disabled={current === 0}
              style={{
                padding: '8px 16px',
                backgroundColor: current === 0 ? '#eee' : '#ddd',
                color: '#333',
                border: 'none',
                borderRadius: 5,
                cursor: current === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent(prev => prev + 1)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={submit}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer'
                }}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
