import React from 'react';

/**
 * Modal de Confirmação Reutilizável
 * @param {Object} props
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar/cancelar
 * @param {Function} props.onConfirm - Função para confirmar
 * @param {string} props.title - Título do modal
 * @param {string} props.message - Mensagem principal
 * @param {string} props.confirmText - Texto do botão de confirmação
 * @param {string} props.cancelText - Texto do botão de cancelar
 * @param {boolean} props.isDangerous - Se a ação é destrutiva (muda cor para vermelho)
 * @param {boolean} props.isLoading - Se está carregando (desabilita botões)
 */
export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isDangerous = false,
    isLoading = false
}) {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(12px)',
                padding: '24px'
            }}
            onClick={onClose}
        >
            <style>{`
        @keyframes modal-scale-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    animation: 'modal-scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{
                    padding: '32px',
                    textAlign: 'center',
                    background: isDangerous
                        ? 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(220,38,38,0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.05) 100%)'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        {isDangerous ? '⚠️' : 'ℹ️'}
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>
                        {title}
                    </h2>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                        {message}
                    </div>
                </div>

                <div style={{ padding: '24px', display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            padding: '14px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.5 : 1,
                            transition: 'background 0.2s'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            padding: '14px',
                            background: isDangerous
                                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            boxShadow: isDangerous
                                ? '0 4px 20px rgba(239,68,68,0.3)'
                                : '0 4px 20px rgba(59,130,246,0.3)',
                            opacity: isLoading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {isLoading && (
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTopColor: '#fff',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                        )}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Adicionar keyframes para o spinner se ainda não existirem globalmente
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin { 
    to { transform: rotate(360deg); } 
  }
`;
document.head.appendChild(style);
