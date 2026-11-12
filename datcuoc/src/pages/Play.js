import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { START_SCORE, MIN_BET, TIME_PER_QUESTION, formatScore } from '../data';
import { validateBet, calcChange, headline } from '../utils';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('betting');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [rounds, setRounds] = useState([]);
  const [bet, setBet] = useState(String(MIN_BET));
  const [placedBet, setPlacedBet] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState(null);

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
    const change = calcChange(placedBet, q.level, correct);
    const after = score + change;
    setSelected(choice);
    setScore(after);
    setRounds([...rounds, { id: q.id, bet: placedBet, correct, change, scoreAfter: after }]);
    setStatus('revealed');
  };

  const finish = () => {
    navigate('/result', {
      replace: true,
      state: {
        name: playerName,
        rounds,
        finalScore: score,
        correctCount: rounds.filter((r) => r.correct).length,
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
        setStatus('betting');
      }
    }, 2000);
    return () => clearTimeout(id);
  }, [status]);
  /* eslint-enable react-hooks/exhaustive-deps */

  if (!q) return null;

  if (status === 'betting') {
    return (
      <BetPanel
        question={q}
        index={index}
        total={total}
        score={score}
        bet={bet}
        setBet={setBet}
        error={error}
        onBet={placeBet}
      />
    );
  }

  const last = rounds[rounds.length - 1];
  let message = '';
  if (status === 'revealed' && last) {
    message = last.correct ? `+${formatScore(last.change)}` : `−${formatScore(last.bet)}`;
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
      <Timer timeLeft={timeLeft} />
      <ScoreInfo score={score} bet={placedBet} />
      {message && <p className="change">{selected === null && 'Hết giờ! '}{message}</p>}
    </div>
  );
};

export default Play;