import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import { ArrowLeft, BookOpen } from 'lucide-react';

const GEO_TOPICS_FALLBACK: Topic[] = [
  { id: 'weather_and_climate', name: 'Weather and Climate', subject: 'geography' },
  { id: 'landforms_and_landscape_processes', name: 'Landforms and Landscape Processes', subject: 'geography' },
  { id: 'ecosystems', name: 'Ecosystems', subject: 'geography' },
  { id: 'natural_resources', name: 'Natural Resources', subject: 'geography' },
  { id: 'energy_and_power_development', name: 'Energy and Power Development', subject: 'geography' },
  { id: 'map_work_and_geographical_information_systems__gis_', name: 'Map Work and Geographical Information Systems (GIS)', subject: 'geography' },
  { id: 'minerals_and_mining', name: 'Minerals and Mining', subject: 'geography' },
  { id: 'environmental_management', name: 'Environmental Management', subject: 'geography' },
  { id: 'agriculture_and_land_reform', name: 'Agriculture and Land Reform', subject: 'geography' },
  { id: 'industry', name: 'Industry', subject: 'geography' },
  { id: 'settlement_and_population', name: 'Settlement and Population', subject: 'geography' },
  { id: 'transport_and_trade', name: 'Transport and Trade', subject: 'geography' },
];

export function GeographyNotesPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('geography');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(GEO_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(GEO_TOPICS_FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayTopics = topics.length ? topics : GEO_TOPICS_FALLBACK;

  return (
    <div className="geo-notes-page">
      <header className="geo-notes-header">
        <Link to="/app/geography" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="geo-notes-title">Geography Notes</h1>
        <p className="geo-notes-subtitle">Comprehensive notes aligned with ZIMSEC O-Level syllabus</p>
      </header>

      <section className="geo-notes-content">
        <div className="geo-notes-intro">
          <div className="geo-notes-intro-icon">
            <BookOpen size={40} />
          </div>
          <p>
            Notes for each topic are aligned with the ZIMSEC O-Level Geography syllabus (All Level, Forms 1–4).
            Use the Quiz and Exam features to practice. Full interactive notes with maps and case studies are available in the NerdX mobile app.
          </p>
        </div>

        <h2 className="geo-notes-topics-title">Topics</h2>
        {loading ? (
          <div className="geo-notes-loading">Loading topics…</div>
        ) : (
          <ul className="geo-notes-topic-list">
            {displayTopics.map((topic) => (
              <li key={topic.id} className="geo-notes-topic-item">
                <span className="geo-notes-topic-name">{topic.name}</span>
                <span className="geo-notes-topic-badge">Syllabus-aligned</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
