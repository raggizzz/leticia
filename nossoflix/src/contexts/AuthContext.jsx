import { createContext, useContext, useState, useEffect } from 'react';
import {
    supabase,
    isSupabaseConfigured,
    signIn as supabaseSignIn,
    signUp as supabaseSignUp,
    signOut as supabaseSignOut,
    getCurrentUser,
    onAuthStateChange,
    resetPassword as supabaseResetPassword,
    getUserSubscription,
} from '../lib/supabase';
import { PLANS, getPlan, isPaidPlan } from '../config/plans';
import { translateAuthError, SUCCESS_MESSAGES } from '../lib/authMessages';

// Contexto de Autenticação
const AuthContext = createContext(null);

// Provider de Autenticação
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    // Inicializar subscription do cache para evitar flickering
    const [subscription, setSubscription] = useState(() => {
        try {
            const cached = localStorage.getItem('nossoflix_subscription');
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);
    const [isConfigured, setIsConfigured] = useState(false);

    useEffect(() => {
        // Verificar se Supabase está configurado
        const configured = isSupabaseConfigured();
        setIsConfigured(configured);

        if (!configured) {
            setLoading(false);
            return;
        }

        console.log('[Auth] Iniciando listener de autenticação...');

        // ABORDAGEM NÃO-BLOQUEANTE: usar onAuthStateChange como fonte única
        // O Supabase dispara INITIAL_SESSION imediatamente com a sessão atual (ou null)
        // Listener de mudança de autenticação
        const unsubscribe = onAuthStateChange(async (event, session) => {
            console.log('[Auth] Evento recebido:', event, session?.user?.email ?? 'sem usuário');
            const newUser = session?.user ?? null;

            // Log para debug
            if (event === 'SIGNED_OUT') {
                setUser(null);
                setSubscription(null);
                localStorage.removeItem('nossoflix_subscription');
                setLoading(false);
            } else if (newUser) {
                setUser(newUser);
                // LIBERAR UI IMEDIATAMENTE - subscription carrega em background
                setLoading(false);

                // Buscar subscription em background (não bloqueia a UI)
                getUserSubscription().then(sub => {
                    if (sub) {
                        setSubscription(sub);
                    }
                }).catch(error => {
                    console.warn('[Auth] Erro ao buscar subscription:', error);
                });
            } else {
                // Nenhum usuário
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Persistir subscription no cache sempre que mudar
    useEffect(() => {
        if (subscription) {
            localStorage.setItem('nossoflix_subscription', JSON.stringify(subscription));
        }
    }, [subscription]);

    // Refresh subscription
    const refreshSubscription = async () => {
        if (user) {
            const sub = await getUserSubscription();
            if (sub) {
                setSubscription(sub);
                return sub;
            }
        }
        return null;
    };

    // Login
    const signIn = async (email, password) => {
        if (!isConfigured) {
            return { success: false, error: 'Sistema de autenticação não disponível.' };
        }

        setLoading(true);
        try {
            const { user } = await supabaseSignIn(email, password);
            setUser(user);

            if (user) {
                const sub = await getUserSubscription();
                setSubscription(sub);
            }

            return {
                success: true,
                user,
                message: SUCCESS_MESSAGES.signIn.message
            };
        } catch (error) {
            return { success: false, error: translateAuthError(error) };
        } finally {
            setLoading(false);
        }
    };

    // Registro
    const signUp = async (email, password, metadata = {}) => {
        if (!isConfigured) {
            return { success: false, error: 'Sistema de autenticação não disponível.' };
        }

        setLoading(true);
        try {
            const { user } = await supabaseSignUp(email, password, metadata);
            return {
                success: true,
                user,
                message: SUCCESS_MESSAGES.signUp.message,
                hint: SUCCESS_MESSAGES.signUp.hint,
            };
        } catch (error) {
            return { success: false, error: translateAuthError(error) };
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const signOut = async () => {
        if (!isConfigured) return { success: true };

        setLoading(true);
        try {
            await supabaseSignOut();
            setUser(null);
            setSubscription(null);
            return {
                success: true,
                message: SUCCESS_MESSAGES.signOut.message
            };
        } catch (error) {
            return { success: false, error: translateAuthError(error) };
        } finally {
            setLoading(false);
        }
    };

    // Resetar senha
    const resetPassword = async (email) => {
        if (!isConfigured) {
            return { success: false, error: 'Sistema de autenticação não disponível.' };
        }

        try {
            await supabaseResetPassword(email);
            return {
                success: true,
                message: SUCCESS_MESSAGES.resetPassword.message,
                hint: SUCCESS_MESSAGES.resetPassword.hint,
            };
        } catch (error) {
            return { success: false, error: translateAuthError(error) };
        }
    };

    // Helpers de plano
    const currentPlan = subscription ? getPlan(subscription.plan_type) : PLANS.free;
    const isPremium = subscription ? isPaidPlan(subscription.plan_type) : false;

    // Verifica se tem feature específica
    const hasFeature = (feature) => {
        return currentPlan[feature] ?? false;
    };

    const value = {
        user,
        loading,
        isConfigured,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        resetPassword,
        // Subscription
        subscription,
        currentPlan,
        isPremium,
        hasFeature,
        refreshSubscription,
        PLANS,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook para usar autenticação
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
