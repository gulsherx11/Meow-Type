import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CatLogo, CatResult } from '../CatSVG';

const API = process.env.REACT_APP_API_URL || 'https://meow-type-production.up.railway.app';
const TOTAL_SENTENCES = 5;

export default function Test() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { nickname, difficulty, timer: totalTime } = state || {};

  const [currentSentence, setCurrentSentence] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [saved, setSaved] = useState(false);
  const [allStats, setAllStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBonus, setShowBonus] = useState(false);

  const intervalRef = useRef(null);
  const finishedRef = useRef(false);
  const textareaRef = useRef(null);
  const sentenceRef = useRef('');
  const startTimeRef = useRef(null);

  const fetchNextSentence = async () => {
    setLoading(true);
    startTimeRef.current = Date.now();
    const res = await axios.get(`${API}/paragraphs?difficulty=${difficulty}`);
    sentenceRef.current = res.data.text;
    setCurrentSentence(res.data.text);
    setInput('');
    setLoading(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  useEffect(() => { fetchNextSentence(); }, []);

  useEffect(() => {
    if (started && !finishedRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(intervalRef.current); triggerFinish(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [started]);

  const calcStats = (typed) => {
    const sentence = sentenceRef.current;
    const elapsed = startTimeRef.current
      ? (Date.now() - startTimeRef.current) / 1000
      : 1;
    const words = typed.trim().split(/\s+/).filter(Boolean).length;
    const mins = elapsed / 60;
    const currentWpm = Math.round(words / mins);
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === sentence[i]) correct++;
    }
    const currentAccuracy = typed.length > 0
      ? Math.round((correct / typed.length) * 100)
      : 100;
    return { currentWpm, currentAccuracy };
  };

  const triggerFinish = (stats) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearInterval(intervalRef.current);
    setFinished(true);
    const finalStats = stats || allStats;
    const avgWpm = finalStats.length > 0
      ? Math.round(finalStats.reduce((a, b) => a + b.wpm, 0) / finalStats.length)
      : wpm;
    const avgAcc = finalStats.length > 0
      ? Math.round(finalStats.reduce((a, b) => a + b.acc, 0) / finalStats.length)
      : accuracy;
    setWpm(avgWpm);
    setAccuracy(avgAcc);
    axios.post(`${API}/scores`, { nickname, wpm: avgWpm, accuracy: avgAcc, difficulty })
      .then(() => setSaved(true));
  };

  const handleInput = (e) => {
    const val = e.target.value;
    if (val.length < input.length) return;
    if (!started) {
      setStarted(true);
      startTimeRef.current = Date.now();
    }
    setInput(val);
    const { currentWpm, currentAccuracy } = calcStats(val);
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
    if (val.length >= sentenceRef.current.length) {
      const sentenceStat = { wpm: currentWpm, acc: currentAccuracy };
      const newStats = [...allStats, sentenceStat];
      setAllStats(newStats);
      if (currentIndex + 1 >= TOTAL_SENTENCES) {
        triggerFinish(newStats);
      } else {
        setCurrentIndex(i => i + 1);
        setTimeLeft(t => t + 5);
        setShowBonus(true);
        setTimeout(() => setShowBonus(false), 1800);
        fetchNextSentence();
      }
    }
  };

  const renderParagraph = () => {
    return currentSentence.split('').map((char, i) => {
      let cls = 'char-pending';
      if (i < input.length) cls = input[i] === char ? 'char-correct' : 'char-wrong';
      else if (i === input.length) cls = 'char-cursor';
      return <span key={i} className={cls}>{char}</span>;
    });
  };

  const timerColor = timeLeft <= 10 ? 'red' : timeLeft <= 20 ? '' : 'green';

  if (!state) return <div className="container"><button onClick={() => navigate('/')}>Go Home</button></div>;

  return (
    <div className="container">
      {showBonus && <div className="bonus-toast">+5 SEC NYA~!</div>}

      <nav className="nav">
        <div className="nav-logo"><CatLogo size={22} /> MEOW TYPE</div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate('/')}>HOME</button>
          <button className="nav-btn" onClick={() => navigate('/leaderboard')}>SCORES</button>
        </div>
      </nav>

      <div className="stats-bar">
        <div className="stat-card">
          <span className={`value ${timerColor}`}>{timeLeft}s</span>
          <span className="label">TIME</span>
        </div>
        <div className="stat-card">
          <span className="value">{wpm}</span>
          <span className="label">WPM</span>
        </div>
        <div className="stat-card">
          <span className={`value ${accuracy >= 90 ? 'green' : accuracy >= 70 ? '' : 'red'}`}>{accuracy}%</span>
          <span className="label">ACC</span>
        </div>
      </div>

      <div className="sentence-dots">
        {Array.from({ length: TOTAL_SENTENCES }).map((_, i) => (
          <div key={i} className={`sentence-dot ${i < currentIndex ? 'done' : i === currentIndex ? 'current' : ''}`} />
        ))}
      </div>
      <div className="sentence-label">~ sentence {Math.min(currentIndex + 1, TOTAL_SENTENCES)} of {TOTAL_SENTENCES} ~</div>

      {finished ? (
        <div className="result-card">
          <CatResult size={56} />
          <h2>TEST COMPLETE!</h2>
          <p>{saved ? '~ score saved to leaderboard ~' : '~ saving score... ~'}</p>
          <div className="result-stats">
            <div className="result-stat">
              <span className="big">{wpm}</span>
              <span className="small">AVG WPM</span>
            </div>
            <div className="result-stat">
              <span className="big">{accuracy}%</span>
              <span className="small">AVG ACC</span>
            </div>
            <div className="result-stat">
              <span className="big">{TOTAL_SENTENCES}</span>
              <span className="small">SENTENCES</span>
            </div>
          </div>
          <div className="btn-group" style={{ justifyContent: 'center' }}>
            <button onClick={() => navigate('/leaderboard')}>SCORES</button>
            <button className="btn-secondary" onClick={() => navigate('/')}>PLAY AGAIN</button>
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="loading-cat">generating nya...</div>
          ) : (
            <div className="paragraph-box">{renderParagraph()}</div>
          )}
          <textarea
            ref={textareaRef}
            rows={3}
            placeholder={started ? '' : '~ start typing to begin, nya~ ~'}
            value={input}
            onChange={handleInput}
            onKeyDown={e => { if (e.key === 'Backspace') e.preventDefault(); }}
            disabled={finished || loading}
            autoFocus
          />
          <div className="typing-info">~ {nickname} · {difficulty} · {totalTime}s ~</div>
        </>
      )}
    </div>
  );
}