import { useState, useEffect } from 'react';

/**
 * Componente de controle de som fixo
 * Permite ao usuário ativar/desativar o áudio de fundo
 */
export default function SoundControl({ enabled = true, onToggle }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Verificar se o usuário já interagiu com a página
    useEffect(() => {
        const handleInteraction = () => {
            setHasInteracted(true);
            // Remover listeners após primeira interação
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    const toggleSound = () => {
        const newState = !isPlaying;
        setIsPlaying(newState);
        onToggle?.(newState);
    };

    if (!enabled) return null;

    return (
        <button
            onClick={toggleSound}
            className="fixed bottom-6 right-6 z-50 group"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.5)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
            aria-label={isPlaying ? 'Desativar música' : 'Ativar música'}
        >
            {/* Ícone de som */}
            <span style={{ fontSize: '20px' }}>
                {isPlaying ? '🔊' : '🔇'}
            </span>

            {/* Label - mostra apenas no hover ou se não interagiu ainda */}
            <span
                style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.8)',
                    whiteSpace: 'nowrap',
                    maxWidth: hasInteracted ? '0' : '150px',
                    overflow: 'hidden',
                    transition: 'max-width 0.3s ease',
                }}
                className="group-hover:!max-w-[150px]"
            >
                {isPlaying ? 'Som ativado' : 'Ativar som 🎵'}
            </span>

            {/* Indicator de pulsação quando tocando */}
            {isPlaying && (
                <span
                    style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '12px',
                        height: '12px',
                        background: '#22c55e',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite',
                    }}
                />
            )}
        </button>
    );
}
