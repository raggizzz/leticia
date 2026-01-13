import { useState, useEffect, useRef } from 'react';
import PricingSection from './PricingSection';
import Testimonials from './Testimonials';
import SocialProofPopup from './SocialProofPopup';
import UrgencyTimer from './UrgencyTimer';

/**
 * Landing Page - Design Premium Anti-IA
 * Inspirado em: Linear, Vercel, Stripe
 */
export default function LandingPage({ onLogin, onDemo, isAuthenticated, onDashboard }) {
    const [scrolled, setScrolled] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [liveCount, setLiveCount] = useState(127);
    const heroRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                setMousePos({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100
                });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Simular contador de pessoas online
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveCount(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const newCount = prev + change;
                return Math.max(80, Math.min(200, newCount));
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#030303',
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>

            {/* CSS Animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .gradient-animated {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 2s infinite;
        }
        .hover-lift:hover { transform: translateY(-4px); }
        .hover-glow:hover { box-shadow: 0 0 40px rgba(236, 72, 153, 0.3); }
        .live-dot { animation: live-pulse 2s infinite; }
      `}</style>

            {/* Social Proof Popup */}
            <SocialProofPopup enabled={true} />

            {/* ========== NAVBAR (RESPONSIVE) ========== */}
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: scrolled ? '8px 12px' : '12px 16px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: window.innerWidth < 640 ? '10px 14px' : '12px 20px',
                        borderRadius: '16px',
                        backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.9)' : 'rgba(10, 10, 10, 0.6)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        {/* Logo */}
                        <a href="/" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            textDecoration: 'none',
                            color: '#fff'
                        }}>
                            <img
                                src="/logo-nossoflix.png"
                                alt="NossoFlix"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                }}
                            />
                            <span style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                letterSpacing: '-0.02em',
                                background: 'linear-gradient(135deg, #c9a227, #d4af37)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>NossoFlix</span>
                        </a>

                        {/* Desktop Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {/* Live counter - hidden on very small screens */}
                            <div className="hidden-mobile" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 10px',
                                background: 'rgba(34, 197, 94, 0.1)',
                                border: '1px solid rgba(34, 197, 94, 0.2)',
                                borderRadius: '100px',
                                marginRight: '4px',
                            }}>
                                <div className="live-dot" style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: '#22c55e',
                                    boxShadow: '0 0 8px #22c55e',
                                }} />
                                <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: '500' }}>
                                    {liveCount} online
                                </span>
                            </div>

                            {/* Demo button - hidden on mobile */}
                            <button
                                onClick={onDemo}
                                className="hidden-mobile"
                                style={{
                                    padding: '8px 14px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
                            >
                                Ver demo
                            </button>

                            {/* Pricing button - hidden on mobile */}
                            <button
                                onClick={() => scrollToSection('pricing')}
                                className="hidden-mobile"
                                style={{
                                    padding: '8px 14px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
                            >
                                Preços
                            </button>

                            {/* Main CTA - always visible but smaller on mobile */}
                            <button
                                onClick={isAuthenticated ? onDashboard : onLogin}
                                style={{
                                    padding: window.innerWidth < 480 ? '8px 14px' : '10px 20px',
                                    background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: window.innerWidth < 480 ? '12px' : '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                {isAuthenticated ? 'Dashboard' : 'Começar'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ========== HERO ========== */}
            <section
                ref={heroRef}
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '120px 24px 80px'
                }}
            >
                {/* Animated Background */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    {/* Main gradient orb that follows mouse */}
                    <div style={{
                        position: 'absolute',
                        width: '800px',
                        height: '800px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
                        left: `${mousePos.x}%`,
                        top: `${mousePos.y}%`,
                        transform: 'translate(-50%, -50%)',
                        transition: 'left 0.8s ease-out, top 0.8s ease-out',
                        pointerEvents: 'none'
                    }} />

                    {/* Static gradient orbs */}
                    <div className="animate-pulse-slow" style={{
                        position: 'absolute',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
                        top: '-20%',
                        right: '-10%'
                    }} />
                    <div className="animate-pulse-slow" style={{
                        position: 'absolute',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)',
                        bottom: '-10%',
                        left: '-10%',
                        animationDelay: '2s'
                    }} />

                    {/* Grid pattern */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)'
                    }} />
                </div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', textAlign: 'center' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 16px 8px 10px',
                        borderRadius: '100px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        marginBottom: '32px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <span style={{
                            padding: '4px 10px',
                            borderRadius: '100px',
                            background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>🔥 Novo</span>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                            +1.247 histórias de amor criadas ✨
                        </span>
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: 'clamp(40px, 8vw, 80px)',
                        fontWeight: '700',
                        lineHeight: '1.05',
                        letterSpacing: '-0.03em',
                        marginBottom: '24px'
                    }}>
                        <span style={{ color: 'rgba(255,255,255,0.95)' }}>Sua história merece</span>
                        <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 40%, #a855f7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundSize: '200% 200%'
                        }} className="gradient-animated">
                            virar uma série
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: 'clamp(16px, 2vw, 20px)',
                        color: 'rgba(255,255,255,0.5)',
                        maxWidth: '560px',
                        margin: '0 auto 32px',
                        lineHeight: '1.7',
                        fontWeight: '400'
                    }}>
                        Transforme os melhores momentos do seu relacionamento em um site cinematográfico.
                        Personalizado, emocionante e feito para surpreender.
                    </p>

                    {/* Urgency Timer */}
                    <div style={{ marginBottom: '32px' }}>
                        <UrgencyTimer message="Preço promocional termina em:" />
                    </div>

                    {/* CTA Buttons */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '48px'
                    }}>
                        <button
                            onClick={onLogin}
                            className="hover-glow shimmer"
                            style={{
                                position: 'relative',
                                padding: '18px 40px',
                                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                border: 'none',
                                borderRadius: '14px',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.35)'
                            }}
                        >
                            Criar meu NossoFlix — grátis
                        </button>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                                onClick={onDemo}
                                style={{
                                    padding: '14px 28px',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '14px',
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    backdropFilter: 'blur(10px)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.05)';
                                    e.target.style.borderColor = 'rgba(255,255,255,0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                                }}
                            >
                                ▶ Ver exemplo
                            </button>
                            <button
                                onClick={() => scrollToSection('pricing')}
                                style={{
                                    padding: '14px 28px',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '14px',
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    backdropFilter: 'blur(10px)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.05)';
                                    e.target.style.borderColor = 'rgba(255,255,255,0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                                }}
                            >
                                💎 Ver planos
                            </button>
                        </div>
                    </div>

                    {/* Trust indicators */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '32px',
                        flexWrap: 'wrap',
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '13px'
                    }}>
                        <span>⚡ Pronto em 10 min</span>
                        <span>🔒 Dados protegidos</span>
                        <span>💳 Pague com MP</span>
                        <span>⭐ 4.9/5 (347 avaliações)</span>
                    </div>
                </div>
            </section>

            {/* ========== PREVIEW ========== */}
            <section style={{ padding: '0 24px 120px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div
                        onClick={onDemo}
                        className="hover-lift"
                        style={{
                            position: 'relative',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {/* Glow effect */}
                        <div style={{
                            position: 'absolute',
                            inset: '-2px',
                            borderRadius: '26px',
                            background: 'linear-gradient(135deg, rgba(244,63,94,0.5), rgba(236,72,153,0.5), rgba(168,85,247,0.5))',
                            filter: 'blur(20px)',
                            opacity: 0.4,
                            zIndex: 0
                        }} />

                        <div style={{
                            position: 'relative',
                            zIndex: 1,
                            background: '#0a0a0a',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            overflow: 'hidden'
                        }}>
                            {/* Browser chrome */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '16px 20px',
                                background: 'rgba(255,255,255,0.02)',
                                borderBottom: '1px solid rgba(255,255,255,0.06)'
                            }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }} />
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }} />
                                </div>
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        padding: '6px 16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        color: 'rgba(255,255,255,0.4)',
                                        fontFamily: 'monospace'
                                    }}>
                                        nossoflix.com/igor-e-leticia
                                    </div>
                                </div>
                            </div>

                            {/* Preview content */}
                            <div style={{
                                aspectRatio: '16/9',
                                background: 'linear-gradient(180deg, #0a0a0a 0%, #000 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <div style={{ textAlign: 'center', zIndex: 1 }}>
                                    <p style={{
                                        fontSize: '10px',
                                        color: 'rgba(255,255,255,0.3)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '4px',
                                        marginBottom: '12px'
                                    }}>Uma série original</p>
                                    <h3 style={{
                                        fontSize: 'clamp(32px, 6vw, 56px)',
                                        fontWeight: '700',
                                        letterSpacing: '0.1em',
                                        marginBottom: '16px',
                                        background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.6) 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>NOSSOFLIX</h3>
                                    <p style={{ fontSize: '14px', color: '#ec4899' }}>Clique para explorar →</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== FEATURES ========== */}
            <section style={{ padding: '80px 24px 120px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <p style={{
                            fontSize: '13px',
                            color: '#ec4899',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '16px',
                            fontWeight: '600'
                        }}>Recursos</p>
                        <h2 style={{
                            fontSize: 'clamp(28px, 5vw, 44px)',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                            marginBottom: '16px'
                        }}>Tudo para criar algo único</h2>
                        <p style={{
                            fontSize: '17px',
                            color: 'rgba(255,255,255,0.5)',
                            maxWidth: '500px',
                            margin: '0 auto'
                        }}>Ferramentas pensadas para transformar momentos em memórias inesquecíveis.</p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '20px'
                    }}>
                        {[
                            { icon: '💌', title: 'Cartas cinematográficas', desc: 'Declarações que rolam na tela como cenas de filme de romance.' },
                            { icon: '🎬', title: 'Episódios', desc: 'Organize cada momento especial em temporadas e episódios.' },
                            { icon: '🎵', title: 'Trilha sonora', desc: 'As músicas de vocês tocando enquanto a mágica acontece.' },
                            { icon: '📸', title: 'Galerias', desc: 'Fotos que viram obras de arte em layouts cinematográficos.' },
                            { icon: '📱', title: 'QR Code especial', desc: 'Gere um QR romântico para presente físico.', premium: true },
                            { icon: '🎥', title: 'Intro Netflix', desc: 'Animação estilo Netflix ao abrir o site.', premium: true },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="hover-lift"
                                style={{
                                    padding: '32px',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '20px',
                                    cursor: 'default',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                }}
                            >
                                {feature.premium && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        padding: '4px 10px',
                                        background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                        borderRadius: '100px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                    }}>PRO</div>
                                )}
                                <span style={{ fontSize: '36px', display: 'block', marginBottom: '20px' }}>{feature.icon}</span>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>{feature.title}</h3>
                                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== TESTIMONIALS ========== */}
            <Testimonials />

            {/* ========== PRICING ========== */}
            <PricingSection />

            {/* ========== HOW IT WORKS ========== */}
            <section style={{ padding: '80px 24px 120px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{
                        fontSize: '13px',
                        color: '#ec4899',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '16px',
                        fontWeight: '600'
                    }}>Como funciona</p>
                    <h2 style={{
                        fontSize: 'clamp(28px, 5vw, 44px)',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                        marginBottom: '64px'
                    }}>Três passos simples</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {[
                            { num: '1', title: 'Crie sua conta', desc: 'Grátis e sem cartão de crédito.' },
                            { num: '2', title: 'Monte sua série', desc: 'Adicione fotos, textos e defina o clima.' },
                            { num: '3', title: 'Surpreenda', desc: 'Compartilhe o link e veja a reação.' },
                        ].map((step, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '24px',
                                    padding: '28px 32px',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '20px',
                                    textAlign: 'left',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <div style={{
                                    width: '52px',
                                    height: '52px',
                                    flexShrink: 0,
                                    background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                    borderRadius: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    boxShadow: '0 8px 24px rgba(236, 72, 153, 0.25)'
                                }}>{step.num}</div>
                                <div>
                                    <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '4px' }}>{step.title}</h3>
                                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== FINAL CTA ========== */}
            <section style={{ padding: '120px 24px', position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(236,72,153,0.08) 0%, transparent 60%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
                    <h2 style={{
                        fontSize: 'clamp(32px, 6vw, 56px)',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                        marginBottom: '20px'
                    }}>
                        Pronto pra fazer história?
                    </h2>
                    <p style={{
                        fontSize: '18px',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '40px'
                    }}>
                        Comece agora e crie algo que vai emocionar de verdade.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={onLogin}
                            style={{
                                padding: '20px 48px',
                                background: '#fff',
                                border: 'none',
                                borderRadius: '14px',
                                color: '#000',
                                fontSize: '17px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 8px 32px rgba(255,255,255,0.15)'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Começar grátis →
                        </button>
                        <button
                            onClick={() => scrollToSection('pricing')}
                            style={{
                                padding: '20px 48px',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '14px',
                                color: '#fff',
                                fontSize: '17px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                            }}
                        >
                            Ver planos PRO
                        </button>
                    </div>
                </div>
            </section>

            {/* ========== FOOTER ========== */}
            <footer style={{
                padding: '40px 24px',
                borderTop: '1px solid rgba(255,255,255,0.06)'
            }}>
                <div style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                            src="/logo-nossoflix.png"
                            alt="NossoFlix"
                            style={{
                                width: '28px',
                                height: '28px',
                                objectFit: 'contain',
                                borderRadius: '6px',
                            }}
                        />
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            background: 'linear-gradient(135deg, #c9a227, #d4af37)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>NossoFlix</span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                        © {new Date().getFullYear()} — Feito com muito ❤️
                    </span>
                </div>
            </footer>
        </div>
    );
}
