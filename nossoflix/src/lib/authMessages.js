/**
 * Biblioteca de mensagens de autenticação em português
 * Traduz erros do Supabase e fornece mensagens de feedback
 */

// Mapeamento de erros do Supabase para português
const ERROR_TRANSLATIONS = {
    // Erros de login
    'Invalid login credentials': 'Email ou senha incorretos. Verifique seus dados e tente novamente.',
    'Invalid email or password': 'Email ou senha incorretos.',
    'Email not confirmed': 'Seu email ainda não foi confirmado. Verifique sua caixa de entrada.',
    'User not found': 'Não encontramos uma conta com este email.',

    // Erros de registro
    'User already registered': 'Este email já está cadastrado. Tente fazer login.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'Unable to validate email address: invalid format': 'Formato de email inválido.',
    'Signup requires a valid password': 'Por favor, digite uma senha válida.',
    'Password is too weak': 'Senha muito fraca. Use letras, números e símbolos.',

    // Erros de rate limit
    'For security purposes, you can only request this once every 60 seconds':
        'Por segurança, aguarde 60 segundos antes de tentar novamente.',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos.',

    // Erros de rede/servidor
    'Failed to fetch': 'Erro de conexão. Verifique sua internet.',
    'Network request failed': 'Falha na conexão. Tente novamente.',
    'Unable to connect to the server': 'Não foi possível conectar ao servidor.',

    // Erros de sessão
    'Session expired': 'Sua sessão expirou. Faça login novamente.',
    'Invalid or expired token': 'Token inválido ou expirado.',
    'Refresh token not found': 'Sessão inválida. Faça login novamente.',

    // Erro de configuração
    'Supabase não configurado': 'O sistema de autenticação não está disponível no momento.',
};

// Códigos de erro específicos do Supabase
const ERROR_CODES = {
    'email_not_confirmed': 'Confirme seu email antes de fazer login. Verifique sua caixa de entrada.',
    'invalid_credentials': 'Email ou senha incorretos.',
    'user_already_exists': 'Este email já está cadastrado.',
    'weak_password': 'Senha muito fraca. Mínimo 6 caracteres.',
    'rate_limit_exceeded': 'Muitas tentativas. Aguarde um momento.',
    'over_email_send_rate_limit': 'Limite de emails atingido. Tente novamente em alguns minutos.',
    'invalid_email': 'Email inválido. Verifique o formato.',
    'signup_disabled': 'Novos cadastros estão temporariamente desabilitados.',
    'email_exists': 'Este email já está em uso.',
};

/**
 * Traduz uma mensagem de erro do Supabase para português
 * @param {string|Error} error - O erro retornado pelo Supabase
 * @returns {string} Mensagem traduzida
 */
export function translateAuthError(error) {
    // Se for um objeto Error, extrair a mensagem
    const message = error?.message || error?.error_description || String(error);

    // Verificar se temos tradução direta
    if (ERROR_TRANSLATIONS[message]) {
        return ERROR_TRANSLATIONS[message];
    }

    // Verificar códigos de erro
    const errorCode = error?.code || error?.error;
    if (errorCode && ERROR_CODES[errorCode]) {
        return ERROR_CODES[errorCode];
    }

    // Verificar por correspondências parciais
    for (const [key, translation] of Object.entries(ERROR_TRANSLATIONS)) {
        if (message.toLowerCase().includes(key.toLowerCase())) {
            return translation;
        }
    }

    // Verificar erros comuns por padrões
    if (message.includes('password') && message.includes('6')) {
        return 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (message.includes('email') && (message.includes('invalid') || message.includes('format'))) {
        return 'Formato de email inválido.';
    }
    if (message.includes('already') && message.includes('registered')) {
        return 'Este email já está cadastrado.';
    }
    if (message.includes('rate') || message.includes('limit')) {
        return 'Muitas tentativas. Aguarde um momento e tente novamente.';
    }
    if (message.includes('network') || message.includes('fetch') || message.includes('connect')) {
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }

    // Se não encontrar tradução, retornar mensagem genérica ou a original
    console.warn('[Auth] Erro não traduzido:', message);
    return message || 'Ocorreu um erro inesperado. Tente novamente.';
}

/**
 * Mensagens de sucesso para diferentes ações
 */
export const SUCCESS_MESSAGES = {
    // Registro
    signUp: {
        title: '🎉 Conta criada com sucesso!',
        message: 'Enviamos um email de confirmação para você. Verifique sua caixa de entrada e clique no link para ativar sua conta.',
        hint: 'Não recebeu? Verifique a pasta de spam.',
    },

    // Login
    signIn: {
        title: '👋 Bem-vindo de volta!',
        message: 'Login realizado com sucesso.',
    },

    // Logout
    signOut: {
        title: '👋 Até logo!',
        message: 'Você saiu da sua conta com segurança.',
    },

    // Reset de senha
    resetPassword: {
        title: '📧 Email enviado!',
        message: 'Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada.',
        hint: 'O link expira em 1 hora.',
    },

    // Atualização de senha
    updatePassword: {
        title: '🔐 Senha atualizada!',
        message: 'Sua senha foi alterada com sucesso.',
    },

    // Confirmação de email
    emailConfirmed: {
        title: '✅ Email confirmado!',
        message: 'Sua conta está ativa. Você já pode fazer login.',
    },
};

/**
 * Mensagens de validação para formulários
 */
export const VALIDATION_MESSAGES = {
    email: {
        required: 'Por favor, digite seu email.',
        invalid: 'Digite um email válido.',
    },
    password: {
        required: 'Por favor, digite sua senha.',
        tooShort: 'A senha deve ter pelo menos 6 caracteres.',
        tooWeak: 'Use uma combinação de letras, números e símbolos.',
    },
    confirmPassword: {
        required: 'Por favor, confirme sua senha.',
        mismatch: 'As senhas não coincidem.',
    },
    coupleName: {
        required: 'Por favor, digite o nome do casal.',
        tooShort: 'O nome deve ter pelo menos 3 caracteres.',
    },
};

/**
 * Verifica a força da senha
 * @param {string} password 
 * @returns {{ score: number, label: string, color: string }}
 */
export function getPasswordStrength(password) {
    if (!password) return { score: 0, label: '', color: 'transparent' };

    let score = 0;

    // Tamanho
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexidade
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // Normalizar para 0-4
    const normalizedScore = Math.min(4, Math.floor(score / 2));

    const levels = [
        { label: 'Muito fraca', color: '#ef4444' },
        { label: 'Fraca', color: '#f97316' },
        { label: 'Razoável', color: '#eab308' },
        { label: 'Forte', color: '#22c55e' },
        { label: 'Muito forte', color: '#10b981' },
    ];

    return {
        score: normalizedScore,
        ...levels[normalizedScore],
    };
}

/**
 * Valida formato de email
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
