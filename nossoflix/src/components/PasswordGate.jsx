import { useState } from 'react';

/**
 * Componente de Gate de Senha
 * Exibido quando um site é privado e requer autenticação
 */
export default function PasswordGate({ siteName, onUnlock, errorMessage = null }) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(errorMessage);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password.trim()) {
            setError('Digite a senha para continuar');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Callback para validar a senha (será implementado no Root)
            const isValid = await onUnlock(password);

            if (!isValid) {
                setError('Senha incorreta. Tente novamente.');
            }
        } catch (err) {
            setError('Erro ao verificar senha. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)',
            padding: '24px',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
            }}>
                {/* Logo/Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 24px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)',
                }}>
                    🔒
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '8px',
                }}>
                    Conteúdo Privado
                </h1>

                <p style={{
                    fontSize: '15px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '32px',
                }}>
                    {siteName ? `"${siteName}" está protegido com senha.` : 'Este site está protegido com senha.'}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite a senha"
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: error ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.2s',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#ec4899';
                                e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = error ? '#ef4444' : 'rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <p style={{
                            color: '#ef4444',
                            fontSize: '14px',
                            marginBottom: '16px',
                        }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '16px 24px',
                            background: isLoading ? 'rgba(236, 72, 153, 0.5)' : 'linear-gradient(135deg, #f43f5e, #ec4899)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 8px 24px rgba(236, 72, 153, 0.25)',
                        }}
                    >
                        {isLoading ? 'Verificando...' : 'Entrar'}
                    </button>
                </form>

                {/* Hint */}
                <p style={{
                    marginTop: '24px',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.3)',
                }}>
                    💕 Peça a senha para quem te enviou este link
                </p>
            </div>
        </div>
    );
}
