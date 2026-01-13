import { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { getMySites, createSite, deleteSite, togglePublishSite, isSlugAvailable, getSiteStats } from '../lib/supabase';
import { generateSiteTemplate } from '../config/siteTemplate';
import QRCodeGenerator from './QRCodeGenerator';
import ConfirmationModal from './ConfirmationModal';
import { PLANS } from '../config/plans';

/**
 * Dashboard - Gerenciamento de Sites do Usuário (Design Premium)
 */
export default function Dashboard({ onEditSite, onClose }) {
    const { user, signOut, subscription, currentPlan, isPremium, refreshSubscription } = useAuth();
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSiteSlug, setNewSiteSlug] = useState('');
    const [newSiteCouple, setNewSiteCouple] = useState({ name1: '', name2: '' });
    const [slugError, setSlugError] = useState('');
    const [stats, setStats] = useState({});
    const [showQRCode, setShowQRCode] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, name }

    useEffect(() => {
        loadSites();
        refreshSubscription?.();
    }, []);

    const loadSites = async () => {
        setLoading(true);
        try {
            // Timeout e lógica de retry já estão no supabase.js
            const mySites = await getMySites();
            setSites(mySites || []);

            // Carregar stats em background (não bloqueia)
            if (mySites && mySites.length > 0) {
                loadStatsInBackground(mySites);
            }
        } catch (error) {
            console.error('Erro ao carregar sites:', error);
            setSites([]); // Mostrar lista vazia em caso de erro
        } finally {
            setLoading(false);
        }
    };

    // Carregar estatísticas em background sem bloquear UI
    const loadStatsInBackground = async (sitesList) => {
        const siteStats = {};
        for (const site of sitesList) {
            try {
                const s = await getSiteStats(site.id);
                if (s) {
                    siteStats[site.id] = s;
                    setStats(prev => ({ ...prev, [site.id]: s }));
                }
            } catch (e) {
                // Ignora erros de stats individuais
            }
        }
    };

    const generateSlug = (name1, name2) => {
        const slug = `${name1}-e-${name2}`
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return slug;
    };

    const checkSlug = async (slug) => {
        if (slug.length < 3) {
            setSlugError('O slug deve ter pelo menos 3 caracteres');
            return false;
        }

        try {
            const available = await isSlugAvailable(slug);
            if (!available) {
                setSlugError('Este endereço já está em uso');
                return false;
            }
            setSlugError('');
            return true;
        } catch (error) {
            setSlugError('Erro ao verificar disponibilidade');
            return false;
        }
    };

    // Verificar limite de sites
    const canCreateSite = () => {
        const maxSites = currentPlan?.maxSites || 1;
        return sites.length < maxSites;
    };

    const handleCreateSite = async () => {
        if (!newSiteCouple.name1 || !newSiteCouple.name2) return;

        if (!canCreateSite()) {
            setSlugError(`Você atingiu o limite de ${currentPlan?.maxSites || 1} site(s) do plano ${currentPlan?.name}. Faça upgrade para criar mais!`);
            return;
        }

        const slug = newSiteSlug || generateSlug(newSiteCouple.name1, newSiteCouple.name2);
        const available = await checkSlug(slug);
        if (!available) return;

        setCreating(true);
        try {
            // Usar o template completo pré-populado com conteúdo de exemplo
            const defaultConfig = generateSiteTemplate(newSiteCouple.name1, newSiteCouple.name2);

            const newSite = await createSite({ slug, config: defaultConfig });
            setShowCreateModal(false);
            setNewSiteSlug('');
            setNewSiteCouple({ name1: '', name2: '' });

            // Abrir editor imediatamente após criar
            if (newSite && onEditSite) {
                onEditSite(newSite);
            } else {
                loadSites();
            }
        } catch (error) {
            console.error('Erro ao criar site:', error);
            setSlugError(error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleTogglePublish = async (siteId, currentStatus) => {
        try {
            await togglePublishSite(siteId, !currentStatus);
            loadSites();
        } catch (error) {
            console.error('Erro ao alterar status:', error);
        }
    };

    const handleDeleteSite = async (siteId, siteName) => {
        // Abre modal de confirmação ao invés de alert
        setDeleteConfirm({ id: siteId, name: siteName });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            await deleteSite(deleteConfirm.id);
            setDeleteConfirm(null); // Fecha modal antes de recarregar
            loadSites();
        } catch (error) {
            console.error('Erro ao deletar site:', error);
            alert('Erro ao excluir site. Tente novamente.');
        }
    };

    const handleUpgrade = (plan) => {
        if (plan.checkoutUrl) {
            window.open(plan.checkoutUrl, '_blank');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#030303',
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* CSS */}
            <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .card-hover:hover { 
          transform: translateY(-4px);
          border-color: rgba(236, 72, 153, 0.4);
        }
      `}</style>

            {/* QR Code Modal */}
            {showQRCode && (
                <QRCodeGenerator
                    siteUrl={`${window.location.origin}/${showQRCode.slug}`}
                    siteName={`${showQRCode.config?.coupleInfo?.creator?.name} & ${showQRCode.config?.coupleInfo?.partner?.name}`}
                    onClose={() => setShowQRCode(null)}
                />
            )}

            {/* Background Effects */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
                    top: '-20%',
                    right: '-10%',
                    animation: 'pulse-slow 4s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
                    bottom: '-10%',
                    left: '-10%',
                    animation: 'pulse-slow 4s ease-in-out infinite',
                    animationDelay: '2s'
                }} />
            </div>

            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 40,
                backgroundColor: 'rgba(3, 3, 3, 0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            ← Voltar
                        </button>
                        <div>
                            <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Meus Sites</h1>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{user?.email}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Plan Badge */}
                        <div style={{
                            padding: '8px 16px',
                            borderRadius: '100px',
                            background: isPremium
                                ? 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.2))'
                                : 'rgba(255,255,255,0.05)',
                            border: isPremium
                                ? '1px solid rgba(236,72,153,0.3)'
                                : '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            <span style={{ fontSize: '14px' }}>{isPremium ? '💎' : '✨'}</span>
                            <span style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: isPremium ? '#ec4899' : 'rgba(255,255,255,0.7)',
                            }}>
                                {currentPlan?.name || 'Grátis'}
                            </span>
                        </div>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            disabled={!canCreateSite()}
                            style={{
                                padding: '10px 20px',
                                background: canCreateSite()
                                    ? 'linear-gradient(135deg, #f43f5e, #ec4899)'
                                    : 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: canCreateSite() ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: canCreateSite() ? '0 4px 20px rgba(236, 72, 153, 0.3)' : 'none',
                                opacity: canCreateSite() ? 1 : 0.5,
                            }}
                        >
                            <span>+</span> Novo Site
                        </button>
                        <button
                            onClick={signOut}
                            style={{
                                padding: '10px 16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Upsell Banner for Free Users */}
            {!isPremium && (
                <div style={{
                    background: 'linear-gradient(90deg, rgba(244,63,94,0.1) 0%, rgba(168,85,247,0.1) 100%)',
                    borderBottom: '1px solid rgba(236,72,153,0.2)',
                    padding: '16px 24px',
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '24px' }}>🚀</span>
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                                    Desbloqueie todo o potencial!
                                </p>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                                    Sites ilimitados, QR Code, intro Netflix e mais
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleUpgrade(PLANS.monthly)}
                                style={{
                                    padding: '10px 20px',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                }}
                            >
                                R$ 29/mês
                            </button>
                            <button
                                onClick={() => handleUpgrade(PLANS.semester)}
                                style={{
                                    padding: '10px 20px',
                                    background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                }}
                            >
                                R$ 99/6 meses (43% OFF) →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', position: 'relative' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '3px solid rgba(236, 72, 153, 0.2)',
                            borderTopColor: '#ec4899',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                        }} />
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Carregando seus sites...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : sites.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontSize: '64px', marginBottom: '24px' }}>💑</div>
                        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>Nenhum site criado ainda</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
                            Crie o primeiro NossoFlix do seu casal!
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            style={{
                                padding: '16px 32px',
                                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                border: 'none',
                                borderRadius: '14px',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.35)'
                            }}
                        >
                            Criar Meu Primeiro Site →
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '16px'
                    }}>
                        {sites.map((site) => (
                            <div
                                key={site.id}
                                className="card-hover"
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {/* Preview */}
                                <div style={{
                                    aspectRatio: '16/9',
                                    background: 'linear-gradient(135deg, rgba(244,63,94,0.15) 0%, rgba(168,85,247,0.1) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <span style={{ fontSize: '48px' }}>💕</span>

                                    {/* Status Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        padding: '6px 12px',
                                        borderRadius: '100px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        background: site.is_published ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                                        color: site.is_published ? '#4ade80' : '#fbbf24',
                                        border: `1px solid ${site.is_published ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`
                                    }}>
                                        {site.is_published ? '● Publicado' : '○ Rascunho'}
                                    </div>

                                    {/* Premium badge if applicable */}
                                    {isPremium && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            left: '16px',
                                            padding: '4px 10px',
                                            borderRadius: '100px',
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                        }}>
                                            PRO
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '6px' }}>
                                        {site.config?.coupleInfo?.creator?.name || 'Nome 1'} & {site.config?.coupleInfo?.partner?.name || 'Nome 2'}
                                    </h3>
                                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                                        nossoflix.com/<span style={{ color: '#ec4899' }}>{site.slug}</span>
                                    </p>

                                    {/* Stats */}
                                    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                                        <div>
                                            <span style={{ fontSize: '20px', fontWeight: '700' }}>{stats[site.id]?.totalViews || 0}</span>
                                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginLeft: '6px' }}>views</span>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '20px', fontWeight: '700' }}>{stats[site.id]?.viewsToday || 0}</span>
                                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginLeft: '6px' }}>hoje</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => onEditSite(site)}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                                border: 'none',
                                                borderRadius: '10px',
                                                color: '#fff',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <span>✏️</span> Editar
                                        </button>

                                        {/* QR Code button - only for premium */}
                                        {isPremium && (
                                            <button
                                                onClick={() => setShowQRCode(site)}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(168, 85, 247, 0.1)',
                                                    border: '1px solid rgba(168, 85, 247, 0.2)',
                                                    borderRadius: '10px',
                                                    color: '#a855f7',
                                                    fontSize: '16px',
                                                    cursor: 'pointer'
                                                }}
                                                title="Gerar QR Code"
                                            >
                                                📱
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleTogglePublish(site.id, site.is_published)}
                                            style={{
                                                padding: '12px 16px',
                                                background: site.is_published ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                border: `1px solid ${site.is_published ? 'rgba(234, 179, 8, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                                                borderRadius: '10px',
                                                color: site.is_published ? '#fbbf24' : '#4ade80',
                                                fontSize: '16px',
                                                cursor: 'pointer'
                                            }}
                                            title={site.is_published ? 'Despublicar' : 'Publicar'}
                                        >
                                            {site.is_published ? '📴' : '🚀'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSite(site.id, site.slug)}
                                            style={{
                                                padding: '12px 16px',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                borderRadius: '10px',
                                                color: '#f87171',
                                                fontSize: '16px',
                                                cursor: 'pointer'
                                            }}
                                            title="Deletar"
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    {/* View Link */}
                                    {site.is_published && (
                                        <a
                                            href={`/${site.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'block',
                                                textAlign: 'center',
                                                color: '#ec4899',
                                                fontSize: '14px',
                                                marginTop: '16px',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            🔗 Ver site publicado →
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Site Modal */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(12px)',
                    padding: '24px'
                }}>
                    <style>{`
            @keyframes modal-in {
              from { opacity: 0; transform: scale(0.95) translateY(20px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>

                    <div style={{
                        width: '100%',
                        maxWidth: '460px',
                        background: 'linear-gradient(180deg, rgba(18,18,18,0.98) 0%, rgba(10,10,10,0.98) 100%)',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.6)',
                        animation: 'modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '40px 32px 32px',
                            background: 'linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(168,85,247,0.05) 100%)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💑</div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Criar Novo Site</h2>
                            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>
                                Insira os nomes do casal para começar
                            </p>
                        </div>

                        {/* Form */}
                        <div style={{ padding: '32px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 400 ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                                        Seu nome
                                    </label>
                                    <input
                                        type="text"
                                        value={newSiteCouple.name1}
                                        onChange={(e) => {
                                            setNewSiteCouple({ ...newSiteCouple, name1: e.target.value });
                                            setNewSiteSlug(generateSlug(e.target.value, newSiteCouple.name2));
                                        }}
                                        placeholder="Igor"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            backgroundColor: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '12px',
                                            fontSize: '15px',
                                            color: '#fff',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                                        Nome do amor
                                    </label>
                                    <input
                                        type="text"
                                        value={newSiteCouple.name2}
                                        onChange={(e) => {
                                            setNewSiteCouple({ ...newSiteCouple, name2: e.target.value });
                                            setNewSiteSlug(generateSlug(newSiteCouple.name1, e.target.value));
                                        }}
                                        placeholder="Letícia"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            backgroundColor: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '12px',
                                            fontSize: '15px',
                                            color: '#fff',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                                    Endereço do site
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>nossoflix.com/</span>
                                    <input
                                        type="text"
                                        value={newSiteSlug}
                                        onChange={(e) => {
                                            const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                                            setNewSiteSlug(slug);
                                            setSlugError('');
                                        }}
                                        onBlur={() => newSiteSlug && checkSlug(newSiteSlug)}
                                        placeholder="igor-e-leticia"
                                        style={{
                                            flex: 1,
                                            padding: '12px 14px',
                                            backgroundColor: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            color: '#ec4899',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                {slugError && (
                                    <p style={{ fontSize: '12px', color: '#f87171', marginTop: '8px' }}>{slugError}</p>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateSite}
                                    disabled={creating || !newSiteCouple.name1 || !newSiteCouple.name2}
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        cursor: creating ? 'not-allowed' : 'pointer',
                                        opacity: (creating || !newSiteCouple.name1 || !newSiteCouple.name2) ? 0.6 : 1
                                    }}
                                >
                                    {creating ? 'Criando...' : 'Criar e Personalizar →'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={confirmDelete}
                title="Deletar Site"
                message={
                    <span>
                        Tem certeza que deseja deletar o site <strong style={{ color: '#ef4444' }}>"{deleteConfirm?.name}"</strong>?
                        <br /><br />
                        <span style={{ fontSize: '13px', color: 'rgba(239,68,68,0.8)' }}>
                            Esta ação não pode ser desfeita!
                        </span>
                    </span>
                }
                confirmText="Sim, Deletar"
                cancelText="Cancelar"
                isDangerous={true}
            />
        </div>
    );
}
