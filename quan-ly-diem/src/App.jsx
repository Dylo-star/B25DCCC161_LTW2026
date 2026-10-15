import { useState } from "react";
import StudentList from "./components/StudentList";
import "./App.css";
const initialStudents = [
  { id: 1, name: "Nguyễn Hoàng Bảo Nhân", score: 8.5, class: "CNCN1" },
  { id: 2, name: "Trần Thị Bình", score: 6.5, class: "CNCN2" },
  { id: 3, name: "Lê Hoàng Cường", score: 4.0, class: "CNCN1" },
  { id: 4, name: "Trần Minh Dũng", score: 9.0, class: "CNCN3" },
];
const filterButtons = [
  { key: "all", label: "Tất cả" },
  { key: "good", label: "Giỏi (≥ 8)" },
  { key: "fail", label: "Trượt (< 5)" },
];
const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ name: "", score: "", class: "" });
  const [error, setError] = useState("");
  const { name, score, class: className } = form;
  const handleChange = ({ target: { name: field, value } }) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const handleAdd = () => {
    const trimmedName = name.trim();
    const trimmedClass = className.trim();
    const scoreNum = Number(score);
    if (!trimmedName || !trimmedClass || score.trim() === "") {
      setError("Vui lòng nhập đầy đủ Họ tên, Điểm số và Lớp.");
      return;
    }
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError("Điểm số không hợp lệ (phải từ 0 đến 10).");
      return;
    }
    const newStudent = {
      id: Date.now(),
      name: trimmedName,
      score: scoreNum,
      class: trimmedClass,
    };
    setStudents((prev) => [...prev, newStudent]);
    setForm({ name: "", score: "", class: "" });
    setError("");
  };
  const handleDelete = (id) =>
    setStudents((prev) => prev.filter((s) => s.id !== id));
  const filteredStudents = students.filter(({ score }) =>
    filter === "good" ? score >= 8 : filter === "fail" ? score < 5 : true
  );
  const total = students.length;
  const average =
    total === 0 ? 0 : students.reduce((sum, { score }) => sum + score, 0) / total;
  return (
    <div className="container">
      <h1>Quản lý Điểm Sinh viên</h1>
      <div className="card">
        <h2>Thêm sinh viên mới</h2>
        <div className="form-row">
          <input name="name" value={name} onChange={handleChange} placeholder="Họ tên" />
          <input
            name="score"
            type="number"
            step="0.1"
            value={score}
            onChange={handleChange}
            placeholder="Điểm (0-10)"
          />
          <input name="class" value={className} onChange={handleChange} placeholder="Lớp" />
          <button className="btn-add" onClick={handleAdd}>
            Thêm
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
      <div className="stats">
        <div className="card">
          <span>Tổng số sinh viên</span>
          <strong>{total}</strong>
        </div>
        <div className="card">
          <span>Điểm trung bình lớp</span>
          <strong>{`${average.toFixed(2)}`}</strong>
        </div>
      </div>
      <div className="filters">
        {filterButtons.map(({ key, label }) => (
          <button
            key={key}
            className={filter === key ? "active" : ""}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <StudentList students={filteredStudents} onDelete={handleDelete} />
    </div>
  );
};
export default App;