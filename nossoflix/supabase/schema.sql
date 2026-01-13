-- ============================================
-- NOSSOFLIX - SCHEMA DO BANCO DE DADOS
-- ============================================
-- 
-- Execute este SQL no Supabase SQL Editor:
-- 1. Va em SQL Editor no painel do Supabase
-- 2. Cole este conteudo
-- 3. Clique em "Run"
--
-- Depois configure o Storage:
-- 1. Va em Storage
-- 2. Crie um bucket chamado "nossoflix-images"
-- 3. Torne-o publico (public bucket)

-- ==================== TABELA DE SITES ====================
-- Cada registro e um site de um casal

CREATE TABLE IF NOT EXISTS sites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    is_published BOOLEAN DEFAULT FALSE,
    plan VARCHAR(20) DEFAULT 'free',
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_slug ON sites(slug);
CREATE INDEX IF NOT EXISTS idx_sites_is_published ON sites(is_published);

-- ==================== RLS (ROW LEVEL SECURITY) ====================
-- Garante que cada usuario so acessa seus proprios dados

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Politica: Usuarios podem ver seus proprios sites
CREATE POLICY "Users can view own sites" ON sites
    FOR SELECT
    USING (auth.uid() = user_id);

-- Politica: Qualquer um pode ver sites publicados (pelo slug)
CREATE POLICY "Anyone can view published sites" ON sites
    FOR SELECT
    USING (is_published = true);

-- Politica: Usuarios podem criar seus proprios sites
CREATE POLICY "Users can create own sites" ON sites
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politica: Usuarios podem atualizar seus proprios sites
CREATE POLICY "Users can update own sites" ON sites
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Politica: Usuarios podem deletar seus proprios sites
CREATE POLICY "Users can delete own sites" ON sites
    FOR DELETE
    USING (auth.uid() = user_id);

-- ==================== TABELA DE ANALYTICS ====================
-- Registra visualizacoes dos sites

CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    page VARCHAR(255) DEFAULT '/',
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    ip_hash VARCHAR(64)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_analytics_site_id ON analytics(site_id);
CREATE INDEX IF NOT EXISTS idx_analytics_viewed_at ON analytics(viewed_at);

-- RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Politica: Qualquer um pode inserir analytics (para sites publicos)
CREATE POLICY "Anyone can insert analytics" ON analytics
    FOR INSERT
    WITH CHECK (true);

-- Politica: Donos dos sites podem ver analytics
CREATE POLICY "Site owners can view analytics" ON analytics
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sites 
            WHERE sites.id = analytics.site_id 
            AND sites.user_id = auth.uid()
        )
    );

-- ==================== FUNCAO PARA INCREMENTAR VIEWS ====================

CREATE OR REPLACE FUNCTION increment_site_views(site_slug VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE sites 
    SET views_count = views_count + 1 
    WHERE slug = site_slug AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== TRIGGER PARA UPDATED_AT ====================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_sites_updated_at ON sites;
CREATE TRIGGER update_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
