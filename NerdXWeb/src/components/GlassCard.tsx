/**
 * GlassCard - Premium glassmorphism card component
 * Features backdrop blur, border glow, and smooth transitions
 */
import React, { type ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    glowColor?: string;
    onClick?: () => void;
}

export function GlassCard({ children, className = '', glowColor = '#7C4DFF', onClick }: GlassCardProps) {
    const isButton = !!onClick;
    const Component = isButton ? 'button' : 'div';

    return (
        <Component
            className={`glass-card-component ${className}`}
            style={{ '--glow-color': glowColor } as React.CSSProperties}
            onClick={onClick}
            type={isButton ? 'button' : undefined}
        >
            {children}
        </Component>
    );
}
