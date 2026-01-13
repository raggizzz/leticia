/**
 * ============================================
 * NOSSOFLIX - CONFIGURAÇÃO DE PLANOS
 * ============================================
 */

export const PLANS = {
    free: {
        id: 'free',
        name: 'Gratuito',
        price: 0,
        period: null,
        features: [
            '1 site NossoFlix',
            'Template básico',
            'Personalização de textos',
        ],
        limitations: [
            'Marca d\'água NossoFlix',
            'Sem novos templates',
            'Sem QR Code',
            'Sem analytics',
            'Sem música de fundo',
        ],
        maxSites: 1,
        hasWatermark: true,
        hasNewTemplates: false,
        hasQRCode: false,
        hasAnalytics: false,
        hasIntro: false,
        checkoutUrl: null,
    },
    monthly: {
        id: 'monthly',
        name: 'Mensal',
        price: 29,
        period: 'mês',
        features: [
            'Novos templates de sites',
            'Sem marca d\'água',
            'QR Code exclusivo',
            'Analytics completo',
            'Intro cinematográfica',
            'Música de fundo',
            'Suporte prioritário',
        ],
        limitations: [],
        maxSites: 999,
        hasWatermark: false,
        hasNewTemplates: true,
        hasQRCode: true,
        hasAnalytics: true,
        hasIntro: true,
        checkoutUrl: 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=178c7ff71bc44b93a5163e6345b2fd77',
        badge: 'Popular',
        badgeColor: '#ec4899',
    },
    semester: {
        id: 'semester',
        name: 'Semestral',
        price: 99,
        period: '6 meses',
        pricePerMonth: 16.50,
        savings: '43%',
        features: [
            'Tudo do plano Mensal',
            'Música de fundo',
            'Economia de 43%',
            'Prioridade em novas features',
            'Suporte VIP',
        ],
        limitations: [],
        maxSites: 999,
        hasWatermark: false,
        hasNewTemplates: true,
        hasQRCode: true,
        hasAnalytics: true,
        hasIntro: true,
        checkoutUrl: 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=d3ebd456cee34000a989ee261dbdaa96',
        badge: 'Melhor valor',
        badgeColor: '#22c55e',
    },
};

/**
 * Verifica se um plano tem determinada feature
 */
export function planHasFeature(planType, feature) {
    const plan = PLANS[planType] || PLANS.free;
    return plan[feature] ?? false;
}

/**
 * Retorna o plano do usuário ou free como fallback
 */
export function getPlan(planType) {
    return PLANS[planType] || PLANS.free;
}

/**
 * Verifica se é um plano pago
 */
export function isPaidPlan(planType) {
    return planType === 'monthly' || planType === 'semester';
}
