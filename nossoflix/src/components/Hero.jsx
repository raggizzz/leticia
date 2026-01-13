import { useEffect, useState } from 'react';
import { coupleInfo as defaultCoupleInfo, themeConfig as defaultThemeConfig } from '../config';

export default function Hero({ onWatchNow, onDetails, config, coupleInfo: propCoupleInfo, themeConfig: propThemeConfig }) {
    const [loaded, setLoaded] = useState(false);

    // Usar props ou fallback para defaults
    const coupleInfo = propCoupleInfo || defaultCoupleInfo;
    const themeConfig = propThemeConfig || defaultThemeConfig;

    // Imagem de fundo dinâmica
    const backgroundImage = themeConfig?.heroBackground || '/couple.png';

    useEffect(() => {
        setLoaded(true);
    }, []);

    // Usar config passada ou valores padrão
    const {
        badges = ['Romance', 'Comédia', 'Drama'],
        title = 'NOSSOFLIX',
        description = 'Uma história de amor, aprendizado e crescimento.',
        primaryButtonText = 'Assistir agora',
        secondaryButtonText = 'Mais informações',
    } = config || {};

    return (
        <section
            id="inicio"
            className="relative min-h-screen flex items-center overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={backgroundImage}
                    alt={`${coupleInfo?.creator?.name || 'Casal'} e ${coupleInfo?.partner?.name || ''}`}
                    className="w-full h-full object-cover object-top scale-105"
                    loading="lazy"
                />
                {/* Multiple gradient overlays for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]"></div>

                {/* Vignette effect */}
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
                }}></div>
            </div>

            {/* Animated Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${100 + Math.random() * 20}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${8 + Math.random() * 6}s`,
                            opacity: Math.random() * 0.5 + 0.2,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 container-custom pt-32 pb-20 sm:pt-40 sm:pb-28">
                <div className="max-w-2xl lg:max-w-3xl">
                    {/* Series Badge + Conceito */}
                    <div className={`flex flex-wrap items-center gap-3 mb-4 ${loaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-red-600 to-red-700 rounded shadow-lg shadow-red-600/30">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Série Original
                        </span>
                        <span className="text-gray-400 text-sm font-medium">{title}</span>
                    </div>

                    {/* Frase-conceito */}
                    <p className={`text-sm sm:text-base text-gray-500 italic mb-6 ${loaded ? 'animate-fadeInUp delay-50' : 'opacity-0'}`}>
                        ✨ Nossa história como se fosse uma série
                    </p>

                    {/* Title */}
                    <h1
                        className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] mb-6 text-shadow-lg ${loaded ? 'animate-fadeInUp delay-100' : 'opacity-0'}`}
                    >
                        <span className="block text-white">{coupleInfo.creator.name}</span>
                        <span className="block text-gray-400 text-3xl sm:text-4xl lg:text-5xl font-light my-2">&</span>
                        <span className="block gradient-text">{coupleInfo.partner.name}</span>
                    </h1>

                    {/* Meta Info Row */}
                    <div className={`flex flex-wrap items-center gap-3 sm:gap-4 mb-6 ${loaded ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
                        <div className="rating-badge">
                            <span>⭐</span>
                            <span>5.0</span>
                        </div>
                        <span className="text-gray-600">|</span>
                        <div className="flex flex-wrap gap-2">
                            {badges.map((badge, index) => (
                                <span key={index} className="genre-tag">{badge}</span>
                            ))}
                        </div>
                        <span className="hidden sm:inline text-gray-600">|</span>
                        <span className="text-gray-400 font-medium">{themeConfig.year} – ∞</span>
                    </div>

                    {/* Synopsis */}
                    <p className={`text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed mb-8 max-w-xl ${loaded ? 'animate-fadeInUp delay-300' : 'opacity-0'}`}>
                        {description}
                    </p>

                    {/* CTA Buttons - Melhorados */}
                    <div className={`flex flex-col gap-4 ${loaded ? 'animate-fadeInUp delay-400' : 'opacity-0'}`}>
                        {/* Botão Principal com Destaque */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={onWatchNow} className="group relative btn-netflix animate-glow text-lg px-8 py-4 shadow-2xl shadow-red-600/40 hover:shadow-red-600/60 transition-all duration-300 hover:scale-105">
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span className="font-bold">Assistir Carta</span>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    💌 Clique para ler a declaração de amor
                                </span>
                            </button>
                            <button onClick={onDetails} className="btn-secondary hover:bg-white/10 transition-all duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {secondaryButtonText.replace('ℹ ', '')}
                            </button>
                        </div>
                        {/* Microtexto explicativo */}
                        <p className="text-xs text-gray-600 sm:hidden mt-2">
                            👆 Toque no botão para começar a explorar nossa história
                        </p>
                    </div>

                    {/* Stats - Now Dynamic */}
                    <div className={`grid grid-cols-3 gap-4 sm:gap-8 mt-12 pt-8 border-t border-white/10 max-w-md ${loaded ? 'animate-fadeInUp delay-500' : 'opacity-0'}`}>
                        <div className="text-center sm:text-left">
                            <p className="text-2xl sm:text-3xl font-bold text-white">{themeConfig.year}</p>
                            <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mt-1">Conhecidos</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-2xl sm:text-3xl font-bold text-white">
                                {new Date(coupleInfo.relationship.startDate).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '')}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mt-1">Juntos</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-2xl sm:text-3xl font-bold text-green-400 flex items-center justify-center sm:justify-start gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                ∞
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mt-1">Temporadas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-float">
                <span className="text-gray-600 text-xs uppercase tracking-[0.2em]">Explorar</span>
                <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center p-2">
                    <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>
        </section>
    );
}
