import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Layers, Zap, X, Shuffle, CheckCircle, Lightbulb,
    ChevronLeft, ChevronRight, RotateCcw, Trophy,
    Brain, Target, Sparkles, Eye, EyeOff, ArrowRight
} from 'lucide-react';
import { flashcardApi, type Flashcard } from '../services/api/flashcardApi';
import type { TopicNotes } from '../data/scienceNotes/types';
import { useAuth } from '../context/AuthContext';
import './FlashcardSection.css';

const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
        case 'easy': return '#22C55E';
        case 'medium': return '#F59E0B';
        case 'difficult': return '#EF4444';
        default: return '#7C4DFF';
    }
};

const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
        case 'easy': return '🟢';
        case 'medium': return '🟡';
        case 'difficult': return '🔴';
        default: return '⚪';
    }
};

interface FlashcardSectionProps {
    subject: string;
    topic: string;
    notes: TopicNotes;
    accentColor?: string;
    isDarkMode?: boolean;
}

export const FlashcardSection: React.FC<FlashcardSectionProps> = ({
    subject,
    topic,
    notes,
    accentColor = '#10B981',
}) => {
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const [cardCount, setCardCount] = useState(20);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());
    const [showCompletion, setShowCompletion] = useState(false);
    const [animDirection, setAnimDirection] = useState<'left' | 'right' | null>(null);
    const [genProgress, setGenProgress] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);
    const touchDeltaX = useRef(0);

    const showPlayerRef = useRef(showPlayer);
    const showCompletionRef = useRef(showCompletion);
    const currentIndexRef = useRef(currentIndex);
    const flashcardsLenRef = useRef(flashcards.length);

    useEffect(() => { showPlayerRef.current = showPlayer; }, [showPlayer]);
    useEffect(() => { showCompletionRef.current = showCompletion; }, [showCompletion]);
    useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
    useEffect(() => { flashcardsLenRef.current = flashcards.length; }, [flashcards.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showPlayerRef.current || showCompletionRef.current) return;
            if (e.key === 'ArrowLeft') {
                if (currentIndexRef.current > 0) {
                    setIsFlipped(false);
                    setShowHint(false);
                    setCurrentIndex(prev => prev - 1);
                }
            }
            if (e.key === 'ArrowRight') {
                if (currentIndexRef.current >= flashcardsLenRef.current - 1) {
                    setShowCompletion(true);
                } else {
                    setIsFlipped(false);
                    setShowHint(false);
                    setCurrentIndex(prev => prev + 1);
                }
            }
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setIsFlipped(prev => !prev); setShowHint(false); }
            if (e.key === 'h') setShowHint(prev => !prev);
            if (e.key === 'm') {
                setMasteredCards(prev => {
                    const next = new Set(prev);
                    if (next.has(currentIndexRef.current)) next.delete(currentIndexRef.current);
                    else next.add(currentIndexRef.current);
                    return next;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const getNotesContent = useCallback((): string => {
        const parts: string[] = [];
        if (notes.summary) parts.push(notes.summary);
        notes.sections.forEach(section => {
            parts.push(`## ${section.title}\n${section.content}`);
        });
        if (notes.key_points?.length) {
            parts.push('## Key Points\n' + notes.key_points.join('\n'));
        }
        return parts.join('\n\n');
    }, [notes]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGenProgress(0);
        const progressInterval = setInterval(() => {
            setGenProgress(prev => Math.min(prev + Math.random() * 15, 90));
        }, 500);
        try {
            const notesContent = getNotesContent();
            const result = await flashcardApi.generateFlashcards(
                subject,
                topic,
                cardCount,
                notesContent
            );
            clearInterval(progressInterval);
            setGenProgress(100);

            if (result.creditsRemaining !== undefined) {
                updateUser({ credits: result.creditsRemaining });
            }

            if (result.flashcards.length > 0) {
                setFlashcards(result.flashcards);
                setTimeout(() => {
                    setShowPlayer(true);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                    setGenProgress(0);
                }, 300);
            } else {
                alert('Could not generate flashcards. Please try again.');
            }
        } catch (error) {
            clearInterval(progressInterval);
            setGenProgress(0);
            console.error('Flashcard generation error:', error);
            const status = (error as { response?: { status?: number } })?.response?.status;
            if (status === 402) {
                alert('Insufficient credits. Please top up to generate flashcards.');
                navigate('/app/credits');
                return;
            }
            alert('Error generating flashcards. Please check your connection.');
        } finally {
            setIsGenerating(false);
        }
    };

    const nextCard = () => {
        if (currentIndex >= flashcards.length - 1) {
            setShowCompletion(true);
            return;
        }
        setAnimDirection('left');
        setTimeout(() => {
            setIsFlipped(false);
            setShowHint(false);
            setCurrentIndex(prev => prev + 1);
            setAnimDirection(null);
        }, 150);
    };

    const prevCard = () => {
        if (currentIndex <= 0) return;
        setAnimDirection('right');
        setTimeout(() => {
            setIsFlipped(false);
            setShowHint(false);
            setCurrentIndex(prev => prev - 1);
            setAnimDirection(null);
        }, 150);
    };

    const shuffleCards = () => {
        const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setCurrentIndex(0);
        setIsShuffled(prev => !prev);
        setIsFlipped(false);
        setShowHint(false);
    };

    const toggleMastered = () => {
        setMasteredCards(prev => {
            const next = new Set(prev);
            if (next.has(currentIndex)) next.delete(currentIndex);
            else next.add(currentIndex);
            return next;
        });
    };

    const resetPlayer = () => {
        setShowPlayer(false);
        setShowCompletion(false);
        setFlashcards([]);
        setCurrentIndex(0);
        setIsFlipped(false);
        setShowHint(false);
        setMasteredCards(new Set());
    };

    const restartDeck = () => {
        setShowCompletion(false);
        setCurrentIndex(0);
        setIsFlipped(false);
        setShowHint(false);
    };

    const handleCardFlip = () => {
        setIsFlipped(prev => !prev);
        setShowHint(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    };

    const handleTouchEnd = () => {
        if (Math.abs(touchDeltaX.current) > 60) {
            if (touchDeltaX.current < 0) nextCard();
            else prevCard();
        }
        touchDeltaX.current = 0;
    };

    if (showCompletion) {
        const totalCards = flashcards.length;
        const masteredCount = masteredCards.size;
        const masteredPct = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;
        const circumference = 2 * Math.PI * 54;
        const strokeDashoffset = circumference - (masteredPct / 100) * circumference;

        return (
            <div className="fc-section">
                <div className="fc-completion" style={{ '--fc-accent': accentColor } as React.CSSProperties}>
                    <div className="fc-completion-glow" style={{ background: `radial-gradient(circle, ${accentColor}30, transparent 70%)` }} />

                    <div className="fc-completion-trophy">
                        <Trophy size={48} />
                    </div>

                    <h2 className="fc-completion-title">Deck Complete!</h2>
                    <p className="fc-completion-subtitle">{topic}</p>

                    <div className="fc-completion-ring-wrap">
                        <svg className="fc-completion-ring" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                            <circle
                                cx="60" cy="60" r="54" fill="none"
                                stroke={accentColor} strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className="fc-ring-progress"
                            />
                        </svg>
                        <div className="fc-ring-label">
                            <span className="fc-ring-pct">{masteredPct}%</span>
                            <span className="fc-ring-sub">Mastered</span>
                        </div>
                    </div>

                    <div className="fc-completion-stats">
                        <div className="fc-stat">
                            <Brain size={20} />
                            <span className="fc-stat-val">{totalCards}</span>
                            <span className="fc-stat-label">Total Cards</span>
                        </div>
                        <div className="fc-stat">
                            <CheckCircle size={20} style={{ color: '#22C55E' }} />
                            <span className="fc-stat-val">{masteredCount}</span>
                            <span className="fc-stat-label">Mastered</span>
                        </div>
                        <div className="fc-stat">
                            <Target size={20} style={{ color: '#F59E0B' }} />
                            <span className="fc-stat-val">{totalCards - masteredCount}</span>
                            <span className="fc-stat-label">To Review</span>
                        </div>
                    </div>

                    <div className="fc-completion-actions">
                        <button className="fc-btn fc-btn-secondary" onClick={restartDeck}>
                            <RotateCcw size={18} /> Review Again
                        </button>
                        <button className="fc-btn fc-btn-primary" onClick={resetPlayer} style={{ background: accentColor }}>
                            <Sparkles size={18} /> New Deck
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showPlayer && flashcards.length > 0) {
        const currentCard = flashcards[currentIndex];
        const totalCards = flashcards.length;
        const hasHint = Boolean(currentCard.hint?.trim());
        const isMastered = masteredCards.has(currentIndex);
        const progressPct = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

        return (
            <div className="fc-section">
                <div className="fc-player" style={{ '--fc-accent': accentColor } as React.CSSProperties}>
                    <div className="fc-player-header">
                        <div className="fc-player-info">
                            <div className="fc-player-counter">
                                <Brain size={16} style={{ color: accentColor }} />
                                <span>{currentIndex + 1} <span className="fc-of">of</span> {totalCards}</span>
                            </div>
                            <div className="fc-player-mastered-count">
                                <CheckCircle size={14} style={{ color: '#22C55E' }} />
                                <span>{masteredCards.size} mastered</span>
                            </div>
                        </div>
                        <div className="fc-player-actions">
                            <button
                                className={`fc-icon-btn ${isShuffled ? 'active' : ''}`}
                                onClick={shuffleCards}
                                title="Shuffle cards"
                                style={isShuffled ? { background: accentColor, color: '#fff' } : undefined}
                            >
                                <Shuffle size={18} />
                            </button>
                            <button className="fc-icon-btn" onClick={resetPlayer} title="Close">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="fc-progress-track">
                        <div className="fc-progress-fill" style={{ width: `${progressPct}%`, background: accentColor }} />
                        {flashcards.map((_, i) => (
                            <div
                                key={i}
                                className={`fc-progress-dot ${i === currentIndex ? 'current' : ''} ${masteredCards.has(i) ? 'mastered' : ''} ${i < currentIndex ? 'done' : ''}`}
                                style={{
                                    left: `${((i + 0.5) / totalCards) * 100}%`,
                                    background: i === currentIndex ? accentColor : masteredCards.has(i) ? '#22C55E' : undefined,
                                }}
                            />
                        ))}
                    </div>

                    <div
                        ref={cardRef}
                        className={`fc-card-wrapper ${isFlipped ? 'flipped' : ''} ${animDirection ? `slide-${animDirection}` : ''}`}
                        onClick={handleCardFlip}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardFlip(); } }}
                    >
                        <div className="fc-card-inner">
                            <div className="fc-card-face fc-card-front">
                                <div className="fc-card-top-row">
                                    {currentCard.difficulty && (
                                        <span
                                            className="fc-difficulty"
                                            style={{ background: `${getDifficultyColor(currentCard.difficulty)}20`, color: getDifficultyColor(currentCard.difficulty) }}
                                        >
                                            {getDifficultyIcon(currentCard.difficulty)} {currentCard.difficulty}
                                        </span>
                                    )}
                                    {currentCard.category && (
                                        <span className="fc-category" style={{ color: accentColor }}>
                                            {currentCard.category}
                                        </span>
                                    )}
                                </div>

                                <div className="fc-card-label">QUESTION</div>

                                <div className="fc-card-body">
                                    <p className="fc-question-text">{currentCard.question}</p>
                                </div>

                                {hasHint && (
                                    <div className="fc-hint-area">
                                        <button
                                            className="fc-hint-toggle"
                                            style={{ borderColor: `${accentColor}60`, color: accentColor }}
                                            onClick={(e) => { e.stopPropagation(); setShowHint(prev => !prev); }}
                                        >
                                            {showHint ? <EyeOff size={14} /> : <Eye size={14} />}
                                            {showHint ? 'Hide Hint' : 'Show Hint'}
                                        </button>
                                        {showHint && currentCard.hint && (
                                            <div className="fc-hint-content" style={{ background: `${accentColor}15`, borderColor: `${accentColor}30` }}>
                                                <Lightbulb size={14} style={{ color: accentColor, flexShrink: 0 }} />
                                                <span>{currentCard.hint}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="fc-card-footer">
                                    <span className="fc-tap-label">Tap to reveal answer</span>
                                    <RotateCcw size={14} className="fc-flip-icon" />
                                </div>
                            </div>

                            <div className="fc-card-face fc-card-back" style={{ '--fc-back-accent': accentColor } as React.CSSProperties}>
                                <div className="fc-back-glow" style={{ background: `radial-gradient(ellipse at top, ${accentColor}25, transparent 60%)` }} />

                                <div className="fc-card-label fc-card-label-back">ANSWER</div>

                                <div className="fc-card-body">
                                    <p className="fc-answer-text">{currentCard.answer}</p>
                                </div>

                                <div className="fc-back-actions">
                                    <button
                                        className={`fc-mastered-btn ${isMastered ? 'active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); toggleMastered(); }}
                                    >
                                        <CheckCircle size={18} />
                                        {isMastered ? 'Mastered!' : 'Mark Mastered'}
                                    </button>
                                </div>

                                <div className="fc-card-footer">
                                    <span className="fc-tap-label">Tap to flip back</span>
                                    <RotateCcw size={14} className="fc-flip-icon" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="fc-nav-controls">
                        <button
                            className="fc-nav-btn"
                            onClick={(e) => { e.stopPropagation(); prevCard(); }}
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft size={22} />
                            <span>Prev</span>
                        </button>

                        <div className="fc-nav-dots">
                            {flashcards.map((_, i) => {
                                const dist = Math.abs(i - currentIndex);
                                if (dist > 3 && i !== 0 && i !== totalCards - 1) return null;
                                if (dist === 3 && i !== 0 && i !== totalCards - 1) return <span key={i} className="fc-nav-ellipsis">...</span>;
                                return (
                                    <button
                                        key={i}
                                        className={`fc-nav-dot ${i === currentIndex ? 'active' : ''} ${masteredCards.has(i) ? 'mastered' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentIndex(i);
                                            setIsFlipped(false);
                                            setShowHint(false);
                                        }}
                                        style={i === currentIndex ? { background: accentColor, borderColor: accentColor } : undefined}
                                    />
                                );
                            })}
                        </div>

                        <button
                            className="fc-nav-btn fc-nav-btn-next"
                            onClick={(e) => { e.stopPropagation(); nextCard(); }}
                            style={{ background: accentColor }}
                        >
                            <span>{currentIndex === totalCards - 1 ? 'Finish' : 'Next'}</span>
                            {currentIndex === totalCards - 1 ? <Trophy size={18} /> : <ChevronRight size={22} />}
                        </button>
                    </div>

                    <div className="fc-keyboard-hint">
                        <span><kbd>←</kbd> <kbd>→</kbd> navigate</span>
                        <span><kbd>Space</kbd> flip</span>
                        <span><kbd>H</kbd> hint</span>
                        <span><kbd>M</kbd> master</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fc-section">
            <div className="fc-setup" style={{ '--fc-accent': accentColor } as React.CSSProperties}>
                <div className="fc-setup-header">
                    <div className="fc-setup-icon" style={{ background: `${accentColor}20` }}>
                        <Layers size={28} style={{ color: accentColor }} />
                    </div>
                    <div>
                        <h2 className="fc-setup-title">AI Flashcards</h2>
                        <p className="fc-setup-subtitle">Generate smart cards from your notes</p>
                    </div>
                </div>

                <div className="fc-setup-features">
                    <div className="fc-feature">
                        <Brain size={16} style={{ color: accentColor }} />
                        <span>AI-generated questions</span>
                    </div>
                    <div className="fc-feature">
                        <Lightbulb size={16} style={{ color: '#F59E0B' }} />
                        <span>Hints included</span>
                    </div>
                    <div className="fc-feature">
                        <Target size={16} style={{ color: '#EF4444' }} />
                        <span>Difficulty levels</span>
                    </div>
                    <div className="fc-feature">
                        <CheckCircle size={16} style={{ color: '#22C55E' }} />
                        <span>Track mastery</span>
                    </div>
                </div>

                <div className="fc-setup-slider">
                    <div className="fc-slider-header">
                        <label>Number of Cards</label>
                        <span className="fc-slider-value" style={{ color: accentColor }}>{cardCount}</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={cardCount}
                        onChange={(e) => setCardCount(parseInt(e.target.value))}
                        className="fc-range"
                        style={{ '--fc-accent': accentColor } as React.CSSProperties}
                    />
                    <div className="fc-slider-labels">
                        <span>5</span>
                        <span>25</span>
                        <span>50</span>
                    </div>
                </div>

                {isGenerating ? (
                    <div className="fc-generating">
                        <div className="fc-gen-spinner">
                            <Sparkles size={24} className="fc-gen-icon" style={{ color: accentColor }} />
                        </div>
                        <p className="fc-gen-text">Generating {cardCount} flashcards...</p>
                        <div className="fc-gen-bar">
                            <div className="fc-gen-fill" style={{ width: `${genProgress}%`, background: accentColor }} />
                        </div>
                    </div>
                ) : (
                    <button
                        className="fc-generate-btn"
                        onClick={handleGenerate}
                        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)` }}
                    >
                        <Zap size={20} />
                        <span>Generate Flashcards</span>
                        <ArrowRight size={18} />
                    </button>
                )}

                <div className="fc-cost-info">
                    <Sparkles size={12} />
                    <span>0.25 credits per card = <strong>{(cardCount * 0.25).toFixed(1)} credits</strong></span>
                </div>
            </div>
        </div>
    );
};
