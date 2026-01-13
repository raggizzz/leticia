/**
 * NossoFlix Analytics Module
 * Sistema de tracking de eventos para entender comportamento do usuário
 */

import { supabase } from './supabase';

// Tipos de eventos
export const ANALYTICS_EVENTS = {
    PAGE_VIEW: 'page_view',
    EPISODE_VIEWED: 'episode_viewed',
    MODAL_OPENED: 'modal_opened',
    MODAL_CLOSED: 'modal_closed',
    LETTER_READ: 'letter_read',
    CTA_CLICKED: 'cta_clicked',
    MUSIC_TOGGLED: 'music_toggled',
    EASTER_EGG_FOUND: 'easter_egg_found',
    WHATSAPP_CLICKED: 'whatsapp_clicked',
    INTRO_SKIPPED: 'intro_skipped',
    INTRO_COMPLETED: 'intro_completed',
    CAROUSEL_SCROLLED: 'carousel_scrolled',
};

// Cache para evitar eventos duplicados em curto período
const eventCache = new Map();
const CACHE_DURATION = 2000; // 2 segundos

/**
 * Verificar se evento foi enviado recentemente
 */
function isEventCached(eventType, details = {}) {
    const cacheKey = `${eventType}-${JSON.stringify(details)}`;
    const cached = eventCache.get(cacheKey);

    if (cached && Date.now() - cached < CACHE_DURATION) {
        return true;
    }

    eventCache.set(cacheKey, Date.now());
    return false;
}

/**
 * Rastrear evento genérico
 * @param {string} siteId - ID do site
 * @param {string} eventType - Tipo do evento (use ANALYTICS_EVENTS)
 * @param {object} details - Detalhes adicionais do evento
 */
export async function trackEvent(siteId, eventType, details = {}) {
    if (!supabase) return;

    // Evitar eventos duplicados
    if (isEventCached(eventType, details)) {
        console.debug('[Analytics] Evento duplicado ignorado:', eventType);
        return;
    }

    try {
        await supabase
            .from('analytics')
            .insert({
                site_id: siteId,
                event_type: eventType,
                page: window.location.pathname,
                details: details,
                user_agent: navigator.userAgent,
                referrer: document.referrer || null,
                screen_size: `${window.innerWidth}x${window.innerHeight}`,
                viewed_at: new Date().toISOString(),
            });

        console.debug('[Analytics] Evento registrado:', eventType, details);
    } catch (e) {
        // Silently fail - analytics não deve quebrar o site
        console.warn('[Analytics] Erro ao registrar evento:', e);
    }
}

/**
 * Eventos específicos com helper functions
 */

export function trackPageView(siteId, page = '/') {
    return trackEvent(siteId, ANALYTICS_EVENTS.PAGE_VIEW, { page });
}

export function trackEpisodeViewed(siteId, episodeId, episodeTitle) {
    return trackEvent(siteId, ANALYTICS_EVENTS.EPISODE_VIEWED, {
        episodeId,
        episodeTitle
    });
}

export function trackModalOpened(siteId, modalTitle) {
    return trackEvent(siteId, ANALYTICS_EVENTS.MODAL_OPENED, { modalTitle });
}

export function trackModalClosed(siteId, modalTitle, timeSpentSeconds) {
    return trackEvent(siteId, ANALYTICS_EVENTS.MODAL_CLOSED, {
        modalTitle,
        timeSpentSeconds
    });
}

export function trackLetterRead(siteId) {
    return trackEvent(siteId, ANALYTICS_EVENTS.LETTER_READ, {});
}

export function trackCtaClicked(siteId, ctaName, ctaLocation) {
    return trackEvent(siteId, ANALYTICS_EVENTS.CTA_CLICKED, {
        ctaName,
        ctaLocation
    });
}

export function trackMusicToggled(siteId, isPlaying) {
    return trackEvent(siteId, ANALYTICS_EVENTS.MUSIC_TOGGLED, { isPlaying });
}

export function trackEasterEggFound(siteId) {
    return trackEvent(siteId, ANALYTICS_EVENTS.EASTER_EGG_FOUND, {});
}

export function trackWhatsAppClicked(siteId) {
    return trackEvent(siteId, ANALYTICS_EVENTS.WHATSAPP_CLICKED, {});
}

export function trackIntroSkipped(siteId, timeWatched) {
    return trackEvent(siteId, ANALYTICS_EVENTS.INTRO_SKIPPED, { timeWatched });
}

export function trackIntroCompleted(siteId) {
    return trackEvent(siteId, ANALYTICS_EVENTS.INTRO_COMPLETED, {});
}

/**
 * Obter resumo de analytics para dashboard
 */
export async function getAnalyticsSummary(siteId) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('analytics')
            .select('event_type, viewed_at, details')
            .eq('site_id', siteId)
            .order('viewed_at', { ascending: false })
            .limit(1000);

        if (error) throw error;

        // Processar dados
        const now = new Date();
        const today = now.toDateString();
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        const stats = {
            totalPageViews: 0,
            viewsToday: 0,
            viewsThisWeek: 0,
            uniqueEpisodesViewed: new Set(),
            lettersRead: 0,
            ctaClicks: 0,
            mostViewedEpisodes: {},
            eventsByType: {},
        };

        data.forEach(event => {
            const eventDate = new Date(event.viewed_at);

            // Contadores gerais
            if (event.event_type === ANALYTICS_EVENTS.PAGE_VIEW) {
                stats.totalPageViews++;
                if (eventDate.toDateString() === today) stats.viewsToday++;
                if (eventDate >= weekAgo) stats.viewsThisWeek++;
            }

            if (event.event_type === ANALYTICS_EVENTS.EPISODE_VIEWED) {
                const episodeId = event.details?.episodeId;
                if (episodeId) {
                    stats.uniqueEpisodesViewed.add(episodeId);
                    stats.mostViewedEpisodes[episodeId] =
                        (stats.mostViewedEpisodes[episodeId] || 0) + 1;
                }
            }

            if (event.event_type === ANALYTICS_EVENTS.LETTER_READ) {
                stats.lettersRead++;
            }

            if (event.event_type === ANALYTICS_EVENTS.CTA_CLICKED) {
                stats.ctaClicks++;
            }

            // Contagem por tipo
            stats.eventsByType[event.event_type] =
                (stats.eventsByType[event.event_type] || 0) + 1;
        });

        return {
            ...stats,
            uniqueEpisodesViewed: stats.uniqueEpisodesViewed.size,
            recentEvents: data.slice(0, 20),
        };
    } catch (error) {
        console.warn('[Analytics] Erro ao buscar resumo:', error);
        return null;
    }
}
