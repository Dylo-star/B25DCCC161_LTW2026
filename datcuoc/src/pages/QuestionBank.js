import { Link } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, formatMultiplier } from '../data';

const QuestionBank = ({ questions, bookmarks, toggleBookmark, filters, setFilters, handleLookupShift }) => {
  const { levels, onlyMarked, query } = filters;
  const keyword = query.trim().toLowerCase();

  const toggleLevel = (lv) =>
    setFilters((f) => ({
      ...f,
      levels: f.levels.includes(lv) ? f.levels.filter((x) => x !== lv) : [...f.levels, lv],
    }));

  const shown = questions
    .filter((q) => levels.includes(q.level))
    .filter((q) => !onlyMarked || bookmarks.includes(q.id))
    .filter((q) => q.question.toLowerCase().includes(keyword));

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div className="row">
        {Object.keys(LEVELS).map((k) => (
          <label key={k}>
            <input type="checkbox" checked={levels.includes(Number(k))} onChange={() => toggleLevel(Number(k))} />
            {LEVELS[k]}
          </label>
        ))}
        <label>
          <input
            type="checkbox"
            checked={onlyMarked}
            onChange={(e) => setFilters((f) => ({ ...f, onlyMarked: e.target.checked }))}
          />
          Chỉ hiện câu đã đánh dấu
        </label>
      </div>
      <div className="row">
        <input type="search" placeholder="Tìm kiếm" value={query} onChange={handleLookupShift} />
      </div>
      <p>Có {shown.length} câu hỏi</p>
      <p>Đã đánh dấu: {bookmarks.length} câu</p>
      <table>
        <thead>
          <tr>
            <th>STT</th><th>Chủ đề</th><th>Mức độ</th><th>Hệ số</th><th>Câu hỏi</th><th>Đánh dấu</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{q.topic}</td>
              <td>{LEVELS[q.level]}</td>
              <td>{formatMultiplier(MULTIPLIERS[q.level])}</td>
              <td><Link to={`/questions/${q.id}`}>{q.question}</Link></td>
              <td><button onClick={() => toggleBookmark(q.id)}>{bookmarks.includes(q.id) ? '★' : '☆'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
