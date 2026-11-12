import { formatScore } from '../data';
import { headline } from '../utils';

const BetPanel = ({ question, index, total, score, bet, setBet, error, onBet }) => (
  <div className="card">
    <p>{headline(question, index + 1, total)}</p>
    <p>Điểm hiện có: {formatScore(score)}</p>
    <div className="row">
      <label>
        Mức cược{' '}
        <input type="number" value={bet} onChange={(e) => setBet(e.target.value)} />
      </label>
      <button className="primary" disabled={error !== ''} onClick={onBet}>Đặt cược</button>
    </div>
    {error && <p className="err">{error}</p>}
  </div>
);

export default BetPanel;