import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar se as variáveis estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase não configurado. O app funcionará em modo local (localStorage).');
}

// Criar cliente Supabase com configuração explícita de persistência
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            storageKey: 'nossoflix-auth',
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
        global: {
            headers: {
                'x-app-name': 'nossoflix',
            },
        },
    })
    : null;

// Debug: Log de configuração
if (supabase) {
    console.log('[Supabase] Cliente inicializado:', supabaseUrl);
}

// Verificar se Supabase está disponível
export const isSupabaseConfigured = () => {
    return supabase !== null;
};

// ==================== AUTENTICAÇÃO ====================

/**
 * Registrar novo usuário (casal)
 */
export async function signUp(email, password, metadata = {}) {
    if (!supabase) throw new Error('Supabase não configurado');

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata, // nome do casal, etc
        },
    });

    if (error) throw error;
    return data;
}

/**
 * Login com email e senha
 */
export async function signIn(email, password) {
    if (!supabase) throw new Error('Supabase não configurado');

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

/**
 * Logout
 */
export async function signOut() {
    if (!supabase) throw new Error('Supabase não configurado');

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Obter usuário atual - usa sessão local
 */
export async function getCurrentUser() {
    if (!supabase) return null;

    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error('[Auth] Erro getSession:', error.message);
            return null;
        }

        return session?.user ?? null;
    } catch (e) {
        console.error('[Auth] Exceção:', e);
        return null;
    }
}

/**
 * Listener de mudança de autenticação
 */
export function onAuthStateChange(callback) {
    if (!supabase) return () => { };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
}

/**
 * Resetar senha
 */
export async function resetPassword(email) {
    if (!supabase) throw new Error('Supabase não configurado');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
}

// ==================== SITES (MULTI-TENANCY) ====================

/**
 * Criar novo site para um casal
 */
export async function createSite(siteData) {
    if (!supabase) throw new Error('Supabase não configurado');

    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('sites')
        .insert({
            user_id: user.id,
            slug: siteData.slug, // URL amigável (ex: igor-leticia)
            config: siteData.config, // Toda a configuração do site
            is_published: false,
            created_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Obter site pelo slug (URL pública)
 */
export async function getSiteBySlug(slug) {
    if (!supabase) throw new Error('Supabase não configurado');

    const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
}

/**
 * Obter sites do usuário logado
 */
export async function getMySites() {
    if (!supabase) throw new Error('Supabase não configurado');

    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    try {
        // Query com timeout curto (4s)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const { data, error } = await supabase
            .from('sites')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (error) {
            console.error('[Sites] Erro:', error);
            throw error;
        }
        return data || [];
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('[Sites] Timeout ao buscar sites');
        }
        throw error;
    }
}

/**
 * Atualizar configuração do site
 */
export async function updateSite(siteId, updates) {
    if (!supabase) throw new Error('Supabase não configurado');

    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('sites')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', siteId)
        .eq('user_id', user.id) // Garantir que é o dono
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Atualizar apenas a configuração do site
 */
export async function updateSiteConfig(siteId, config) {
    return updateSite(siteId, { config });
}

/**
 * Publicar/despublicar site
 */
export async function togglePublishSite(siteId, isPublished) {
    return updateSite(siteId, { is_published: isPublished });
}

/**
 * Verificar se slug está disponível
 */
export async function isSlugAvailable(slug) {
    if (!supabase) throw new Error('Supabase não configurado');

    const { data } = await supabase
        .from('sites')
        .select('id')
        .eq('slug', slug)
        .single();

    return !data; // true se não encontrou (disponível)
}

/**
 * Deletar site
 */
export async function deleteSite(siteId) {
    if (!supabase) throw new Error('Supabase não configurado');

    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId)
        .eq('user_id', user.id);

    if (error) throw error;
}

// ==================== STORAGE (UPLOADS) ====================

/**
 * Upload de imagem para o storage
 */
export async function uploadImage(file, folder = 'images') {
    if (!supabase) throw new Error('Supabase não configurado');

    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Gerar nome único
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('nossoflix-images')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) throw error;

    // Retornar URL pública
    const { data: { publicUrl } } = supabase.storage
        .from('nossoflix-images')
        .getPublicUrl(fileName);

    return publicUrl;
}

/**
 * Upload de áudio para o storage
 */
export async function uploadAudio(file) {
    if (!supabase) throw new Error('Supabase não configurado');

    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Validar tipo de arquivo
    if (!file.type.startsWith('audio/')) {
        throw new Error('Apenas arquivos de áudio são permitidos');
    }

    // Validar tamanho (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('Arquivo muito grande (máximo 10MB)');
    }

    // Gerar nome único
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/audio/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('nossoflix-images') // Usando o mesmo bucket
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) throw error;

    // Retornar URL pública
    const { data: { publicUrl } } = supabase.storage
        .from('nossoflix-images')
        .getPublicUrl(fileName);

    return publicUrl;
}

/**
 * Deletar imagem do storage
 */
export async function deleteImage(imageUrl) {
    if (!supabase) throw new Error('Supabase não configurado');

    // Extrair caminho do arquivo da URL
    const url = new URL(imageUrl);
    const path = url.pathname.split('/nossoflix-images/')[1];

    if (!path) throw new Error('URL de imagem inválida');

    const { error } = await supabase.storage
        .from('nossoflix-images')
        .remove([path]);

    if (error) throw error;
}

// ==================== ANALYTICS (OPCIONAL) ====================

/**
 * Registrar visualização do site
 */
export async function trackPageView(siteId, page = '/') {
    if (!supabase) return;

    try {
        await supabase
            .from('analytics')
            .insert({
                site_id: siteId,
                page,
                viewed_at: new Date().toISOString(),
                user_agent: navigator.userAgent,
            });
    } catch (e) {
        // Silently fail - analytics não deve quebrar o site
        console.warn('Analytics error:', e);
    }
}

/**
 * Obter estatísticas do site
 */
export async function getSiteStats(siteId) {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('analytics')
        .select('page, viewed_at')
        .eq('site_id', siteId)
        .order('viewed_at', { ascending: false })
        .limit(1000);

    if (error) {
        console.warn('Analytics error:', error);
        return null;
    }

    // Processar estatísticas
    const totalViews = data.length;
    const today = new Date().toDateString();
    const viewsToday = data.filter(v => new Date(v.viewed_at).toDateString() === today).length;

    return {
        totalViews,
        viewsToday,
        recentViews: data.slice(0, 10),
    };
}

// ==================== ASSINATURAS ====================

/**
 * Obter assinatura do usuário atual
 * Se não existir, cria automaticamente com plano gratuito
 */
export async function getUserSubscription(userId = null) {
    if (!supabase) return { plan_type: 'free', status: 'active' };

    try {
        // Se não passou userId, buscar o atual
        let uid = userId;
        if (!uid) {
            const user = await getCurrentUser();
            if (!user) return { plan_type: 'free', status: 'active' };
            uid = user.id;
        }

        // Buscar assinatura diretamente
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', uid)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('[Subscription] Erro:', error);
            return { plan_type: 'free', status: 'active', user_id: uid };
        }

        // Se não tem assinatura, criar uma nova com plano gratuito
        if (!data) {
            console.log('[Subscription] Criando assinatura gratuita para:', uid);
            const newSub = { user_id: uid, plan_type: 'free', status: 'active' };

            const { data: created, error: insertError } = await supabase
                .from('subscriptions')
                .insert(newSub)
                .select()
                .single();

            if (insertError) {
                console.warn('[Subscription] Erro ao criar:', insertError.message);
                return newSub;
            }
            return created;
        }

        // Verificar se expirou
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
            return { ...data, plan_type: 'free', status: 'expired' };
        }

        return data;
    } catch (error) {
        console.error('[Subscription] Exceção:', error);
        return { plan_type: 'free', status: 'active' };
    }
}

/**
 * Criar ou atualizar assinatura
 */
export async function upsertSubscription(subscriptionData) {
    if (!supabase) throw new Error('Supabase não configurado');

    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('subscriptions')
        .upsert({
            user_id: user.id,
            ...subscriptionData,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Atualizar para plano pago (após confirmação do MP)
 */
export async function upgradeToPlan(planType, mpSubscriptionId = null) {
    const expiresAt = planType === 'monthly'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 180 dias

    return upsertSubscription({
        plan_type: planType,
        status: 'active',
        mp_subscription_id: mpSubscriptionId,
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
    });
}

/**
 * Cancelar assinatura (volta para free)
 */
export async function cancelSubscription() {
    return upsertSubscription({
        plan_type: 'free',
        status: 'cancelled',
        mp_subscription_id: null,
        expires_at: null,
    });
}

// ==================== SITES PRIVADOS ====================

/**
 * Obter site pelo slug (incluindo status de privacidade)
 * Retorna informações públicas mesmo para sites privados
 */
export async function getSiteBySlugWithPrivacy(slug) {
    if (!supabase) throw new Error('Supabase não configurado');

    const { data, error } = await supabase
        .from('sites')
        .select('id, slug, config, is_published')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Adicionar is_private do config se existir (fallback para DB sem coluna)
    if (data) {
        data.is_private = data.config?.privacy?.isPrivate || false;
    }

    return data;
}

/**
 * Verificar senha de um site privado
 * NOTA: Em produção, use uma Edge Function com bcrypt para comparação segura
 */
export async function validateSitePassword(siteId, password) {
    if (!supabase) throw new Error('Supabase não configurado');

    try {
        // Buscar o hash armazenado
        const { data, error } = await supabase
            .from('sites')
            .select('password_hash')
            .eq('id', siteId)
            .single();

        if (error) throw error;

        // Comparação simples (em produção, use bcrypt)
        // Por segurança, o hash é um SHA256 do password + site ID
        const inputHash = await hashPassword(password, siteId);
        return data.password_hash === inputHash;
    } catch (error) {
        console.error('[Password] Error validating:', error);
        return false;
    }
}

/**
 * Definir senha para um site (torná-lo privado)
 */
export async function setSitePassword(siteId, password) {
    if (!supabase) throw new Error('Supabase não configurado');

    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Gerar hash da senha
    const passwordHash = await hashPassword(password, siteId);

    const { data, error } = await supabase
        .from('sites')
        .update({
            is_private: true,
            password_hash: passwordHash,
            updated_at: new Date().toISOString(),
        })
        .eq('id', siteId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Remover senha de um site (torná-lo público)
 */
export async function removeSitePassword(siteId) {
    if (!supabase) throw new Error('Supabase não configurado');

    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('sites')
        .update({
            is_private: false,
            password_hash: null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', siteId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Helper para criar hash de senha
 * NOTA: Em produção, use bcrypt via Edge Function
 */
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
