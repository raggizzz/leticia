import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import EpisodeCard from './components/EpisodeCard';
import Modal from './components/Modal';
import NetflixIntro from './components/NetflixIntro';
import WelcomeSplash from './components/WelcomeSplash';
import Watermark from './components/Watermark';
import EditableWrapper from './components/EditableWrapper';
// Novos componentes Tempo Juntos style
import FloatingHearts from './components/FloatingHearts';
import RelationshipTimer from './components/RelationshipTimer';
import WeddingAnniversaryTimeline from './components/WeddingAnniversaryTimeline';
import ShareableStoryCard from './components/ShareableStoryCard';
import YouTubeBackgroundMusic from './components/YouTubeBackgroundMusic';
import { useSiteConfig, useSiteHead } from './hooks';
import {
  trackEpisodeViewed,
  trackModalOpened,
  trackLetterRead,
  trackMusicToggled,
  trackEasterEggFound,
  trackWhatsAppClicked,
} from './lib/analytics';

// Importar configuração padrão (fallback)
import {
  paragraphsToHtml,
  renderDifficultEpisodeContent,
  getWhatsAppLink,
} from './config';

// ==================== APP COMPONENT ====================

export default function App({
  siteData = null,
  isPremium = false,
  showIntro = true,
  isPreview = false,
  editMode = false,
  selectedSection = null,
  onSectionClick = null,
}) {
  const { config, loading } = useSiteConfig(siteData);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '', gradient: '', image: null });
  const [mainLetterOpen, setMainLetterOpen] = useState(false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  // Skip intro in preview mode
  const [introComplete, setIntroComplete] = useState(!showIntro || isPreview);
  // Welcome splash - only for non-preview, non-edit mode
  const [splashComplete, setSplashComplete] = useState(isPreview || editMode);

  // Dynamic SEO meta tags
  useSiteHead(siteData);

  // Verificar se é plano pago baseado no siteData
  const hasPremiumFeatures = isPremium || siteData?.is_premium || false;

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-pulse mb-4">❤️</div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Extrair dados da configuração
  const {
    coupleInfo,
    heroContent,
    themeConfig,
    mainLetter,
    bestMoments,
    difficultEpisodes,
    behindTheScenes,
    promises,
    credits,
    easterEgg,
    backgroundMusic,
    enabledSections,
  } = config;

  const openModal = (title, content, gradient = 'from-red-600 via-pink-600 to-purple-600', image = null, youtubeId = null) => {
    setModalContent({ title, content, gradient, image, youtubeId });
    setModalOpen(true);
    // Track modal opened
    if (siteData?.id) {
      trackModalOpened(siteData.id, title);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Função para abrir modal de episódio comum (melhores momentos, promessas, bastidores)
  const openEpisodeModal = (episode) => {
    const content = paragraphsToHtml(episode.paragraphs);
    openModal(episode.title, content, episode.gradient, episode.image, episode.youtubeId);
    // Track episode viewed
    if (siteData?.id) {
      trackEpisodeViewed(siteData.id, episode.id, episode.title);
    }
  };

  // Função para abrir modal de episódio difícil
  const openDifficultEpisodeModal = (episode) => {
    const content = renderDifficultEpisodeContent(episode);
    openModal(episode.title, content, episode.gradient, episode.image, episode.youtubeId);
  };

  // Gerar conteúdo da carta principal
  const mainLetterContent = `
    <div class="space-y-5 sm:space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed">
      ${mainLetter.paragraphs.map(p => `<p>${p}</p>`).join('')}
      <p class="text-xl sm:text-2xl font-semibold text-white text-center pt-4">
        ${mainLetter.closing}
      </p>
    </div>
  `;

  // Determinar título para intro
  const introTitle = heroContent?.title || 'NOSSOFLIX';

  // Mostrar Welcome Splash primeiro (antes da intro)
  if (!splashComplete && !isPreview && !editMode) {
    return (
      <WelcomeSplash
        creatorName={coupleInfo?.creator?.name || 'Alguém especial'}
        partnerName={coupleInfo?.partner?.name || ''}
        onAccept={() => {
          // Quando aceita, ativa o som e passa para próxima tela
          setSoundEnabled(true);
          setSplashComplete(true);
        }}
        onDecline={() => {
          // Se recusar, pula direto pro site sem som
          setSplashComplete(true);
          setIntroComplete(true);
        }}
      />
    );
  }

  // Mostrar intro se habilitado (depois do splash)
  if (!introComplete && showIntro && hasPremiumFeatures && enabledSections?.backgroundMusic && splashComplete) {
    return (
      <NetflixIntro
        coupleName={introTitle}
        onComplete={() => setIntroComplete(true)}
        enabled={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Floating Hearts - Global romantic overlay */}
      {enabledSections?.floatingHearts !== false && !editMode && (
        <FloatingHearts count={15} variant="default" enabled={true} />
      )}

      {/* YouTube Background Music - plays after splash interaction */}
      {enabledSections?.backgroundMusic !== false && splashComplete && config?.backgroundMusic?.youtubeId && !editMode && (
        <YouTubeBackgroundMusic
          videoId={config.backgroundMusic.youtubeId}
          enabled={true}
          loop={config.backgroundMusic?.loop !== false}
        />
      )}

      {/* Hide Navbar in edit mode to avoid overlap with editor header */}
      {!editMode && (
        <Navbar onEasterEgg={() => setEasterEggOpen(true)} coupleInfo={coupleInfo} heroContent={heroContent} />
      )}

      <EditableWrapper
        sectionId="hero"
        sectionName="Hero"
        editMode={editMode}
        isSelected={selectedSection === 'hero'}
        onEdit={onSectionClick}
      >
        <Hero
          onWatchNow={() => setMainLetterOpen(true)}
          onDetails={() => scrollToSection('episodios-dificeis')}
          config={heroContent}
          coupleInfo={coupleInfo}
          themeConfig={themeConfig}
        />
      </EditableWrapper>

      {/* Melhores Momentos */}
      {enabledSections?.bestMoments && (
        <EditableWrapper
          sectionId="bestMoments"
          sectionName="Melhores Momentos"
          editMode={editMode}
          isSelected={selectedSection === 'bestMoments'}
          onEdit={onSectionClick}
        >
          <Carousel
            title="Melhores Momentos"
            subtitle="As cenas que eu nunca quero esquecer"
          >
            {bestMoments?.map((ep) => (
              <EpisodeCard
                key={ep.id}
                {...ep}
                onClick={() => openEpisodeModal(ep)}
              />
            ))}
          </Carousel>
        </EditableWrapper>
      )}

      {/* Episódios Difíceis */}
      {enabledSections?.difficultEpisodes && (
        <EditableWrapper
          sectionId="difficultEpisodes"
          sectionName="Episódios Difíceis"
          editMode={editMode}
          isSelected={selectedSection === 'difficultEpisodes'}
          onEdit={onSectionClick}
        >
          <div id="episodios-dificeis">
            <Carousel
              title="Episódios Difíceis (mas importantes)"
              subtitle="As cenas que doeram, mas geraram aprendizado"
            >
              {difficultEpisodes?.map((ep) => (
                <EpisodeCard
                  key={ep.id}
                  {...ep}
                  onClick={() => openDifficultEpisodeModal(ep)}
                />
              ))}
            </Carousel>
          </div>
        </EditableWrapper>
      )}

      {/* Bastidores */}
      {enabledSections?.behindTheScenes && (
        <EditableWrapper
          sectionId="behindTheScenes"
          sectionName="Bastidores"
          editMode={editMode}
          isSelected={selectedSection === 'behindTheScenes'}
          onEdit={onSectionClick}
        >
          <section id="bastidores" className="py-12 sm:py-20">
            <div className="container-custom">
              <h2 className="section-title mb-2">Bastidores</h2>
              <p className="text-gray-500 text-sm sm:text-base mb-8 sm:mb-12">
                O que eu sinto de verdade (e talvez nunca tenha conseguido dizer)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center">
                {behindTheScenes?.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => openEpisodeModal(item)}
                    className={`group relative p-6 sm:p-8 rounded-2xl ${!item.image ? `bg-gradient-to-br ${item.gradient}` : 'bg-cover bg-center'
                      } cursor-pointer transform hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      ...(item.image ? { backgroundImage: `url(${item.image})` } : {})
                    }}
                  >
                    {/* Image Overlay */}
                    {item.image && <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/40"></div>}

                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white blur-2xl"></div>
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10">
                      <div className="text-4xl sm:text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/70 text-sm sm:text-base mb-4">{item.subtitle}</p>
                      <div className="flex items-center justify-center text-white/50 text-sm group-hover:text-white/80 transition-colors">
                        <span>Ler mais</span>
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </EditableWrapper>
      )}

      {/* Próxima Temporada */}
      {enabledSections?.promises && (
        <EditableWrapper
          sectionId="promises"
          sectionName="Próxima Temporada"
          editMode={editMode}
          isSelected={selectedSection === 'promises'}
          onEdit={onSectionClick}
        >
          <div id="proxima-temporada">
            <Carousel
              title="Próxima Temporada"
              subtitle="Se depender de mim, a continuação é assim"
            >
              {promises?.map((ep) => (
                <EpisodeCard
                  key={ep.id}
                  episodeNumber={`Promessa ${ep.id}`}
                  title={ep.title}
                  description={ep.description}
                  gradient={ep.gradient}
                  image={ep.image}
                  duration={ep.duration}
                  onClick={() => openEpisodeModal(ep)}
                />
              ))}
            </Carousel>
          </div>
        </EditableWrapper>
      )}

      {/* Tempo Juntos - Contador de Tempo */}
      {enabledSections?.timeCounter !== false && (
        <EditableWrapper
          sectionId="timeCounter"
          sectionName="Tempo Juntos"
          editMode={editMode}
          isSelected={selectedSection === 'timeCounter'}
          onEdit={onSectionClick}
        >
          <RelationshipTimer
            startDate={coupleInfo?.relationship?.startDate}
            creatorName={coupleInfo?.creator?.name}
            partnerName={coupleInfo?.partner?.name}
            showEmotionalStats={true}
          />
        </EditableWrapper>
      )}

      {/* Timeline de Bodas */}
      {enabledSections?.weddingTimeline !== false && (
        <EditableWrapper
          sectionId="weddingTimeline"
          sectionName="Bodas"
          editMode={editMode}
          isSelected={selectedSection === 'weddingTimeline'}
          onEdit={onSectionClick}
        >
          <WeddingAnniversaryTimeline
            startDate={coupleInfo?.relationship?.startDate}
            maxItems={12}
          />
        </EditableWrapper>
      )}

      {/* Card Compartilhável para Stories */}
      {enabledSections?.shareableCard !== false && (
        <EditableWrapper
          sectionId="shareableCard"
          sectionName="Compartilhar"
          editMode={editMode}
          isSelected={selectedSection === 'shareableCard'}
          onEdit={onSectionClick}
        >
          <ShareableStoryCard
            creatorName={coupleInfo?.creator?.name}
            partnerName={coupleInfo?.partner?.name}
            startDate={coupleInfo?.relationship?.startDate}
            backgroundImage={themeConfig?.heroBackground}
            siteUrl={siteData?.slug ? `nossoflix.com/${siteData.slug}` : 'nossoflix.com'}
          />
        </EditableWrapper>
      )}

      {/* Créditos Finais */}
      {enabledSections?.credits && credits && (
        <EditableWrapper
          sectionId="credits"
          sectionName="Créditos Finais"
          editMode={editMode}
          isSelected={selectedSection === 'credits'}
          onEdit={onSectionClick}
        >
          <section id="creditos" className="py-20 sm:py-32 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 via-transparent to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/5 blur-3xl"></div>
            </div>

            <div className="container-custom relative">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-wider gradient-text mb-12 sm:mb-16">
                  {credits.title}
                </h2>

                {/* Credits List */}
                <div className="space-y-1 mb-16">
                  {credits.roles?.map((role, index) => (
                    <div key={index} className="credits-item">
                      <span className="credits-role">{role.role}</span>
                      <h3 className={`credits-name ${role.highlight ? 'gradient-text' : ''} ${index > 1 ? 'text-base sm:text-lg' : ''}`}>
                        {role.name}
                      </h3>
                    </div>
                  ))}
                </div>

                {/* Final Message */}
                <div className="glass-card p-6 sm:p-10 rounded-2xl text-left space-y-5 sm:space-y-6 mb-10">
                  {credits.finalMessage?.paragraphs?.map((p, index) => (
                    <p key={index} className="text-gray-300 text-base sm:text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: p }} />
                  ))}
                  <p className="text-xl sm:text-2xl font-semibold text-white text-center pt-4">
                    {credits.finalMessage?.closing}
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    if (siteData?.id) {
                      trackWhatsAppClicked(siteData.id);
                    }
                    window.open(getWhatsAppLink(coupleInfo.contact), '_blank');
                  }}
                  className="btn-netflix text-base sm:text-lg"
                >
                  <span>{credits.ctaButton?.icon}</span>
                  {credits.ctaButton?.text}
                </button>

                {/* Mini-CTA NossoFlix */}
                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                  <p className="text-gray-600 text-sm mb-4">
                    💕 Se emocionou com essa história?
                  </p>
                  <a
                    href="https://nossoflix.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/30 transition-all duration-300 group"
                  >
                    <img
                      src="/logo-nossoflix.png"
                      alt="NossoFlix"
                      className="w-6 h-6 rounded"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      Quer fazer um <span className="text-pink-400 font-semibold">NOSSOFLIX</span> pro seu amor? Crie o seu →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </EditableWrapper>
      )}

      {/* Footer */}
      <footer className="py-8 sm:py-10 border-t border-white/5 text-center">
        <p className="text-gray-600 text-xs sm:text-sm">
          {credits?.footer?.copyright}
        </p>
        <p className="text-gray-700 text-xs mt-2">
          {credits?.footer?.signature}
        </p>
      </footer>

      {/* Watermark para plano gratuito */}
      {!hasPremiumFeatures && <Watermark />}

      {/* ==================== MODALS ==================== */}

      {/* Main Letter Modal */}
      <Modal
        isOpen={mainLetterOpen}
        onClose={() => setMainLetterOpen(false)}
        title={mainLetter.title}
        gradient={mainLetter.gradient}
      >
        <div dangerouslySetInnerHTML={{ __html: mainLetterContent }} />
      </Modal>

      {/* Episode/Bastidores/Promessas Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        gradient={modalContent.gradient}
        image={modalContent.image}
        youtubeId={modalContent.youtubeId}
      >
        <div dangerouslySetInnerHTML={{ __html: modalContent.content }} />
      </Modal>

      {/* Easter Egg Modal */}
      {enabledSections?.easterEgg && easterEgg && (
        <Modal
          isOpen={easterEggOpen}
          onClose={() => setEasterEggOpen(false)}
          title=""
          gradient={easterEgg.gradient}
        >
          <div className="text-center space-y-6 py-4">
            <div className="text-6xl sm:text-7xl animate-heartbeat">{easterEgg.icon}</div>
            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
              {easterEgg.message}
            </p>
            <p className="text-2xl sm:text-3xl font-bold gradient-text leading-tight">
              {easterEgg.mainText}
            </p>
            <p className="text-gray-400 text-base sm:text-lg">
              {easterEgg.subText}
            </p>
            <p className="text-gray-500">{easterEgg.closing}</p>
          </div>
        </Modal>
      )}

      {/* Background Music - HTML5 Audio (preferred) or YouTube fallback */}
      {console.log('[Music Debug]', {
        hasPremiumFeatures,
        backgroundMusicEnabled: enabledSections?.backgroundMusic,
        soundEnabled,
        modalOpen,
        audioUrl: backgroundMusic?.audioUrl,
        youtubeId: backgroundMusic?.youtubeId,
        backgroundMusic
      })}
      {enabledSections?.backgroundMusic && soundEnabled && !modalOpen && (
        <>
          {/* Se tem audioUrl (arquivo), usar HTML5 audio */}
          {backgroundMusic?.audioUrl && (
            <audio
              src={backgroundMusic.audioUrl}
              autoPlay
              loop={backgroundMusic?.loop !== false}
              style={{ display: 'none' }}
            />
          )}

          {/* Fallback: YouTube iframe (se não tem audioUrl mas tem youtubeId) */}
          {!backgroundMusic?.audioUrl && backgroundMusic?.youtubeId && (
            <div className="fixed bottom-0 right-0 w-1 h-1 opacity-0 overflow-hidden pointer-events-none">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${backgroundMusic.youtubeId}?autoplay=1&loop=1&playlist=${backgroundMusic.youtubeId}&controls=0&showinfo=0`}
                title="Home Audio"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
