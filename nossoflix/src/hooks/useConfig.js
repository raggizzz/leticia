import { useState, useEffect } from 'react';
import { isSupabaseConfigured, updateSiteConfig, uploadImage as supabaseUploadImage } from '../lib/supabase';
import {
    coupleInfo,
    themeConfig,
    heroContent,
    mainLetter,
    bestMoments,
    difficultEpisodes,
    behindTheScenes,
    promises,
    credits,
    easterEgg,
    backgroundMusic,
    enabledSections,
} from '../config';

/**
 * Hook para gerenciar a configuração do site
 * Prioridade: 
 * 1. Configuração do site (Supabase) se logado
 * 2. localStorage se não logado
 * 3. Arquivo siteConfig.js como fallback
 */
export function useSiteConfig(siteData = null) {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasLocalChanges, setHasLocalChanges] = useState(false);
    const [currentSiteId, setCurrentSiteId] = useState(null);

    // Carregar configuração
    useEffect(() => {
        const loadConfig = () => {
            try {
                // Se temos dados de um site do Supabase, usar eles
                if (siteData?.config) {
                    setConfig(siteData.config);
                    setCurrentSiteId(siteData.id);
                    setLoading(false);
                    return;
                }

                // Tentar carregar do localStorage
                const savedConfig = localStorage.getItem('nossoflix_config');
                if (savedConfig) {
                    const parsed = JSON.parse(savedConfig);
                    setConfig(parsed);
                    setHasLocalChanges(true);
                } else {
                    // Usar configuração padrão do arquivo
                    setConfig(getDefaultConfig());
                }
            } catch (error) {
                console.error('Erro ao carregar configuração:', error);
                setConfig(getDefaultConfig());
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
        // Usar JSON.stringify para detectar mudanças profundas na config
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteData?.id, JSON.stringify(siteData?.config)]);

    // Salvar configuração
    const saveConfig = async (newConfig) => {
        try {
            // Se temos um site no Supabase, salvar lá também
            if (currentSiteId && isSupabaseConfigured()) {
                await updateSiteConfig(currentSiteId, newConfig);
            }

            // Sempre salvar no localStorage como backup
            localStorage.setItem('nossoflix_config', JSON.stringify(newConfig));
            setConfig(newConfig);
            setHasLocalChanges(true);
            return { success: true };
        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
            // Mesmo que Supabase falhe, salvar localmente
            localStorage.setItem('nossoflix_config', JSON.stringify(newConfig));
            setConfig(newConfig);
            return { success: false, error: error.message };
        }
    };

    // Resetar para padrão
    const resetToDefault = () => {
        localStorage.removeItem('nossoflix_config');
        setConfig(getDefaultConfig());
        setHasLocalChanges(false);
    };

    // Exportar configuração como JSON
    const exportConfig = () => {
        const dataStr = JSON.stringify(config, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportName = `nossoflix_${config?.coupleInfo?.creator?.name || 'config'}_${config?.coupleInfo?.partner?.name || ''}_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();
    };

    // Importar configuração de JSON
    const importConfig = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    saveConfig(imported);
                    resolve({ success: true });
                } catch (error) {
                    reject({ success: false, error: 'Arquivo JSON inválido' });
                }
            };
            reader.onerror = () => reject({ success: false, error: 'Erro ao ler arquivo' });
            reader.readAsText(file);
        });
    };

    // Carregar configuração de um site específico do Supabase
    const loadFromSite = (site) => {
        if (site?.config) {
            setConfig(site.config);
            setCurrentSiteId(site.id);
        }
    };

    return {
        config,
        loading,
        hasLocalChanges,
        currentSiteId,
        saveConfig,
        resetToDefault,
        exportConfig,
        importConfig,
        loadFromSite,
        updateSection: (section, data) => {
            const newConfig = { ...config, [section]: data };
            saveConfig(newConfig);
        },
    };
}

/**
 * Retorna a configuração padrão do arquivo siteConfig.js
 */
function getDefaultConfig() {
    return {
        coupleInfo,
        themeConfig,
        heroContent,
        mainLetter,
        bestMoments,
        difficultEpisodes,
        behindTheScenes,
        promises,
        credits,
        easterEgg,
        backgroundMusic,
        enabledSections,
    };
}

/**
 * Hook para gerenciar upload de imagens
 * Usa Supabase Storage se configurado, senão base64
 */
export function useImageUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadImage = async (file) => {
        setUploading(true);
        setError(null);

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            setError('Apenas imagens são permitidas');
            setUploading(false);
            return { success: false, error: 'Apenas imagens são permitidas' };
        }

        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Imagem muito grande (máximo 5MB)');
            setUploading(false);
            return { success: false, error: 'Imagem muito grande (máximo 5MB)' };
        }

        try {
            // Tentar upload para Supabase Storage
            if (isSupabaseConfigured()) {
                const url = await supabaseUploadImage(file);
                setUploading(false);
                return { success: true, url };
            }
        } catch (supabaseError) {
            console.warn('Supabase upload failed, falling back to base64:', supabaseError);
        }

        // Fallback: converter para base64
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploading(false);
                resolve({ success: true, dataUrl: e.target.result, url: e.target.result });
            };
            reader.onerror = () => {
                setError('Erro ao processar imagem');
                setUploading(false);
                resolve({ success: false, error: 'Erro ao processar imagem' });
            };
            reader.readAsDataURL(file);
        });
    };

    return { uploadImage, uploading, error };
}
