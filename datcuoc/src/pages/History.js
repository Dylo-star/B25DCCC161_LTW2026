import { useState } from 'react';
import { formatScore } from '../data';

const History = ({ history, onClear }) => {
  const [player, setPlayer] = useState('');
  const players = [...new Set(history.map((h) => h.name))];
  const shown = player ? history.filter((h) => h.name === player) : history;
  const sorted = [...shown].sort((a, b) => b.finalScore - a.finalScore);
  const best = shown.reduce((m, h) => Math.max(m, h.finalScore), 0);
  const busts = shown.filter((h) => h.result === 'Cháy túi').length;

  if (history.length === 0) {
    return (
      <div>
        <h2>Lịch sử</h2>
        <p>Chưa có lượt chơi nào</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Lịch sử</h2>
      <div className="row">
        <label>
          Người chơi{' '}
          <select value={player} onChange={(e) => setPlayer(e.target.value)}>
            <option value="">Tất cả</option>
            {players.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <button onClick={() => { onClear(); setPlayer(''); }}>Xóa lịch sử</button>
      </div>
      <p>Số lượt chơi: {shown.length}</p>
      <p>Điểm cao nhất: {formatScore(best)}</p>
      <p>Số lần cháy túi: {busts}</p>
      <table>
        <thead>
          <tr><th>Người chơi</th><th>Số câu đúng</th><th>Điểm cuối</th><th>Đánh giá</th><th>Thời gian</th></tr>
        </thead>
        <tbody>
          {sorted.map((h) => (
            <tr key={h.id}>
              <td>{h.name}</td>
              <td>{h.correctCount}/{h.played}</td>
              <td>{formatScore(h.finalScore)}</td>
              <td>{h.result}</td>
              <td>{h.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;