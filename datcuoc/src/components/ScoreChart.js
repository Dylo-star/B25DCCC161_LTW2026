import { formatScore } from '../data';

const ScoreChart = ({ rounds }) => {
  const max = Math.max(...rounds.map((r) => r.scoreAfter), 1);
  return (
    <div className="chart">
      {rounds.map((r, i) => (
        <div className="col" key={r.id}>
          <span>{formatScore(r.scoreAfter)}</span>
          <div className={`bar ${r.correct ? 'ok' : 'bad'}`} style={{ height: (r.scoreAfter / max) * 200 }} />
          <span>{i + 1}</span>
        </div>
      ))}
    </div>
  );
};

export default ScoreChart;