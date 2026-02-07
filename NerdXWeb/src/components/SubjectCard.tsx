/**
 * SubjectCard - Premium gradient subject card (no images)
 * Features animated gradients, icons, and glow effects
 */
import React, { type ElementType } from 'react';



interface SubjectCardProps {
    title: string;
    subtitle: string;
    icon: ElementType;
    gradientFrom: string;
    gradientTo: string;
    onClick: () => void;
}

export function SubjectCard({ title, subtitle, icon: Icon, gradientFrom, gradientTo, onClick }: SubjectCardProps) {
    return (
        <button
            type="button"
            className="subject-card"
            onClick={onClick}
            style={{
                '--gradient-from': gradientFrom,
                '--gradient-to': gradientTo,
            } as React.CSSProperties}
        >
            <div className="subject-card-bg" />
            <div className="subject-card-glow" />
            <div className="subject-card-content">
                <div className="subject-card-icon">
                    <Icon size={32} strokeWidth={1.5} />
                </div>
                <div className="subject-card-text">
                    <span className="subject-card-title">{title}</span>
                    <span className="subject-card-subtitle">{subtitle}</span>
                </div>
            </div>
            <div className="subject-card-arrow">→</div>
        </button>
    );
}
