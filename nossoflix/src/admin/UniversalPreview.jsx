import { useState, useEffect } from 'react';
import { HeroMiniPreview } from './HeroMiniPreview';

/**
 * Componente Universal de Preview para o Admin Panel
 * Mostra preview específico baseado na aba ativa
 */
export function UniversalPreview({ activeTab, config, getField }) {
    const [isAnimating, setIsAnimating] = useState(false);

    // Animar quando a aba muda
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 300);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const containerStyles = {
        wrapper: {
            position: 'sticky',
            top: '24px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.3s ease',
            transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
            opacity: isAnimating ? 0.8 : 1,
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
        },
        title: {
            fontSize: '12px',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        liveDot: {
            width: '8px',
            height: '8px',
            background: '#4ade80',
            borderRadius: '50%',
            animation: 'pulse 1.5s infinite',
        },
        hint: {
            fontSize: '11px',
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center',
            marginTop: '16px',
        },
    };

    // Renderiza o preview baseado na aba ativa
    const renderPreview = () => {
        switch (activeTab) {
            case 'couple':
                return (
                    <HeroMiniPreview
                        creatorName={getField('coupleInfo.creator.name')}
                        partnerName={getField('coupleInfo.partner.name')}
                        heroBackground={getField('themeConfig.heroBackground')}
                        startDate={getField('coupleInfo.relationship.startDate')}
                        currentSeason={getField('coupleInfo.relationship.currentSeason')}
                    />
                );

            case 'hero':
                return <HeroPreview config={config} getField={getField} />;

            case 'letter':
                return <LetterPreview config={config} getField={getField} />;

            case 'moments':
                return <MomentsPreview config={config} getField={getField} />;

            case 'difficult':
                return <DifficultPreview config={config} getField={getField} />;

            case 'backstage':
                return <BackstagePreview config={config} getField={getField} />;

            case 'promises':
                return <PromisesPreview config={config} getField={getField} />;

            case 'credits':
                return <CreditsPreview config={config} getField={getField} />;

            case 'settings':
                return <SettingsPreview config={config} getField={getField} />;

            default:
                return null;
        }
    };

    const getTabLabel = () => {
        const labels = {
            couple: 'Capa do Site',
            hero: 'Banner Principal',
            letter: 'Carta de Amor',
            moments: 'Melhores Momentos',
            difficult: 'Episódios Difíceis',
            backstage: 'Bastidores',
            promises: 'Promessas',
            credits: 'Créditos Finais',
            settings: 'Configurações',
        };
        return labels[activeTab] || 'Preview';
    };

    return (
        <div style={containerStyles.wrapper}>
            <div style={containerStyles.header}>
                <h3 style={containerStyles.title}>
                    <span style={containerStyles.liveDot} />
                    Preview: {getTabLabel()}
                </h3>
            </div>

            {renderPreview()}

            <p style={containerStyles.hint}>
                ☝️ Alterações aparecem aqui em tempo real
            </p>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.95); }
                }
            `}</style>
        </div>
    );
}

/**
 * Preview do Hero/Capa
 */
function HeroPreview({ config, getField }) {
    const styles = {
        container: {
            aspectRatio: '16/9',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            background: getField('themeConfig.heroBackground')
                ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${getField('themeConfig.heroBackground')}) center/cover`
                : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        },
        content: {
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
        },
        title: {
            fontSize: '10px',
            fontWeight: '700',
            color: '#e50914',
            letterSpacing: '2px',
            marginBottom: '4px',
        },
        name: {
            fontSize: '24px',
            fontWeight: '900',
            color: 'white',
            lineHeight: '1.1',
        },
        description: {
            fontSize: '10px',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '8px',
            lineHeight: '1.4',
        },
        buttons: {
            display: 'flex',
            gap: '8px',
            marginTop: '12px',
        },
        primaryBtn: {
            padding: '6px 12px',
            background: '#e50914',
            color: 'white',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '600',
            border: 'none',
        },
        secondaryBtn: {
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '600',
            border: '1px solid rgba(255,255,255,0.3)',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.title}>
                    {getField('heroContent.title') || 'SÉRIE ORIGINAL'} • {getField('heroContent.subtitle') || 'NOSSOFLIX'}
                </div>
                <div style={styles.name}>
                    {getField('coupleInfo.creator.name') || 'Nome'} & {getField('coupleInfo.partner.name') || 'Amor'}
                </div>
                <div style={styles.description}>
                    {getField('heroContent.description') || 'Uma história de amor, aprendizado e crescimento.'}
                </div>
                <div style={styles.buttons}>
                    <button style={styles.primaryBtn}>
                        {getField('heroContent.primaryButtonText') || '▶ Assistir'}
                    </button>
                    <button style={styles.secondaryBtn}>
                        {getField('heroContent.secondaryButtonText') || 'ℹ Info'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Preview da Carta
 */
function LetterPreview({ config, getField }) {
    const styles = {
        container: {
            background: 'linear-gradient(180deg, rgba(139,92,246,0.1) 0%, rgba(219,39,119,0.1) 100%)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
        },
        title: {
            fontSize: '16px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '12px',
            textAlign: 'center',
        },
        paragraph: {
            fontSize: '11px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.6',
            marginBottom: '8px',
            fontStyle: 'italic',
        },
        closing: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#ec4899',
            textAlign: 'right',
            marginTop: '12px',
        },
    };

    const paragraphs = config?.mainLetter?.paragraphs || [];

    return (
        <div style={styles.container}>
            <div style={styles.title}>
                {getField('mainLetter.title') || 'Carta para você ❤️'}
            </div>
            {paragraphs.slice(0, 2).map((p, i) => (
                <p key={i} style={styles.paragraph}>
                    {p?.substring(0, 100)}{p?.length > 100 ? '...' : ''}
                </p>
            ))}
            {paragraphs.length > 2 && (
                <p style={{ ...styles.paragraph, color: 'rgba(255,255,255,0.4)' }}>
                    ... +{paragraphs.length - 2} parágrafos
                </p>
            )}
            <div style={styles.closing}>
                {getField('mainLetter.closing') || 'Te amo! ❤️'}
            </div>
        </div>
    );
}

/**
 * Preview dos Momentos
 */
function MomentsPreview({ config, getField }) {
    const moments = config?.bestMoments || [];

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        header: {
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '4px',
        },
        card: {
            display: 'flex',
            gap: '10px',
            padding: '10px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
        },
        thumbnail: {
            width: '60px',
            height: '40px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
        },
        info: {
            flex: 1,
            minWidth: 0,
        },
        episodeNum: {
            fontSize: '9px',
            color: '#ec4899',
            fontWeight: '600',
        },
        title: {
            fontSize: '11px',
            fontWeight: '600',
            color: 'white',
            marginTop: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        empty: {
            textAlign: 'center',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            padding: '20px',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>✨ Melhores Momentos ({moments.length})</div>
            {moments.length === 0 ? (
                <div style={styles.empty}>Nenhum momento adicionado</div>
            ) : (
                moments.slice(0, 3).map((moment, i) => (
                    <div key={i} style={styles.card}>
                        <div style={styles.thumbnail}>
                            {moment.image ? (
                                <img src={moment.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                            ) : '✨'}
                        </div>
                        <div style={styles.info}>
                            <div style={styles.episodeNum}>{moment.episodeNumber}</div>
                            <div style={styles.title}>{moment.title}</div>
                        </div>
                    </div>
                ))
            )}
            {moments.length > 3 && (
                <div style={{ ...styles.empty, padding: '8px' }}>
                    +{moments.length - 3} momentos
                </div>
            )}
        </div>
    );
}

/**
 * Preview dos Episódios Difíceis
 */
function DifficultPreview({ config, getField }) {
    const episodes = config?.difficultEpisodes || [];
    const enabled = getField('enabledSections.difficultEpisodes');

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        header: {
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        badge: {
            fontSize: '9px',
            padding: '2px 6px',
            borderRadius: '10px',
            background: enabled ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)',
            color: enabled ? '#4ade80' : '#ef4444',
        },
        card: {
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(219,39,119,0.1) 100%)',
            borderRadius: '8px',
            border: '1px solid rgba(239,68,68,0.2)',
        },
        episodeNum: {
            fontSize: '9px',
            color: '#ef4444',
            fontWeight: '600',
        },
        title: {
            fontSize: '11px',
            fontWeight: '600',
            color: 'white',
            marginTop: '4px',
        },
        sections: {
            display: 'flex',
            gap: '4px',
            marginTop: '8px',
        },
        section: {
            flex: 1,
            padding: '4px',
            borderRadius: '4px',
            fontSize: '8px',
            textAlign: 'center',
        },
        empty: {
            textAlign: 'center',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            padding: '20px',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                💔 Episódios Difíceis ({episodes.length})
                <span style={styles.badge}>{enabled ? 'Visível' : 'Oculto'}</span>
            </div>
            {episodes.length === 0 ? (
                <div style={styles.empty}>Nenhum episódio adicionado</div>
            ) : (
                episodes.slice(0, 2).map((ep, i) => (
                    <div key={i} style={styles.card}>
                        <div style={styles.episodeNum}>{ep.episodeNumber}</div>
                        <div style={styles.title}>{ep.title}</div>
                        <div style={styles.sections}>
                            <div style={{ ...styles.section, background: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>Aconteceu</div>
                            <div style={{ ...styles.section, background: 'rgba(236,72,153,0.2)', color: '#f9a8d4' }}>Significou</div>
                            <div style={{ ...styles.section, background: 'rgba(168,85,247,0.2)', color: '#c4b5fd' }}>Aprendi</div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

/**
 * Preview dos Bastidores
 */
function BackstagePreview({ config, getField }) {
    const items = config?.behindTheScenes || [];

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        header: {
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
        },
        card: {
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.15) 100%)',
            borderRadius: '8px',
            border: '1px solid rgba(168,85,247,0.2)',
        },
        icon: {
            fontSize: '20px',
            marginBottom: '8px',
        },
        title: {
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
        },
        subtitle: {
            fontSize: '10px',
            color: 'rgba(255,255,255,0.6)',
            marginTop: '2px',
        },
        empty: {
            textAlign: 'center',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            padding: '20px',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>🎭 Bastidores ({items.length})</div>
            {items.length === 0 ? (
                <div style={styles.empty}>Nenhum bastidor adicionado</div>
            ) : (
                items.slice(0, 2).map((item, i) => (
                    <div key={i} style={styles.card}>
                        <div style={styles.icon}>{item.icon || '💭'}</div>
                        <div style={styles.title}>{item.title}</div>
                        <div style={styles.subtitle}>{item.subtitle}</div>
                    </div>
                ))
            )}
        </div>
    );
}

/**
 * Preview das Promessas
 */
function PromisesPreview({ config, getField }) {
    const items = config?.promises || [];

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        header: {
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
        },
        card: {
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(20,184,166,0.15) 100%)',
            borderRadius: '8px',
            border: '1px solid rgba(34,197,94,0.2)',
        },
        icon: {
            fontSize: '20px',
            marginBottom: '8px',
        },
        title: {
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
        },
        description: {
            fontSize: '10px',
            color: 'rgba(255,255,255,0.6)',
            marginTop: '4px',
        },
        empty: {
            textAlign: 'center',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            padding: '20px',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>🤝 Promessas ({items.length})</div>
            {items.length === 0 ? (
                <div style={styles.empty}>Nenhuma promessa adicionada</div>
            ) : (
                items.slice(0, 2).map((item, i) => (
                    <div key={i} style={styles.card}>
                        <div style={styles.icon}>{item.icon || '🤝'}</div>
                        <div style={styles.title}>{item.title}</div>
                        <div style={styles.description}>{item.description}</div>
                    </div>
                ))
            )}
        </div>
    );
}

/**
 * Preview dos Créditos
 */
function CreditsPreview({ config, getField }) {
    const styles = {
        container: {
            background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
        },
        title: {
            fontSize: '14px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '12px',
        },
        message: {
            fontSize: '10px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.5',
            marginBottom: '12px',
        },
        button: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: '600',
            border: 'none',
        },
        footer: {
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
        },
        copyright: {
            fontSize: '9px',
            color: 'rgba(255,255,255,0.4)',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.title}>
                {getField('credits.title') || 'Créditos Finais'}
            </div>
            <div style={styles.message}>
                {getField('credits.finalMessage.closing') || 'Te amo para sempre ❤️'}
            </div>
            <button style={styles.button}>
                💬 {getField('credits.ctaButton.text') || 'Mandar WhatsApp'}
            </button>
            <div style={styles.footer}>
                <div style={styles.copyright}>
                    {getField('credits.footer.copyright') || '© 2024 NossoFlix'}
                </div>
            </div>
        </div>
    );
}

/**
 * Preview das Configurações
 */
function SettingsPreview({ config, getField }) {
    const sections = [
        { key: 'bestMoments', label: 'Melhores Momentos', icon: '✨' },
        { key: 'difficultEpisodes', label: 'Episódios Difíceis', icon: '💔' },
        { key: 'behindTheScenes', label: 'Bastidores', icon: '🎭' },
        { key: 'promises', label: 'Promessas', icon: '🤝' },
        { key: 'credits', label: 'Créditos', icon: '🎬' },
        { key: 'backgroundMusic', label: 'Música', icon: '🎵' },
    ];

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        header: {
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '4px',
        },
        item: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)',
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.8)',
        },
        status: {
            fontSize: '9px',
            padding: '2px 8px',
            borderRadius: '10px',
        },
        enabled: {
            background: 'rgba(74,222,128,0.2)',
            color: '#4ade80',
        },
        disabled: {
            background: 'rgba(239,68,68,0.2)',
            color: '#ef4444',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>⚙️ Seções Ativas</div>
            {sections.map(section => {
                const enabled = getField(`enabledSections.${section.key}`);
                return (
                    <div key={section.key} style={styles.item}>
                        <span style={styles.label}>
                            <span>{section.icon}</span>
                            {section.label}
                        </span>
                        <span style={{ ...styles.status, ...(enabled ? styles.enabled : styles.disabled) }}>
                            {enabled ? 'ON' : 'OFF'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default UniversalPreview;
