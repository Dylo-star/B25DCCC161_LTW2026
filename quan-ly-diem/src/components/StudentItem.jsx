const StudentItem = ({ student, index, onDelete }) => {
  const { id, name, score, class: className } = student;
  const rank = score >= 8 ? "Giỏi" : score < 5 ? "Trượt" : "Đạt";
  const rankClass = score >= 8 ? "good" : score < 5 ? "fail" : "ok";
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>{className}</td>
      <td>{score.toFixed(1)}</td>
      <td>
        <span className={`badge ${rankClass}`}>{rank}</span>
      </td>
      <td>
        <button className="btn-delete" onClick={() => onDelete(id)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};
export default StudentItem;