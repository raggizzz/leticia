import { useEffect, useState } from 'react';

/**
 * Mini-Preview da capa do site em tempo real
 * Mostra como ficará o Hero com os nomes do casal
 */
export function HeroMiniPreview({
    creatorName = 'Nome',
    partnerName = 'Parceiro(a)',
    heroBackground = null,
    startDate = null,
    currentSeason = 1
}) {
    const [isAnimating, setIsAnimating] = useState(false);

    // Animar quando os nomes mudam
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 300);
        return () => clearTimeout(timer);
    }, [creatorName, partnerName]);

    // Calcular tempo juntos
    const getTimeTogetherText = () => {
        if (!startDate) return { year: '2024', month: 'jan', day: '01' };
        const date = new Date(startDate);
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        return {
            year: date.getFullYear().toString(),
            month: months[date.getMonth()],
            day: date.getDate().toString().padStart(2, '0')
        };
    };

    const timeTogether = getTimeTogetherText();

    const styles = {
        container: {
            position: 'relative',
            width: '100%',
            aspectRatio: '16/10',
            borderRadius: '16px',
            overflow: 'hidden',
            background: heroBackground
                ? `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url(${heroBackground}) center/cover`
                : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        },
        overlay: {
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
        },
        content: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px',
        },
        seriesLabel: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
        },
        redDot: {
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#e50914',
            animation: 'pulse 2s infinite',
        },
        seriesText: {
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '2px',
            color: '#e50914',
            textTransform: 'uppercase',
        },
        nossoflixText: {
            fontSize: '10px',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '1px',
        },
        namesContainer: {
            transition: 'all 0.3s ease',
            transform: isAnimating ? 'scale(1.02)' : 'scale(1)',
        },
        creatorName: {
            fontSize: '28px',
            fontWeight: '900',
            color: 'white',
            lineHeight: '1',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            margin: 0,
        },
        ampersand: {
            fontSize: '16px',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.6)',
            margin: '2px 0',
            display: 'block',
        },
        partnerName: {
            fontSize: '28px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #dc2626 0%, #be185d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1',
            textShadow: 'none',
            margin: 0,
        },
        badges: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '10px',
            flexWrap: 'wrap',
        },
        ratingBadge: {
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            background: '#fbbf24',
            color: '#000',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '9px',
            fontWeight: '700',
        },
        genreBadge: {
            padding: '2px 8px',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px',
            fontSize: '8px',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.5px',
        },
        stats: {
            display: 'flex',
            alignItems: 'flex-end',
            gap: '20px',
            marginTop: '12px',
        },
        statItem: {
            textAlign: 'center',
        },
        statValue: {
            fontSize: '16px',
            fontWeight: '800',
            color: 'white',
            lineHeight: '1',
        },
        statLabel: {
            fontSize: '7px',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginTop: '2px',
        },
        liveIndicator: {
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            padding: '4px 8px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
        },
        liveText: {
            fontSize: '8px',
            fontWeight: '600',
            color: '#4ade80',
            letterSpacing: '0.5px',
        },
        liveDot: {
            width: '6px',
            height: '6px',
            background: '#4ade80',
            borderRadius: '50%',
            animation: 'pulse 1.5s infinite',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.overlay} />

            {/* Live Indicator */}
            <div style={styles.liveIndicator}>
                <div style={styles.liveDot} />
                <span style={styles.liveText}>PREVIEW AO VIVO</span>
            </div>

            <div style={styles.content}>
                {/* Series Label */}
                <div style={styles.seriesLabel}>
                    <div style={styles.redDot} />
                    <span style={styles.seriesText}>SÉRIE ORIGINAL</span>
                    <span style={styles.nossoflixText}>NOSSOFLIX</span>
                </div>

                {/* Names */}
                <div style={styles.namesContainer}>
                    <h2 style={styles.creatorName}>
                        {creatorName || 'Seu Nome'}
                    </h2>
                    <span style={styles.ampersand}>&</span>
                    <h2 style={styles.partnerName}>
                        {partnerName || 'Nome do Amor'}
                    </h2>
                </div>

                {/* Badges */}
                <div style={styles.badges}>
                    <span style={styles.ratingBadge}>
                        ⭐ 5.0
                    </span>
                    <span style={styles.genreBadge}>ROMANCE</span>
                    <span style={styles.genreBadge}>DRAMA</span>
                    <span style={styles.genreBadge}>COMÉDIA</span>
                </div>

                {/* Stats */}
                <div style={styles.stats}>
                    <div style={styles.statItem}>
                        <div style={styles.statValue}>{timeTogether.year}</div>
                        <div style={styles.statLabel}>CONHECIDOS</div>
                    </div>
                    <div style={styles.statItem}>
                        <div style={styles.statValue}>{timeTogether.month} de {timeTogether.day}</div>
                        <div style={styles.statLabel}>JUNTOS</div>
                    </div>
                    <div style={styles.statItem}>
                        <div style={{ ...styles.statValue, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }} />
                            <span style={{ color: '#4ade80' }}>∞</span>
                        </div>
                        <div style={styles.statLabel}>TEMPORADAS</div>
                    </div>
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}

export default HeroMiniPreview;
