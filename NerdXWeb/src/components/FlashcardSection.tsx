/**
 * FlashcardSection - Web Version
 * Ports the mobile flashcard functionality to the web
 */
import React, { useState, useCallback } from 'react';
import { Layers, Zap, Info, X } from 'lucide-react';
import { flashcardApi, type Flashcard } from '../services/api/flashcardApi';
import type { TopicNotes } from '../data/scienceNotes/types';
import '../pages/sciences/ScienceUniverse.css'; // Reusing science styles for consistency

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
    const [cardCount, setCardCount] = useState(20);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

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
            const cards = await flashcardApi.generateFlashcards(
                subject,
                topic,
                cardCount,
                notesContent
            );

            if (cards.length > 0) {
                setFlashcards(cards);
                setShowPlayer(true);
                setCurrentIndex(0);
                setIsFlipped(false);
            } else {
                alert('Could not generate flashcards. Please try again.');
            }
        } catch (error) {
            console.error('Flashcard generation error:', error);
            alert('Error generating flashcards. Please check your connection.');
        } finally {
            setIsGenerating(false);
        }
    };

    const nextCard = () => {
        setIsFlipped(false);
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevCard = () => {
        setIsFlipped(false);
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const resetPlayer = () => {
        setShowPlayer(false);
        setFlashcards([]);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    if (showPlayer && flashcards.length > 0) {
        const currentCard = flashcards[currentIndex];

        return (
            <div className="science-flashcard-player" style={{ borderColor: accentColor }}>
                <div className="player-header">
                    <div className="player-progress">
                        Card {currentIndex + 1} / {flashcards.length}
                    </div>
                    <button onClick={resetPlayer} className="player-close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div
                    className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className="flashcard-inner">
                        <div className="flashcard-front">
                            <div className="card-label">QUESTION</div>
                            <div className="card-content">{currentCard.question}</div>
                            <div className="card-hint">Click to flip</div>
                        </div>
                        <div className="flashcard-back" style={{ borderColor: accentColor }}>
                            <div className="card-label" style={{ color: accentColor }}>ANSWER</div>
                            <div className="card-content">{currentCard.answer}</div>
                        </div>
                    </div>
                </div>

                <div className="player-controls">
                    <button
                        onClick={prevCard}
                        disabled={currentIndex === 0}
                        className="control-btn"
                    >
                        Previous
                    </button>

                    <button
                        onClick={nextCard}
                        disabled={currentIndex === flashcards.length - 1}
                        className="control-btn primary"
                        style={{ backgroundColor: accentColor }}
                    >
                        {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next'}
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
