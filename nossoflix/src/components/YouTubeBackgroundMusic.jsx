import { useState, useEffect, useRef, memo, useCallback } from 'react';

// Variáveis globais para carregar a API do YouTube apenas uma vez
let ytApiLoaded = false;
let ytApiCallbacks = [];

// Carregar YouTube IFrame API
function loadYouTubeAPI(callback) {
    if (ytApiLoaded && window.YT && window.YT.Player) {
        callback();
        return;
    }

    ytApiCallbacks.push(callback);

    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        return; // Já está carregando
    }

    window.onYouTubeIframeAPIReady = () => {
        ytApiLoaded = true;
        ytApiCallbacks.forEach(cb => cb());
        ytApiCallbacks = [];
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
}

/**
 * YouTubeBackgroundMusic - Reproduz música via YouTube IFrame API
 * Usa a API oficial para controle programático após interação
 */
// ID fixo para o container do player - previne duplicatas
const PLAYER_CONTAINER_ID = 'yt-bg-music-player';
let globalPlayerInstance = null;

const YouTubeBackgroundMusic = memo(function YouTubeBackgroundMusic({
    videoId,
    enabled = false,
    loop = true,
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [apiLoaded, setApiLoaded] = useState(false);
    const [userStarted, setUserStarted] = useState(false);
    const playerRef = useRef(null);

    // Extrair ID do vídeo do YouTube
    const extractVideoId = useCallback((input) => {
        if (!input) return null;
        if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
        ];

        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match) return match[1];
        }
        return null;
    }, []);

    const actualVideoId = extractVideoId(videoId);

    // Limpar iframes do YouTube existentes no DOM ao montar
    useEffect(() => {
        // Destruir qualquer player global anterior
        if (globalPlayerInstance) {
            try { globalPlayerInstance.destroy(); } catch (e) { }
            globalPlayerInstance = null;
        }
        // Limpar container existente
        const existingContainer = document.getElementById(PLAYER_CONTAINER_ID);
        if (existingContainer) {
            existingContainer.innerHTML = '';
        }
    }, []);

    // Carregar API
    useEffect(() => {
        loadYouTubeAPI(() => setApiLoaded(true));
    }, []);

    // Criar player
    const createPlayer = useCallback(() => {
        if (!apiLoaded || !actualVideoId || !window.YT?.Player) return;

        // Destruir player global existente
        if (globalPlayerInstance) {
            try { globalPlayerInstance.destroy(); } catch (e) { }
            globalPlayerInstance = null;
        }
        if (playerRef.current) {
            try { playerRef.current.destroy(); } catch (e) { }
            playerRef.current = null;
        }

        const container = document.getElementById(PLAYER_CONTAINER_ID);
        if (!container) return;

        playerRef.current = new window.YT.Player(PLAYER_CONTAINER_ID, {
            height: '1',
            width: '1',
            videoId: actualVideoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                fs: 0,
                iv_load_policy: 3,
                loop: loop ? 1 : 0,
                modestbranding: 1,
                playsinline: 1,
                rel: 0,
                playlist: loop ? actualVideoId : undefined,
            },
            events: {
                onReady: (e) => {
                    globalPlayerInstance = e.target;
                    setIsReady(true);
                    e.target.playVideo();
                    setIsPlaying(true);
                },
                onStateChange: (e) => {
                    const state = e.data;
                    if (state === window.YT.PlayerState.PLAYING) {
                        setIsPlaying(true);
                    } else if (state === window.YT.PlayerState.PAUSED) {
                        setIsPlaying(false);
                    } else if (state === window.YT.PlayerState.ENDED && loop) {
                        e.target.seekTo(0);
                        e.target.playVideo();
                    }
                },
            }
        });
    }, [apiLoaded, actualVideoId, loop]);

    // Iniciar música
    const handleStartMusic = useCallback(() => {
        if (!actualVideoId || !apiLoaded) return;
        setUserStarted(true);
        setTimeout(createPlayer, 100);
    }, [actualVideoId, apiLoaded, createPlayer]);

    // Toggle play/pause
    const handleToggle = useCallback(() => {
        if (!userStarted) {
            handleStartMusic();
            return;
        }

        if (!playerRef.current) {
            createPlayer();
            return;
        }

        try {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
        } catch (e) {
            createPlayer();
        }
    }, [userStarted, isPlaying, handleStartMusic, createPlayer]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch (e) { }
            }
        };
    }, []);

    // Auto-iniciar quando API carregar (apenas uma vez)
    const hasStartedRef = useRef(false);
    useEffect(() => {
        if (apiLoaded && actualVideoId && !hasStartedRef.current) {
            hasStartedRef.current = true;
            setUserStarted(true);
            // Delay para garantir que o container existe no DOM
            const timer = setTimeout(() => {
                createPlayer();
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [apiLoaded, actualVideoId, createPlayer]);

    if (!actualVideoId || !enabled) return null;

    return (
        <>
            {/* Container invisível para o player - sem interface visível */}
            {userStarted && (
                <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                    <div id={PLAYER_CONTAINER_ID} />
                </div>
            )}
        </>
    );
});

/**
 * Sugestões de músicas populares do YouTube para casais
 */
export const MUSIC_SUGGESTIONS = [
    // Sertanejo
    {
        id: 'cUQTTOlY-TE',
        title: 'Jorge e Mateus - A Hora É Agora',
        artist: 'Jorge e Mateus',
        duration: '3:58',
        thumbnail: 'https://img.youtube.com/vi/cUQTTOlY-TE/mqdefault.jpg',
        category: 'sertanejo',
    },
    {
        id: '-YzDsDMYqdw',
        title: 'Luan Santana - Tudo O Que Você Quiser',
        artist: 'Luan Santana',
        duration: '4:10',
        thumbnail: 'https://img.youtube.com/vi/-YzDsDMYqdw/mqdefault.jpg',
        category: 'sertanejo',
    },
    {
        id: 'MxwZ66L9RQI',
        title: 'Luan Santana - Sinais',
        artist: 'Luan Santana',
        duration: '3:45',
        thumbnail: 'https://img.youtube.com/vi/MxwZ66L9RQI/mqdefault.jpg',
        category: 'sertanejo',
    },
    {
        id: 'BkpqU3gdjlw',
        title: 'Matheus & Kauan - Que Sorte A Nossa',
        artist: 'Matheus & Kauan',
        duration: '3:13',
        thumbnail: 'https://img.youtube.com/vi/BkpqU3gdjlw/mqdefault.jpg',
        category: 'sertanejo',
    },
    {
        id: 'ICS6uKC93w0',
        title: 'Jorge e Mateus - Os Anjos Cantam',
        artist: 'Jorge e Mateus',
        duration: '4:22',
        thumbnail: 'https://img.youtube.com/vi/ICS6uKC93w0/mqdefault.jpg',
        category: 'sertanejo',
    },
    {
        id: 'rTsbSY04s1Y',
        title: 'Luan Santana - Chuva de Arroz',
        artist: 'Luan Santana',
        duration: '3:58',
        thumbnail: 'https://img.youtube.com/vi/rTsbSY04s1Y/mqdefault.jpg',
        category: 'sertanejo',
    },
    {
        id: 'lmFm_ByIgE0',
        title: 'Zé Neto e Cristiano - Te Amo',
        artist: 'Zé Neto e Cristiano',
        duration: '3:29',
        thumbnail: 'https://img.youtube.com/vi/lmFm_ByIgE0/mqdefault.jpg',
        category: 'sertanejo',
    },
    {
        id: 'kbCtpDwVCLQ',
        title: 'Matheus & Kauan - O Nosso Santo Bateu',
        artist: 'Matheus & Kauan',
        duration: '3:45',
        thumbnail: 'https://img.youtube.com/vi/kbCtpDwVCLQ/mqdefault.jpg',
        category: 'sertanejo',
    },
    {
        id: 'Ack_3EAZLlE',
        title: 'Marcos & Belutti - Romântico Anônimo',
        artist: 'Marcos & Belutti',
        duration: '3:52',
        thumbnail: 'https://img.youtube.com/vi/Ack_3EAZLlE/mqdefault.jpg',
        category: 'sertanejo',
    },
    // Internacional
    {
        id: 'i9UDD6zyCGs',
        title: 'New West - Those Eyes (Home Session)',
        artist: 'New West',
        duration: '3:40',
        thumbnail: 'https://img.youtube.com/vi/i9UDD6zyCGs/mqdefault.jpg',
        category: 'internacional',
    },
    {
        id: 'cNGjD0VG4R8',
        title: 'Ed Sheeran - Perfect',
        artist: 'Ed Sheeran',
        duration: '4:23',
        thumbnail: 'https://img.youtube.com/vi/cNGjD0VG4R8/mqdefault.jpg',
        category: 'internacional',
    },
    {
        id: 'WjB16KMQMh4',
        title: 'Shawn Mendes - Never Be Alone',
        artist: 'Shawn Mendes',
        duration: '3:36',
        thumbnail: 'https://img.youtube.com/vi/WjB16KMQMh4/mqdefault.jpg',
        category: 'internacional',
    },
    {
        id: 'Oa5Wt7Jd13g',
        title: 'Shawn Mendes - Mercy',
        artist: 'Shawn Mendes',
        duration: '3:50',
        thumbnail: 'https://img.youtube.com/vi/Oa5Wt7Jd13g/mqdefault.jpg',
        category: 'internacional',
    },
];

/**
 * Componente de seleção de música para o Admin
 */
export function YouTubeMusicSelector({ value, onChange, isPremium }) {
    const [customUrl, setCustomUrl] = useState('');
    const [selectedId, setSelectedId] = useState(value);
    const [showAll, setShowAll] = useState(false);

    const handleSelectSuggestion = (music) => {
        setSelectedId(music.id);
        onChange?.(music.id);
    };

    const handleApplyCustom = () => {
        if (!customUrl.trim()) return;

        // Extrair ID do YouTube
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /^([a-zA-Z0-9_-]{11})$/,
        ];

        for (const pattern of patterns) {
            const match = customUrl.match(pattern);
            if (match) {
                setSelectedId(match[1]);
                onChange?.(match[1]);
                setCustomUrl('');
                return;
            }
        }

        alert('Link inválido. Por favor, insira um link válido do YouTube.');
    };

    const displayedSuggestions = showAll ? MUSIC_SUGGESTIONS : MUSIC_SUGGESTIONS.slice(0, 5);

    if (!isPremium) {
        return (
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30 text-center">
                <span className="text-2xl mb-2 block">🎵</span>
                <p className="text-gray-300 font-medium mb-1">Recurso Premium</p>
                <p className="text-gray-500 text-sm">Faça upgrade para o plano PRO para adicionar música de fundo!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header com badge NOVO */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2">
                    <span
                        style={{
                            fontFamily: "'Dancing Script', cursive",
                            fontSize: '1.75rem',
                            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Música
                    </span>
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #e50914, #b20710)',
                            color: '#fff',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        Novo
                    </span>
                </div>
            </div>

            {/* Sugestões de músicas */}
            <div>
                <p className="text-sm text-gray-400 mb-3">Sugestões de música</p>
                <div className="space-y-2">
                    {displayedSuggestions.map((music) => (
                        <div
                            key={music.id}
                            onClick={() => handleSelectSuggestion(music)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${selectedId === music.id
                                ? 'bg-white/10 border border-red-500/50'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {/* Thumbnail */}
                            <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                                <img
                                    src={music.thumbnail}
                                    alt={music.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <span className="text-white text-lg">▶</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium truncate">{music.title}</p>
                                <p className="text-xs text-gray-500">{music.duration}</p>
                            </div>

                            {/* Check */}
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedId === music.id
                                    ? 'bg-red-600'
                                    : 'bg-white/10'
                                    }`}
                            >
                                {selectedId === music.id && (
                                    <span className="text-white text-xs">✓</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {!showAll && MUSIC_SUGGESTIONS.length > 5 && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Ver mais sugestões ({MUSIC_SUGGESTIONS.length - 5}+)
                    </button>
                )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500">ou cole seu link aqui</span>
                <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Custom URL input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="Link do YouTube"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-500/50"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyCustom();
                    }}
                />
                <button
                    onClick={handleApplyCustom}
                    disabled={!customUrl.trim()}
                    className="px-5 py-3 bg-red-600/80 hover:bg-red-600 disabled:bg-white/10 disabled:text-gray-500 text-white font-medium rounded-lg transition-all text-sm"
                >
                    Aplicar
                </button>
            </div>
            <p className="text-xs text-gray-600 text-center">
                Insira aqui o link da música no youtube.
            </p>

            {/* Selected music preview */}
            {selectedId && (
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                        <span>✓</span>
                        <span>Música selecionada!</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        ID: {selectedId}
                    </p>
                    <button
                        onClick={() => {
                            setSelectedId('');
                            onChange?.('');
                        }}
                        className="mt-2 text-xs text-red-400 hover:text-red-300"
                    >
                        Remover música
                    </button>
                </div>
            )}
        </div>
    );
}

export default YouTubeBackgroundMusic;
