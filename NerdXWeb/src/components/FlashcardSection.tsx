/**
 * FlashcardSection - Web Version
 * Ports the mobile flashcard functionality to the web (hint, difficulty, category, mastered, shuffle, progress bar)
 */
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Zap, Info, X, Shuffle, CheckCircle, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { flashcardApi, type Flashcard } from '../services/api/flashcardApi';
import type { TopicNotes } from '../data/scienceNotes/types';
import '../pages/sciences/ScienceUniverse.css'; // Reusing science styles for consistency
import { useAuth } from '../context/AuthContext';

const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
        case 'easy': return '#4CAF50';
        case 'medium': return '#FF9800';
        case 'difficult': return '#F44336';
        default: return '#7C4DFF';
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

    // Convert notes to text context
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
        try {
            const notesContent = getNotesContent();
            // For web, we currently default to batch generation for simplicity 
            // (Streaming can be added later if needed)
            const result = await flashcardApi.generateFlashcards(
                subject,
                topic,
                cardCount,
                notesContent
            );

            if (result.creditsRemaining !== undefined) {
                updateUser({ credits: result.creditsRemaining });
            }

            if (result.flashcards.length > 0) {
                setFlashcards(result.flashcards);
                setShowPlayer(true);
                setCurrentIndex(0);
                setIsFlipped(false);
            } else {
                alert('Could not generate flashcards. Please try again.');
            }
        } catch (error) {
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
        setIsFlipped(false);
        setShowHint(false);
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevCard = () => {
        setIsFlipped(false);
        setShowHint(false);
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const shuffleCards = (e: React.MouseEvent) => {
        e.stopPropagation();
        const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setCurrentIndex(0);
        setIsShuffled(prev => !prev);
        setIsFlipped(false);
        setShowHint(false);
    };

    const toggleMastered = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMasteredCards(prev => {
            const next = new Set(prev);
            if (next.has(currentIndex)) next.delete(currentIndex);
            else next.add(currentIndex);
            return next;
        });
    };

    const resetPlayer = () => {
        setShowPlayer(false);
        setFlashcards([]);
        setCurrentIndex(0);
        setIsFlipped(false);
        setShowHint(false);
        setMasteredCards(new Set());
    };

    const handleCardFlip = () => {
        setIsFlipped(prev => !prev);
        setShowHint(false);
    };

    if (showPlayer && flashcards.length > 0) {
        const currentCard = flashcards[currentIndex];
        const totalCards = flashcards.length;
        const hasHint = Boolean(currentCard.hint?.trim());
        const isMastered = masteredCards.has(currentIndex);
        const progressPct = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;
        const dotStart = Math.max(0, currentIndex - 2);
        const dotEnd = Math.min(flashcards.length, currentIndex + 3);

        return (
            <div className="science-flashcard-player" style={{ borderColor: accentColor }}>
                <div className="player-header">
                    <div className="player-progress-wrap">
                        <div className="player-progress">
                            Card {currentIndex + 1} / {totalCards}
                        </div>
                        <div className="player-progress-bar">
                            <div
                                className="player-progress-fill"
                                style={{ width: `${progressPct}%`, backgroundColor: accentColor }}
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={shuffleCards}
                        className={`player-shuffle-btn ${isShuffled ? 'active' : ''}`}
                        style={isShuffled ? { backgroundColor: accentColor } : undefined}
                        title="Shuffle cards"
                    >
                        <Shuffle size={20} />
                    </button>
                    <button type="button" onClick={resetPlayer} className="player-close-btn" title="Close">
                        <X size={20} />
                    </button>
                </div>

                <div className="player-mastered-row">
                    <CheckCircle size={16} className="mastered-icon" />
                    <span className="player-mastered-text">{masteredCards.size} mastered</span>
                </div>

                <div
                    className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}
                    onClick={handleCardFlip}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardFlip(); } }}
                    aria-label={isFlipped ? 'Tap to flip back to question' : 'Tap to flip and see answer'}
                >
                    <div className="flashcard-inner">
                        <div className="flashcard-front">
                            {currentCard.difficulty && (
                                <div
                                    className="flashcard-difficulty-badge"
                                    style={{ backgroundColor: getDifficultyColor(currentCard.difficulty) }}
                                >
                                    {currentCard.difficulty.toUpperCase()}
                                </div>
                            )}
                            {currentCard.category && (
                                <div className="flashcard-category" style={{ color: accentColor }}>
                                    {currentCard.category}
                                </div>
                            )}
                            <div className="card-label">QUESTION</div>
                            <div className="card-content">{currentCard.question}</div>
                            {hasHint && (
                                <button
                                    type="button"
                                    className="flashcard-hint-btn"
                                    style={{ borderColor: accentColor, color: accentColor }}
                                    onClick={(e) => { e.stopPropagation(); setShowHint(prev => !prev); }}
                                >
                                    <Lightbulb size={16} />
                                    {showHint ? 'Hide Hint' : 'Show Hint'}
                                </button>
                            )}
                            {showHint && hasHint && currentCard.hint && (
                                <div className="flashcard-hint-box" style={{ backgroundColor: `${accentColor}20` }}>
                                    💡 {currentCard.hint}
                                </div>
                            )}
                            <div className="card-hint">TAP TO FLIP</div>
                        </div>
                        <div className="flashcard-back" style={{ borderColor: accentColor }}>
                            <div className="card-label" style={{ color: 'rgba(255,255,255,0.95)' }}>ANSWER</div>
                            <div className="card-content">{currentCard.answer}</div>
                            <button
                                type="button"
                                className={`flashcard-mastered-btn ${isMastered ? 'active' : ''}`}
                                onClick={toggleMastered}
                            >
                                <CheckCircle size={20} />
                                {isMastered ? 'Mastered!' : 'Mark as Mastered'}
                            </button>
                            <div className="card-hint">TAP TO FLIP BACK</div>
                        </div>
                    </div>
                </div>

                <div className="player-controls">
                    <button
                        type="button"
                        onClick={prevCard}
                        disabled={currentIndex === 0}
                        className="control-btn"
                    >
                        <ChevronLeft size={24} />
                        Previous
                    </button>

                    <div className="player-dots">
                        {flashcards.slice(dotStart, dotEnd).map((_, i) => {
                            const idx = dotStart + i;
                            return (
                                <span
                                    key={idx}
                                    className={`player-dot ${idx === currentIndex ? 'active' : ''}`}
                                    style={{
                                        backgroundColor: idx === currentIndex ? accentColor : 'rgba(255,255,255,0.2)',
                                        transform: idx === currentIndex ? 'scale(1.3)' : 'scale(1)',
                                    }}
                                />
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={nextCard}
                        disabled={currentIndex === flashcards.length - 1}
                        className="control-btn primary"
                        style={{ backgroundColor: accentColor }}
                    >
                        {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next'}
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="science-notes-card flashcard-setup-card">
            <div className="science-notes-card-header">
                <Layers size={24} className="science-notes-card-icon" style={{ color: accentColor }} />
                <h2 className="science-notes-card-title">AI Flashcards</h2>
            </div>

            <div className="flashcard-setup-body">
                <p className="setup-desc">
                    Generate custom flashcards from these notes to test your knowledge.
                </p>

                <div className="slider-container">
                    <label>Number of Cards: <span className="highlight-text">{cardCount}</span></label>
                    <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={cardCount}
                        onChange={(e) => setCardCount(parseInt(e.target.value))}
                        className="range-slider"
                        style={{ accentColor: accentColor }}
                    />
                </div>

                <button
                    className="generate-btn"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    style={{ backgroundColor: accentColor }}
                >
                    {isGenerating ? (
                        <span>Generating...</span>
                    ) : (
                        <>
                            <Zap size={18} />
                            Generate Flashcards
                        </>
                    )}
                </button>

                <div className="credit-cost-info">
                    <Info size={14} />
                    <span>0.25 credits per card</span>
                </div>
            </div>
        </div>
    );
};
