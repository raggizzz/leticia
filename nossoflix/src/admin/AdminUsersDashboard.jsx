import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PLANS } from '../config/plans';

/**
 * AdminUsersDashboard - Painel administrativo para gerenciar usuários e planos
 * Apenas para administradores do sistema
 */
export default function AdminUsersDashboard({ onClose }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState('all');
    const [editingUser, setEditingUser] = useState(null);
    const [saving, setSaving] = useState(false);
    const [stats, setStats] = useState({ total: 0, free: 0, monthly: 0, semester: 0 });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            // Buscar todos os usuários com suas assinaturas
            const { data: subscriptions, error } = await supabase
                .from('subscriptions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Buscar sites de cada usuário
            const usersWithSites = await Promise.all(
                (subscriptions || []).map(async (sub) => {
                    const { data: sites } = await supabase
                        .from('sites')
                        .select('id, slug, is_published, created_at')
                        .eq('user_id', sub.user_id);

                    return {
                        ...sub,
                        sites: sites || [],
                        sitesCount: sites?.length || 0,
                    };
                })
            );

            setUsers(usersWithSites);

            // Calcular stats
            const stats = usersWithSites.reduce((acc, u) => {
                acc.total++;
                const plan = u.plan_type || 'free';
                acc[plan] = (acc[plan] || 0) + 1;
                return acc;
            }, { total: 0, free: 0, monthly: 0, semester: 0 });
            setStats(stats);

        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePlan = async (userId, newPlan) => {
        setSaving(true);
        try {
            const updates = {
                plan_type: newPlan,
                updated_at: new Date().toISOString(),
            };

            // Se mudando para plano pago, definir data de expiração
            if (newPlan === 'monthly') {
                const expires = new Date();
                expires.setMonth(expires.getMonth() + 1);
                updates.expires_at = expires.toISOString();
                updates.status = 'active';
            } else if (newPlan === 'semester') {
                const expires = new Date();
                expires.setMonth(expires.getMonth() + 6);
                updates.expires_at = expires.toISOString();
                updates.status = 'active';
            } else {
                updates.expires_at = null;
                updates.status = 'free';
            }

            const { error } = await supabase
                .from('subscriptions')
                .update(updates)
                .eq('user_id', userId);

            if (error) throw error;

            // Atualizar lista local
            setUsers(prev => prev.map(u =>
                u.user_id === userId ? { ...u, ...updates } : u
            ));
            setEditingUser(null);

        } catch (error) {
            console.error('Erro ao atualizar plano:', error);
            alert('Erro ao atualizar plano: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleExtendPlan = async (userId, months) => {
        setSaving(true);
        try {
            const user = users.find(u => u.user_id === userId);
            const currentExpiry = user?.expires_at ? new Date(user.expires_at) : new Date();
            const newExpiry = new Date(currentExpiry);
            newExpiry.setMonth(newExpiry.getMonth() + months);

            const { error } = await supabase
                .from('subscriptions')
                .update({
                    expires_at: newExpiry.toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId);

            if (error) throw error;

            setUsers(prev => prev.map(u =>
                u.user_id === userId ? { ...u, expires_at: newExpiry.toISOString() } : u
            ));

        } catch (error) {
            console.error('Erro ao estender plano:', error);
        } finally {
            setSaving(false);
        }
    };

    // Filtrar usuários
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.user_id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = filterPlan === 'all' || user.plan_type === filterPlan;
        return matchesSearch && matchesPlan;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getPlanBadge = (planType) => {
        const plan = PLANS[planType] || PLANS.free;
        const colors = {
            free: { bg: 'rgba(156,163,175,0.2)', text: '#9ca3af', border: 'rgba(156,163,175,0.3)' },
            monthly: { bg: 'rgba(236,72,153,0.2)', text: '#ec4899', border: 'rgba(236,72,153,0.3)' },
            semester: { bg: 'rgba(34,197,94,0.2)', text: '#22c55e', border: 'rgba(34,197,94,0.3)' },
        };
        const color = colors[planType] || colors.free;

        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                background: color.bg,
                color: color.text,
                border: `1px solid ${color.border}`,
            }}>
                {plan.name}
            </span>
        );
    };

    const getStatusBadge = (status, expiresAt) => {
        const isExpired = expiresAt && new Date(expiresAt) < new Date();

        if (isExpired) {
            return (
                <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: 'rgba(239,68,68,0.2)',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.3)',
                }}>
                    Expirado
                </span>
            );
        }

        const statusColors = {
            active: { bg: 'rgba(34,197,94,0.2)', text: '#22c55e' },
            cancelled: { bg: 'rgba(239,68,68,0.2)', text: '#ef4444' },
            pending: { bg: 'rgba(234,179,8,0.2)', text: '#eab308' },
            free: { bg: 'rgba(156,163,175,0.2)', text: '#9ca3af' },
        };
        const color = statusColors[status] || statusColors.free;

        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                background: color.bg,
                color: color.text,
            }}>
                {status || 'free'}
            </span>
        );
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: '#0a0a0a',
            overflow: 'auto',
        }}>
            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                padding: '16px 24px',
                background: 'linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.9) 100%)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '10px 16px',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}
                            >
                                ← Voltar
                            </button>
                            <div>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                                    👥 Gerenciar Usuários
                                </h1>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                                    Visualize e gerencie os planos dos usuários
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={loadUsers}
                            style={{
                                padding: '10px 20px',
                                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                            }}
                        >
                            🔄 Atualizar
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                        {[
                            { label: 'Total Usuários', value: stats.total, icon: '👥', color: '#8b5cf6' },
                            { label: 'Plano Gratuito', value: stats.free, icon: '🆓', color: '#9ca3af' },
                            { label: 'Plano Mensal', value: stats.monthly, icon: '💳', color: '#ec4899' },
                            { label: 'Plano Semestral', value: stats.semester, icon: '🌟', color: '#22c55e' },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '20px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '16px',
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="🔍 Buscar por email ou ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                flex: 1,
                                minWidth: '250px',
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                            }}
                        />
                        <select
                            value={filterPlan}
                            onChange={(e) => setFilterPlan(e.target.value)}
                            style={{
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="all">Todos os planos</option>
                            <option value="free">Gratuito</option>
                            <option value="monthly">Mensal</option>
                            <option value="semester">Semestral</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Carregando usuários...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Nenhum usuário encontrado</p>
                    </div>
                ) : (
                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                    }}>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 150px',
                            gap: '16px',
                            padding: '16px 20px',
                            background: 'rgba(255,255,255,0.03)',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}>
                            <span>Usuário</span>
                            <span>Plano</span>
                            <span>Status</span>
                            <span>Sites</span>
                            <span>Expira em</span>
                            <span>Criado em</span>
                            <span>Ações</span>
                        </div>

                        {/* Table Rows */}
                        {filteredUsers.map((user) => (
                            <div
                                key={user.user_id}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 150px',
                                    gap: '16px',
                                    padding: '16px 20px',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    alignItems: 'center',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                {/* Email */}
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                                        {user.user_email || 'Email não disponível'}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                                        {user.user_id?.slice(0, 8)}...
                                    </div>
                                </div>

                                {/* Plan */}
                                <div>{getPlanBadge(user.plan_type)}</div>

                                {/* Status */}
                                <div>{getStatusBadge(user.status, user.expires_at)}</div>

                                {/* Sites */}
                                <div style={{ fontSize: '14px' }}>
                                    <span style={{ fontWeight: '600' }}>{user.sitesCount}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: '4px' }}>sites</span>
                                </div>

                                {/* Expires */}
                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                                    {formatDate(user.expires_at)}
                                </div>

                                {/* Created */}
                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                                    {formatDate(user.created_at)}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => setEditingUser(user)}
                                        style={{
                                            padding: '8px 12px',
                                            background: 'rgba(139,92,246,0.2)',
                                            border: '1px solid rgba(139,92,246,0.3)',
                                            borderRadius: '8px',
                                            color: '#a78bfa',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ✏️ Editar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Edit Modal */}
            {editingUser && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(10px)',
                        padding: '24px',
                    }}
                    onClick={() => setEditingUser(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
                            borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            maxWidth: '500px',
                            width: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{
                            padding: '24px',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(168,85,247,0.05) 100%)',
                        }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
                                ✏️ Editar Usuário
                            </h2>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '8px 0 0' }}>
                                {editingUser.user_email}
                            </p>
                        </div>

                        <div style={{ padding: '24px' }}>
                            {/* Current Info */}
                            <div style={{
                                padding: '16px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '12px',
                                marginBottom: '20px',
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                                    <div>
                                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Plano atual:</span>
                                        <span style={{ marginLeft: '8px' }}>{PLANS[editingUser.plan_type]?.name || 'Gratuito'}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Sites:</span>
                                        <span style={{ marginLeft: '8px' }}>{editingUser.sitesCount}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Expira:</span>
                                        <span style={{ marginLeft: '8px' }}>{formatDate(editingUser.expires_at)}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Status:</span>
                                        <span style={{ marginLeft: '8px' }}>{editingUser.status || 'free'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Change Plan */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>
                                    Alterar Plano
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {Object.values(PLANS).map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => handleUpdatePlan(editingUser.user_id, plan.id)}
                                            disabled={saving}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                background: editingUser.plan_type === plan.id
                                                    ? 'linear-gradient(135deg, #f43f5e, #ec4899)'
                                                    : 'rgba(255,255,255,0.05)',
                                                border: editingUser.plan_type === plan.id
                                                    ? 'none'
                                                    : '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '10px',
                                                color: '#fff',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                cursor: saving ? 'wait' : 'pointer',
                                                opacity: saving ? 0.5 : 1,
                                            }}
                                        >
                                            {plan.name}
                                            {plan.price > 0 && <div style={{ fontSize: '11px', opacity: 0.7 }}>R$ {plan.price}</div>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Extend Plan */}
                            {editingUser.plan_type !== 'free' && (
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>
                                        Estender Plano
                                    </label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {[1, 3, 6, 12].map((months) => (
                                            <button
                                                key={months}
                                                onClick={() => handleExtendPlan(editingUser.user_id, months)}
                                                disabled={saving}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px',
                                                    background: 'rgba(34,197,94,0.1)',
                                                    border: '1px solid rgba(34,197,94,0.3)',
                                                    borderRadius: '10px',
                                                    color: '#22c55e',
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    cursor: saving ? 'wait' : 'pointer',
                                                }}
                                            >
                                                +{months} {months === 1 ? 'mês' : 'meses'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sites List */}
                            {editingUser.sites?.length > 0 && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>
                                        Sites ({editingUser.sites.length})
                                    </label>
                                    <div style={{
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '10px',
                                        padding: '8px',
                                    }}>
                                        {editingUser.sites.map((site) => (
                                            <div
                                                key={site.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '10px 12px',
                                                    borderRadius: '8px',
                                                    marginBottom: '4px',
                                                    background: 'rgba(255,255,255,0.02)',
                                                }}
                                            >
                                                <span style={{ fontSize: '13px' }}>/{site.slug}</span>
                                                <span style={{
                                                    fontSize: '11px',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    background: site.is_published
                                                        ? 'rgba(34,197,94,0.2)'
                                                        : 'rgba(239,68,68,0.2)',
                                                    color: site.is_published ? '#22c55e' : '#ef4444',
                                                }}>
                                                    {site.is_published ? 'Publicado' : 'Rascunho'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '16px 24px',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}>
                            <button
                                onClick={() => setEditingUser(null)}
                                style={{
                                    padding: '12px 24px',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                }}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
