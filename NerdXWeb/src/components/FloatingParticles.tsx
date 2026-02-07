/**
 * FloatingParticles - CSS-only animated background particles
 * Creates a premium, modern look with floating gradient orbs
 */
import { useMemo } from 'react';

interface FloatingParticlesProps {
    count?: number;
}

export function FloatingParticles({ count = 15 }: FloatingParticlesProps) {
    const particles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            size: Math.random() * 60 + 20,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5,
            duration: Math.random() * 10 + 15,
            opacity: Math.random() * 0.15 + 0.05,
            hue: Math.random() * 60 + 240, // Purple to blue range
        }));
    }, [count]);

    return (
        <div className="floating-particles-container" aria-hidden="true">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="floating-particle"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        opacity: p.opacity,
                        background: `radial-gradient(circle, hsla(${p.hue}, 80%, 60%, 0.4) 0%, transparent 70%)`,
                    }}
                />
            ))}
        </div>
    );
}
