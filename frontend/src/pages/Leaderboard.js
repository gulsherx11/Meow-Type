import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CatLogo } from '../CatSVG';

const API = process.env.REACT_APP_API_URL || 'https://meow-type-production.up.railway.app';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/leaderboard`)
      .then(res => setScores(res.data))
      .finally(() => setLoading(false));
  }, []);

  const rankClass = i => i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
  const rankIcon  = i => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
  const namePrefix = i => i === 0 ? '😸 ' : i === 1 ? '😺 ' : i === 2 ? '🐱 ' : '';

  return (
    <div className="container">
      <nav className="nav">
        <div className="nav-logo"><CatLogo size={22} /> MEOW TYPE</div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate('/')}>HOME</button>
          <button className="nav-btn active">SCORES</button>
        </div>
      </nav>

      <div className="leaderboard-header">
        <h1>TOP CATS</h1>
        <p>~ the fastest paws in the land ~</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-cat">loading scores...</div>
        ) : scores.length === 0 ? (
          <div className="empty-state">
            <p>no scores yet. be the first cat!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>RANK</th>
                <th>NAME</th>
                <th>WPM</th>
                <th>ACC</th>
                <th>LEVEL</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => (
                <tr key={s.id}>
                  <td className={rankClass(i)}>{rankIcon(i)}</td>
                  <td>{namePrefix(i)}{s.nickname}</td>
                  <td className="wpm-cell">{s.wpm}</td>
                  <td>{s.accuracy}%</td>
                  <td><span className={`badge badge-${s.difficulty}`}>{s.difficulty}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="btn-group" style={{ marginTop: '14px' }}>
        <button onClick={() => navigate('/')}>▶ PLAY AGAIN</button>
      </div>
    </div>
  );
}