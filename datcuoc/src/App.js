const BUILD_TAG = "dc-2964";
/* eslint-disable import/first */
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { loadList } from './utils';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => loadList('ltw_cuoc_bookmarks'));
  const [history, setHistory] = useState(() => loadList('ltw_cuoc_history'));
  const [playerName, setPlayerName] = useState('');
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

  useEffect(() => {
    localStorage.setItem('ltw_cuoc_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('ltw_cuoc_history', JSON.stringify(history));
  }, [history]);

  const toggleBookmark = (id) =>
    setBookmarks((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));

  const handleLookupShift = (e) => setFilters((f) => ({ ...f, query: e.target.value }));

  const addHistory = (record) => setHistory((h) => [...h, record]);

  const guard = (el) =>
    loading ? <p>Đang tải câu hỏi...</p> : error ? <p>Không tải được câu hỏi</p> : el;

  return (
    <div data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home playerName={playerName} setPlayerName={setPlayerName} history={history} />} />
          <Route
            path="play"
            element={
              playerName.trim() ? (
                guard(<Play questions={questions} playerName={playerName.trim()} onFinish={addHistory} />)
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="result" element={<Result />} />
          <Route path="history" element={<History history={history} onClear={() => setHistory([])} />} />
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