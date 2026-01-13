import { useState } from 'react';

/**
 * WelcomeSplash - Tela de boas-vindas antes do site
 * "Fulano te mandou um vídeo especial. Quer ver?"
 * Quando aceita, ativa o som e entra no site
 */
export default function WelcomeSplash({
    creatorName = 'Alguém especial',
    partnerName = '',
    onAccept,
    onDecline
}) {
    const [isExiting, setIsExiting] = useState(false);

    const handleAccept = () => {
        setIsExiting(true);
        setTimeout(() => {
            onAccept?.();
        }, 800);
    };

    const handleDecline = () => {
        setIsExiting(true);
        setTimeout(() => {
            onDecline?.();
        }, 500);
    };

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-700 ${isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
                }`}
            style={{
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)',
            }}
        >
            {/* Partículas de fundo animadas */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-red-500/30 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Gradiente radial central */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.15) 0%, transparent 50%)',
                }}
            />

            {/* Conteúdo principal */}
            <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
                {/* Ícone de envelope/coração */}
                <div className="mb-8 animate-bounce">
                    <div
                        className="inline-flex items-center justify-center w-24 h-24 rounded-full"
                        style={{
                            background: 'linear-gradient(135deg, #dc2626 0%, #db2777 50%, #9333ea 100%)',
                            boxShadow: '0 0 60px rgba(220, 38, 38, 0.5), 0 0 120px rgba(219, 39, 119, 0.3)',
                        }}
                    >
                        <span className="text-5xl">💌</span>
                    </div>
                </div>

                {/* Mensagem principal */}
                <h1
                    className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent"
                    style={{
                        textShadow: '0 0 40px rgba(220, 38, 38, 0.3)',
                    }}
                >
                    {creatorName} te mandou algo especial
                </h1>

                <p className="text-gray-400 text-lg mb-2">
                    Uma surpresa foi preparada com muito carinho
                </p>

                {partnerName && (
                    <p className="text-red-400 text-xl font-medium mb-8">
                        especialmente pra você, {partnerName} ❤️
                    </p>
                )}

                {!partnerName && (
                    <p className="text-gray-500 mb-8">
                        Prepare-se para uma experiência única
                    </p>
                )}

                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {/* Botão Aceitar */}
                    <button
                        onClick={handleAccept}
                        className="group relative px-10 py-4 rounded-full font-bold text-lg text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #dc2626 0%, #db2777 100%)',
                            boxShadow: '0 10px 40px rgba(220, 38, 38, 0.4)',
                        }}
                    >
                        {/* Brilho animado */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                                transform: 'skewX(-20deg)',
                                animation: 'shimmer 2s infinite',
                            }}
                        />
                        <span className="relative flex items-center gap-2">
                            <span>▶️</span>
                            <span>Quero ver!</span>
                        </span>
                    </button>

                    {/* Botão Recusar (discreto) */}
                    <button
                        onClick={handleDecline}
                        className="text-gray-500 hover:text-gray-400 text-sm transition-colors duration-300"
                    >
                        Agora não
                    </button>
                </div>

                {/* Aviso de som */}
                <p className="mt-8 text-gray-600 text-xs flex items-center justify-center gap-2">
                    <span>🔊</span>
                    <span>Recomendamos assistir com som</span>
                </p>
            </div>

            {/* Linha vermelha Netflix style no fundo */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, #dc2626 20%, #db2777 50%, #dc2626 80%, transparent 100%)',
                }}
            />

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-20deg); }
                    100% { transform: translateX(200%) skewX(-20deg); }
                }
            `}</style>
        </div>
    );
}
