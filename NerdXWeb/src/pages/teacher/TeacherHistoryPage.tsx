import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { teacherApi, type TeacherHistoryItem } from '../../services/api/teacherApi';
import { SUBJECT_COLORS, SUBJECT_ICONS } from '../../data/teacherConstants';
import { ArrowLeft, Search, Trash2 } from 'lucide-react';

export function TeacherHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<TeacherHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<TeacherHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await teacherApi.getHistory();
      setHistory(data || []);
      setFilteredHistory(data || []);
    } catch {
      setHistory([]);
      setFilteredHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredHistory(history);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredHistory(
      history.filter(
        (item) =>
          item.subject.toLowerCase().includes(q) ||
          (item.topic && item.topic.toLowerCase().includes(q)) ||
          (item.last_message && item.last_message.toLowerCase().includes(q))
      )
    );
  }, [searchQuery, history]);

  const handleDelete = async (e: React.MouseEvent, item: TeacherHistoryItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    const prev = [...history];
    setHistory((h) => h.filter((x) => x.session_id !== item.session_id));
    setFilteredHistory((f) => f.filter((x) => x.session_id !== item.session_id));
    try {
      await teacherApi.deleteSession(item.session_id);
    } catch {
      setHistory(prev);
      setFilteredHistory(prev);
    }
  };

  const handlePress = (item: TeacherHistoryItem) => {
    navigate('/app/teacher/chat', {
      state: {
        subject: item.subject,
        gradeLevel: item.grade_level,
        topic: item.topic,
      },
    });
  };

  const getSubjectColor = (subject: string) => SUBJECT_COLORS[subject] ?? '#9C27B0';
  const getSubjectIcon = (subject: string) => SUBJECT_ICONS[subject] ?? '🎓';

  return (
    <div className="teacher-history-page">
      <header className="teacher-history-header">
        <Link to="/app/teacher" className="teacher-history-back" aria-label="Back">
          <ArrowLeft size={24} />
        </Link>
        <h1>Session History</h1>
        <div className="teacher-history-search">
          <Search size={20} className="teacher-history-search-icon" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="teacher-history-search-input"
          />
          {searchQuery.length > 0 && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="teacher-history-search-clear"
              aria-label="Clear"
            >
              ×
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="teacher-history-loading">Loading...</div>
      ) : (
        <div className="teacher-history-list">
          {filteredHistory.length === 0 ? (
            <div className="teacher-history-empty">
              <p>No history found</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <button
                key={item.session_id}
                type="button"
                className="teacher-history-card"
                onClick={() => handlePress(item)}
              >
                <div className="teacher-history-card-header">
                  <div
                    className="teacher-history-card-icon"
                    style={{ backgroundColor: `${getSubjectColor(item.subject)}20` }}
                  >
                    {getSubjectIcon(item.subject)}
                  </div>
                  <div className="teacher-history-card-header-text">
                    <span className="teacher-history-card-subject">{item.subject}</span>
                    <span className="teacher-history-card-date">
                      {new Date(item.updated_at).toLocaleDateString()} •{' '}
                      {new Date(item.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="teacher-history-card-delete"
                    onClick={(e) => handleDelete(e, item)}
                    aria-label="Delete session"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                {item.topic && (
                  <div
                    className="teacher-history-topic-badge"
                    style={{
                      backgroundColor: `${getSubjectColor(item.subject)}15`,
                      color: getSubjectColor(item.subject),
                    }}
                  >
                    {item.topic}
                  </div>
                )}
                {item.last_message && (
                  <p className="teacher-history-preview">{item.last_message}</p>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
