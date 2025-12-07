import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, gradient = 'from-red-600 via-pink-600 to-purple-600', image, youtubeId }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with gradient or image */}
                <div
                    className={`modal-header relative ${!image ? `bg-gradient-to-br ${gradient}` : 'bg-cover bg-center'}`}
                    style={image ? { backgroundImage: `url(${image})` } : {}}
                >
                    {/* Dark Overlay for text readability if image exists */}
                    {image && <div className="absolute inset-0 bg-black/40"></div>}

                    {/* Play button decoration (only if NO image, or meaningful with image too? Let's keep it but subtle) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 animate-pulse-slow group cursor-pointer hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 z-20 group"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Bottom gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a1a] to-transparent z-10"></div>
                </div>

                {/* Content */}
                <div className="modal-body">
                    {title && (
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight">
                            {title}
                        </h2>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-white/10 text-gray-300">
                        <span className="rating-badge">
                            <span>⭐</span>
                            <span>5.0</span>
                        </span>
                        <span className="maturity-rating">L</span>
                        <span className="genre-tag">Romance</span>
                        <span className="text-sm">~3 min de leitura</span>
                    </div>

                    <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-300 leading-relaxed">
                        {children}
                    </div>
                </div>
                {/* Background Music (YouTube) - Hidden but playing */}
                {isOpen && youtubeId && (
                    <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0`}
                            title="YouTube audio"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
