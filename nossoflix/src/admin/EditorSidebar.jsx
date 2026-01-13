import { useState } from 'react';
import {
    AdminInput,
    ImageUpload,
    AdminSection,
    AdminToggle,
    AdminButton,
} from './AdminComponents';

/**
 * EditorSidebar - Painel lateral contextual para edição visual
 * Versão completa com todos os campos do AdminPanel original
 */
export default function EditorSidebar({
    selectedSection,
    config,
    onUpdate,
    onClose,
}) {
    const [expandedCard, setExpandedCard] = useState(null);

    if (!selectedSection) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="text-6xl mb-4 opacity-50">👆</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Clique em uma seção
                </h3>
                <p className="text-gray-400 text-sm">
                    Passe o mouse sobre o site e clique em qualquer seção para editar
                </p>
            </div>
        );
    }

    // Helper para atualizar campos
    const updateField = (path, value) => {
        const newConfig = JSON.parse(JSON.stringify(config));
        const keys = path.split('.');
        let current = newConfig;

        for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        onUpdate(newConfig);
    };

    // Helper para obter valores
    const getField = (path) => {
        const keys = path.split('.');
        let current = config;
        for (const key of keys) {
            if (current === undefined) return '';
            current = current[key];
        }
        return current || '';
    };

    // Componente para editar um card/episódio completo
    const CardEditor = ({ item, index, arrayPath, onEdit }) => {
        const isExpanded = expandedCard === `${arrayPath}-${index}`;

        return (
            <div
                className="rounded-xl overflow-hidden border border-white/10 mb-3"
                style={{ background: 'rgba(255,255,255,0.02)' }}
            >
                {/* Header do Card */}
                <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5"
                    onClick={() => setExpandedCard(isExpanded ? null : `${arrayPath}-${index}`)}
                >
                    <div className="flex items-center gap-3">
                        {item.image ? (
                            <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-lg">
                                {item.icon || '📷'}
                            </div>
                        )}
                        <div>
                            <p className="text-white text-sm font-medium">{item.title || 'Sem título'}</p>
                            <p className="text-gray-500 text-xs">{item.episodeNumber || item.subtitle || ''}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const items = [...config[arrayPath]];
                                items.splice(index, 1);
                                updateField(arrayPath, items);
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                        >
                            🗑️
                        </button>
                        <span className="text-gray-500">{isExpanded ? '▼' : '▶'}</span>
                    </div>
                </div>

                {/* Conteúdo Expandido */}
                {isExpanded && (
                    <div className="p-4 border-t border-white/10 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <AdminInput
                                label="Número/Ep."
                                value={item.episodeNumber || ''}
                                onChange={(v) => onEdit({ episodeNumber: v })}
                                placeholder="Ep. 1"
                            />
                            <AdminInput
                                label="Duração"
                                value={item.duration || ''}
                                onChange={(v) => onEdit({ duration: v })}
                                placeholder="~2 min"
                            />
                        </div>

                        <AdminInput
                            label="Título"
                            value={item.title || ''}
                            onChange={(v) => onEdit({ title: v })}
                        />

                        <AdminInput
                            label="Descrição curta"
                            value={item.description || ''}
                            onChange={(v) => onEdit({ description: v })}
                            multiline
                            rows={2}
                        />

                        <ImageUpload
                            label="Imagem do card"
                            value={item.image}
                            onChange={(v) => onEdit({ image: v })}
                            hint="Aparece no card e no modal"
                        />

                        {/* Parágrafos */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Texto completo (parágrafos)
                            </label>
                            {(item.paragraphs || []).map((p, pIndex) => (
                                <div key={pIndex} className="flex gap-2">
                                    <textarea
                                        value={p}
                                        onChange={(e) => {
                                            const newParagraphs = [...(item.paragraphs || [])];
                                            newParagraphs[pIndex] = e.target.value;
                                            onEdit({ paragraphs: newParagraphs });
                                        }}
                                        rows={2}
                                        placeholder="Escreva aqui..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none focus:border-pink-500/50 outline-none"
                                    />
                                    <button
                                        onClick={() => {
                                            const newParagraphs = (item.paragraphs || []).filter((_, i) => i !== pIndex);
                                            onEdit({ paragraphs: newParagraphs });
                                        }}
                                        className="text-red-400 hover:text-red-300 px-1"
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
                                className="w-full py-2 border border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-pink-500/40 transition-all text-sm"
                            >
                                + Adicionar parágrafo
                            </button>
                        </div>

                        {/* Seções especiais para Episódios Difíceis */}
                        {item.sections && (
                            <div className="space-y-3 pt-3 border-t border-white/10">
                                <h4 className="text-sm font-medium text-gray-300">Seções do episódio</h4>

                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <AdminInput
                                        label="🔴 O que aconteceu"
                                        value={item.sections?.whatHappened?.text || ''}
                                        onChange={(v) => onEdit({
                                            sections: { ...item.sections, whatHappened: { ...item.sections.whatHappened, text: v } }
                                        })}
                                        multiline
                                        rows={2}
                                    />
                                </div>

                                <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                                    <AdminInput
                                        label="💗 O que isso significou"
                                        value={item.sections?.whatItMeant?.text || ''}
                                        onChange={(v) => onEdit({
                                            sections: { ...item.sections, whatItMeant: { ...item.sections.whatItMeant, text: v } }
                                        })}
                                        multiline
                                        rows={2}
                                    />
                                </div>

                                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                    <AdminInput
                                        label="💜 O que eu aprendi"
                                        value={item.sections?.whatILearned?.text || ''}
                                        onChange={(v) => onEdit({
                                            sections: { ...item.sections, whatILearned: { ...item.sections.whatILearned, text: v } }
                                        })}
                                        multiline
                                        rows={2}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Ícone para Bastidores */}
                        {typeof item.icon !== 'undefined' && (
                            <AdminInput
                                label="Ícone (emoji)"
                                value={item.icon || ''}
                                onChange={(v) => onEdit({ icon: v })}
                                placeholder="💭"
                            />
                        )}

                        {/* Subtítulo para Bastidores */}
                        {typeof item.subtitle !== 'undefined' && (
                            <AdminInput
                                label="Subtítulo"
                                value={item.subtitle || ''}
                                onChange={(v) => onEdit({ subtitle: v })}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Renderizar campos baseado na seção
    const renderSectionFields = () => {
        switch (selectedSection) {
            case 'hero':
                return (
                    <div className="space-y-4">
                        <AdminSection title="Informações do Casal" icon="💑" defaultOpen>
                            <div className="grid grid-cols-2 gap-3">
                                <AdminInput
                                    label="Seu nome"
                                    value={getField('coupleInfo.creator.name')}
                                    onChange={(v) => updateField('coupleInfo.creator.name', v)}
                                    placeholder="Igor"
                                />
                                <AdminInput
                                    label="Nome do amor"
                                    value={getField('coupleInfo.partner.name')}
                                    onChange={(v) => updateField('coupleInfo.partner.name', v)}
                                    placeholder="Letícia"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <AdminInput
                                    label="Seu apelido"
                                    value={getField('coupleInfo.creator.nickname')}
                                    onChange={(v) => updateField('coupleInfo.creator.nickname', v)}
                                    placeholder="Amor"
                                />
                                <AdminInput
                                    label="Apelido dele(a)"
                                    value={getField('coupleInfo.partner.nickname')}
                                    onChange={(v) => updateField('coupleInfo.partner.nickname', v)}
                                    placeholder="Princesa"
                                />
                            </div>
                        </AdminSection>

                        <AdminSection title="Textos da Capa" icon="📝" defaultOpen>
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
                                placeholder="Uma série original"
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
                                label="Botão principal"
                                value={getField('heroContent.primaryButtonText')}
                                onChange={(v) => updateField('heroContent.primaryButtonText', v)}
                                placeholder="▶ Assistir Carta"
                            />
                            <AdminInput
                                label="Botão secundário"
                                value={getField('heroContent.secondaryButtonText')}
                                onChange={(v) => updateField('heroContent.secondaryButtonText', v)}
                                placeholder="ℹ Mais Informações"
                            />
                        </AdminSection>

                        <AdminSection title="Imagem de Fundo" icon="🖼️" defaultOpen>
                            <ImageUpload
                                label="Foto do casal"
                                value={getField('themeConfig.heroBackground')}
                                onChange={(v) => updateField('themeConfig.heroBackground', v)}
                                hint="Recomendado: 1920x1080 ou maior"
                            />
                        </AdminSection>

                        <AdminSection title="Datas" icon="📅">
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
                                onChange={(v) => updateField('coupleInfo.relationship.currentSeason', parseInt(v) || 1)}
                            />
                        </AdminSection>

                        <AdminSection title="WhatsApp" icon="📱">
                            <AdminInput
                                label="Número"
                                value={getField('coupleInfo.contact.whatsapp')}
                                onChange={(v) => updateField('coupleInfo.contact.whatsapp', v)}
                                placeholder="5511999999999"
                            />
                            <AdminInput
                                label="Mensagem"
                                value={getField('coupleInfo.contact.whatsappMessage')}
                                onChange={(v) => updateField('coupleInfo.contact.whatsappMessage', v)}
                                placeholder="Oi amor! 💕"
                            />
                        </AdminSection>
                    </div>
                );

            case 'letter':
                return (
                    <div className="space-y-4">
                        <AdminSection title="Carta Principal" icon="💌" defaultOpen>
                            <AdminInput
                                label="Título da carta"
                                value={getField('mainLetter.title')}
                                onChange={(v) => updateField('mainLetter.title', v)}
                                placeholder="Carta pra você"
                            />

                            <div className="space-y-2 mt-4">
                                <label className="block text-sm font-medium text-gray-300">
                                    Parágrafos da carta
                                </label>
                                {(config.mainLetter?.paragraphs || []).map((p, index) => (
                                    <div key={index} className="flex gap-2">
                                        <textarea
                                            value={p}
                                            onChange={(e) => {
                                                const newParagraphs = [...config.mainLetter.paragraphs];
                                                newParagraphs[index] = e.target.value;
                                                updateField('mainLetter.paragraphs', newParagraphs);
                                            }}
                                            rows={3}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none focus:border-pink-500/50 outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                const newParagraphs = config.mainLetter.paragraphs.filter((_, i) => i !== index);
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
                                        const newParagraphs = [...(config.mainLetter?.paragraphs || []), ''];
                                        updateField('mainLetter.paragraphs', newParagraphs);
                                    }}
                                    className="w-full py-3 border border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-pink-500/40 transition-all"
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
                );

            case 'bestMoments':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">
                                Melhores Momentos
                            </h3>
                            <span className="text-sm text-gray-500">
                                {config.bestMoments?.length || 0} episódios
                            </span>
                        </div>

                        <AdminToggle
                            label="Exibir esta seção"
                            value={getField('enabledSections.bestMoments')}
                            onChange={(v) => updateField('enabledSections.bestMoments', v)}
                        />

                        <div className="space-y-2 mt-4">
                            {(config.bestMoments || []).map((item, index) => (
                                <CardEditor
                                    key={item.id || index}
                                    item={item}
                                    index={index}
                                    arrayPath="bestMoments"
                                    onEdit={(changes) => {
                                        const newItems = [...config.bestMoments];
                                        newItems[index] = { ...item, ...changes };
                                        updateField('bestMoments', newItems);
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                const newItems = [...(config.bestMoments || []), {
                                    id: Date.now(),
                                    episodeNumber: `Ep. ${(config.bestMoments?.length || 0) + 1}`,
                                    title: 'Novo momento',
                                    description: 'Descrição curta',
                                    image: null,
                                    duration: '~2 min',
                                    paragraphs: ['Escreva aqui o texto...'],
                                }];
                                updateField('bestMoments', newItems);
                            }}
                            className="w-full py-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-xl text-white hover:from-pink-600/30 hover:to-purple-600/30 transition-all font-medium"
                        >
                            + Adicionar Momento
                        </button>
                    </div>
                );

            case 'difficultEpisodes':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">
                                Episódios Difíceis
                            </h3>
                            <span className="text-sm text-gray-500">
                                {config.difficultEpisodes?.length || 0} episódios
                            </span>
                        </div>

                        <AdminToggle
                            label="Exibir esta seção"
                            value={getField('enabledSections.difficultEpisodes')}
                            onChange={(v) => updateField('enabledSections.difficultEpisodes', v)}
                        />

                        <div className="space-y-2 mt-4">
                            {(config.difficultEpisodes || []).map((item, index) => (
                                <CardEditor
                                    key={item.id || index}
                                    item={item}
                                    index={index}
                                    arrayPath="difficultEpisodes"
                                    onEdit={(changes) => {
                                        const newItems = [...config.difficultEpisodes];
                                        newItems[index] = { ...item, ...changes };
                                        updateField('difficultEpisodes', newItems);
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                const newItems = [...(config.difficultEpisodes || []), {
                                    id: Date.now(),
                                    episodeNumber: `Cap. ${(config.difficultEpisodes?.length || 0) + 1}`,
                                    title: 'Novo episódio',
                                    description: 'Descrição curta',
                                    image: null,
                                    duration: '~4 min',
                                    sections: {
                                        whatHappened: { title: 'O que aconteceu', color: 'red', text: '' },
                                        whatItMeant: { title: 'O que isso significou', color: 'pink', text: '' },
                                        whatILearned: { title: 'O que eu aprendi', color: 'purple', text: '' },
                                    },
                                }];
                                updateField('difficultEpisodes', newItems);
                            }}
                            className="w-full py-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-xl text-white hover:from-pink-600/30 hover:to-purple-600/30 transition-all font-medium"
                        >
                            + Adicionar Episódio
                        </button>
                    </div>
                );

            case 'behindTheScenes':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">
                                Bastidores
                            </h3>
                            <span className="text-sm text-gray-500">
                                {config.behindTheScenes?.length || 0} itens
                            </span>
                        </div>

                        <AdminToggle
                            label="Exibir esta seção"
                            value={getField('enabledSections.behindTheScenes')}
                            onChange={(v) => updateField('enabledSections.behindTheScenes', v)}
                        />

                        <div className="space-y-2 mt-4">
                            {(config.behindTheScenes || []).map((item, index) => (
                                <CardEditor
                                    key={item.id || index}
                                    item={item}
                                    index={index}
                                    arrayPath="behindTheScenes"
                                    onEdit={(changes) => {
                                        const newItems = [...config.behindTheScenes];
                                        newItems[index] = { ...item, ...changes };
                                        updateField('behindTheScenes', newItems);
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                const newItems = [...(config.behindTheScenes || []), {
                                    id: Date.now(),
                                    title: 'Novo pensamento',
                                    subtitle: 'Subtítulo',
                                    icon: '💭',
                                    image: null,
                                    paragraphs: ['Escreva aqui...'],
                                }];
                                updateField('behindTheScenes', newItems);
                            }}
                            className="w-full py-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-xl text-white hover:from-pink-600/30 hover:to-purple-600/30 transition-all font-medium"
                        >
                            + Adicionar Bastidor
                        </button>
                    </div>
                );

            case 'promises':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">
                                Próxima Temporada
                            </h3>
                            <span className="text-sm text-gray-500">
                                {config.promises?.length || 0} promessas
                            </span>
                        </div>

                        <AdminToggle
                            label="Exibir esta seção"
                            value={getField('enabledSections.promises')}
                            onChange={(v) => updateField('enabledSections.promises', v)}
                        />

                        <div className="space-y-2 mt-4">
                            {(config.promises || []).map((item, index) => (
                                <CardEditor
                                    key={item.id || index}
                                    item={item}
                                    index={index}
                                    arrayPath="promises"
                                    onEdit={(changes) => {
                                        const newItems = [...config.promises];
                                        newItems[index] = { ...item, ...changes };
                                        updateField('promises', newItems);
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                const newItems = [...(config.promises || []), {
                                    id: Date.now(),
                                    title: 'Nova promessa',
                                    description: 'Descrição curta',
                                    icon: '🤝',
                                    image: null,
                                    duration: '~2 min',
                                    paragraphs: ['Escreva aqui...'],
                                }];
                                updateField('promises', newItems);
                            }}
                            className="w-full py-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-xl text-white hover:from-pink-600/30 hover:to-purple-600/30 transition-all font-medium"
                        >
                            + Adicionar Promessa
                        </button>
                    </div>
                );

            case 'credits':
                return (
                    <div className="space-y-4">
                        <AdminSection title="Título" icon="🎬" defaultOpen>
                            <AdminInput
                                label="Título dos créditos"
                                value={getField('credits.title')}
                                onChange={(v) => updateField('credits.title', v)}
                                placeholder="Créditos Finais"
                            />
                        </AdminSection>

                        <AdminSection title="Equipe (roles)" icon="👥" defaultOpen>
                            <div className="space-y-3">
                                {(config.credits?.roles || []).map((role, index) => (
                                    <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <div className="flex gap-2 mb-2">
                                            <AdminInput
                                                label="Cargo"
                                                value={role.role}
                                                onChange={(v) => {
                                                    const newRoles = [...config.credits.roles];
                                                    newRoles[index] = { ...role, role: v };
                                                    updateField('credits.roles', newRoles);
                                                }}
                                                placeholder="Diretor"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newRoles = config.credits.roles.filter((_, i) => i !== index);
                                                    updateField('credits.roles', newRoles);
                                                }}
                                                className="text-red-400 hover:text-red-300 mt-6"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        <AdminInput
                                            label="Nome"
                                            value={role.name}
                                            onChange={(v) => {
                                                const newRoles = [...config.credits.roles];
                                                newRoles[index] = { ...role, name: v };
                                                updateField('credits.roles', newRoles);
                                            }}
                                        />
                                        <AdminToggle
                                            label="Destacar"
                                            value={role.highlight}
                                            onChange={(v) => {
                                                const newRoles = [...config.credits.roles];
                                                newRoles[index] = { ...role, highlight: v };
                                                updateField('credits.roles', newRoles);
                                            }}
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newRoles = [...(config.credits?.roles || []), {
                                            role: 'Novo cargo',
                                            name: 'Nome',
                                            highlight: false,
                                        }];
                                        updateField('credits.roles', newRoles);
                                    }}
                                    className="w-full py-2 border border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white text-sm"
                                >
                                    + Adicionar role
                                </button>
                            </div>
                        </AdminSection>

                        <AdminSection title="Mensagem Final" icon="💝" defaultOpen>
                            <div className="space-y-2">
                                {(config.credits?.finalMessage?.paragraphs || []).map((p, index) => (
                                    <div key={index} className="flex gap-2">
                                        <textarea
                                            value={p}
                                            onChange={(e) => {
                                                const newParagraphs = [...config.credits.finalMessage.paragraphs];
                                                newParagraphs[index] = e.target.value;
                                                updateField('credits.finalMessage.paragraphs', newParagraphs);
                                            }}
                                            rows={2}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none"
                                        />
                                        <button
                                            onClick={() => {
                                                const newParagraphs = config.credits.finalMessage.paragraphs.filter((_, i) => i !== index);
                                                updateField('credits.finalMessage.paragraphs', newParagraphs);
                                            }}
                                            className="text-red-400"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newParagraphs = [...(config.credits?.finalMessage?.paragraphs || []), ''];
                                        updateField('credits.finalMessage.paragraphs', newParagraphs);
                                    }}
                                    className="w-full py-2 border border-dashed border-white/20 rounded-lg text-gray-400 text-sm"
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

                        <AdminSection title="Botão CTA" icon="🔘">
                            <AdminInput
                                label="Texto do botão"
                                value={getField('credits.ctaButton.text')}
                                onChange={(v) => updateField('credits.ctaButton.text', v)}
                            />
                            <AdminInput
                                label="Ícone"
                                value={getField('credits.ctaButton.icon')}
                                onChange={(v) => updateField('credits.ctaButton.icon', v)}
                            />
                        </AdminSection>

                        <AdminSection title="Rodapé" icon="📄">
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
                );

            default:
                return (
                    <div className="text-center p-8">
                        <p className="text-gray-400">
                            Seção "{selectedSection}" selecionada
                        </p>
                    </div>
                );
        }
    };

    const sectionNames = {
        hero: 'Hero / Capa',
        letter: 'Carta Principal',
        bestMoments: 'Melhores Momentos',
        difficultEpisodes: 'Episódios Difíceis',
        behindTheScenes: 'Bastidores',
        promises: 'Próxima Temporada',
        credits: 'Créditos Finais',
    };

    const sectionIcons = {
        hero: '🎬',
        letter: '💌',
        bestMoments: '✨',
        difficultEpisodes: '💔',
        behindTheScenes: '🎭',
        promises: '🤝',
        credits: '🎬',
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div
                className="flex-shrink-0 p-4 border-b border-white/10"
                style={{
                    background: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.15) 100%)',
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{sectionIcons[selectedSection] || '✏️'}</span>
                        <div>
                            <h3 className="font-semibold text-white text-lg">
                                {sectionNames[selectedSection] || selectedSection}
                            </h3>
                            <p className="text-xs text-gray-400">Editando seção</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <span className="text-gray-400 text-lg">✕</span>
                    </button>
                </div>
            </div>

            {/* Fields */}
            <div className="flex-1 overflow-y-auto p-4">
                {renderSectionFields()}
            </div>

            {/* Footer Tip */}
            <div className="flex-shrink-0 p-3 border-t border-white/10 bg-black/30">
                <p className="text-xs text-gray-500 text-center">
                    💡 Todas as alterações aparecem em tempo real no site
                </p>
            </div>
        </div>
    );
}
