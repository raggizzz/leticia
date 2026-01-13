-- ============================================
-- NOSSOFLIX - Configuração de Tabelas para Gerenciamento de Usuários
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. ADICIONAR COLUNAS FALTANTES (se a tabela já existe)
-- ============================================

-- Adicionar coluna user_email se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'user_email'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN user_email TEXT;
    END IF;
END $$;

-- Adicionar coluna payment_id se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'payment_id'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN payment_id TEXT;
    END IF;
END $$;

-- Adicionar coluna payment_method se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN payment_method TEXT;
    END IF;
END $$;

-- ============================================
-- 2. POPULAR user_email A PARTIR DE auth.users
-- ============================================

UPDATE subscriptions s
SET user_email = u.email
FROM auth.users u
WHERE s.user_id = u.id
AND (s.user_email IS NULL OR s.user_email = '');

-- ============================================
-- 3. VIEW PARA DASHBOARD ADMIN
-- ============================================
-- Esta view facilita a visualização no Supabase Table Editor

DROP VIEW IF EXISTS admin_users_view;

CREATE VIEW admin_users_view AS
SELECT 
    s.id as subscription_id,
    s.user_id,
    COALESCE(s.user_email, u.email, 'Email não disponível') as email,
    s.plan_type as plano,
    s.status,
    CASE 
        WHEN s.plan_type = 'free' THEN 'Gratuito'
        WHEN s.plan_type = 'monthly' THEN 'Mensal (R$ 29)'
        WHEN s.plan_type = 'semester' THEN 'Semestral (R$ 99)'
        ELSE s.plan_type
    END as plano_nome,
    s.expires_at as expira_em,
    CASE 
        WHEN s.expires_at IS NULL THEN false
        WHEN s.expires_at < NOW() THEN true
        ELSE false
    END as expirado,
    s.created_at as criado_em,
    s.updated_at as atualizado_em,
    (SELECT COUNT(*) FROM sites WHERE sites.user_id = s.user_id) as total_sites,
    (SELECT COUNT(*) FROM sites WHERE sites.user_id = s.user_id AND is_published = true) as sites_publicados
FROM subscriptions s
LEFT JOIN auth.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- ============================================
-- 4. FUNÇÕES PARA GERENCIAMENTO VIA SQL
-- ============================================

-- Alterar plano de um usuário (por email)
CREATE OR REPLACE FUNCTION set_user_plan(
    p_email TEXT,
    p_plan TEXT,
    p_months INTEGER DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
    v_user_id UUID;
    v_expires TIMESTAMPTZ;
BEGIN
    -- Buscar user_id pelo email (primeiro em subscriptions, depois em auth.users)
    SELECT s.user_id INTO v_user_id 
    FROM subscriptions s
    LEFT JOIN auth.users u ON s.user_id = u.id
    WHERE s.user_email = p_email OR u.email = p_email
    LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RETURN 'Erro: Usuário não encontrado com email: ' || p_email;
    END IF;
    
    -- Calcular data de expiração
    IF p_plan IN ('monthly', 'semester') THEN
        IF p_months IS NOT NULL THEN
            v_expires := NOW() + (p_months || ' months')::INTERVAL;
        ELSIF p_plan = 'monthly' THEN
            v_expires := NOW() + INTERVAL '1 month';
        ELSE
            v_expires := NOW() + INTERVAL '6 months';
        END IF;
    ELSE
        v_expires := NULL;
    END IF;
    
    -- Atualizar
    UPDATE subscriptions 
    SET 
        plan_type = p_plan,
        status = CASE WHEN p_plan = 'free' THEN 'free' ELSE 'active' END,
        expires_at = v_expires,
        updated_at = NOW()
    WHERE user_id = v_user_id;
    
    RETURN 'Plano atualizado para ' || p_plan || 
           CASE WHEN v_expires IS NOT NULL 
                THEN ' até ' || v_expires::DATE::TEXT 
                ELSE '' 
           END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Estender plano de um usuário (por email)
CREATE OR REPLACE FUNCTION extend_user_plan(
    p_email TEXT,
    p_months INTEGER
)
RETURNS TEXT AS $$
DECLARE
    v_user_id UUID;
    v_current_expires TIMESTAMPTZ;
    v_new_expires TIMESTAMPTZ;
BEGIN
    -- Buscar dados
    SELECT s.user_id, s.expires_at INTO v_user_id, v_current_expires
    FROM subscriptions s
    LEFT JOIN auth.users u ON s.user_id = u.id
    WHERE s.user_email = p_email OR u.email = p_email
    LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RETURN 'Erro: Usuário não encontrado com email: ' || p_email;
    END IF;
    
    -- Calcular nova data (a partir da data atual de expiração ou agora)
    IF v_current_expires IS NULL OR v_current_expires < NOW() THEN
        v_new_expires := NOW() + (p_months || ' months')::INTERVAL;
    ELSE
        v_new_expires := v_current_expires + (p_months || ' months')::INTERVAL;
    END IF;
    
    -- Atualizar
    UPDATE subscriptions 
    SET 
        expires_at = v_new_expires,
        status = 'active',
        updated_at = NOW()
    WHERE user_id = v_user_id;
    
    RETURN 'Plano estendido até ' || v_new_expires::DATE::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. EXEMPLOS DE USO
-- ============================================

-- Ver todos os usuários:
-- SELECT * FROM admin_users_view;

-- Alterar plano para mensal (1 mês):
-- SELECT set_user_plan('email@exemplo.com', 'monthly');

-- Alterar plano para semestral (6 meses):
-- SELECT set_user_plan('email@exemplo.com', 'semester');

-- Dar plano mensal por 3 meses específicos:
-- SELECT set_user_plan('email@exemplo.com', 'monthly', 3);

-- Cancelar plano (voltar para gratuito):
-- SELECT set_user_plan('email@exemplo.com', 'free');

-- Estender plano existente em 2 meses:
-- SELECT extend_user_plan('email@exemplo.com', 2);

-- Ver apenas usuários pagantes:
-- SELECT * FROM admin_users_view WHERE plano != 'free';

-- Ver usuários com plano expirado:
-- SELECT * FROM admin_users_view WHERE expirado = true;

-- ============================================
-- PRONTO! Agora você pode:
-- 1. Ver usuários em: Table Editor → admin_users_view
-- 2. Editar direto: Table Editor → subscriptions
-- 3. Usar funções no SQL Editor
-- ============================================
