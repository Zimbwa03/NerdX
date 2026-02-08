import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, FileText, Receipt } from 'lucide-react';
import { accountingTopics, type AccountingTopic } from '../../data/accounting/topics';

export function AccountingNotesPage() {
  const navigate = useNavigate();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const toggle = (topic: AccountingTopic) => {
    setExpandedTopic((prev) => (prev === topic.id ? null : topic.id));
  };

  return (
    <div className="accounting-notes-page">
      <header className="subject-header-v2">
        <Link to="/app/accounting" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #B8860B, #8B6914)' }}>
            <Receipt size={28} />
          </div>
          <div>
            <h1>Accounting Notes</h1>
            <p>ZIMSEC O Level - Principles of Accounting (7112)</p>
          </div>
        </div>
      </header>

      <div className="accounting-notes-wrap">
        <div className="accounting-notes-intro">
          <h2>Topics</h2>
          <p>Tap a topic to see its description; open detailed notes where available.</p>
        </div>

        <div className="accounting-topics-list">
          {accountingTopics.map((topic, index) => {
            const expanded = expandedTopic === topic.id;
            return (
              <div key={topic.id} className={`accounting-topic ${expanded ? 'expanded' : ''}`}>
                <button type="button" className="accounting-topic-head" onClick={() => toggle(topic)}>
                  <div className="accounting-topic-left">
                    <div className="accounting-topic-index">{index + 1}</div>
                    <div className="accounting-topic-title">
                      <div className="accounting-topic-name">{topic.name}</div>
                      {topic.hasNotes && (
                        <div className="accounting-topic-badges">
                          <span className="accounting-badge">
                            <FileText size={14} /> Notes
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="accounting-topic-right">
                    {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {expanded && (
                  <div className="accounting-topic-body">
                    <div className="accounting-topic-desc">{topic.description}</div>
                    {topic.hasNotes && (
                      <button
                        type="button"
                        className="accounting-view-notes"
                        onClick={() => navigate(`/app/accounting/notes/${topic.id}`)}
                      >
                        View detailed notes
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

