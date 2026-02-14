import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TeacherCard } from '../../components/marketplace/TeacherCard';
import { searchTeachers } from '../../services/api/teacherMarketplaceApi';
import {
  MARKETPLACE_SUBJECTS,
  ACADEMIC_LEVELS,
  DAYS_OF_WEEK,
  FEATURED_TEACHERS,
} from '../../data/marketplaceConstants';
import type { TeacherProfile, TeacherSearchFilters, AcademicLevel, DayOfWeek } from '../../types';
import {
  Search, SlidersHorizontal, ArrowLeft, GraduationCap, Star,
  Loader2, Users, X, RefreshCw, Rss
} from 'lucide-react';

export function FindTeacherPage() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [academicLevel, setAcademicLevel] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [dayOfWeek, setDayOfWeek] = useState('');

  const activeFilterCount = [subject, academicLevel, minRating > 0, dayOfWeek].filter(Boolean).length;

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const filters: TeacherSearchFilters = {};
      if (query.trim()) filters.query = query.trim();
      if (subject) filters.subject = subject;
      if (academicLevel) filters.academic_level = academicLevel as AcademicLevel;
      if (minRating > 0) filters.min_rating = minRating;
      if (dayOfWeek) filters.day_of_week = dayOfWeek as DayOfWeek;

      const results = await searchTeachers(filters);
      setTeachers(results);
    } catch {
      console.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  }, [query, subject, academicLevel, minRating, dayOfWeek]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const clearFilters = () => {
    setQuery('');
    setSubject('');
    setAcademicLevel('');
    setMinRating(0);
    setDayOfWeek('');
  };

  // Demo teacher profiles for preview when no results from Supabase
  const demoTeachers: TeacherProfile[] = FEATURED_TEACHERS.map((ft) => ({
    id: ft.id,
    user_id: ft.id,
    full_name: ft.full_name,
    surname: ft.surname,
    email: '',
    whatsapp: '',
    bio: ft.bio,
    experience_description: '',
    years_of_experience: 5 + Math.floor(Math.random() * 10),
    verification_status: 'approved' as const,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subjects: ft.subjects.map((s, i) => ({
      id: `${ft.id}-subj-${i}`,
      teacher_id: ft.id,
      subject_name: s,
      academic_level: 'O-Level' as const,
      form_levels: ['Form 3', 'Form 4'] as any,
      curriculum: 'ZIMSEC' as const,
    })),
    average_rating: ft.rating,
    total_reviews: ft.reviews,
  }));

  const displayTeachers = teachers.length > 0 ? teachers : demoTeachers;

  return (
    <div className="marketplace-page">
      {/* Hero */}
      <div className="marketplace-hero">
        <Link to="/app" className="marketplace-hero__back">
          <ArrowLeft size={20} />
        </Link>
        <div className="marketplace-hero__content">
          <div className="marketplace-hero__icon">
            <GraduationCap size={32} />
          </div>
          <h1 className="marketplace-hero__title">Find Your Perfect Teacher</h1>
          <p className="marketplace-hero__subtitle">
            Browse verified ZIMSEC & Cambridge teachers. Filter by subject, level, and rating.
          </p>
        </div>
      </div>

      {/* Feed link bar */}
      <div className="marketplace-feed-bar">
        <Link to="/app/marketplace/feed" className="marketplace-feed-bar__link">
          <Rss size={16} />
          <span>Browse Teacher Feed</span>
          <span className="marketplace-feed-bar__arrow">&rarr;</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="marketplace-search">
        <div className="marketplace-search__bar">
          <Search size={18} className="marketplace-search__icon" />
          <input
            type="text"
            placeholder="Search by name or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="marketplace-search__input"
          />
          {query && (
            <button type="button" className="marketplace-search__clear" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="button"
          className={`marketplace-filter-toggle${activeFilterCount > 0 ? ' marketplace-filter-toggle--active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={18} />
          Filters
          {activeFilterCount > 0 && (
            <span className="marketplace-filter-toggle__count">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="marketplace-filters">
          <div className="marketplace-filters__grid">
            <div className="marketplace-filters__field">
              <label>Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="">All Subjects</option>
                {MARKETPLACE_SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="marketplace-filters__field">
              <label>Academic Level</label>
              <select value={academicLevel} onChange={(e) => setAcademicLevel(e.target.value)}>
                <option value="">All Levels</option>
                {ACADEMIC_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="marketplace-filters__field">
              <label>Minimum Rating</label>
              <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
            <div className="marketplace-filters__field">
              <label>Available On</label>
              <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                <option value="">Any Day</option>
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button type="button" className="marketplace-filters__clear" onClick={clearFilters}>
              <RefreshCw size={14} /> Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Results header */}
      <div className="marketplace-results-header">
        <span className="marketplace-results-header__count">
          <Users size={16} />
          {displayTeachers.length} teacher{displayTeachers.length !== 1 ? 's' : ''} found
        </span>
        {teachers.length === 0 && !loading && (
          <span className="marketplace-results-header__demo">
            <Star size={14} /> Showing featured teachers
          </span>
        )}
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="marketplace-loading">
          <Loader2 size={32} className="marketplace-loading__spinner" />
          <span>Finding teachers...</span>
        </div>
      ) : displayTeachers.length > 0 ? (
        <div className="marketplace-grid">
          {displayTeachers.map((t) => (
            <TeacherCard key={t.id} teacher={t} />
          ))}
        </div>
      ) : (
        <div className="marketplace-empty">
          <GraduationCap size={48} />
          <h3>No Teachers Found</h3>
          <p>No teachers match your current filters. Try adjusting your search criteria.</p>
          <button type="button" className="to-btn to-btn--outline" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
