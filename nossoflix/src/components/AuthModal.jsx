import { useState } from 'react';
import { useAuth, useToast } from '../contexts';
import { getPasswordStrength, isValidEmail, VALIDATION_MESSAGES } from '../lib/authMessages';

/**
 * Modal de Autenticação - Design Premium Anti-IA
 */
export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }) {
    const { signIn, signUp, resetPassword, loading } = useAuth();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [coupleName, setCoupleName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [hint, setHint] = useState('');
    const [focusedField, setFocusedField] = useState(null);

    // Força da senha
    const passwordStrength = getPasswordStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setHint('');

        // Validações locais
        if (!isValidEmail(email)) {
            setError(VALIDATION_MESSAGES.email.invalid);
            toast.error(VALIDATION_MESSAGES.email.invalid);
            return;
        }

        if (activeTab !== 'forgot' && password.length < 6) {
            setError(VALIDATION_MESSAGES.password.tooShort);
            toast.error(VALIDATION_MESSAGES.password.tooShort);
            return;
        }

        if (activeTab === 'register' && password !== confirmPassword) {
            setError(VALIDATION_MESSAGES.confirmPassword.mismatch);
            toast.error(VALIDATION_MESSAGES.confirmPassword.mismatch);
            return;
        }

        if (activeTab === 'register' && coupleName.length < 3) {
            setError(VALIDATION_MESSAGES.coupleName.tooShort);
            toast.error(VALIDATION_MESSAGES.coupleName.tooShort);
            return;
        }

        if (activeTab === 'login') {
            const result = await signIn(email, password);
            if (result.success) {
                toast.success('👋 Bem-vindo de volta! Login realizado com sucesso.');
                onClose();
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        } else if (activeTab === 'register') {
            const result = await signUp(email, password, { couple_name: coupleName });
            if (result.success) {
                setSuccess(result.message);
                setHint(result.hint || '');
                toast.success('🎉 ' + result.message);
                setActiveTab('login');
                // Limpar campos para login
                setPassword('');
                setConfirmPassword('');
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        } else if (activeTab === 'forgot') {
            const result = await resetPassword(email);
            if (result.success) {
                setSuccess(result.message);
                setHint(result.hint || '');
                toast.success('📧 ' + result.message);
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        }
    };

    if (!isOpen) return null;

    const inputStyle = (fieldName) => ({
        width: '100%',
        padding: '16px 18px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: `1.5px solid ${focusedField === fieldName ? 'rgba(236, 72, 153, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '14px',
        fontSize: '15px',
        color: '#fff',
        outline: 'none',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxSizing: 'border-box',
        boxShadow: focusedField === fieldName ? '0 0 0 4px rgba(236, 72, 153, 0.1)' : 'none'
    });

    return (
        <div
            onClick={onClose}
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
        >
            {/* CSS Animations */}
            <style>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .modal-animate {
          animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

            <div
                className="modal-animate"
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '440px'
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '-52px',
                        right: '0',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.4)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#fff'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}
                >
                    <span style={{ fontSize: '16px' }}>✕</span>
                    Fechar
                </button>

                {/* Modal */}
                <div style={{
                    background: 'linear-gradient(180deg, rgba(18,18,18,0.98) 0%, rgba(10,10,10,0.98) 100%)',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.05)'
                }}>

                    {/* Header */}
                    <div style={{
                        padding: '48px 40px 40px',
                        background: 'linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(168,85,247,0.05) 100%)',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative gradient */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '300px',
                            height: '300px',
                            background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }} />

                        {/* Logo */}
                        <div style={{
                            position: 'relative',
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 24px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
                        }}>
                            <img
                                src="/logo-nossoflix.png"
                                alt="NossoFlix"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                }}
                            />
                        </div>

                        <h2 style={{
                            position: 'relative',
                            fontSize: '26px',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                            marginBottom: '8px'
                        }}>
                            {activeTab === 'login' && 'Bem-vindo de volta!'}
                            {activeTab === 'register' && 'Crie sua conta'}
                            {activeTab === 'forgot' && 'Recuperar acesso'}
                        </h2>
                        <p style={{
                            position: 'relative',
                            fontSize: '15px',
                            color: 'rgba(255, 255, 255, 0.5)'
                        }}>
                            {activeTab === 'login' && 'Entre para acessar seu NossoFlix'}
                            {activeTab === 'register' && 'Comece a criar sua história de amor'}
                            {activeTab === 'forgot' && 'Vamos enviar um link para seu email'}
                        </p>
                    </div>

                    {/* Tabs */}
                    {activeTab !== 'forgot' && (
                        <div style={{
                            display: 'flex',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                            padding: '0 8px'
                        }}>
                            {['login', 'register'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setError(''); setSuccess(''); }}
                                    style={{
                                        flex: 1,
                                        padding: '18px 16px',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: `2px solid ${activeTab === tab ? '#ec4899' : 'transparent'}`,
                                        color: activeTab === tab ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s',
                                        marginBottom: '-1px'
                                    }}
                                >
                                    {tab === 'login' ? 'Entrar' : 'Criar Conta'}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ padding: '36px 40px 40px' }}>

                        {/* Alerts */}
                        {error && (
                            <div style={{
                                padding: '16px 18px',
                                borderRadius: '14px',
                                fontSize: '14px',
                                marginBottom: '24px',
                                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#f87171',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span>⚠️</span> {error}
                            </div>
                        )}
                        {success && (
                            <div style={{
                                padding: '16px 18px',
                                borderRadius: '14px',
                                fontSize: '14px',
                                marginBottom: '24px',
                                backgroundColor: 'rgba(34, 197, 94, 0.08)',
                                border: '1px solid rgba(34, 197, 94, 0.2)',
                                color: '#4ade80',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>✓</span> {success}
                                </div>
                                {hint && (
                                    <p style={{
                                        margin: '8px 0 0 26px',
                                        fontSize: '12px',
                                        color: 'rgba(34, 197, 94, 0.7)',
                                    }}>
                                        💡 {hint}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Nome do Casal (apenas registro) */}
                        {activeTab === 'register' && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginBottom: '10px'
                                }}>Nome do Casal</label>
                                <input
                                    type="text"
                                    value={coupleName}
                                    onChange={(e) => setCoupleName(e.target.value)}
                                    onFocus={() => setFocusedField('couple')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Ex: Igor & Letícia"
                                    style={inputStyle('couple')}
                                    required
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: 'rgba(255, 255, 255, 0.6)',
                                marginBottom: '10px'
                            }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="seu@email.com"
                                style={inputStyle('email')}
                                required
                            />
                        </div>

                        {/* Password */}
                        {activeTab !== 'forgot' && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginBottom: '10px'
                                }}>Senha</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••"
                                    style={inputStyle('password')}
                                    required
                                    minLength={6}
                                />

                                {/* Password Strength Indicator (apenas no registro) */}
                                {activeTab === 'register' && password && (
                                    <div style={{ marginTop: '10px' }}>
                                        <div style={{
                                            display: 'flex',
                                            gap: '4px',
                                            marginBottom: '6px'
                                        }}>
                                            {[0, 1, 2, 3].map(index => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        flex: 1,
                                                        height: '4px',
                                                        borderRadius: '2px',
                                                        backgroundColor: index <= passwordStrength.score
                                                            ? passwordStrength.color
                                                            : 'rgba(255, 255, 255, 0.1)',
                                                        transition: 'all 0.3s'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <p style={{
                                            fontSize: '12px',
                                            color: passwordStrength.color,
                                            margin: 0
                                        }}>
                                            {passwordStrength.label}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Confirm Password (apenas registro) */}
                        {activeTab === 'register' && (
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginBottom: '10px'
                                }}>Confirmar Senha</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => setFocusedField('confirm')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••"
                                    style={inputStyle('confirm')}
                                    required
                                    minLength={6}
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '18px',
                                background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
                                border: 'none',
                                borderRadius: '14px',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#fff',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 8px 24px rgba(236, 72, 153, 0.25)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <span style={{
                                        width: '18px',
                                        height: '18px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: '#fff',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite'
                                    }} />
                                    Processando...
                                </span>
                            ) : (
                                <>
                                    {activeTab === 'login' && 'Entrar'}
                                    {activeTab === 'register' && 'Criar minha conta'}
                                    {activeTab === 'forgot' && 'Enviar link'}
                                </>
                            )}
                        </button>

                        {/* Links */}
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            {activeTab === 'login' && (
                                <button
                                    type="button"
                                    onClick={() => { setActiveTab('forgot'); setError(''); setSuccess(''); }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255, 255, 255, 0.4)',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#ec4899'}
                                    onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}
                                >
                                    Esqueci minha senha
                                </button>
                            )}
                            {activeTab === 'forgot' && (
                                <button
                                    type="button"
                                    onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255, 255, 255, 0.4)',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#ec4899'}
                                    onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}
                                >
                                    ← Voltar para login
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
