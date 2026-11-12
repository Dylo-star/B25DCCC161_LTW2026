const BUILD_TAG = "dc-2964";
/* eslint-disable import/first */
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [filters, setFilters] = useState({ levels: [1, 2, 3], onlyMarked: false, query: '' });

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const toggleBookmark = (id) =>
    setBookmarks((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));

  const handleLookupShift = (e) => setFilters((f) => ({ ...f, query: e.target.value }));

  const guard = (el) =>
    loading ? <p>Đang tải câu hỏi...</p> : error ? <p>Không tải được câu hỏi</p> : el;

  return (
    <div data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h2>Trang chủ</h2>} />
          <Route path="play" element={<h2>Màn hình chơi</h2>} />
          <Route path="result" element={<h2>Kết quả</h2>} />
          <Route path="history" element={<h2>Lịch sử</h2>} />
          <Route
            path="questions"
            element={guard(
              <QuestionBank
                questions={questions}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                filters={filters}
                setFilters={setFilters}
                handleLookupShift={handleLookupShift}
              />
            )}
          />
          <Route
            path="questions/:id"
            element={guard(<QuestionDetail questions={questions} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />)}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
