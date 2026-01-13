import { useState, useEffect } from 'react';

/**
 * Timer de Urgência com contagem regressiva
 */
export default function UrgencyTimer({ endDate = null, message = 'Oferta especial termina em:' }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        // Se não tiver data final, criar uma data fake (próximas 24h do dia)
        const targetDate = endDate || (() => {
            const now = new Date();
            // Final do dia + algumas horas do próximo
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            return end;
        })();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference <= 0) {
                setIsExpired(true);
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            });
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    if (isExpired) return null;

    const TimeBlock = ({ value, label }) => (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '60px',
        }}>
            <div style={{
                fontSize: '28px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
            }}>{String(value).padStart(2, '0')}</div>
            <div style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: '4px',
            }}>{label}</div>
        </div>
    );

    const Separator = () => (
        <span style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#ec4899',
            marginTop: '-8px',
        }}>:</span>
    );

    return (
        <div style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 32px',
            background: 'rgba(236, 72, 153, 0.1)',
            border: '1px solid rgba(236, 72, 153, 0.2)',
            borderRadius: '20px',
        }}>
            <p style={{
                fontSize: '13px',
                color: '#ec4899',
                marginBottom: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}>
                <span style={{ animation: 'pulse 2s infinite' }}>🔥</span>
                {message}
            </p>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
            }}>
                {timeLeft.days > 0 && (
                    <>
                        <TimeBlock value={timeLeft.days} label="dias" />
                        <Separator />
                    </>
                )}
                <TimeBlock value={timeLeft.hours} label="horas" />
                <Separator />
                <TimeBlock value={timeLeft.minutes} label="min" />
                <Separator />
                <TimeBlock value={timeLeft.seconds} label="seg" />
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
