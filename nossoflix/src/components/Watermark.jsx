/**
 * Marca d'água para sites do plano gratuito
 * Usa a logo oficial do NossoFlix com tooltip de CTA
 */
import { useState } from 'react';

export default function Watermark() {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 40 }}>
            {/* Tooltip */}
            <div style={{
                position: 'absolute',
                bottom: '100%',
                right: '0',
                marginBottom: '8px',
                padding: '10px 14px',
                background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.98), rgba(30, 30, 30, 0.98))',
                borderRadius: '12px',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                whiteSpace: 'nowrap',
                opacity: showTooltip ? 1 : 0,
                transform: showTooltip ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.3s ease',
                pointerEvents: showTooltip ? 'auto' : 'none',
            }}>
                <p style={{ fontSize: '13px', color: '#fff', margin: 0, fontWeight: '500' }}>
                    💕 Crie um igual para o seu relacionamento!
                </p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0' }}>
                    Clique para conhecer → nossoflix.com
                </p>
                {/* Arrow */}
                <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '20px',
                    width: '12px',
                    height: '12px',
                    background: 'rgba(30, 30, 30, 0.98)',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    borderTop: 'none',
                    borderLeft: 'none',
                    transform: 'rotate(45deg)',
                }} />
            </div>

            {/* Badge principal */}
            <a
                href="https://nossoflix.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    background: 'rgba(0, 0, 0, 0.9)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '100px',
                    border: showTooltip ? '1px solid rgba(236, 72, 153, 0.5)' : '1px solid rgba(255, 255, 255, 0.15)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: showTooltip ? '0 8px 32px rgba(236, 72, 153, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.4)',
                    transform: showTooltip ? 'scale(1.05)' : 'scale(1)',
                }}
            >
                {/* Logo NossoFlix */}
                <img
                    src="/logo-nossoflix.png"
                    alt="NossoFlix"
                    style={{
                        width: '28px',
                        height: '28px',
                        objectFit: 'contain',
                        borderRadius: '4px',
                    }}
                />
                <span style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '500',
                    letterSpacing: '0.3px',
                }}>
                    Criado com <span style={{
                        background: 'linear-gradient(135deg, #c9a227, #d4af37)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '600',
                    }}>NossoFlix</span>
                </span>
            </a>
        </div>
    );
}
