import { useState } from 'react';
import { PLANS } from '../config/plans';

/**
 * Seção de Preços Premium - Design Ultra Premium
 */
export default function PricingSection({ onSelectPlan, currentPlan = 'free' }) {
    const [billingPeriod, setBillingPeriod] = useState('semester');

    const plans = [
        { ...PLANS.free, recommended: false },
        { ...PLANS.monthly, recommended: false },
        { ...PLANS.semester, recommended: true },
    ];

    const handleSelectPlan = (plan) => {
        if (plan.checkoutUrl) {
            window.open(plan.checkoutUrl, '_blank');
        }
        if (onSelectPlan) {
            onSelectPlan(plan);
        }
    };

    return (
        <section
            id="pricing"
            style={{
                padding: '120px 24px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Effects */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute',
                    width: '800px',
                    height: '800px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }} />
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{
                        fontSize: '13px',
                        color: '#ec4899',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        marginBottom: '16px',
                        fontWeight: '600',
                    }}>Planos & Preços</p>
                    <h2 style={{
                        fontSize: 'clamp(32px, 5vw, 48px)',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                        marginBottom: '16px',
                    }}>
                        Escolha seu plano
                    </h2>
                    <p style={{
                        fontSize: '18px',
                        color: 'rgba(255,255,255,0.5)',
                        maxWidth: '500px',
                        margin: '0 auto',
                    }}>
                        Crie momentos inesquecíveis. Cancele quando quiser.
                    </p>
                </div>

                {/* Plans Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    alignItems: 'stretch',
                }}>
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            style={{
                                position: 'relative',
                                padding: plan.recommended ? '3px' : '0',
                                borderRadius: '28px',
                                background: plan.recommended
                                    ? 'linear-gradient(135deg, #f43f5e, #ec4899, #a855f7)'
                                    : 'transparent',
                            }}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    padding: '6px 16px',
                                    borderRadius: '100px',
                                    background: plan.badgeColor || '#ec4899',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#fff',
                                    zIndex: 10,
                                    boxShadow: `0 4px 20px ${plan.badgeColor || '#ec4899'}40`,
                                }}>
                                    {plan.badge}
                                </div>
                            )}

                            <div style={{
                                background: 'rgba(15, 15, 15, 0.95)',
                                borderRadius: plan.recommended ? '26px' : '28px',
                                padding: '40px 32px',
                                border: plan.recommended ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                {/* Plan Name */}
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    marginBottom: '8px',
                                }}>{plan.name}</h3>

                                {/* Price */}
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                        <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)' }}>R$</span>
                                        <span style={{
                                            fontSize: '48px',
                                            fontWeight: '700',
                                            background: plan.price > 0
                                                ? 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)'
                                                : 'rgba(255,255,255,0.6)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}>{plan.price}</span>
                                        {plan.period && (
                                            <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)' }}>
                                                /{plan.period}
                                            </span>
                                        )}
                                    </div>
                                    {plan.pricePerMonth && (
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#22c55e',
                                            marginTop: '8px',
                                        }}>
                                            💰 Apenas R$ {plan.pricePerMonth.toFixed(2)}/mês
                                        </p>
                                    )}
                                    {plan.savings && (
                                        <p style={{
                                            fontSize: '13px',
                                            color: '#22c55e',
                                            marginTop: '4px',
                                        }}>
                                            Economia de {plan.savings}
                                        </p>
                                    )}
                                </div>

                                {/* Features */}
                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: '0 0 32px 0',
                                    flex: 1,
                                }}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '14px',
                                            fontSize: '15px',
                                            color: 'rgba(255,255,255,0.8)',
                                        }}>
                                            <span style={{ color: '#22c55e' }}>✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                    {plan.limitations?.map((limitation, i) => (
                                        <li key={`lim-${i}`} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '14px',
                                            fontSize: '15px',
                                            color: 'rgba(255,255,255,0.4)',
                                        }}>
                                            <span style={{ color: 'rgba(255,255,255,0.3)' }}>✕</span>
                                            {limitation}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={currentPlan === plan.id}
                                    style={{
                                        width: '100%',
                                        padding: '16px 24px',
                                        borderRadius: '14px',
                                        border: 'none',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: currentPlan === plan.id ? 'default' : 'pointer',
                                        transition: 'all 0.3s',
                                        ...(plan.recommended ? {
                                            background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                            color: '#fff',
                                            boxShadow: '0 8px 32px rgba(236, 72, 153, 0.35)',
                                        } : plan.price > 0 ? {
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff',
                                        } : {
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            color: 'rgba(255,255,255,0.6)',
                                        }),
                                        ...(currentPlan === plan.id && {
                                            opacity: 0.5,
                                            background: 'rgba(255,255,255,0.05)',
                                            color: 'rgba(255,255,255,0.5)',
                                        }),
                                    }}
                                >
                                    {currentPlan === plan.id
                                        ? 'Plano atual'
                                        : plan.price === 0
                                            ? 'Começar grátis'
                                            : `Assinar ${plan.name}`
                                    }
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust indicators */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    marginTop: '60px',
                    flexWrap: 'wrap',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                        <span style={{ fontSize: '20px' }}>🔒</span>
                        Pagamento seguro
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                        <span style={{ fontSize: '20px' }}>↩️</span>
                        Cancele quando quiser
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                        <span style={{ fontSize: '20px' }}>💳</span>
                        Mercado Pago
                    </div>
                </div>
            </div>
        </section>
    );
}
