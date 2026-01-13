import { useRef, useState, useMemo, memo, useCallback } from 'react';

/**
 * ShareableStoryCard - Card compartilhável para Stories
 * Design PREMIUM e extremamente emocional com foto do casal
 */
const ShareableStoryCard = memo(function ShareableStoryCard({
    creatorName = 'Você',
    partnerName = 'Amor',
    startDate,
    backgroundImage, // Foto do casal da Hero
    siteUrl,
}) {
    const cardRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const timeData = useMemo(() => {
        if (!startDate) return null;
        const start = new Date(startDate);
        const now = new Date();

        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();
        let days = now.getDate() - start.getDate();

        if (days < 0) {
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) { months += 12; years--; }

        const totalDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        return { years, months, days, totalDays };
    }, [startDate]);

    const handleDownload = useCallback(async () => {
        if (!cardRef.current || isGenerating) return;
        setIsGenerating(true);

        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#0a0a0a',
                width: 540,
                height: 960,
            });

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${creatorName}-${partnerName}-nossa-historia.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 'image/png', 1);
        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [creatorName, partnerName, isGenerating]);

    if (!startDate) return null;

    return (
        <section
            style={{
                padding: 'clamp(4rem, 10vw, 8rem) 0',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Ambient background glow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(600px, 100vw)',
                height: 'min(600px, 100vw)',
                background: 'radial-gradient(circle, rgba(229, 9, 20, 0.08) 0%, transparent 50%)',
                filter: 'blur(80px)',
                pointerEvents: 'none',
            }} />

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2rem)', position: 'relative' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
                    <span
                        style={{
                            display: 'inline-block',
                            fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                            fontWeight: 600,
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            color: 'rgba(229, 9, 20, 0.7)',
                            marginBottom: '1rem',
                        }}
                    >
                        Eternize este momento
                    </span>
                    <h2
                        style={{
                            fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            margin: '0 0 1rem 0',
                            lineHeight: 1.2,
                        }}
                    >
                        Compartilhe sua história
                    </h2>
                    <p style={{
                        fontSize: 'clamp(0.875rem, 2vw, 1.1rem)',
                        color: 'rgba(255, 255, 255, 0.5)',
                        margin: 0,
                        maxWidth: '450px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: 1.7,
                    }}>
                        Baixe uma imagem especial com a foto de vocês e compartilhe nos Stories
                    </p>
                </header>

                {/* Main content - Preview card with photo */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(2rem, 5vw, 3rem)' }}>

                    {/* Big preview card with couple photo */}
                    <div
                        onClick={() => setShowPreview(true)}
                        style={{
                            position: 'relative',
                            width: 'clamp(240px, 50vw, 300px)',
                            aspectRatio: '9 / 16',
                            borderRadius: 'clamp(1.25rem, 3vw, 2rem)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 40px 100px rgba(0, 0, 0, 0.6), 0 0 60px rgba(229, 9, 20, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)';
                        }}
                    >
                        {/* Background with couple photo */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center top',
                                filter: 'brightness(0.7)',
                            }}
                        />

                        {/* Gradient overlays */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.95) 100%)',
                        }} />
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(circle at center 30%, transparent 0%, rgba(0,0,0,0.4) 100%)',
                        }} />

                        {/* Content */}
                        <div style={{
                            position: 'relative',
                            zIndex: 10,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: 'clamp(1.25rem, 4vw, 2rem)',
                            textAlign: 'center',
                        }}>
                            {/* Top badge */}
                            <div style={{
                                position: 'absolute',
                                top: 'clamp(1rem, 3vw, 1.5rem)',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.35rem 0.75rem',
                                    background: 'rgba(229, 9, 20, 0.9)',
                                    borderRadius: '100px',
                                    fontSize: 'clamp(0.55rem, 1.3vw, 0.65rem)',
                                    fontWeight: 600,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: '#fff',
                                }}>
                                    Nossa História
                                </span>
                            </div>

                            {/* Couple names */}
                            <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
                                <h3 style={{
                                    fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                                    fontWeight: 800,
                                    color: '#fff',
                                    margin: 0,
                                    textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                                }}>
                                    {creatorName}
                                </h3>
                                <span style={{
                                    display: 'block',
                                    fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                                    color: 'rgba(255,255,255,0.5)',
                                    margin: '0.25rem 0',
                                }}>&</span>
                                <h3 style={{
                                    fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #ff6b6b 0%, #e50914 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    margin: 0,
                                    textShadow: 'none',
                                }}>
                                    {partnerName}
                                </h3>
                            </div>

                            {/* Time together */}
                            <div style={{
                                background: 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
                                padding: 'clamp(0.75rem, 2vw, 1rem)',
                                marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
                            }}>
                                <div style={{
                                    fontSize: 'clamp(1.5rem, 5vw, 2.25rem)',
                                    fontWeight: 700,
                                    color: '#fff',
                                    lineHeight: 1,
                                }}>
                                    {timeData?.totalDays?.toLocaleString('pt-BR')}
                                </div>
                                <div style={{
                                    fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginTop: '0.25rem',
                                    letterSpacing: '0.05em',
                                }}>
                                    dias de amor ❤️
                                </div>
                            </div>

                            {/* Tap to view */}
                            <div style={{
                                fontSize: 'clamp(0.55rem, 1.3vw, 0.65rem)',
                                color: 'rgba(255, 255, 255, 0.4)',
                            }}>
                                👆 Toque para ampliar
                            </div>
                        </div>
                    </div>

                    {/* Download CTA */}
                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                padding: 'clamp(1rem, 3vw, 1.25rem) clamp(2rem, 5vw, 3rem)',
                                fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)',
                                fontWeight: 700,
                                color: '#fff',
                                background: isGenerating
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : 'linear-gradient(135deg, #e50914 0%, #b20710 100%)',
                                border: 'none',
                                borderRadius: '100px',
                                cursor: isGenerating ? 'not-allowed' : 'pointer',
                                transition: 'all 0.4s ease',
                                boxShadow: isGenerating ? 'none' : '0 10px 40px rgba(229, 9, 20, 0.35)',
                                letterSpacing: '0.02em',
                            }}
                            onMouseEnter={e => {
                                if (!isGenerating) {
                                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 15px 50px rgba(229, 9, 20, 0.45)';
                                }
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = isGenerating ? 'none' : '0 10px 40px rgba(229, 9, 20, 0.35)';
                            }}
                        >
                            {isGenerating ? (
                                <>
                                    <span style={{ fontSize: '1.2em' }}>⏳</span>
                                    Gerando sua imagem...
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '1.2em' }}>📲</span>
                                    Baixar para Stories
                                </>
                            )}
                        </button>

                        <p style={{
                            marginTop: 'clamp(1rem, 3vw, 1.5rem)',
                            fontSize: 'clamp(0.7rem, 1.6vw, 0.8rem)',
                            color: 'rgba(255, 255, 255, 0.35)',
                        }}>
                            Perfeito para Instagram, WhatsApp e TikTok
                        </p>
                    </div>
                </div>
            </div>

            {/* Full preview modal */}
            {showPreview && (
                <PreviewModal
                    ref={cardRef}
                    creatorName={creatorName}
                    partnerName={partnerName}
                    timeData={timeData}
                    backgroundImage={backgroundImage}
                    siteUrl={siteUrl}
                    onClose={() => setShowPreview(false)}
                    onDownload={handleDownload}
                    isGenerating={isGenerating}
                />
            )}

            {/* Hidden card for capture - full resolution with photo */}
            <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
                <StoryCardCanvas
                    ref={cardRef}
                    creatorName={creatorName}
                    partnerName={partnerName}
                    timeData={timeData}
                    backgroundImage={backgroundImage}
                    siteUrl={siteUrl}
                />
            </div>
        </section>
    );
});

/**
 * StoryCardCanvas - Canvas premium para geração da imagem com foto do casal
 */
const StoryCardCanvas = memo(function StoryCardCanvas({ creatorName, partnerName, timeData, backgroundImage, siteUrl }, ref) {
    return (
        <div
            ref={ref}
            style={{
                width: '540px',
                height: '960px',
                position: 'relative',
                fontFamily: 'Poppins, -apple-system, sans-serif',
                color: 'white',
                overflow: 'hidden',
            }}
        >
            {/* Background photo */}
            {backgroundImage && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    filter: 'brightness(0.6)',
                }} />
            )}

            {/* Fallback gradient if no photo */}
            {!backgroundImage && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, #1a0a10 0%, #0a0a0a 50%, #0a0a10 100%)',
                }} />
            )}

            {/* Gradient overlays */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.95) 100%)',
            }} />

            {/* Vignette */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center 40%, transparent 0%, rgba(0,0,0,0.5) 100%)',
            }} />

            {/* Ambient glow */}
            <div style={{
                position: 'absolute',
                bottom: '30%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '400px',
                height: '300px',
                background: 'radial-gradient(ellipse, rgba(229, 9, 20, 0.2) 0%, transparent 60%)',
                filter: 'blur(60px)',
            }} />

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '50px 40px',
            }}>
                {/* Top badge */}
                <div style={{ textAlign: 'center' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '8px 20px',
                        background: 'rgba(229, 9, 20, 0.9)',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: '#fff',
                        boxShadow: '0 4px 20px rgba(229, 9, 20, 0.4)',
                    }}>
                        ❤️ Nossa História
                    </span>
                </div>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Bottom content */}
                <div style={{ textAlign: 'center' }}>
                    {/* Couple names */}
                    <div style={{ marginBottom: '35px' }}>
                        <h1 style={{
                            fontSize: '48px',
                            fontWeight: 800,
                            color: '#fff',
                            margin: '0 0 5px 0',
                            lineHeight: 1.1,
                            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                        }}>
                            {creatorName}
                        </h1>
                        <span style={{
                            fontSize: '24px',
                            color: 'rgba(255, 255, 255, 0.4)',
                            fontWeight: 300,
                        }}>&</span>
                        <h1 style={{
                            fontSize: '48px',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #e50914 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            margin: '5px 0 0 0',
                            lineHeight: 1.1,
                        }}>
                            {partnerName}
                        </h1>
                    </div>

                    {/* Stats box */}
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        padding: '30px 40px',
                        marginBottom: '30px',
                    }}>
                        {/* Time units */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '15px',
                            marginBottom: '25px',
                        }}>
                            {timeData?.years > 0 && (
                                <TimeBox value={timeData.years} label={timeData.years === 1 ? 'Ano' : 'Anos'} isHighlight />
                            )}
                            <TimeBox value={timeData?.months || 0} label="Meses" />
                            <TimeBox value={timeData?.days || 0} label="Dias" />
                        </div>

                        {/* Divider */}
                        <div style={{
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                            marginBottom: '25px',
                        }} />

                        {/* Total days */}
                        <div>
                            <span style={{
                                fontSize: '56px',
                                fontWeight: 800,
                                color: '#fff',
                                lineHeight: 1,
                            }}>
                                {timeData?.totalDays?.toLocaleString('pt-BR')}
                            </span>
                            <span style={{
                                display: 'block',
                                fontSize: '15px',
                                color: 'rgba(255, 255, 255, 0.5)',
                                marginTop: '8px',
                                letterSpacing: '0.05em',
                            }}>
                                dias de amor ❤️
                            </span>
                        </div>
                    </div>

                    {/* Quote */}
                    <p style={{
                        fontSize: '17px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontStyle: 'italic',
                        maxWidth: '300px',
                        margin: '0 auto 40px auto',
                        lineHeight: 1.5,
                    }}>
                        "Juntos, para todo sempre"
                    </p>

                    {/* Footer */}
                    <div>
                        <span style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.3)',
                            letterSpacing: '0.1em',
                        }}>
                            {siteUrl || 'nossoflix.com'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

function TimeBox({ value, label, isHighlight }) {
    return (
        <div style={{
            background: isHighlight
                ? 'linear-gradient(135deg, rgba(229, 9, 20, 0.25) 0%, rgba(229, 9, 20, 0.1) 100%)'
                : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isHighlight ? 'rgba(229, 9, 20, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
            borderRadius: '16px',
            padding: '18px 24px',
            minWidth: '85px',
        }}>
            <div style={{
                fontSize: '34px',
                fontWeight: 700,
                color: isHighlight ? '#ff6b6b' : '#fff',
                lineHeight: 1,
            }}>
                {String(value).padStart(2, '0')}
            </div>
            <div style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.45)',
                marginTop: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 500,
            }}>
                {label}
            </div>
        </div>
    );
}

/**
 * PreviewModal - Modal de preview em tela cheia
 */
const PreviewModal = memo(function PreviewModal({
    creatorName,
    partnerName,
    timeData,
    backgroundImage,
    siteUrl,
    onClose,
    onDownload,
    isGenerating,
}) {
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
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.92)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                animation: 'fadeIn 0.3s ease',
            }} />

            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 'clamp(1rem, 3vw, 1.5rem)',
                    right: 'clamp(1rem, 3vw, 1.5rem)',
                    width: 'clamp(40px, 7vw, 48px)',
                    height: 'clamp(40px, 7vw, 48px)',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                ✕
            </button>

            {/* Preview card */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: 'min(300px, 65vw)',
                    aspectRatio: '9 / 16',
                    borderRadius: 'clamp(1.25rem, 3vw, 2rem)',
                    overflow: 'hidden',
                    animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 40px 120px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Background photo in preview */}
                {backgroundImage && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                        filter: 'brightness(0.6)',
                    }} />
                )}

                {!backgroundImage && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, #1a0a10 0%, #0a0a0a 50%, #0a0a10 100%)',
                    }} />
                )}

                {/* Overlays */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.9) 100%)',
                }} />

                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 'clamp(1rem, 3vw, 1.5rem)',
                    textAlign: 'center',
                }}>
                    {/* Badge */}
                    <div style={{
                        position: 'absolute',
                        top: 'clamp(0.75rem, 2vw, 1rem)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.6rem',
                            background: 'rgba(229, 9, 20, 0.9)',
                            borderRadius: '100px',
                            fontSize: 'clamp(0.45rem, 1.2vw, 0.55rem)',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: '#fff',
                        }}>
                            ❤️ Nossa História
                        </span>
                    </div>

                    <h3 style={{ fontSize: 'clamp(1rem, 3.5vw, 1.4rem)', fontWeight: 700, color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {creatorName}
                    </h3>
                    <span style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)', color: 'rgba(255,255,255,0.4)' }}>&</span>
                    <h3 style={{ fontSize: 'clamp(1rem, 3.5vw, 1.4rem)', fontWeight: 700, background: 'linear-gradient(135deg, #ff6b6b, #e50914)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 clamp(0.75rem, 2vw, 1rem) 0' }}>
                        {partnerName}
                    </h3>

                    <div style={{
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                        padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                    }}>
                        <span style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 700, color: '#fff' }}>
                            {timeData?.totalDays?.toLocaleString('pt-BR')}
                        </span>
                        <span style={{ display: 'block', fontSize: 'clamp(0.5rem, 1.2vw, 0.6rem)', color: 'rgba(255,255,255,0.5)', marginTop: '0.15rem' }}>
                            dias de amor ❤️
                        </span>
                    </div>
                </div>
            </div>

            {/* Download button */}
            <button
                onClick={(e) => { e.stopPropagation(); onDownload(); }}
                disabled={isGenerating}
                style={{
                    position: 'absolute',
                    bottom: 'clamp(1.5rem, 4vw, 2.5rem)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 2rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#fff',
                    background: isGenerating ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #e50914, #b20710)',
                    border: 'none',
                    borderRadius: '100px',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    boxShadow: isGenerating ? 'none' : '0 10px 40px rgba(229,9,20,0.35)',
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                    if (!isGenerating) {
                        e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)';
                    }
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';
                }}
            >
                {isGenerating ? '⏳ Gerando...' : '📲 Baixar para Stories'}
            </button>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
        </div>
    );
});

export default ShareableStoryCard;
