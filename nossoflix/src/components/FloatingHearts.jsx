import { memo, useMemo } from 'react';

/**
 * FloatingHearts - Partículas de corações flutuantes
 * Design premium - performance otimizada, sutil e elegante
 */
const FloatingHearts = memo(function FloatingHearts({
    count = 12,
    enabled = true,
}) {
    // Gerar corações com propriedades estáveis
    const hearts = useMemo(() => {
        const emojis = ['❤️', '💕', '💗', '💖'];
        return [...Array(count)].map((_, i) => ({
            id: i,
            left: 5 + Math.random() * 90, // 5-95% para evitar bordas
            delay: Math.random() * 15,
            duration: 14 + Math.random() * 10, // 14-24s - mais lento, mais elegante
            size: 10 + Math.random() * 8, // 10-18px - mais discreto
            opacity: 0.15 + Math.random() * 0.2, // 0.15-0.35 - muito sutil
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            wobbleAmount: 15 + Math.random() * 20, // pixels de oscilação
        }));
    }, [count]);

    if (!enabled) return null;

    return (
        <>
            <div
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    inset: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 5,
                }}
            >
                {hearts.map((heart) => (
                    <span
                        key={heart.id}
                        style={{
                            position: 'absolute',
                            left: `${heart.left}%`,
                            bottom: '-5%',
                            fontSize: `${heart.size}px`,
                            opacity: 0, // Começa invisível, a animação controla
                            animation: `floatHeartPremium ${heart.duration}s ease-in-out ${heart.delay}s infinite`,
                            '--wobble': `${heart.wobbleAmount}px`,
                            willChange: 'transform, opacity',
                            filter: 'blur(0.3px)', // Suaviza ligeiramente
                        }}
                    >
                        {heart.emoji}
                    </span>
                ))}
            </div>

            <style>{`
        @keyframes floatHeartPremium {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          5% {
            opacity: var(--max-opacity, 0.25);
            transform: translateY(-5vh) translateX(calc(var(--wobble) * 0.2)) rotate(5deg) scale(1);
          }
          25% {
            transform: translateY(-25vh) translateX(calc(var(--wobble) * -0.5)) rotate(-8deg) scale(1);
          }
          50% {
            transform: translateY(-50vh) translateX(calc(var(--wobble) * 0.6)) rotate(10deg) scale(0.95);
            opacity: var(--max-opacity, 0.25);
          }
          75% {
            transform: translateY(-75vh) translateX(calc(var(--wobble) * -0.4)) rotate(-5deg) scale(0.9);
          }
          95% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-105vh) translateX(calc(var(--wobble) * 0.3)) rotate(8deg) scale(0.85);
            opacity: 0;
          }
        }
      `}</style>
        </>
    );
});

export default FloatingHearts;
