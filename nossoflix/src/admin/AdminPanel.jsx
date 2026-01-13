import { useState, useEffect } from 'react';
import { useSiteConfig } from '../hooks';
import { useAuth } from '../contexts/AuthContext';
import {
    AdminInput,
    ImageUpload,
    AdminSection,
    AdminToggle,
    AdminButton,
    EditableList,
} from './AdminComponents';
import App from '../App';
import { uploadAudio } from '../lib/supabase';
import { HeroMiniPreview } from './HeroMiniPreview';
import { UniversalPreview } from './UniversalPreview';
import { YouTubeMusicSelector } from '../components/YouTubeBackgroundMusic';

export default function AdminPanel({ onClose, onSave, siteData = null }) {
    const { isPremium } = useAuth();
    const { config, loading, saveConfig, resetToDefault, exportConfig, importConfig, currentSiteId } = useSiteConfig(siteData);
    const [localConfig, setLocalConfig] = useState(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('couple');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (config) {
            setLocalConfig(JSON.parse(JSON.stringify(config)));
        }
    }, [config]);

    const updateField = (path, value) => {
        const newConfig = { ...localConfig };
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

    const handleSave = async () => {
        setSaving(true);
        try {
            saveConfig(localConfig);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            if (onSave) onSave(localConfig);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (file) {
            importConfig(file).then(() => {
                window.location.reload();
            });
        }
    };

    if (loading || !localConfig) {
        return (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                <div className="text-white text-xl">Carregando...</div>
            </div>
        );
    }

    const tabs = [
        { id: 'couple', label: 'Casal', shortLabel: 'Casal', icon: '💑' },
        { id: 'hero', label: 'Capa', shortLabel: 'Capa', icon: '🎬' },
        { id: 'letter', label: 'Carta', shortLabel: 'Carta', icon: '💌' },
        { id: 'moments', label: 'Momentos', shortLabel: 'Mom.', icon: '✨' },
        { id: 'difficult', label: 'Difíceis', shortLabel: 'Difíc.', icon: '💔' },
        { id: 'backstage', label: 'Bastidores', shortLabel: 'Bast.', icon: '🎭' },
        { id: 'promises', label: 'Promessas', shortLabel: 'Prom.', icon: '🤝' },
        { id: 'credits', label: 'Créditos', shortLabel: 'Créd.', icon: '🎬' },
        { id: 'settings', label: 'Config', shortLabel: 'Conf.', icon: '⚙️' },
    ];

    return (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-hidden flex flex-col">
            {/* Header Premium */}
            <header
                className="flex-shrink-0 border-b border-white/10 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(220,38,38,0.2) 0%, rgba(219,39,119,0.25) 50%, rgba(139,92,246,0.2) 100%)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Animated background glow */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: 'radial-gradient(ellipse at 30% 50%, rgba(236,72,153,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.3) 0%, transparent 50%)',
                    }}
                />
                <div className="container mx-auto px-6 py-5 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 text-gray-300 hover:text-white transition-all hover:translate-x-[-2px] group"
                        >
                            <span className="group-hover:animate-pulse">←</span>
                            <span className="text-sm">Voltar</span>
                        </button>
                        <div className="h-8 w-px bg-white/10" />
                        <h1
                            className="text-2xl font-bold bg-clip-text text-transparent"
                            style={{
                                backgroundImage: 'linear-gradient(135deg, #fff 0%, #f472b6 50%, #a855f7 100%)',
                            }}
                        >
                            ✨ Painel de Administração
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {showSuccess && (
                            <span
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                                style={{
                                    background: 'rgba(34,197,94,0.15)',
                                    border: '1px solid rgba(34,197,94,0.3)',
                                    color: '#4ade80',
                                }}
                            >
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Salvo com sucesso!
                            </span>
                        )}
                        <AdminButton
                            variant={showPreview ? "primary" : "secondary"}
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            {showPreview ? '✏️ Voltar ao Editor' : '👁️ Visualizar'}
                        </AdminButton>
                        <AdminButton variant="secondary" onClick={exportConfig} icon="📥">
                            Exportar
                        </AdminButton>
                        <AdminButton variant="primary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Salvando...' : '💾 Salvar Alterações'}
                        </AdminButton>
                    </div>
                </div>
            </header>

            {/* Tabs Premium - Maiores e Mais Acessíveis */}
            <nav
                className="flex-shrink-0 border-b border-white/10 overflow-x-auto scrollbar-hide"
                style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                }}
            >
                <div className="flex gap-1 px-2 sm:px-4 md:px-8 py-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            title={tab.label} /* Tooltip para mobile */
                            className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-5 md:px-6 py-3 sm:py-2.5 md:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 rounded-xl min-w-[52px] sm:min-w-0 ${activeTab === tab.id
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            style={activeTab === tab.id ? {
                                background: 'linear-gradient(135deg, rgba(220,38,38,0.3) 0%, rgba(219,39,119,0.3) 100%)',
                                boxShadow: '0 4px 15px -3px rgba(236,72,153,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                                border: '1px solid rgba(236,72,153,0.3)',
                            } : {}}
                        >
                            <span className="text-xl sm:text-lg">{tab.icon}</span>
                            <span className="text-[9px] sm:text-xs md:text-sm leading-tight sm:leading-normal">
                                {/* No mobile mostra label curto, em desktop label completo */}
                                <span className="sm:hidden">{tab.shortLabel || tab.label.substring(0, 4)}</span>
                                <span className="hidden sm:inline">{tab.label}</span>
                            </span>
                            {activeTab === tab.id && (
                                <span
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                                    style={{
                                        background: 'linear-gradient(90deg, #ec4899 0%, #a855f7 100%)',
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Preview Mode - Ocupa espaço disponível, não cobre o header */}
                {showPreview ? (
                    <div className="h-full bg-gray-900 p-4 md:p-6 lg:p-8 overflow-auto">
                        {/* Preview container with device frame styling */}
                        <div className="mx-auto max-w-6xl rounded-xl shadow-2xl border border-white/10 relative">
                            {/* Browser frame header - maior z-index */}
                            <div
                                className="bg-gray-800 px-4 py-3 flex items-center gap-3 border-b border-white/10 sticky top-0 z-50"
                                style={{ borderRadius: '12px 12px 0 0' }}
                            >
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="flex-1 text-center">
                                    <span className="text-sm text-gray-400">
                                        🌐 Preview: {siteData?.slug ? `nossoflix.com/${siteData.slug}` : 'Seu Site'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg"
                                >
                                    ✏️ Voltar ao Editor
                                </button>
                            </div>
                            {/* Site Preview - Isolado via transform para conter elementos fixed */}
                            <div
                                className="overflow-auto bg-black"
                                style={{
                                    height: 'calc(100vh - 320px)',
                                    minHeight: '400px',
                                    transform: 'scale(1)', /* Cria novo stacking context */
                                    borderRadius: '0 0 12px 12px',
                                }}
                            >
                                <App siteData={{ ...siteData, config: localConfig }} isPreview={true} />
                            </div>
                        </div>
                        {/* Floating tip */}
                        <div className="text-center mt-4 text-sm text-gray-500">
                            💡 Dica: Navegue pelo preview para ver como seu site ficará
                        </div>
                    </div>
                ) : (
                    <div className="container mx-auto px-4 py-6 lg:px-8">
                        {/* Layout Split Universal: Conteúdo + Preview */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                            {/* Coluna Principal: Editor */}
                            <div className="xl:col-span-8 space-y-6 order-2 xl:order-1">

                                {activeTab === 'couple' && (
                                    <div className="space-y-6">
                                        {/* Header com gradiente premium */}
                                        <div
                                            className="text-center mb-6 relative overflow-hidden rounded-2xl p-6 lg:p-8"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(219,39,119,0.15) 50%, rgba(124,58,237,0.15) 100%)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-pink-500/5 to-purple-500/5 animate-pulse" />
                                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 relative z-10">
                                                ✨ Personalize sua História
                                            </h2>
                                            <p className="text-gray-300 relative z-10 text-sm lg:text-base">
                                                Digite os nomes e veja a mágica acontecer em tempo real 👉
                                            </p>
                                        </div>

                                        {/* Formulários */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                            <AdminSection title="Quem está criando" icon="✍️" defaultOpen>
                                                <AdminInput
                                                    label="Nome"
                                                    value={getField('coupleInfo.creator.name')}
                                                    onChange={(v) => updateField('coupleInfo.creator.name', v)}
                                                    placeholder="Seu nome"
                                                    required
                                                />
                                                <AdminInput
                                                    label="Apelido carinhoso"
                                                    value={getField('coupleInfo.creator.nickname')}
                                                    onChange={(v) => updateField('coupleInfo.creator.nickname', v)}
                                                    placeholder="Ex: Amor"
                                                />
                                            </AdminSection>

                                            <AdminSection title="Quem vai receber" icon="💕" defaultOpen>
                                                <AdminInput
                                                    label="Nome"
                                                    value={getField('coupleInfo.partner.name')}
                                                    onChange={(v) => updateField('coupleInfo.partner.name', v)}
                                                    placeholder="Nome do(a) parceiro(a)"
                                                    required
                                                />
                                                <AdminInput
                                                    label="Apelido carinhoso"
                                                    value={getField('coupleInfo.partner.nickname')}
                                                    onChange={(v) => updateField('coupleInfo.partner.nickname', v)}
                                                    placeholder="Ex: minha princesa"
                                                />
                                            </AdminSection>
                                        </div>

                                        <AdminSection title="Relacionamento" icon="💍" defaultOpen>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <AdminInput
                                                    label="Data de início"
                                                    type="date"
                                                    value={getField('coupleInfo.relationship.startDate')}
                                                    onChange={(v) => updateField('coupleInfo.relationship.startDate', v)}
                                                />
                                                <AdminInput
                                                    label="Temporada atual"
                                                    type="number"
                                                    value={getField('coupleInfo.relationship.currentSeason')}
                                                    onChange={(v) => updateField('coupleInfo.relationship.currentSeason', parseInt(v))}
                                                    hint="Quantos 'ciclos' ou 'recomeços' vocês tiveram"
                                                />
                                            </div>
                                        </AdminSection>

                                        <AdminSection title="Contato (WhatsApp)" icon="📱" defaultOpen>
                                            <AdminInput
                                                label="Número do WhatsApp"
                                                value={getField('coupleInfo.contact.whatsapp')}
                                                onChange={(v) => updateField('coupleInfo.contact.whatsapp', v)}
                                                placeholder="5511999999999"
                                                hint="Apenas números, com código do país"
                                            />
                                            <AdminInput
                                                label="Mensagem pré-preenchida"
                                                value={getField('coupleInfo.contact.whatsappMessage')}
                                                onChange={(v) => updateField('coupleInfo.contact.whatsappMessage', v)}
                                                placeholder="Oi amor! Vi o site... 💕"
                                            />
                                        </AdminSection>
                                    </div>
                                )}

                                {/* Tab: Hero */}
                                {activeTab === 'hero' && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Capa do Site</h2>
                                            <p className="text-gray-400">Configure o banner principal</p>
                                        </div>

                                        <AdminSection title="Textos" icon="📝" defaultOpen>
                                            <AdminInput
                                                label="Título principal"
                                                value={getField('heroContent.title')}
                                                onChange={(v) => updateField('heroContent.title', v)}
                                                placeholder="NOSSOFLIX"
                                            />
                                            <AdminInput
                                                label="Subtítulo"
                                                value={getField('heroContent.subtitle')}
                                                onChange={(v) => updateField('heroContent.subtitle', v)}
                                                placeholder="Uma série original sobre nós dois"
                                            />
                                            <AdminInput
                                                label="Descrição"
                                                value={getField('heroContent.description')}
                                                onChange={(v) => updateField('heroContent.description', v)}
                                                multiline
                                                rows={3}
                                            />
                                        </AdminSection>

                                        <AdminSection title="Botões" icon="🔘" defaultOpen>
                                            <AdminInput
                                                label="Texto do botão principal"
                                                value={getField('heroContent.primaryButtonText')}
                                                onChange={(v) => updateField('heroContent.primaryButtonText', v)}
                                                placeholder="▶ Assistir Carta"
                                            />
                                            <AdminInput
                                                label="Texto do botão secundário"
                                                value={getField('heroContent.secondaryButtonText')}
                                                onChange={(v) => updateField('heroContent.secondaryButtonText', v)}
                                                placeholder="ℹ Mais Informações"
                                            />
                                        </AdminSection>

                                        <AdminSection title="Imagem de fundo" icon="🖼️" defaultOpen>
                                            <ImageUpload
                                                label="Foto do casal"
                                                value={getField('themeConfig.heroBackground')}
                                                onChange={(v) => updateField('themeConfig.heroBackground', v)}
                                                hint="Recomendado: imagem de alta qualidade, mín. 1920x1080"
                                            />
                                        </AdminSection>
                                    </div>
                                )}

                                {/* Tab: Carta */}
                                {activeTab === 'letter' && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Carta Principal</h2>
                                            <p className="text-gray-400">A mensagem que aparece ao clicar em "Assistir"</p>
                                        </div>

                                        <AdminSection title="Conteúdo da Carta" icon="💌" defaultOpen>
                                            <AdminInput
                                                label="Título da carta"
                                                value={getField('mainLetter.title')}
                                                onChange={(v) => updateField('mainLetter.title', v)}
                                                placeholder="Carta pra você, [Nome]"
                                            />

                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium text-gray-300">Parágrafos</label>
                                                {(localConfig.mainLetter?.paragraphs || []).map((p, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <AdminInput
                                                            value={p}
                                                            onChange={(v) => {
                                                                const newParagraphs = [...localConfig.mainLetter.paragraphs];
                                                                newParagraphs[index] = v;
                                                                updateField('mainLetter.paragraphs', newParagraphs);
                                                            }}
                                                            multiline
                                                            rows={2}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newParagraphs = localConfig.mainLetter.paragraphs.filter((_, i) => i !== index);
                                                                updateField('mainLetter.paragraphs', newParagraphs);
                                                            }}
                                                            className="text-red-400 hover:text-red-300 px-2"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        const newParagraphs = [...(localConfig.mainLetter?.paragraphs || []), ''];
                                                        updateField('mainLetter.paragraphs', newParagraphs);
                                                    }}
                                                    className="w-full py-2 border-2 border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-white/40 transition-all"
                                                >
                                                    + Adicionar parágrafo
                                                </button>
                                            </div>

                                            <AdminInput
                                                label="Fechamento"
                                                value={getField('mainLetter.closing')}
                                                onChange={(v) => updateField('mainLetter.closing', v)}
                                                placeholder="Te amo! ❤️"
                                                hint="Última frase em destaque"
                                            />
                                        </AdminSection>
                                    </div>
                                )}

                                {/* Tab: Momentos */}
                                {activeTab === 'moments' && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Melhores Momentos</h2>
                                            <p className="text-gray-400">Os episódios especiais do relacionamento</p>
                                        </div>

                                        <EditableList
                                            items={localConfig.bestMoments || []}
                                            onUpdate={(items) => updateField('bestMoments', items)}
                                            addLabel="Adicionar momento"
                                            onAdd={() => {
                                                const newMoments = [...(localConfig.bestMoments || []), {
                                                    id: Date.now(),
                                                    episodeNumber: `Ep. ${(localConfig.bestMoments?.length || 0) + 1}`,
                                                    title: 'Novo momento',
                                                    description: 'Descrição curta',
                                                    image: null,
                                                    duration: '~2 min',
                                                    paragraphs: ['Escreva aqui o texto do episódio...'],
                                                }];
                                                updateField('bestMoments', newMoments);
                                            }}
                                            renderItem={(item, onEdit) => (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <AdminInput
                                                            label="Número do episódio"
                                                            value={item.episodeNumber}
                                                            onChange={(v) => onEdit({ episodeNumber: v })}
                                                            placeholder="Ep. 1"
                                                        />
                                                        <AdminInput
                                                            label="Duração"
                                                            value={item.duration}
                                                            onChange={(v) => onEdit({ duration: v })}
                                                            placeholder="~2 min"
                                                        />
                                                    </div>
                                                    <AdminInput
                                                        label="Título"
                                                        value={item.title}
                                                        onChange={(v) => onEdit({ title: v })}
                                                    />
                                                    <AdminInput
                                                        label="Descrição curta"
                                                        value={item.description}
                                                        onChange={(v) => onEdit({ description: v })}
                                                    />
                                                    <ImageUpload
                                                        label="Imagem"
                                                        value={item.image}
                                                        onChange={(v) => onEdit({ image: v })}
                                                    />
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-300">Texto do episódio</label>
                                                        {(item.paragraphs || []).map((p, pIndex) => (
                                                            <div key={pIndex} className="flex gap-2">
                                                                <textarea
                                                                    value={p}
                                                                    onChange={(e) => {
                                                                        const newParagraphs = [...item.paragraphs];
                                                                        newParagraphs[pIndex] = e.target.value;
                                                                        onEdit({ paragraphs: newParagraphs });
                                                                    }}
                                                                    rows={2}
                                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm resize-none"
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const newParagraphs = item.paragraphs.filter((_, i) => i !== pIndex);
                                                                        onEdit({ paragraphs: newParagraphs });
                                                                    }}
                                                                    className="text-red-400 hover:text-red-300"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => {
                                                                const newParagraphs = [...(item.paragraphs || []), ''];
                                                                onEdit({ paragraphs: newParagraphs });
                                                            }}
                                                            className="text-sm text-pink-400 hover:text-pink-300"
                                                        >
                                                            + Adicionar parágrafo
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                )}

                                {/* Tab: Episódios Difíceis */}
                                {activeTab === 'difficult' && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Episódios Difíceis</h2>
                                            <p className="text-gray-400">Momentos de aprendizado e crescimento</p>
                                        </div>

                                        <AdminToggle
                                            label="Exibir esta seção"
                                            value={getField('enabledSections.difficultEpisodes')}
                                            onChange={(v) => updateField('enabledSections.difficultEpisodes', v)}
                                            hint="Você pode desativar se não quiser mostrar"
                                        />

                                        <EditableList
                                            items={localConfig.difficultEpisodes || []}
                                            onUpdate={(items) => updateField('difficultEpisodes', items)}
                                            addLabel="Adicionar episódio"
                                            onAdd={() => {
                                                const newEpisodes = [...(localConfig.difficultEpisodes || []), {
                                                    id: Date.now(),
                                                    episodeNumber: `Cap. ${(localConfig.difficultEpisodes?.length || 0) + 1}`,
                                                    title: 'Novo episódio',
                                                    description: 'Descrição curta',
                                                    image: null,
                                                    duration: '~4 min',
                                                    sections: {
                                                        whatHappened: { title: 'O que aconteceu', color: 'red', text: '' },
                                                        whatItMeant: { title: 'O que isso significou', color: 'pink', text: '' },
                                                        whatILearned: { title: 'O que eu aprendi', color: 'purple', text: '' },
                                                    },
                                                    showImage: true,
                                                }];
                                                updateField('difficultEpisodes', newEpisodes);
                                            }}
                                            renderItem={(item, onEdit) => (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <AdminInput
                                                            label="Capítulo"
                                                            value={item.episodeNumber}
                                                            onChange={(v) => onEdit({ episodeNumber: v })}
                                                        />
                                                        <AdminInput
                                                            label="Duração"
                                                            value={item.duration}
                                                            onChange={(v) => onEdit({ duration: v })}
                                                        />
                                                    </div>
                                                    <AdminInput
                                                        label="Título"
                                                        value={item.title}
                                                        onChange={(v) => onEdit({ title: v })}
                                                    />
                                                    <AdminInput
                                                        label="Descrição"
                                                        value={item.description}
                                                        onChange={(v) => onEdit({ description: v })}
                                                    />
                                                    <ImageUpload
                                                        label="Imagem"
                                                        value={item.image}
                                                        onChange={(v) => onEdit({ image: v })}
                                                    />

                                                    <div className="space-y-3 pt-4 border-t border-white/10">
                                                        <h4 className="text-sm font-medium text-gray-300">Seções do episódio</h4>

                                                        <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                                            <AdminInput
                                                                label="O que aconteceu"
                                                                value={item.sections?.whatHappened?.text || ''}
                                                                onChange={(v) => onEdit({
                                                                    sections: { ...item.sections, whatHappened: { ...item.sections.whatHappened, text: v } }
                                                                })}
                                                                multiline
                                                                rows={2}
                                                            />
                                                        </div>

                                                        <div className="bg-pink-500/10 p-4 rounded-lg border border-pink-500/20">
                                                            <AdminInput
                                                                label="O que isso significou"
                                                                value={item.sections?.whatItMeant?.text || ''}
                                                                onChange={(v) => onEdit({
                                                                    sections: { ...item.sections, whatItMeant: { ...item.sections.whatItMeant, text: v } }
                                                                })}
                                                                multiline
                                                                rows={2}
                                                            />
                                                        </div>

                                                        <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                                                            <AdminInput
                                                                label="O que eu aprendi"
                                                                value={item.sections?.whatILearned?.text || ''}
                                                                onChange={(v) => onEdit({
                                                                    sections: { ...item.sections, whatILearned: { ...item.sections.whatILearned, text: v } }
                                                                })}
                                                                multiline
                                                                rows={2}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                )}

                                {/* Tab: Bastidores */}
                                {activeTab === 'backstage' && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Bastidores</h2>
                                            <p className="text-gray-400">Pensamentos e sentimentos profundos</p>
                                        </div>

                                        <EditableList
                                            items={localConfig.behindTheScenes || []}
                                            onUpdate={(items) => updateField('behindTheScenes', items)}
                                            addLabel="Adicionar bastidor"
                                            onAdd={() => {
                                                const newItems = [...(localConfig.behindTheScenes || []), {
                                                    id: Date.now(),
                                                    title: 'Novo pensamento',
                                                    subtitle: 'Subtítulo',
                                                    icon: '💭',
                                                    gradient: 'from-purple-600 to-pink-700',
                                                    image: null,
                                                    paragraphs: ['Escreva aqui...'],
                                                }];
                                                updateField('behindTheScenes', newItems);
                                            }}
                                            renderItem={(item, onEdit) => (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <AdminInput
                                                            label="Título"
                                                            value={item.title}
                                                            onChange={(v) => onEdit({ title: v })}
                                                        />
                                                        <AdminInput
                                                            label="Ícone (emoji)"
                                                            value={item.icon}
                                                            onChange={(v) => onEdit({ icon: v })}
                                                        />
                                                    </div>
                                                    <AdminInput
                                                        label="Subtítulo"
                                                        value={item.subtitle}
                                                        onChange={(v) => onEdit({ subtitle: v })}
                                                    />
                                                    <ImageUpload
                                                        label="Imagem de fundo"
                                                        value={item.image}
                                                        onChange={(v) => onEdit({ image: v })}
                                                    />
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-300">Texto</label>
                                                        {(item.paragraphs || []).map((p, pIndex) => (
                                                            <div key={pIndex} className="flex gap-2">
                                                                <textarea
                                                                    value={p}
                                                                    onChange={(e) => {
                                                                        const newParagraphs = [...item.paragraphs];
                                                                        newParagraphs[pIndex] = e.target.value;
                                                                        onEdit({ paragraphs: newParagraphs });
                                                                    }}
                                                                    rows={2}
                                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm resize-none"
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const newParagraphs = item.paragraphs.filter((_, i) => i !== pIndex);
                                                                        onEdit({ paragraphs: newParagraphs });
                                                                    }}
                                                                    className="text-red-400"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => onEdit({ paragraphs: [...(item.paragraphs || []), ''] })}
                                                            className="text-sm text-pink-400 hover:text-pink-300"
                                                        >
                                                            + Adicionar parágrafo
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                )}

                                {/* Tab: Promessas */}
                                {activeTab === 'promises' && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Próxima Temporada</h2>
                                            <p className="text-gray-400">Promessas e compromissos para o futuro</p>
                                        </div>

                                        <EditableList
                                            items={localConfig.promises || []}
                                            onUpdate={(items) => updateField('promises', items)}
                                            addLabel="Adicionar promessa"
                                            onAdd={() => {
                                                const newItems = [...(localConfig.promises || []), {
                                                    id: Date.now(),
                                                    title: 'Nova promessa',
                                                    description: 'Descrição curta',
                                                    icon: '🤝',
                                                    gradient: 'from-green-500 to-teal-600',
                                                    image: null,
                                                    duration: '~2 min',
                                                    paragraphs: ['Escreva aqui...'],
                                                }];
                                                updateField('promises', newItems);
                                            }}
                                            renderItem={(item, onEdit) => (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <AdminInput
                                                            label="Título"
                                                            value={item.title}
                                                            onChange={(v) => onEdit({ title: v })}
                                                        />
                                                        <AdminInput
                                                            label="Ícone (emoji)"
                                                            value={item.icon}
                                                            onChange={(v) => onEdit({ icon: v })}
                                                        />
                                                    </div>
                                                    <AdminInput
                                                        label="Descrição curta"
                                                        value={item.description}
                                                        onChange={(v) => onEdit({ description: v })}
                                                    />
                                                    <ImageUpload
                                                        label="Imagem"
                                                        value={item.image}
                                                        onChange={(v) => onEdit({ image: v })}
                                                    />
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-300">Texto da promessa</label>
                                                        {(item.paragraphs || []).map((p, pIndex) => (
                                                            <div key={pIndex} className="flex gap-2">
                                                                <textarea
                                                                    value={p}
                                                                    onChange={(e) => {
                                                                        const newParagraphs = [...item.paragraphs];
                                                                        newParagraphs[pIndex] = e.target.value;
                                                                        onEdit({ paragraphs: newParagraphs });
                                                                    }}
                                                                    rows={2}
                                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm resize-none"
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const newParagraphs = item.paragraphs.filter((_, i) => i !== pIndex);
                                                                        onEdit({ paragraphs: newParagraphs });
                                                                    }}
                                                                    className="text-red-400"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => onEdit({ paragraphs: [...(item.paragraphs || []), ''] })}
                                                            className="text-sm text-pink-400 hover:text-pink-300"
                                                        >
                                                            + Adicionar parágrafo
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                )}

                                {/* Tab: Créditos */}
                                {activeTab === 'credits' && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Créditos Finais</h2>
                                            <p className="text-gray-400">A mensagem de encerramento</p>
                                        </div>

                                        <AdminSection title="Título e Botão" icon="🎬" defaultOpen>
                                            <AdminInput
                                                label="Título da seção"
                                                value={getField('credits.title')}
                                                onChange={(v) => updateField('credits.title', v)}
                                            />
                                            <AdminInput
                                                label="Texto do botão WhatsApp"
                                                value={getField('credits.ctaButton.text')}
                                                onChange={(v) => updateField('credits.ctaButton.text', v)}
                                            />
                                        </AdminSection>

                                        <AdminSection title="Mensagem Final" icon="💬" defaultOpen>
                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium text-gray-300">Parágrafos</label>
                                                {(localConfig.credits?.finalMessage?.paragraphs || []).map((p, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <textarea
                                                            value={p}
                                                            onChange={(e) => {
                                                                const newParagraphs = [...localConfig.credits.finalMessage.paragraphs];
                                                                newParagraphs[index] = e.target.value;
                                                                updateField('credits.finalMessage.paragraphs', newParagraphs);
                                                            }}
                                                            rows={2}
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm resize-none"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newParagraphs = localConfig.credits.finalMessage.paragraphs.filter((_, i) => i !== index);
                                                                updateField('credits.finalMessage.paragraphs', newParagraphs);
                                                            }}
                                                            className="text-red-400"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        const newParagraphs = [...(localConfig.credits?.finalMessage?.paragraphs || []), ''];
                                                        updateField('credits.finalMessage.paragraphs', newParagraphs);
                                                    }}
                                                    className="w-full py-2 border-2 border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white"
                                                >
                                                    + Adicionar parágrafo
                                                </button>
                                            </div>
                                            <AdminInput
                                                label="Fechamento"
                                                value={getField('credits.finalMessage.closing')}
                                                onChange={(v) => updateField('credits.finalMessage.closing', v)}
                                            />
                                        </AdminSection>

                                        <AdminSection title="Rodapé" icon="📄" defaultOpen>
                                            <AdminInput
                                                label="Copyright"
                                                value={getField('credits.footer.copyright')}
                                                onChange={(v) => updateField('credits.footer.copyright', v)}
                                            />
                                            <AdminInput
                                                label="Assinatura"
                                                value={getField('credits.footer.signature')}
                                                onChange={(v) => updateField('credits.footer.signature', v)}
                                            />
                                        </AdminSection>
                                    </div>
                                )}

                                {/* Tab: Configurações */}
                                {activeTab === 'settings' && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Configurações</h2>
                                            <p className="text-gray-400">Opções gerais e backup</p>
                                        </div>

                                        <AdminSection title="Seções visíveis" icon="👁️" defaultOpen>
                                            <div className="space-y-4">
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
                                                    label="Promessas"
                                                    value={getField('enabledSections.promises')}
                                                    onChange={(v) => updateField('enabledSections.promises', v)}
                                                />
                                                <AdminToggle
                                                    label="Créditos Finais"
                                                    value={getField('enabledSections.credits')}
                                                    onChange={(v) => updateField('enabledSections.credits', v)}
                                                />
                                                <AdminToggle
                                                    label="Easter Egg"
                                                    value={getField('enabledSections.easterEgg')}
                                                    onChange={(v) => updateField('enabledSections.easterEgg', v)}
                                                />
                                                <AdminToggle
                                                    label="Música de fundo"
                                                    value={getField('enabledSections.backgroundMusic')}
                                                    onChange={(v) => updateField('enabledSections.backgroundMusic', v)}
                                                />
                                            </div>
                                        </AdminSection>

                                        <AdminSection title="Música de fundo" icon="🎵" defaultOpen>
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

                                        <AdminSection title="Privacidade" icon="🔒" defaultOpen>
                                            <div className="space-y-4">
                                                <AdminToggle
                                                    label="Site privado (requer senha)"
                                                    value={getField('privacy.isPrivate')}
                                                    onChange={(v) => updateField('privacy.isPrivate', v)}
                                                    hint="Quando ativado, visitantes precisarão digitar uma senha para ver o site"
                                                />

                                                {getField('privacy.isPrivate') && (
                                                    <AdminInput
                                                        label="Senha do site"
                                                        value={getField('privacy.password')}
                                                        onChange={(v) => updateField('privacy.password', v)}
                                                        placeholder="Digite uma senha segura"
                                                        hint="O visitante precisará digitar essa senha para acessar"
                                                        type="password"
                                                    />
                                                )}

                                                <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                                                    <p className="text-sm text-gray-300">
                                                        💡 <strong>Dica:</strong> Ative esta opção se quiser que apenas quem tem a senha possa ver seu site. Ideal para surpresas!
                                                    </p>
                                                </div>
                                            </div>
                                        </AdminSection>

                                        <AdminSection title="Backup e Reset" icon="💾" defaultOpen>
                                            <div className="space-y-4">
                                                <div className="flex gap-4">
                                                    <AdminButton variant="secondary" onClick={exportConfig} icon="📥" className="flex-1">
                                                        Exportar configuração (JSON)
                                                    </AdminButton>
                                                    <label className="flex-1">
                                                        <input
                                                            type="file"
                                                            accept=".json"
                                                            onChange={handleImport}
                                                            className="hidden"
                                                        />
                                                        <span className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 justify-center cursor-pointer bg-white/10 hover:bg-white/20 text-white w-full h-full">
                                                            📤 Importar configuração
                                                        </span>
                                                    </label>
                                                </div>

                                                <div className="pt-4 border-t border-white/10">
                                                    <AdminButton
                                                        variant="danger"
                                                        onClick={() => {
                                                            if (confirm('Tem certeza? Isso irá apagar todas as suas alterações e voltar ao padrão.')) {
                                                                resetToDefault();
                                                                window.location.reload();
                                                            }
                                                        }}
                                                        icon="⚠️"
                                                        className="w-full justify-center"
                                                    >
                                                        Resetar para configuração padrão
                                                    </AdminButton>
                                                </div>
                                            </div>
                                        </AdminSection>
                                    </div>
                                )}

                            </div>

                            {/* Coluna Direita: Preview Universal (visível apenas em telas grandes) */}
                            <div className="xl:col-span-4 order-1 xl:order-2">
                                <div className="xl:sticky xl:top-6">
                                    <UniversalPreview
                                        activeTab={activeTab}
                                        config={localConfig}
                                        getField={getField}
                                    />
                                </div>
                            </div>
                        </div>
                    </div >
                )
                }
            </main >
        </div >
    );
}
