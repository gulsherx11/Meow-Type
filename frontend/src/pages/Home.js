import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CatLogo, CatHero } from '../CatSVG';

export default function Home() {
  const [nickname, setNickname] = useState(localStorage.getItem('meow_nickname') || '');
  const [difficulty, setDifficulty] = useState('medium');
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  const start = () => {
    if (!nickname.trim()) return alert('Enter a name, nya~!');
    localStorage.setItem('meow_nickname', nickname);
    navigate('/test', { state: { nickname, difficulty, timer } });
  };

  return (
    <div className="container">
      <nav className="nav">
        <div className="nav-logo">
          <CatLogo size={26} />
          MEOW TYPE
        </div>
        <div className="nav-links">
          <button className="nav-btn active">HOME</button>
          <button className="nav-btn" onClick={() => navigate('/leaderboard')}>SCORES</button>
        </div>
      </nav>

      <div className="hero">
        <CatHero size={64} />
        <h1>MEOW TYPE</h1>
        <p>~ type fast. purr louder. ~</p>
      </div>

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>YOUR NAME</label>
            <input
              type="text"
              placeholder="enter name, nya..."
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && start()}
              maxLength={16}
            />
          </div>
          <div className="form-group">
            <label>DIFFICULTY</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>
          <div className="form-group">
            <label>DURATION</label>
            <select value={timer} onChange={e => setTimer(Number(e.target.value))}>
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={120}>120 seconds</option>
            </select>
          </div>
        </div>
        <div className="btn-group">
          <button onClick={start}>▶ START</button>
          <button className="btn-secondary" onClick={() => navigate('/leaderboard')}>SCORES</button>
        </div>
      </div>

      <div className="card">
        <div className="features-grid">
          <div className="feature-item">
            <svg className="feature-icon" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 17,11 26,11 19,17 22,26 14,20 6,26 9,17 2,11 11,11" fill="#f472b6"/>
            </svg>
            <span className="feature-title">LIVE WPM</span>
            <span className="feature-desc">real-time speed</span>
          </div>
          <div className="feature-item">
            <svg className="feature-icon" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="11" stroke="#f472b6" strokeWidth="2" fill="none"/>
              <circle cx="14" cy="14" r="3" fill="#f472b6"/>
              <line x1="14" y1="3" x2="14" y2="7" stroke="#f472b6" strokeWidth="2"/>
              <line x1="25" y1="14" x2="21" y2="14" stroke="#f472b6" strokeWidth="2"/>
              <line x1="14" y1="25" x2="14" y2="21" stroke="#f472b6" strokeWidth="2"/>
              <line x1="3" y1="14" x2="7" y2="14" stroke="#f472b6" strokeWidth="2"/>
            </svg>
            <span className="feature-title">ACCURACY</span>
            <span className="feature-desc">char-by-char</span>
          </div>
          <div className="feature-item">
            <svg className="feature-icon" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="4" y="8" width="20" height="16" rx="3" fill="none" stroke="#f472b6" strokeWidth="2"/>
              <path d="M9 8V5M19 8V5" stroke="#f472b6" strokeWidth="2" strokeLinecap="round"/>
              <rect x="8" y="13" width="4" height="4" rx="1" fill="#f472b6"/>
              <rect x="16" y="13" width="4" height="4" rx="1" fill="#a78bfa"/>
            </svg>
            <span className="feature-title">AI SENTENCES</span>
            <span className="feature-desc">fresh every round</span>
          </div>
        </div>
      </div>
    </div>
  );
}