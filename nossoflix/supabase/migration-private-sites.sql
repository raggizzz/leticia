-- ============================================
-- NOSSOFLIX - MIGRAÇÃO: SITES PRIVADOS COM SENHA
-- ============================================
--
-- Adiciona suporte para proteger sites com senha
--
-- Execute no Supabase SQL Editor

-- ==================== ADICIONAR COLUNAS ====================

-- Campo para indicar se o site é privado (requer senha)
ALTER TABLE sites ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE;

-- Campo para armazenar o hash da senha (nunca armazene senhas em texto puro!)
ALTER TABLE sites ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT NULL;

-- ==================== COMENTÁRIOS ====================

COMMENT ON COLUMN sites.is_private IS 'Se true, o site requer senha para visualização';
COMMENT ON COLUMN sites.password_hash IS 'Hash bcrypt da senha do site (nunca armazenar texto puro)';

-- ==================== FUNÇÃO PARA VALIDAR SENHA ====================

CREATE OR REPLACE FUNCTION validate_site_password(site_slug VARCHAR, input_password VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    stored_hash VARCHAR;
BEGIN
    -- Buscar o hash armazenado
    SELECT password_hash INTO stored_hash 
    FROM sites 
    WHERE slug = site_slug AND is_private = true;
    
    -- Se não encontrou ou não tem senha, retorna false
    IF stored_hash IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Comparar usando crypt/bcrypt
    -- NOTA: Supabase usa pgcrypto para isso
    RETURN stored_hash = crypt(input_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== ATUALIZAR POLÍTICA RLS ====================

-- Agora sites privados também podem ser lidos (a validação da senha será no frontend)
-- Mantemos a política atual pois a lógica de senha é tratada no aplicativo
