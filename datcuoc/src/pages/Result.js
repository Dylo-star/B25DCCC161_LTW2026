import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatScore } from '../data';
import { getResult } from '../utils';
import ScoreChart from '../components/ScoreChart';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  if (!state) return <Navigate to="/" replace />;
  const { name, rounds, finalScore, correctCount, reason } = state;

  return (
    <div>
      <h2>{reason === 'bust' ? 'Bạn đã cháy túi!' : 'Bạn đã hoàn thành 12 câu.'}</h2>
      <p>Người chơi: {name}</p>
      <p>Số câu trả lời đúng: {correctCount}/{rounds.length}</p>
      <p>Điểm cuối: {formatScore(finalScore)}</p>
      <p>Đánh giá: {getResult(finalScore).title}</p>
      <ScoreChart rounds={rounds} />
      <div className="row">
        <button className="primary" onClick={() => navigate('/play')}>Chơi lại</button>
        <button onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    </div>
  );
};

export default Result;