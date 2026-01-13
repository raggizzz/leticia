import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type, duration };

        setToasts(prev => [...prev, toast]);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
    const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
    const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);
    const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast deve ser usado dentro de um ToastProvider');
    }
    return context;
}

// Container de Toasts
function ToastContainer({ toasts, onRemove }) {
    return (
        <>
            <style>{`
                @keyframes toast-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes toast-out {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                @keyframes toast-progress {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
            `}</style>
            <div style={{
                position: 'fixed',
                top: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '400px',
                pointerEvents: 'none',
            }}>
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} onRemove={onRemove} />
                ))}
            </div>
        </>
    );
}

// Componente Toast individual
function Toast({ toast, onRemove }) {
    const { id, message, type, duration } = toast;

    const configs = {
        success: {
            bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)',
            border: 'rgba(34, 197, 94, 0.3)',
            icon: '✓',
            iconBg: '#22c55e',
        },
        error: {
            bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
            border: 'rgba(239, 68, 68, 0.3)',
            icon: '✕',
            iconBg: '#ef4444',
        },
        warning: {
            bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.1) 100%)',
            border: 'rgba(245, 158, 11, 0.3)',
            icon: '⚠',
            iconBg: '#f59e0b',
        },
        info: {
            bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)',
            border: 'rgba(59, 130, 246, 0.3)',
            icon: 'ℹ',
            iconBg: '#3b82f6',
        },
    };

    const config = configs[type] || configs.info;

    return (
        <div
            style={{
                background: config.bg,
                backdropFilter: 'blur(16px)',
                border: `1px solid ${config.border}`,
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                animation: 'toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                pointerEvents: 'auto',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Icon */}
            <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: config.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                flexShrink: 0,
            }}>
                {config.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingTop: '3px' }}>
                <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#fff',
                    lineHeight: 1.5,
                }}>
                    {message}
                </p>
            </div>

            {/* Close button */}
            <button
                onClick={() => onRemove(id)}
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '12px',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                }}
                onMouseEnter={e => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.color = '#fff';
                }}
                onMouseLeave={e => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = 'rgba(255, 255, 255, 0.5)';
                }}
            >
                ✕
            </button>

            {/* Progress bar */}
            {duration > 0 && (
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: config.iconBg,
                    transformOrigin: 'left',
                    animation: `toast-progress ${duration}ms linear`,
                    opacity: 0.5,
                }} />
            )}
        </div>
    );
}

export { ToastContext };
