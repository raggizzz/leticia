-- ============================================
-- NOSSOFLIX - REMOVER TRIGGER PROBLEMÁTICO
-- Execute isso PRIMEIRO para resolver o erro de registro
-- ============================================

-- PASSO 1: Remover completamente o trigger que está causando erro
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- PRONTO! Agora o registro deve funcionar.
-- A assinatura será criada pelo código quando necessário.
