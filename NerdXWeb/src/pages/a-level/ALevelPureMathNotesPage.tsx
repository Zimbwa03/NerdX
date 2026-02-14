import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Search, Layers3, Sparkles } from 'lucide-react';
import { aLevelPureMathTopics, topicCounts, type ALevelPureMathTopic } from '../../data/aLevelPureMath/topics';
import './ALevelPureMathNotesPage.css';

type SixthLevel = 'Lower Sixth' | 'Upper Sixth';

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function topicNumber(topic: ALevelPureMathTopic): number {
  const index = aLevelPureMathTopics.findIndex((item) => item.id === topic.id);
  return index >= 0 ? index + 1 : 0;
}

export function ALevelPureMathNotesPage() {
  const [selectedLevel, setSelectedLevel] = useState<SixthLevel>('Lower Sixth');
  const [searchText, setSearchText] = useState('');

  const filteredTopics = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return aLevelPureMathTopics.filter((topic) => {
      if (topic.difficulty !== selectedLevel) return false;
      if (!query) return true;
      return (
        topic.name.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.learningObjectives.some((objective) => objective.toLowerCase().includes(query))
      );
    });
  }, [searchText, selectedLevel]);

  const topicOne = aLevelPureMathTopics[0];

  return (
    <div className="subject-page-v2 alevel-notes-page">
      <header className="subject-header-v2">
        <Link to="/app/pure-math" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
            <BookOpen size={28} />
          </div>
          <div>
            <h1>A-Level Pure Math Notes Book</h1>
            <p>Lower Sixth + Upper Sixth expanded chapter notes and examples</p>
          </div>
        </div>
      </header>

      <div className="alevel-notes-layout">
        <section className="alevel-notes-controls">
          <div className="alevel-notes-pill-row" role="tablist" aria-label="Choose level">
            <button
              type="button"
              className={`alevel-notes-pill ${selectedLevel === 'Lower Sixth' ? 'active lower' : ''}`}
              onClick={() => setSelectedLevel('Lower Sixth')}
            >
              Lower Sixth ({topicCounts.lowerSixth})
            </button>
            <button
              type="button"
              className={`alevel-notes-pill ${selectedLevel === 'Upper Sixth' ? 'active upper' : ''}`}
              onClick={() => setSelectedLevel('Upper Sixth')}
            >
              Upper Sixth ({topicCounts.upperSixth})
            </button>
          </div>

          <label className="alevel-notes-search">
            <Search size={16} />
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search chapters, objectives, methods"
            />
          </label>
        </section>

        <section className="alevel-notes-starter">
          <div className="alevel-notes-starter-icon">
            <Sparkles size={18} />
          </div>
          <div className="alevel-notes-starter-content">
            <h3>Start with Topic 1 (Lower Sixth): {topicOne?.name}</h3>
            <p>Expanded deeply with chapter structure, worked examples, and visual diagrams.</p>
          </div>
          {topicOne ? (
            <Link to={`/app/pure-math/notes/${toSlug(topicOne.name)}`} className="alevel-notes-starter-link">
              Open Topic 1
            </Link>
          ) : null}
        </section>

        <section className="alevel-notes-grid">
          {filteredTopics.map((topic) => (
            <Link
              key={topic.id}
              to={`/app/pure-math/notes/${toSlug(topic.name)}`}
              className="alevel-notes-topic-card"
            >
              <div className="alevel-notes-topic-top">
                <span className="alevel-notes-topic-num">Topic {topicNumber(topic)}</span>
                <span className="alevel-notes-topic-paper">
                  <Layers3 size={13} /> {topic.paperRelevance}
                </span>
              </div>
              <h3>{topic.name}</h3>
              <p>{topic.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
