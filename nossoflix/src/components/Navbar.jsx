import { useState, useEffect } from 'react';
import { heroContent as defaultHeroContent, coupleInfo as defaultCoupleInfo } from '../config';

export default function Navbar({ onEasterEgg, coupleInfo: propCoupleInfo, heroContent: propHeroContent }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Usar props ou fallback para defaults
    const coupleInfo = propCoupleInfo || defaultCoupleInfo;
    const heroContent = propHeroContent || defaultHeroContent;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Início', href: '#inicio' },
        { label: 'Melhores Momentos', href: '#melhores-momentos' },
        { label: 'Episódios Difíceis', href: '#episodios-dificeis' },
        { label: 'Bastidores', href: '#bastidores' },
        { label: 'Promessas', href: '#proxima-temporada' },
        { label: 'Créditos', href: '#creditos' },
    ];

    // Gerar tagline dinâmica
    const tagline = `histórias de ${coupleInfo?.creator?.name?.toLowerCase() || 'nós'} e ${coupleInfo?.partner?.name?.toLowerCase() || 'nosso amor'}`;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'glass-strong py-2 sm:py-3 shadow-2xl shadow-black/50'
                : 'bg-gradient-to-b from-black via-black/80 to-transparent py-4 sm:py-6'
                }`}
        >
            <div className="container-custom flex items-center justify-between">
                {/* Logo */}
                <div
                    className="flex flex-col cursor-pointer group select-none"
                    onClick={onEasterEgg}
                >
                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-wider gradient-text group-hover:animate-pulse-slow transition-all">
                        {heroContent.title || 'NOSSOFLIX'}
                    </h1>
                    <span className="text-[9px] sm:text-[10px] text-gray-500 tracking-widest uppercase -mt-1 group-hover:text-gray-400 transition-colors">
                        {tagline}
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1">
                    {navItems.map((item, index) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <span className="relative z-10">{item.label}</span>
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
                    <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
            >
                <div className="glass-strong m-4 rounded-xl overflow-hidden">
                    {navItems.map((item, index) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-6 py-4 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 border-b border-white/5 last:border-0 transition-all"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
}
