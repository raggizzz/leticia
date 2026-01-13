import { useState, useEffect } from 'react';
import { AuthProvider, useAuth, ToastProvider } from './contexts';
import { getSiteBySlug, trackPageView, isSupabaseConfigured, getSiteBySlugWithPrivacy, validateSitePassword } from './lib/supabase';
import App from './App';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import PasswordGate from './components/PasswordGate';
import { VisualEditor, AdminPanel, AdminUsersDashboard } from './admin';

/**
 * Componente Root - Gerencia roteamento e autenticação
 */
function RootContent() {
    const { user, isAuthenticated, loading: authLoading, isConfigured } = useAuth();
    const [currentView, setCurrentView] = useState('loading');
    const [siteData, setSiteData] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [editingSite, setEditingSite] = useState(null);
    const [showAdminLocal, setShowAdminLocal] = useState(false);
    const [showAdminUsers, setShowAdminUsers] = useState(false);
    const [siteNeedsPassword, setSiteNeedsPassword] = useState(false);
    const [unlockedSites, setUnlockedSites] = useState(() => {
        // Carregar sites desbloqueados da sessionStorage
        try {
            const stored = sessionStorage.getItem('nossoflix_unlocked');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        determineView();
    }, [authLoading, isAuthenticated]);

    // Detectar tecla para admin local (Ctrl+Shift+A)
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                setShowAdminLocal(true);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const determineView = async () => {
        if (authLoading) {
            setCurrentView('loading');
            return;
        }

        const path = window.location.pathname;
        const slug = path.replace(/^\//, '').replace(/\/$/, '');

        // Rotas especiais
        if (path === '/dashboard' || path === '/admin') {
            if (isAuthenticated) {
                setCurrentView('dashboard');
            } else {
                setShowAuthModal(true);
                setCurrentView('landing');
            }
            return;
        }

        // Admin de usuários (rota protegida)
        if (path === '/admin-users') {
            if (isAuthenticated) {
                setShowAdminUsers(true);
                setCurrentView('dashboard');
            } else {
                setShowAuthModal(true);
                setCurrentView('landing');
            }
            return;
        }

        // Demo - mostra o site de exemplo (Igor & Letícia)
        if (path === '/demo' || path === '/exemplo') {
            setCurrentView('demo');
            return;
        }

        // Raiz - mostrar landing page de vendas
        if (slug === '') {
            setCurrentView('landing');
            return;
        }

        // Se não tem Supabase configurado e não é demo, mostrar landing
        if (!isConfigured) {
            setCurrentView('landing');
            return;
        }

        // Se tem slug, tentar carregar site do Supabase
        try {
            const site = await getSiteBySlugWithPrivacy(slug);
            if (site) {
                setSiteData(site);

                // Verificar se site é privado e não está desbloqueado
                if (site.is_private && !unlockedSites.includes(site.id)) {
                    setSiteNeedsPassword(true);
                    setCurrentView('password');
                } else {
                    setSiteNeedsPassword(false);
                    setCurrentView('site');
                    trackPageView(site.id, '/');
                }
            } else {
                setCurrentView('not-found');
            }
        } catch (error) {
            console.error('Erro ao carregar site:', error);
            setCurrentView('not-found');
        }
    };

    const goToDemo = () => {
        window.history.pushState({}, '', '/demo');
        setCurrentView('demo');
    };

    const goToLanding = () => {
        window.history.pushState({}, '', '/');
        setCurrentView('landing');
        setSiteData(null);
    };

    const goToDashboard = () => {
        if (isAuthenticated) {
            window.history.pushState({}, '', '/dashboard');
            setCurrentView('dashboard');
        } else {
            setShowAuthModal(true);
        }
    };

    const handleEditSite = (site) => {
        setSiteData(site);
        setEditingSite(site);
        setCurrentView('admin');
    };

    const handleCloseAdmin = () => {
        setEditingSite(null);
        if (isAuthenticated) {
            setCurrentView('dashboard');
        } else {
            setCurrentView('landing');
        }
    };

    // Handler para desbloquear site com senha
    const handleUnlockSite = async (password) => {
        if (!siteData?.id) return false;

        try {
            const isValid = await validateSitePassword(siteData.id, password);

            if (isValid) {
                // Salvar na sessionStorage
                const newUnlocked = [...unlockedSites, siteData.id];
                setUnlockedSites(newUnlocked);
                sessionStorage.setItem('nossoflix_unlocked', JSON.stringify(newUnlocked));

                // Ir para o site
                setSiteNeedsPassword(false);
                setCurrentView('site');
                trackPageView(siteData.id, '/');
                return true;
            }

            return false;
        } catch (error) {
            console.error('Erro ao validar senha:', error);
            return false;
        }
    };

    // Loading
    if (currentView === 'loading') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl animate-pulse mb-4">❤️</div>
                    <p className="text-gray-400">Carregando...</p>
                </div>
            </div>
        );
    }

    // Password Gate (site privado)
    if (currentView === 'password' && siteData) {
        const siteName = siteData.config?.heroContent?.title ||
            siteData.config?.coupleInfo?.creator?.name ||
            siteData.slug;
        return (
            <PasswordGate
                siteName={siteName}
                onUnlock={handleUnlockSite}
            />
        );
    }

    // Landing Page
    if (currentView === 'landing') {
        return (
            <>
                <LandingPage
                    onLogin={() => setShowAuthModal(true)}
                    onDemo={goToDemo}
                    isAuthenticated={isAuthenticated}
                    onDashboard={goToDashboard}
                />
                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            </>
        );
    }

    // Demo (site de exemplo Igor & Letícia)
    if (currentView === 'demo') {
        return (
            <>
                <App siteData={null} />

                {/* Barra de demo */}
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-pink-600 py-3 px-4 shadow-lg">
                    <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-white text-sm text-center sm:text-left">
                            <span className="font-semibold">🎬 Modo Demo:</span> Este é o NossoFlix de Igor & Letícia
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={goToLanding}
                                className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-all"
                            >
                                ← Voltar
                            </button>
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="px-4 py-1.5 bg-white rounded-lg text-red-600 text-sm font-bold hover:bg-gray-100 transition-all"
                            >
                                Criar o Meu →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Admin local (Ctrl+Shift+A) */}
                {showAdminLocal && (
                    <AdminPanel
                        siteData={null}
                        onClose={() => setShowAdminLocal(false)}
                        onSave={() => { }}
                    />
                )}

                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            </>
        );
    }

    // Not Found
    if (currentView === 'not-found') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">💔</div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Site não encontrado</h1>
                    <p className="text-gray-400 mb-6 text-sm sm:text-base">
                        Este NossoFlix não existe ou não está publicado ainda.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={goToLanding}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium hover:from-red-500 hover:to-pink-500 transition-all"
                        >
                            Criar meu NossoFlix
                        </button>
                        <button
                            onClick={goToDemo}
                            className="px-6 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
                        >
                            Ver exemplo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Dashboard
    if (currentView === 'dashboard') {
        return (
            <>
                <Dashboard
                    onEditSite={handleEditSite}
                    onClose={goToLanding}
                />
                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            </>
        );
    }

    // Admin (editando um site do Supabase) - Usando Editor Visual
    // Admin de usuários
    if (showAdminUsers) {
        return (
            <AdminUsersDashboard
                onClose={() => {
                    setShowAdminUsers(false);
                    window.history.pushState({}, '', '/dashboard');
                }}
            />
        );
    }

    // Edição de site (VisualEditor)
    if (currentView === 'admin' && editingSite) {
        return (
            <VisualEditor
                siteData={editingSite}
                onClose={handleCloseAdmin}
                onSave={() => {
                    determineView();
                }}
            />
        );
    }

    // Site de casal (carregado do Supabase)
    if (currentView === 'site' && siteData) {
        return (
            <>
                <App siteData={siteData} />
                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            </>
        );
    }

    // Fallback
    return (
        <LandingPage
            onLogin={() => setShowAuthModal(true)}
            onDemo={goToDemo}
            isAuthenticated={isAuthenticated}
            onDashboard={goToDashboard}
        />
    );
}

/**
 * Root com Provider de Autenticação
 */
export default function Root() {
    return (
        <AuthProvider>
            <ToastProvider>
                <RootContent />
            </ToastProvider>
        </AuthProvider>
    );
}
