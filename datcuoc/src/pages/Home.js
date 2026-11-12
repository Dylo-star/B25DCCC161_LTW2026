import { useNavigate } from 'react-router-dom';
import { START_SCORE, MIN_BET, MAX_BET, TIME_PER_QUESTION, formatScore } from '../data';

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  const start = () => {
    setPlayerName(playerName.trim());
    navigate('/play');
  };

  return (
    <div>
      <h1>Đặt cược kiến thức</h1>
      <div className="card">
        <ul>
          <li>Bắt đầu với {formatScore(START_SCORE)}, trả lời 12 câu hỏi.</li>
          <li>Trước mỗi câu, chỉ biết chủ đề và mức độ, đặt cược từ {MIN_BET} đến {MAX_BET} điểm.</li>
          <li>Có {TIME_PER_QUESTION} giây để trả lời. Đúng: thưởng mức cược × hệ số. Sai hoặc hết giờ: mất mức cược.</li>
          <li>Còn dưới {MIN_BET} điểm là cháy túi, lượt chơi kết thúc.</li>
        </ul>
      </div>
      <div className="row">
        <label>
          Tên người chơi{' '}
          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        </label>
        <button className="primary" disabled={!playerName.trim()} onClick={start}>Vào chơi</button>
      </div>
    </div>
  );
};

export default Home;