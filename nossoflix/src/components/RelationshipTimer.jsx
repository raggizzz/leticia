import { useState, useEffect, useMemo, memo } from 'react';

/**
 * RelationshipTimer - Contador de tempo em tempo real
 * Design premium de agência - elegante, sofisticado e emocional
 */
const RelationshipTimer = memo(function RelationshipTimer({
    startDate,
    creatorName = 'Você',
    partnerName = 'Amor',
    showEmotionalStats = true,
    compact = false,
}) {
    const [time, setTime] = useState(calculateTime(startDate));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(calculateTime(startDate));
        }, 1000);
        return () => clearInterval(interval);
    }, [startDate]);

    const emotionalStats = useMemo(() => {
        if (!startDate) return null;

        const start = new Date(startDate);
        const now = new Date();
        const totalDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor((now - start) / (1000 * 60 * 60));
        const totalMinutes = Math.floor((now - start) / (1000 * 60));
        const totalSeconds = Math.floor((now - start) / 1000);

        const fullMoons = Math.floor(totalDays / 29.5);

        let christmases = 0;
        let year = start.getFullYear();
        while (year <= now.getFullYear()) {
            const christmas = new Date(year, 11, 25);
            if (christmas >= start && christmas <= now) christmases++;
            year++;
        }

        let valentines = 0;
        year = start.getFullYear();
        while (year <= now.getFullYear()) {
            const valentine = new Date(year, 5, 12);
            if (valentine >= start && valentine <= now) valentines++;
            year++;
        }

        const weekends = Math.floor(totalDays / 7);
        const heartbeats = totalMinutes * 80 * 2;

        return { totalDays, totalHours, totalMinutes, totalSeconds, fullMoons, christmases, valentines, weekends, heartbeats };
    }, [startDate, time.seconds]);

    if (!startDate) return null;

    return (
        <section
            className="relative overflow-hidden"
            style={{
                padding: 'clamp(3rem, 8vw, 6rem) 0',
                background: 'linear-gradient(180deg, transparent 0%, rgba(139, 69, 69, 0.03) 50%, transparent 100%)',
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'min(800px, 90vw)',
                    height: 'min(800px, 90vw)',
                    background: 'radial-gradient(circle, rgba(229, 9, 20, 0.06) 0%, transparent 60%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }}
            />

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2rem)', position: 'relative' }}>

                {/* Section header */}
                <header style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
                    <span
                        style={{
                            display: 'inline-block',
                            fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                            fontWeight: 600,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(229, 9, 20, 0.8)',
                            marginBottom: '0.75rem',
                        }}
                    >
                        Tempo Juntos
                    </span>
                    <h2
                        style={{
                            fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.85) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            margin: '0 0 0.5rem 0',
                            lineHeight: 1.1,
                        }}
                    >
                        {creatorName} <span style={{ opacity: 0.4, fontWeight: 300 }}>&</span> {partnerName}
                    </h2>
                    <p style={{
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                        color: 'rgba(255, 255, 255, 0.4)',
                        margin: 0,
                    }}>
                        Uma história que cresce a cada segundo
                    </p>
                </header>

                {/* Main counter grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(6, 1fr)',
                        gap: 'clamp(0.5rem, 2vw, 1rem)',
                        marginBottom: 'clamp(2.5rem, 6vw, 4rem)',
                    }}
                    className="time-counter-grid"
                >
                    <TimeUnit value={time.years} label="Anos" isHighlight delay={0} />
                    <TimeUnit value={time.months} label="Meses" delay={50} />
                    <TimeUnit value={time.days} label="Dias" delay={100} />
                    <TimeUnit value={time.hours} label="Horas" delay={150} />
                    <TimeUnit value={time.minutes} label="Minutos" delay={200} />
                    <TimeUnit value={time.seconds} label="Segundos" isLive delay={250} />
                </div>

                {/* Emotional stats */}
                {showEmotionalStats && emotionalStats && !compact && (
                    <>
                        {/* Stats cards */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                gap: 'clamp(0.75rem, 2vw, 1rem)',
                                marginBottom: 'clamp(2rem, 5vw, 3rem)',
                            }}
                        >
                            <StatCard icon="🌙" value={emotionalStats.fullMoons} label="Luas cheias" />
                            <StatCard icon="🎄" value={emotionalStats.christmases} label={emotionalStats.christmases === 1 ? 'Natal' : 'Natais'} />
                            <StatCard icon="💑" value={emotionalStats.valentines} label="Dia dos Namorados" />
                            <StatCard icon="🌅" value={emotionalStats.weekends} label="Finais de semana" />
                            <StatCard
                                icon="💓"
                                value={formatLargeNumber(emotionalStats.heartbeats)}
                                label="Batimentos juntos"
                                isSpecial
                            />
                        </div>

                        {/* Total stats summary */}
                        <div
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                borderRadius: 'clamp(1rem, 2vw, 1.5rem)',
                                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                                textAlign: 'center',
                                maxWidth: '700px',
                                margin: '0 auto',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'clamp(1rem, 3vw, 1.5rem)',
                            }}>
                                <TotalStat
                                    value={emotionalStats.totalHours}
                                    label="horas"
                                />
                                <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                                <TotalStat
                                    value={emotionalStats.totalMinutes}
                                    label="minutos"
                                />
                                <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                                <TotalStat
                                    value={emotionalStats.totalSeconds}
                                    label="segundos"
                                />
                            </div>
                        </div>

                        {/* Closing phrase */}
                        <p
                            style={{
                                textAlign: 'center',
                                marginTop: 'clamp(2rem, 5vw, 3rem)',
                                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #e50914 0%, #ff6b6b 50%, #e50914 100%)',
                                backgroundSize: '200% 100%',
                                animation: 'gradientShift 4s ease infinite',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Juntos, para todo sempre ❤️
                        </p>
                    </>
                )}
            </div>

            <style>{`
        .time-counter-grid {
          grid-template-columns: repeat(6, 1fr);
        }
        @media (max-width: 768px) {
          .time-counter-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-live {
          0%, 100% { box-shadow: 0 0 0 0 rgba(229, 9, 20, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(229, 9, 20, 0); }
        }
      `}</style>
        </section>
    );
});

/* TimeUnit - Elegante unidade de tempo */
function TimeUnit({ value, label, isHighlight, isLive, delay = 0 }) {
    return (
        <div
            style={{
                background: isHighlight
                    ? 'linear-gradient(135deg, rgba(229, 9, 20, 0.15) 0%, rgba(229, 9, 20, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                border: `1px solid ${isHighlight ? 'rgba(229, 9, 20, 0.25)' : 'rgba(255, 255, 255, 0.06)'}`,
                borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
                padding: 'clamp(1rem, 3vw, 1.5rem) clamp(0.5rem, 2vw, 1rem)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                animation: `fadeInUp 0.6s ease ${delay}ms both`,
            }}
        >
            {/* Live indicator */}
            {isLive && (
                <div
                    style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#e50914',
                        animation: 'pulse-live 2s ease infinite',
                    }}
                />
            )}

            <div
                style={{
                    fontSize: 'clamp(1.5rem, 5vw, 2.75rem)',
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: isHighlight ? '#ff6b6b' : '#fff',
                    lineHeight: 1,
                    marginBottom: '0.25rem',
                    transition: 'color 0.3s ease',
                }}
            >
                {String(value).padStart(2, '0')}
            </div>
            <div
                style={{
                    fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(255, 255, 255, 0.4)',
                }}
            >
                {label}
            </div>
        </div>
    );
}

/* StatCard - Card de estatística emocional */
function StatCard({ icon, value, label, isSpecial }) {
    return (
        <div
            style={{
                background: isSpecial
                    ? 'linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%)'
                    : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isSpecial ? 'rgba(229, 9, 20, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
                padding: 'clamp(1rem, 3vw, 1.25rem)',
                textAlign: 'center',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: 'default',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = isSpecial ? 'rgba(229, 9, 20, 0.2)' : 'rgba(255, 255, 255, 0.05)';
            }}
        >
            <div style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', marginBottom: '0.5rem' }}>{icon}</div>
            <div
                style={{
                    fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                    fontWeight: 700,
                    color: isSpecial ? '#ff6b6b' : '#fff',
                    marginBottom: '0.25rem',
                }}
            >
                {value}
            </div>
            <div
                style={{
                    fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                    color: 'rgba(255, 255, 255, 0.4)',
                    lineHeight: 1.3,
                }}
            >
                {label}
            </div>
        </div>
    );
}

/* TotalStat - Estatística total com descrição */
function TotalStat({ value, label, description }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span
                    style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        fontWeight: 700,
                        color: '#fff',
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {value.toLocaleString('pt-BR')}
                </span>
                <span style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', color: 'rgba(255, 255, 255, 0.5)' }}>{label}</span>
            </div>
            {description && (
                <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: 'rgba(255, 255, 255, 0.3)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                    {description}
                </div>
            )}
        </div>
    );
}

/* Helpers */
function calculateTime(startDate) {
    if (!startDate) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    const start = new Date(startDate);
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    let hours = now.getHours() - start.getHours();
    let minutes = now.getMinutes() - start.getMinutes();
    let seconds = now.getSeconds() - start.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) { months += 12; years--; }

    return { years, months, days, hours, minutes, seconds };
}

function formatLargeNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.', ',') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toLocaleString('pt-BR');
}

function numberToWordsSimple(num) {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(0)} bilhões`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)} milhões`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)} mil`;
    return '';
}

export default RelationshipTimer;
