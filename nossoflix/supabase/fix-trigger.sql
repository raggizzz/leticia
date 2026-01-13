-- ============================================
-- NOSSOFLIX - CORREÇÃO DO TRIGGER
-- Execute isso separado para corrigir o erro de registro
-- ============================================

-- 1. Remover trigger se existir (pode estar causando o erro)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. Criar a função com tratamento de erro adequado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.subscriptions (user_id, user_email, plan_type, status, created_at, updated_at)
    VALUES (
        NEW.id, 
        NEW.email, 
        'free', 
        'free',
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        user_email = EXCLUDED.user_email,
        updated_at = NOW();
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Se falhar, não bloqueia o registro do usuário
        RAISE WARNING 'Erro ao criar subscription: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recriar o trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Garantir que a tabela subscriptions tem as colunas corretas
-- Rodar só se a tabela já existir
DO $$ 
BEGIN
    -- Adicionar user_email se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'user_email'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN user_email TEXT;
    END IF;
    
    -- Adicionar created_at se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- Adicionar updated_at se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 5. Dar permissões corretas
GRANT ALL ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

-- Pronto! Agora o registro de usuários deve funcionar
