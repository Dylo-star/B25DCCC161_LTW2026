import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { START_SCORE, MIN_BET, MAX_BET, BET_STEP, TIME_PER_QUESTION, formatScore } from '../data';
import { validateBet, calcChange, getResult, headline } from '../utils';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';
import Supports from '../components/Supports';

const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('betting');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [rounds, setRounds] = useState([]);
  const [bet, setBet] = useState(String(MIN_BET));
  const [placedBet, setPlacedBet] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState(null);
  const [used, setUsed] = useState({ preview: false, insure: false, hint: false });
  const [previewing, setPreviewing] = useState(false);
  const [insured, setInsured] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  const q = questions[index];
  const total = questions.length;
  const error = validateBet(Number(bet), score);

  const placeBet = () => {
    if (error) return;
    setPlacedBet(Number(bet));
    setTimeLeft(TIME_PER_QUESTION);
    setSelected(null);
    setStatus('answering');
  };

  const resolve = (choice) => {
    const correct = choice === q.answer;
    const change = insured && !correct ? 0 : calcChange(placedBet, q.level, correct);
    const after = score + change;
    setSelected(choice);
    setScore(after);
    setRounds([...rounds, { id: q.id, bet: placedBet, correct, change, scoreAfter: after }]);
    setStatus('revealed');
  };

  const finish = () => {
    const correctCount = rounds.filter((r) => r.correct).length;
    onFinish({
      id: Date.now(),
      name: playerName,
      finalScore: score,
      correctCount,
      played: rounds.length,
      result: getResult(score).title,
      playedAt: new Date().toLocaleString('vi-VN'),
    });
    navigate('/result', {
      replace: true,
      state: {
        name: playerName,
        rounds,
        finalScore: score,
        correctCount,
        reason: score < MIN_BET ? 'bust' : 'done',
      },
    });
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (status !== 'answering') return undefined;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) resolve(null);
  }, [timeLeft, status]);

  useEffect(() => {
    if (status !== 'revealed') return undefined;
    const id = setTimeout(() => {
      if (score < MIN_BET || index + 1 >= total) {
        finish();
      } else {
        setIndex(index + 1);
        setBet(String(MIN_BET));
        setInsured(false);
        setHintShown(false);
        setPreviewing(false);
        setStatus('betting');
      }
    }, 2000);
    return () => clearTimeout(id);
  }, [status]);

  useEffect(() => {
    if (status !== 'betting') return undefined;
    const maxBet = Math.min(MAX_BET, Math.floor(score / BET_STEP) * BET_STEP);
    const handleKey = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setBet(String(Math.max(MIN_BET, Math.min(maxBet, Number(bet) + BET_STEP))));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setBet(String(Math.max(MIN_BET, Math.min(maxBet, Number(bet) - BET_STEP))));
      } else if (e.key === 'Enter' && !error) {
        e.preventDefault();
        placeBet();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, bet, score]);

  useEffect(() => {
    if (status === 'betting') document.title = `Câu ${index + 1}/${total} – đặt cược`;
    else if (status === 'answering') document.title = `Câu ${index + 1}/${total} – cược ${placedBet}`;
  }, [status, index, total, placedBet]);

  useEffect(() => () => { document.title = 'Đặt cược kiến thức'; }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  if (!q) return null;

  const supports = (
    <Supports
      status={status}
      used={used}
      insured={insured}
      onPreview={() => { setPreviewing(true); setUsed({ ...used, preview: true }); }}
      onInsure={() => { setInsured(true); setUsed({ ...used, insure: true }); }}
      onHint={() => { setHintShown(true); setUsed({ ...used, hint: true }); }}
    />
  );

  if (status === 'betting') {
    return (
      <div>
        <BetPanel
          question={q}
          index={index}
          total={total}
          score={score}
          bet={bet}
          setBet={setBet}
          error={error}
          previewing={previewing}
          onBet={placeBet}
        />
        {supports}
      </div>
    );
  }

  const last = rounds[rounds.length - 1];
  let message = '';
  if (status === 'revealed' && last) {
    if (last.correct) message = `+${formatScore(last.change)}`;
    else if (insured) message = 'Bảo hiểm: không bị trừ điểm';
    else message = `−${formatScore(last.bet)}`;
  }

  return (
    <div>
      <QuestionCard
        head={headline(q, index + 1, total)}
        question={q.question}
        options={q.options}
        status={status}
        selected={selected}
        answer={q.answer}
        onPick={resolve}
      />
      {hintShown && <p>Gợi ý: {q.hint}</p>}
      <Timer timeLeft={timeLeft} />
      <ScoreInfo score={score} bet={placedBet} />
      {message && <p className="change">{selected === null && 'Hết giờ! '}{message}</p>}
      {supports}
    </div>
  );
};

export default Play;