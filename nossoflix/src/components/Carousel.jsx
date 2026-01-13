import { useRef, useState, useEffect } from 'react';

export default function Carousel({ children, title, subtitle }) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        const ref = scrollRef.current;
        if (ref) {
            ref.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (ref) {
                ref.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const cardWidth = 320;
            const gap = 24;
            const scrollAmount = (cardWidth + gap) * 2;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="py-8 sm:py-12 relative">
            <div className="container-custom">
                {/* Title */}
                {title && (
                    <div className="mb-6 text-center">
                        <h2 className="section-title justify-center">{title}</h2>
                        {subtitle && (
                            <p className="text-gray-500 text-sm sm:text-base -mt-2">{subtitle}</p>
                        )}
                        {/* Instrução de interação - centralizada */}
                        <p className="text-xs text-gray-600 mt-3 flex items-center gap-2 justify-center">
                            <span className="hidden sm:inline">🖱️ Clique</span>
                            <span className="sm:hidden">👆 Toque</span>
                            <span>em um episódio para ler a história completa</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Carousel Container */}
            <div className="relative group/carousel">
                {/* Navigation Arrows */}
                <button
                    onClick={() => scroll('left')}
                    className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/80 hover:bg-red-600 text-white rounded-full shadow-xl transition-all duration-300 ${canScrollLeft ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={() => scroll('right')}
                    className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/80 hover:bg-red-600 text-white rounded-full shadow-xl transition-all duration-300 ${canScrollRight ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Gradient Edges */}
                <div className={`absolute left-0 top-0 bottom-0 w-12 sm:w-20 carousel-gradient-left z-20 pointer-events-none transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute right-0 top-0 bottom-0 w-12 sm:w-20 carousel-gradient-right z-20 pointer-events-none transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* Scrollable Container - Centralizado com w-fit */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-12 py-4 w-fit mx-auto max-w-full"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {children}
                </div>
            </div>
        </section>
    );
}
