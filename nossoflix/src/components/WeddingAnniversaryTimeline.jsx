import { useState, useMemo, memo, useCallback } from 'react';

/**
 * WEDDING_ANNIVERSARIES - Bodas de casamento brasileiras
 */
const WEDDING_ANNIVERSARIES = [
    { year: 1, name: 'Papel', emoji: '📜', meaning: 'Como uma folha em branco, vocês começam a escrever juntos a história do amor. Frágil, mas cheio de possibilidades.' },
    { year: 2, name: 'Algodão', emoji: '🧵', meaning: 'O algodão representa a flexibilidade e adaptação. Vocês aprendem a se moldar um ao outro.' },
    { year: 3, name: 'Trigo', emoji: '🌾', meaning: 'O trigo simboliza abundância e prosperidade. O amor de vocês começa a dar frutos.' },
    { year: 4, name: 'Flores', emoji: '🌸', meaning: 'As flores representam a beleza e a delicadeza do amor que floresce a cada dia.' },
    { year: 5, name: 'Madeira', emoji: '🪵', meaning: 'A madeira simboliza a solidez e as raízes profundas que vocês criaram juntos.' },
    { year: 6, name: 'Perfume', emoji: '🌹', meaning: 'O perfume representa a essência do amor que permanece mesmo quando vocês estão longe.' },
    { year: 7, name: 'Lã', emoji: '🧶', meaning: 'A lã simboliza o conforto e o aconchego que vocês proporcionam um ao outro.' },
    { year: 8, name: 'Barro', emoji: '🏺', meaning: 'O barro representa a moldagem mútua. Vocês se transformam juntos.' },
    { year: 9, name: 'Vime', emoji: '🧺', meaning: 'O vime simboliza a união de fios diferentes formando algo belo e resistente.' },
    { year: 10, name: 'Estanho', emoji: '✨', meaning: 'O estanho representa a durabilidade e a resistência do seu amor.' },
    { year: 15, name: 'Cristal', emoji: '💠', meaning: 'O cristal simboliza a transparência e a pureza do relacionamento.' },
    { year: 20, name: 'Porcelana', emoji: '🏺', meaning: 'A porcelana representa a delicadeza que resistiu ao tempo.' },
    { year: 25, name: 'Prata', emoji: '🥈', meaning: 'A prata simboliza as bodas de prata - um marco precioso de amor duradouro.' },
    { year: 30, name: 'Pérola', emoji: '🦪', meaning: 'A pérola nasce da perseverança. Vocês transformaram desafios em beleza.' },
    { year: 40, name: 'Esmeralda', emoji: '💚', meaning: 'A esmeralda simboliza a esperança eterna e o amor que se renova.' },
    { year: 50, name: 'Ouro', emoji: '🥇', meaning: 'As bodas de ouro celebram o amor mais valioso - resistente ao tempo.' },
    { year: 60, name: 'Diamante', emoji: '💎', meaning: 'O diamante representa o amor eterno e indestrutível.' },
    { year: 75, name: 'Brilhante', emoji: '✨', meaning: 'O brilhante celebra o esplendor de uma vida inteira de amor.' },
];

/**
 * WeddingAnniversaryTimeline - Timeline premium de bodas
 */
const WeddingAnniversaryTimeline = memo(function WeddingAnniversaryTimeline({
    startDate,
    maxItems = 10,
}) {
    const [selectedBoda, setSelectedBoda] = useState(null);

    const anniversariesWithStatus = useMemo(() => {
        if (!startDate) return [];

        const start = new Date(startDate);
        const now = new Date();

        return WEDDING_ANNIVERSARIES.map(boda => {
            const anniversaryDate = new Date(start);
            anniversaryDate.setFullYear(start.getFullYear() + boda.year);

            const isComplete = now >= anniversaryDate;
            const diffMs = anniversaryDate - now;
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            const daysSinceComplete = isComplete ? Math.floor((now - anniversaryDate) / (1000 * 60 * 60 * 24)) : 0;

            return { ...boda, anniversaryDate, isComplete, daysRemaining: isComplete ? 0 : diffDays, daysSinceComplete };
        });
    }, [startDate]);

    const displayedAnniversaries = useMemo(() => {
        const nextIndex = anniversariesWithStatus.findIndex(a => !a.isComplete);
        const startIdx = Math.max(0, (nextIndex !== -1 ? nextIndex : anniversariesWithStatus.length) - 2);
        return anniversariesWithStatus.slice(startIdx, startIdx + maxItems);
    }, [anniversariesWithStatus, maxItems]);

    const handleClose = useCallback(() => setSelectedBoda(null), []);

    if (!startDate) return null;

    return (
        <section
            style={{
                padding: 'clamp(3rem, 8vw, 6rem) 0',
                background: 'linear-gradient(180deg, transparent 0%, rgba(139, 115, 69, 0.02) 50%, transparent 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'min(600px, 80vw)',
                    height: 'min(400px, 60vw)',
                    background: 'radial-gradient(ellipse, rgba(255, 215, 0, 0.04) 0%, transparent 60%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                }}
            />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2rem)', position: 'relative' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
                    <span
                        style={{
                            display: 'inline-block',
                            fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                            fontWeight: 600,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(255, 215, 0, 0.7)',
                            marginBottom: '0.75rem',
                        }}
                    >
                        Celebrações
                    </span>
                    <h2
                        style={{
                            fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 50%, #ff8c00 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            margin: '0 0 0.5rem 0',
                            lineHeight: 1.1,
                        }}
                    >
                        💍 Bodas
                    </h2>
                    <p style={{
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                        color: 'rgba(255, 255, 255, 0.4)',
                        margin: 0,
                        maxWidth: '400px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                        Cada ano é um marco na jornada do amor
                    </p>
                </header>

                {/* Carousel container */}
                <div style={{ position: 'relative' }}>
                    {/* Gradient masks */}
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 'clamp(40px, 8vw, 80px)',
                            background: 'linear-gradient(to right, #0a0a0a, transparent)',
                            zIndex: 10,
                            pointerEvents: 'none',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: 'clamp(40px, 8vw, 80px)',
                            background: 'linear-gradient(to left, #0a0a0a, transparent)',
                            zIndex: 10,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Scrollable carousel */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 'clamp(0.75rem, 2vw, 1rem)',
                            overflowX: 'auto',
                            padding: 'clamp(0.5rem, 2vw, 1rem) clamp(2rem, 5vw, 4rem)',
                            scrollSnapType: 'x mandatory',
                            scrollBehavior: 'smooth',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                        }}
                        className="hide-scrollbar"
                    >
                        {displayedAnniversaries.map((boda, index) => (
                            <BodaCard
                                key={boda.year}
                                boda={boda}
                                index={index}
                                onClick={() => setSelectedBoda(boda)}
                            />
                        ))}
                    </div>
                </div>

                {/* Scroll hint */}
                <p
                    style={{
                        textAlign: 'center',
                        marginTop: 'clamp(1rem, 3vw, 1.5rem)',
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                        color: 'rgba(255, 255, 255, 0.25)',
                    }}
                >
                    ← Deslize para explorar →
                </p>
            </div>

            {/* Modal */}
            {selectedBoda && <BodaMeaningModal boda={selectedBoda} onClose={handleClose} />}
        </section>
    );
});

/**
 * BodaCard - Card elegante de boda
 */
function BodaCard({ boda, index, onClick }) {
    const isComplete = boda.isComplete;

    return (
        <div
            onClick={onClick}
            style={{
                flex: '0 0 auto',
                width: 'clamp(140px, 25vw, 180px)',
                background: isComplete
                    ? 'linear-gradient(145deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 170, 0, 0.05) 100%)'
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                border: `1px solid ${isComplete ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                borderRadius: 'clamp(0.875rem, 2vw, 1.25rem)',
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                scrollSnapAlign: 'center',
                animation: `fadeInUp 0.5s ease ${index * 60}ms both`,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = isComplete
                    ? '0 20px 40px rgba(255, 215, 0, 0.15)'
                    : '0 20px 40px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Emoji */}
            <div style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                {boda.emoji}
            </div>

            {/* Year */}
            <div
                style={{
                    fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                    fontWeight: 700,
                    color: isComplete ? '#ffd700' : '#fff',
                    marginBottom: '0.125rem',
                }}
            >
                {boda.year} {boda.year === 1 ? 'Ano' : 'Anos'}
            </div>

            {/* Name */}
            <div
                style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: 500,
                    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
                }}
            >
                {boda.name}
            </div>

            {/* Status pill */}
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: 'clamp(0.35rem, 1vw, 0.5rem) clamp(0.5rem, 1.5vw, 0.75rem)',
                    background: isComplete ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isComplete ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '100px',
                    fontSize: 'clamp(0.6rem, 1.3vw, 0.7rem)',
                    color: isComplete ? '#22c55e' : 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 500,
                }}
            >
                {isComplete ? '✓ Completo' : `${boda.daysRemaining} dias`}
            </div>
        </div>
    );
}

/**
 * BodaMeaningModal - Modal de significado premium
 */
function BodaMeaningModal({ boda, onClose }) {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(1rem, 4vw, 2rem)',
            }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    animation: 'fadeIn 0.3s ease',
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '440px',
                    background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)',
                    border: '1px solid rgba(255, 215, 0, 0.15)',
                    borderRadius: 'clamp(1rem, 3vw, 1.5rem)',
                    padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                    animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.05)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 'clamp(0.75rem, 2vw, 1rem)',
                        right: 'clamp(0.75rem, 2vw, 1rem)',
                        width: 'clamp(28px, 5vw, 36px)',
                        height: 'clamp(28px, 5vw, 36px)',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                    }}
                >
                    ✕
                </button>

                {/* Content */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
                        {boda.emoji}
                    </div>
                    <h3
                        style={{
                            fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            margin: '0 0 0.25rem 0',
                        }}
                    >
                        Bodas de {boda.name}
                    </h3>
                    <p style={{
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        color: 'rgba(255, 255, 255, 0.4)',
                        margin: '0 0 clamp(1rem, 3vw, 1.5rem) 0',
                    }}>
                        {boda.year} {boda.year === 1 ? 'ano' : 'anos'} de união
                    </p>

                    {/* Meaning */}
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
                            padding: 'clamp(1rem, 3vw, 1.5rem)',
                            marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                        }}
                    >
                        <p
                            style={{
                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                color: 'rgba(255, 255, 255, 0.7)',
                                lineHeight: 1.7,
                                fontStyle: 'italic',
                                margin: 0,
                            }}
                        >
                            "{boda.meaning}"
                        </p>
                    </div>

                    {/* Status */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                            background: boda.isComplete ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 215, 0, 0.1)',
                            border: `1px solid ${boda.isComplete ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 215, 0, 0.2)'}`,
                            borderRadius: '100px',
                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                            color: boda.isComplete ? '#22c55e' : '#ffd700',
                            fontWeight: 500,
                        }}
                    >
                        {boda.isComplete
                            ? `🎉 Celebrado há ${boda.daysSinceComplete} dias!`
                            : `⏳ Faltam ${boda.daysRemaining} dias`
                        }
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
        </div>
    );
}

export default WeddingAnniversaryTimeline;
