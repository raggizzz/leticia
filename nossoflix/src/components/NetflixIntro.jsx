import { useState, useEffect, useRef } from 'react';

/**
 * Netflix Intro - Animação cinematográfica ao abrir o site
 */
export default function NetflixIntro({ coupleName = 'NossoFlix', onComplete, enabled = true }) {
    const [phase, setPhase] = useState('loading');
    const [showSkip, setShowSkip] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!enabled) {
            onComplete?.();
            return;
        }

        // Mostrar botão de skip após 1 segundo
        const skipTimer = setTimeout(() => setShowSkip(true), 1000);

        // Fase 1: Loading -> Logo
        const phase1 = setTimeout(() => setPhase('logo'), 500);

        // Fase 2: Logo -> Sound
        const phase2 = setTimeout(() => {
            setPhase('sound');
            // Tentar tocar som
            if (audioRef.current) {
                audioRef.current.play().catch(() => { });
            }
        }, 1500);

        // Fase 3: Fade out e completar
        const phase3 = setTimeout(() => {
            setPhase('fadeout');
        }, 4500);

        const complete = setTimeout(() => {
            onComplete?.();
        }, 5500);

        return () => {
            clearTimeout(skipTimer);
            clearTimeout(phase1);
            clearTimeout(phase2);
            clearTimeout(phase3);
            clearTimeout(complete);
        };
    }, [enabled, onComplete]);

    const handleSkip = () => {
        setPhase('fadeout');
        setTimeout(() => onComplete?.(), 300);
    };

    if (!enabled) return null;

    return (
        <>
            <style>{`
                @keyframes netflix-zoom {
                    0% { transform: scale(0.8); opacity: 0; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes netflix-glow {
                    0% { filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0)); }
                    50% { filter: drop-shadow(0 0 60px rgba(236, 72, 153, 0.6)); }
                    100% { filter: drop-shadow(0 0 40px rgba(236, 72, 153, 0.4)); }
                }
                @keyframes netflix-text {
                    0% { letter-spacing: 0.3em; opacity: 0; }
                    100% { letter-spacing: 0.15em; opacity: 1; }
                }
                @keyframes netflix-subtitle {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    100% { transform: scale(2); opacity: 0; }
                }
            `}</style>

            {/* Audio (som opcional estilo Netflix) */}
            <audio ref={audioRef} preload="auto">
                {/* Você pode adicionar um som customizado aqui */}
            </audio>

            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                    opacity: phase === 'fadeout' ? 0 : 1,
                    transition: 'opacity 0.8s ease-out',
                    pointerEvents: phase === 'fadeout' ? 'none' : 'auto',
                }}
            >
                {/* Background gradient */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(236,72,153,0.15) 0%, transparent 60%)',
                }} />

                {/* Main content */}
                <div style={{
                    textAlign: 'center',
                    position: 'relative',
                    opacity: phase === 'loading' ? 0 : 1,
                    transform: phase === 'loading' ? 'scale(0.9)' : 'scale(1)',
                    transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                    {/* Pulse rings */}
                    {phase === 'sound' && (
                        <>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '200px',
                                height: '200px',
                                marginLeft: '-100px',
                                marginTop: '-100px',
                                borderRadius: '50%',
                                border: '2px solid rgba(236, 72, 153, 0.5)',
                                animation: 'pulse-ring 2s ease-out infinite',
                            }} />
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '200px',
                                height: '200px',
                                marginLeft: '-100px',
                                marginTop: '-100px',
                                borderRadius: '50%',
                                border: '2px solid rgba(236, 72, 153, 0.3)',
                                animation: 'pulse-ring 2s ease-out infinite 0.5s',
                            }} />
                        </>
                    )}

                    {/* Logo icon */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        margin: '0 auto 32px',
                        borderRadius: '28px',
                        background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '56px',
                        fontWeight: '700',
                        color: '#fff',
                        animation: phase !== 'loading' ? 'netflix-zoom 1s ease-out, netflix-glow 2s ease-in-out infinite 1s' : 'none',
                        boxShadow: '0 20px 60px rgba(236, 72, 153, 0.4)',
                    }}>
                        N
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: 'clamp(48px, 10vw, 80px)',
                        fontWeight: '700',
                        letterSpacing: '0.15em',
                        color: '#fff',
                        margin: 0,
                        animation: phase !== 'loading' ? 'netflix-text 1.5s ease-out 0.3s both' : 'none',
                        textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    }}>
                        {coupleName.toUpperCase()}
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: '16px',
                        color: 'rgba(255,255,255,0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3em',
                        marginTop: '20px',
                        animation: phase !== 'loading' ? 'netflix-subtitle 1s ease-out 1s both' : 'none',
                    }}>
                        Uma série original
                    </p>
                </div>

                {/* Skip button */}
                {showSkip && phase !== 'fadeout' && (
                    <button
                        onClick={handleSkip}
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            right: '40px',
                            padding: '12px 24px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            backdropFilter: 'blur(10px)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.2)';
                            e.target.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.1)';
                            e.target.style.color = 'rgba(255,255,255,0.7)';
                        }}
                    >
                        Pular intro →
                    </button>
                )}
            </div>
        </>
    );
}
