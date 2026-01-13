import { useState, useEffect } from 'react';
import { useSiteConfig } from '../hooks';
import { useAuth } from '../contexts/AuthContext';
import { AdminSection, AdminToggle, AdminInput } from './AdminComponents';
import { uploadAudio } from '../lib/supabase';
import { YouTubeMusicSelector } from '../components/YouTubeBackgroundMusic';
import EditorSidebar from './EditorSidebar';
import App from '../App';

/**
 * VisualEditor - Editor visual estilo page builder
 * Layout responsivo: mobile usa slide-over panel, desktop usa split view
 */
export default function VisualEditor({ onClose, onSave, siteData = null }) {
    const { isPremium } = useAuth();
    const { config, loading, saveConfig, exportConfig } = useSiteConfig(siteData);
    const [localConfig, setLocalConfig] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (config) {
            setLocalConfig(JSON.parse(JSON.stringify(config)));
        }
    }, [config]);

    // Abrir sidebar quando seleciona uma seção
    useEffect(() => {
        if (selectedSection || showSettings) {
            setSidebarOpen(true);
        }
    }, [selectedSection, showSettings]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveConfig(localConfig);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            if (onSave) onSave(localConfig);
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
        setSaving(false);
    };

    const handleConfigUpdate = (newConfig) => {
        setLocalConfig(newConfig);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        setSelectedSection(null);
        setShowSettings(false);
    };

    // Helper para atualizar campos de configuração
    const updateField = (path, value) => {
        const newConfig = JSON.parse(JSON.stringify(localConfig));
        const keys = path.split('.');
        let current = newConfig;

        for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        setLocalConfig(newConfig);
    };

    const getField = (path) => {
        const keys = path.split('.');
        let current = localConfig;
        for (const key of keys) {
            if (current === undefined) return '';
            current = current[key];
        }
        return current || '';
    };

    if (loading || !localConfig) {
        return (
            <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl animate-pulse mb-4">✨</div>
                    <p className="text-gray-400">Carregando editor...</p>
                </div>
            </div>
        );
    }

    // Renderizar Settings Panel
    const renderSettingsPanel = () => (
        <div className="h-full flex flex-col">
            <div
                className="flex-shrink-0 p-4 border-b border-white/10"
                style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(168,85,247,0.15) 100%)',
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⚙️</span>
                        <div>
                            <h3 className="font-semibold text-white text-lg">Configurações</h3>
                            <p className="text-xs text-gray-400">Opções do site</p>
                        </div>
                    </div>
                    <button
                        onClick={closeSidebar}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <span className="text-gray-400 text-lg">✕</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AdminSection title="Seções Visíveis" icon="👁️" defaultOpen>
                    <div className="space-y-3">
                        <AdminToggle
                            label="Melhores Momentos"
                            value={getField('enabledSections.bestMoments')}
                            onChange={(v) => updateField('enabledSections.bestMoments', v)}
                        />
                        <AdminToggle
                            label="Episódios Difíceis"
                            value={getField('enabledSections.difficultEpisodes')}
                            onChange={(v) => updateField('enabledSections.difficultEpisodes', v)}
                        />
                        <AdminToggle
                            label="Bastidores"
                            value={getField('enabledSections.behindTheScenes')}
                            onChange={(v) => updateField('enabledSections.behindTheScenes', v)}
                        />
                        <AdminToggle
                            label="Próxima Temporada"
                            value={getField('enabledSections.promises')}
                            onChange={(v) => updateField('enabledSections.promises', v)}
                        />
                        <AdminToggle
                            label="Créditos Finais"
                            value={getField('enabledSections.credits')}
                            onChange={(v) => updateField('enabledSections.credits', v)}
                        />
                    </div>
                </AdminSection>

                <AdminSection title="Música de Fundo" icon="🎵" defaultOpen>
                    <AdminToggle
                        label="Ativar música"
                        value={getField('enabledSections.backgroundMusic')}
                        onChange={(v) => updateField('enabledSections.backgroundMusic', v)}
                    />
                    {getField('enabledSections.backgroundMusic') && (
                        <YouTubeMusicSelector
                            value={getField('backgroundMusic.youtubeId')}
                            onChange={(id) => updateField('backgroundMusic.youtubeId', id)}
                            isPremium={isPremium}
                        />
                    )}
                </AdminSection>

                <AdminSection title="Privacidade" icon="🔒">
                    <AdminToggle
                        label="Site privado (requer senha)"
                        value={getField('privacy.isPrivate')}
                        onChange={(v) => updateField('privacy.isPrivate', v)}
                        hint="Visitantes precisarão digitar uma senha"
                    />
                    {getField('privacy.isPrivate') && (
                        <AdminInput
                            label="Senha do site"
                            value={getField('privacy.password')}
                            onChange={(v) => updateField('privacy.password', v)}
                            placeholder="Digite uma senha"
                            type="password"
                        />
                    )}
                </AdminSection>

                <AdminSection title="Easter Egg" icon="🥚">
                    <AdminToggle
                        label="Ativar easter egg"
                        value={getField('easterEgg.enabled')}
                        onChange={(v) => updateField('easterEgg.enabled', v)}
                    />
                    {getField('easterEgg.enabled') && (
                        <>
                            <AdminInput
                                label="Título"
                                value={getField('easterEgg.title')}
                                onChange={(v) => updateField('easterEgg.title', v)}
                            />
                            <AdminInput
                                label="Mensagem"
                                value={getField('easterEgg.message')}
                                onChange={(v) => updateField('easterEgg.message', v)}
                                multiline
                                rows={3}
                            />
                        </>
                    )}
                </AdminSection>

                <AdminSection title="Backup" icon="💾">
                    <div className="space-y-3">
                        <button
                            onClick={() => exportConfig?.()}
                            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                        >
                            📥 Exportar configuração
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                            Baixe um arquivo JSON com todas as configurações
                        </p>
                    </div>
                </AdminSection>
            </div>

            <div className="flex-shrink-0 p-3 border-t border-white/10 bg-black/30">
                <p className="text-xs text-gray-500 text-center">
                    💡 Alterações aplicadas em tempo real
                </p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col overflow-hidden">
            {/* Header - Responsivo */}
            <header
                className="flex-shrink-0 border-b border-white/10 relative z-50"
                style={{
                    background: 'linear-gradient(135deg, rgba(220,38,38,0.2) 0%, rgba(219,39,119,0.25) 50%, rgba(139,92,246,0.2) 100%)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div className="px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
                    {/* Left side */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white text-sm sm:text-base"
                        >
                            <span>←</span>
                            <span className="hidden xs:inline">Voltar</span>
                        </button>
                        <div className="hidden md:flex items-center gap-2">
                            <span className="text-xl">🎨</span>
                            <div>
                                <h1 className="text-base font-bold text-white">Editor Visual</h1>
                                <p className="text-[10px] text-gray-400">
                                    {siteData?.slug ? `/${siteData.slug}` : 'Editando'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {showSuccess && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 border border-green-500/30 text-green-400">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="hidden sm:inline">Salvo!</span>
                            </span>
                        )}

                        {/* Settings Button */}
                        <button
                            onClick={() => {
                                setShowSettings(!showSettings);
                                setSelectedSection(null);
                                setSidebarOpen(true);
                            }}
                            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-all text-sm ${showSettings
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                        >
                            <span>⚙️</span>
                            <span className="hidden sm:inline">Config</span>
                        </button>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base"
                            style={{
                                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
                            }}
                        >
                            <span>{saving ? '⏳' : '💾'}</span>
                            <span className="hidden xs:inline">{saving ? 'Salvando...' : 'Salvar'}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Site Preview - Full width on mobile, partial on desktop */}
                <div
                    className="flex-1 overflow-y-auto"
                    style={{ background: '#0a0a0a' }}
                >
                    <App
                        siteData={{ ...siteData, config: localConfig }}
                        isPreview={true}
                        showIntro={false}
                        editMode={true}
                        selectedSection={selectedSection}
                        onSectionClick={(sectionId) => {
                            setSelectedSection(sectionId);
                            setShowSettings(false);
                            setSidebarOpen(true);
                        }}
                    />
                </div>

                {/* Desktop Sidebar - Hidden on mobile */}
                <div
                    className="hidden lg:block w-[400px] xl:w-[450px] flex-shrink-0 border-l border-white/10 overflow-hidden"
                    style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,10,0.98) 100%)',
                    }}
                >
                    {showSettings ? (
                        renderSettingsPanel()
                    ) : (
                        <EditorSidebar
                            selectedSection={selectedSection}
                            config={localConfig}
                            onUpdate={handleConfigUpdate}
                            onClose={closeSidebar}
                        />
                    )}
                </div>

                {/* Mobile/Tablet Slide-over Panel */}
                <div
                    className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
                        }`}
                >
                    {/* Backdrop */}
                    <div
                        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'
                            }`}
                        onClick={closeSidebar}
                    />

                    {/* Panel */}
                    <div
                        className={`absolute right-0 top-0 bottom-0 w-full max-w-[90vw] sm:max-w-[400px] transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                        style={{
                            background: 'linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(5,5,5,0.99) 100%)',
                        }}
                    >
                        {showSettings ? (
                            renderSettingsPanel()
                        ) : (
                            <EditorSidebar
                                selectedSection={selectedSection}
                                config={localConfig}
                                onUpdate={handleConfigUpdate}
                                onClose={closeSidebar}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Tips Bar - Responsive */}
            <div className="flex-shrink-0 px-2 sm:px-4 py-1.5 sm:py-2 bg-black/60 border-t border-white/5">
                <div className="flex items-center justify-center gap-2 sm:gap-6 text-[10px] sm:text-xs text-gray-500">
                    <span>👆 Toque para editar</span>
                    <span className="hidden sm:inline">⚙️ Config para opções</span>
                    <span>💾 Salve alterações</span>
                </div>
            </div>
        </div>
    );
}
