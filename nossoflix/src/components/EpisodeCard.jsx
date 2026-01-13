export default function EpisodeCard({
    title,
    description,
    episodeNumber,
    gradient = 'from-red-600 to-pink-600',
    image,
    duration = '~3 min',
    isTop = false,
    onClick
}) {
    return (
        <div
            onClick={onClick}
            className="netflix-card w-[260px] sm:w-[300px] lg:w-[320px] group"
            style={{ scrollSnapAlign: 'start' }}
        >
            {/* Thumbnail */}
            <div
                className={`card-thumbnail relative ${!image ? `bg-gradient-to-br ${gradient}` : 'bg-cover bg-center'}`}
                style={image ? { backgroundImage: `url(${image})` } : {}}
            >
                {/* Top Badge */}
                {isTop && (
                    <div className="top-badge">
                        <span>❤️</span>
                        <span>Especial</span>
                    </div>
                )}

                {/* Episode Badge */}
                {!isTop && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="episode-number">{episodeNumber}</span>
                    </div>
                )}

                {/* Play Overlay */}
                <div className="play-overlay">
                    <div className="play-button">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>

                {/* Subtle gradient texture */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Content - Always visible */}
            <div className="netflix-card-title">
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1 line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
                    {title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="episode-duration">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {duration}
                    </span>
                </div>
            </div>

            {/* Hover Content */}
            <div className="netflix-card-content">
                <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-3">
                    {description}
                </p>
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                    <button className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white hover:scale-110 transition-all">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <button className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white hover:scale-110 transition-all">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>


            </div>
        </div>
    );
}
