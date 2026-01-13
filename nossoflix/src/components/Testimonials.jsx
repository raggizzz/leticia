import { useState, useEffect } from 'react';

/**
 * Depoimentos de clientes - Design Premium
 */

const testimonials = [
    {
        id: 1,
        name: 'Maria Clara',
        location: 'São Paulo, SP',
        avatar: '👩',
        rating: 5,
        text: 'Meu namorado chorou quando viu! Nunca tinha visto ele assim. O NossoFlix superou todas as expectativas.',
        date: 'Há 2 dias',
    },
    {
        id: 2,
        name: 'Pedro Henrique',
        location: 'Rio de Janeiro, RJ',
        avatar: '👨',
        rating: 5,
        text: 'Usei para pedir ela em namoro e foi simplesmente perfeito. Ela ficou emocionada do começo ao fim.',
        date: 'Há 5 dias',
    },
    {
        id: 3,
        name: 'Ana Beatriz',
        location: 'Curitiba, PR',
        avatar: '👩‍🦰',
        rating: 5,
        text: 'Surpreendi meu marido no aniversário de casamento. Ele amou reviver nossa história assim!',
        date: 'Há 1 semana',
    },
    {
        id: 4,
        name: 'Lucas Gabriel',
        location: 'Brasília, DF',
        avatar: '🧑',
        rating: 5,
        text: 'Super fácil de criar e o resultado é profissional demais. Ela achou que eu tinha contratado alguém!',
        date: 'Há 1 semana',
    },
    {
        id: 5,
        name: 'Juliana Santos',
        location: 'Belo Horizonte, MG',
        avatar: '👩‍🦱',
        rating: 5,
        text: 'O melhor presente que já dei! A intro estilo Netflix deixou tudo ainda mais especial.',
        date: 'Há 2 semanas',
    },
];

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section style={{
            padding: '100px 24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 0%, rgba(236,72,153,0.03) 50%, transparent 100%)',
                pointerEvents: 'none',
            }} />

            <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{
                        fontSize: '13px',
                        color: '#ec4899',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        marginBottom: '16px',
                        fontWeight: '600',
                    }}>Depoimentos</p>
                    <h2 style={{
                        fontSize: 'clamp(28px, 5vw, 44px)',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                        marginBottom: '16px',
                    }}>
                        O que estão dizendo
                    </h2>
                    <p style={{
                        fontSize: '17px',
                        color: 'rgba(255,255,255,0.5)',
                    }}>
                        Mais de 500 histórias criadas e contando
                    </p>
                </div>

                {/* Main Testimonial */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '28px',
                    padding: '48px 40px',
                    textAlign: 'center',
                    position: 'relative',
                    marginBottom: '32px',
                }}>
                    {/* Quote icon */}
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '48px',
                        opacity: 0.3,
                    }}>❝</div>

                    {/* Stars */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '4px',
                        marginBottom: '24px',
                    }}>
                        {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ fontSize: '20px', color: '#fbbf24' }}>★</span>
                        ))}
                    </div>

                    {/* Text */}
                    <p style={{
                        fontSize: '22px',
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '32px',
                        fontStyle: 'italic',
                    }}>
                        "{testimonials[activeIndex].text}"
                    </p>

                    {/* Author */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                    }}>
                        <span style={{ fontSize: '48px' }}>{testimonials[activeIndex].avatar}</span>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{
                                fontSize: '17px',
                                fontWeight: '600',
                                marginBottom: '4px',
                            }}>{testimonials[activeIndex].name}</p>
                            <p style={{
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.4)',
                            }}>{testimonials[activeIndex].location} • {testimonials[activeIndex].date}</p>
                        </div>
                    </div>
                </div>

                {/* Dots */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                }}>
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                background: i === activeIndex
                                    ? 'linear-gradient(135deg, #f43f5e, #ec4899)'
                                    : 'rgba(255,255,255,0.2)',
                                transform: i === activeIndex ? 'scale(1.2)' : 'scale(1)',
                            }}
                        />
                    ))}
                </div>

                {/* Mini testimonials grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginTop: '48px',
                }}>
                    {testimonials.slice(0, 3).map((t, i) => (
                        <div
                            key={t.id}
                            style={{
                                padding: '20px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '16px',
                                opacity: activeIndex === i ? 0.5 : 1,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            }}
                            onClick={() => setActiveIndex(i)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '24px' }}>{t.avatar}</span>
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>{t.name}</span>
                            </div>
                            <p style={{
                                fontSize: '13px',
                                color: 'rgba(255,255,255,0.5)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>"{t.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
