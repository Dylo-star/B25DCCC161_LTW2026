import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, LETTERS, formatMultiplier } from '../data';

const QuestionDetail = ({ questions, bookmarks, toggleBookmark }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const q = questions.find((x) => x.id === Number(id));

  if (!q) {
    return (
      <div>
        <p>Không tìm thấy câu hỏi</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  const marked = bookmarks.includes(q.id);
  return (
    <div>
      <h2>{`Câu hỏi số ${q.id} – ${q.topic} · ${LEVELS[q.level]} (${formatMultiplier(MULTIPLIERS[q.level])})`}</h2>
      <p>{q.question}</p>
      {q.options.map((opt, i) => (
        <div key={i} className={i === q.answer ? 'opt correct' : 'opt'}>
          {LETTERS[i]}. {opt}{i === q.answer && ' (Đáp án đúng)'}
        </div>
      ))}
      <p>Gợi ý: {q.hint}</p>
      <div className="row">
        <button onClick={() => toggleBookmark(q.id)}>{marked ? 'Bỏ đánh dấu' : 'Đánh dấu'}</button>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    </div>
  );
};

export default QuestionDetail;
