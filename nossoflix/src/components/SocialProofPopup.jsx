import { useState, useEffect } from 'react';

/**
 * Social Proof Popup - Mostra atividade recente fictícia
 */

const names = [
    'Maria', 'Ana', 'Juliana', 'Camila', 'Beatriz', 'Larissa', 'Fernanda',
    'Pedro', 'Lucas', 'Gabriel', 'Rafael', 'Bruno', 'Thiago', 'Felipe',
    'Carolina', 'Amanda', 'Patricia', 'Isabela', 'Mariana', 'Daniela',
];

const cities = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Salvador',
    'Brasília', 'Fortaleza', 'Recife', 'Porto Alegre', 'Goiânia',
    'Manaus', 'Belém', 'Campinas', 'Natal', 'Florianópolis',
];

const actions = [
    { text: 'acabou de criar', icon: '🎉', color: '#22c55e' },
    { text: 'começou a editar', icon: '✏️', color: '#3b82f6' },
    { text: 'publicou', icon: '🚀', color: '#ec4899' },
];

function generateNotification() {
    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const minutes = Math.floor(Math.random() * 15) + 1;

    return {
        name,
        city,
        action,
        time: `Há ${minutes} min`,
    };
}

export default function SocialProofPopup({ enabled = true }) {
    const [visible, setVisible] = useState(false);
    const [notification, setNotification] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (!enabled || dismissed) return;

        // Mostrar primeira notificação após 8 segundos
        const firstTimeout = setTimeout(() => {
            showNotification();
        }, 8000);

        return () => clearTimeout(firstTimeout);
    }, [enabled, dismissed]);

    const showNotification = () => {
        setNotification(generateNotification());
        setVisible(true);

        // Esconder após 5 segundos
        setTimeout(() => {
            setVisible(false);

            // Próxima notificação em 20-40 segundos
            const nextDelay = 20000 + Math.random() * 20000;
            setTimeout(showNotification, nextDelay);
        }, 5000);
    };

    const handleDismiss = () => {
        setVisible(false);
        setDismissed(true);
    };

    if (!visible || !notification) return null;

    return (
        <>
            <style>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(100%) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes slideOutDown {
                    from {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(100%) scale(0.95);
                    }
                }
            `}</style>

            <div
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '24px',
                    zIndex: 1000,
                    animation: 'slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px 20px',
                    background: 'rgba(15, 15, 15, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    maxWidth: '320px',
                }}>
                    {/* Icon */}
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: `${notification.action.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        flexShrink: 0,
                    }}>
                        {notification.action.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            marginBottom: '4px',
                            color: '#fff',
                        }}>
                            <span style={{ color: notification.action.color }}>{notification.name}</span>
                            {' '}{notification.action.text} um NossoFlix
                        </p>
                        <p style={{
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.4)',
                        }}>
                            {notification.city} • {notification.time}
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        ✕
                    </button>
                </div>
            </div>
        </>
    );
}
