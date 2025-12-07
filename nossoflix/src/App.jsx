import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import EpisodeCard from './components/EpisodeCard';
import Modal from './components/Modal';

// ==================== DATA ====================

const melhoresMomentos = [
  {
    id: 1,
    episodeNumber: 'Ep. 1',
    title: 'A paz no caos do Moto Week',
    description: 'Quando você dormiu voltando pra casa e eu entendi tudo.',
    image: '/motoweek.png',
    duration: '~2 min',
    isTop: true,
    youtubeId: 'UuFuVqQqJT4',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Lembra quando voltamos do Moto Week? Todo aquele barulho, aquela agitação da festa... e no meio de tudo isso, voltando para casa, você dormiu.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Ali, vendo você descansar segura comigo, eu entendi algo gigante: eu quero ser isso pra você sempre.
        Eu quero ser o seu descanso, a sua segurança, o lugar pra onde você volta quando o mundo tá barulhento demais.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        Você dormindo tranquila do meu lado foi a melhor parte do meu dia. ❤️
      </p>
    `
  },
  {
    id: 2,
    episodeNumber: 'Ep. 2',
    title: 'O nosso test-drive',
    description: 'Uma semana direto na sua casa (e eu não queria ir embora).',
    image: '/casa1.png',
    duration: '~2 min',
    youtubeId: 'UuFuVqQqJT4',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Aquela semana que fiquei direto na sua casa... não foi só "ficar junto" por conveniência. 
        Foi um spoiler da vida que eu quero ter com você.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Acordar com você, te ver na rotina, rir das nossas manias, dividir o espaço. 
        Foi ali que minha casa deixou de ser um endereço e passou a ser uma pessoa: você.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        Por mim, aquela semana duraria pra sempre. 🏠
      </p>
    `
  },
  {
    id: 3,
    episodeNumber: 'Ep. 3',
    title: 'Nossa sintonia em Brasília',
    description: 'Show do Nattanzinho: a gente na mesma frequência.',
    image: '/nattanzinho.png',
    duration: '~2 min',
    youtubeId: 'UuFuVqQqJT4',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Esse dia no show do Nattanzinho... ver você feliz, cantando, curtindo, me preenche de um jeito que eu não sei explicar.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Ali não era só sobre a música ou a festa. Era sobre a gente estar conectado, na mesma vibe.
        Eu olhava pra você e pensava: <span class="text-white font-medium">"é com ela que eu quero viver todas as festas e todos os silêncios"</span>.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        Obrigado por ser minha melhor companhia, em qualquer lugar. 🎉
      </p>
    `
  },
  {
    id: 4,
    episodeNumber: 'Ep. 4',
    title: 'A foto da discórdia (que virou amor)',
    description: 'Matheus e Kauan e a famosa capinha.',
    image: '/matheus.png',
    duration: '~2 min',
    youtubeId: 'UuFuVqQqJT4',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        O dia da famosa foto da capinha! Sei que o contexto desse dia ("foto da capinha") teve seus momentos tensos que eu causei,
        mas olhando pra essa foto nossa no show do Matheus e Kauan, eu só vejo o quanto a gente é real.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        A gente tem nossos momentos difíceis, a gente se estranha, mas a gente se ajeita. 
        Sua insistência em querer estar perto (até na capinha) é o que me fez acordar.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        Eu não trocaria nosso "caos" pela "paz" de ninguém. 💞
      </p>
    `
  },
  {
    id: 5,
    episodeNumber: 'Ep. 5',
    title: 'A prova do crime (e do amor)',
    description: 'Você me pegou dormindo... e eu amei.',
    image: '/dormindo.png',
    duration: '~2 min',
    youtubeId: 'UuFuVqQqJT4',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Você tirou essa foto quando eu tava completamente apagado do seu lado... e com esse filtro maravilhoso! 😂
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Mas sabe de uma coisa? Eu amo essa foto. Porque mostra a gente sem filtro (metaforicamente falando), sem pose. 
        Mostra a intimidade e a confiança de poder dormir tranquilo ao lado de quem a gente ama.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        E mostra que você me ama até quando eu tô babando (eu espero). Te amo, minha fotógrafa favorita. 📸
      </p>
    `
  },
];

const episodiosDificeis = [
  {
    id: 1,
    episodeNumber: 'Cap. 1',
    title: 'A piada que não teve graça',
    description: 'Quando minhas "brincadeiras" passaram do ponto.',
    image: '/piada_autista.jpg',
    duration: '~4 min',
    content: `
      <div class="space-y-8">
        <div class="p-4 sm:p-5 rounded-xl bg-red-500/10 border border-red-500/20">
          <h4 class="text-red-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-red-400 rounded-full"></span>
            O que aconteceu
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Eu fiz uma piada achando que era engraçado, mas não era. Pro meu senso de humor 
            poderia até parecer leve, mas pra você foi uma pequena humilhação. E o pior: 
            eu não percebi na hora.
          </p>
        </div>
        <div class="p-4 sm:p-5 rounded-xl bg-pink-500/10 border border-pink-500/20">
          <h4 class="text-pink-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-pink-400 rounded-full"></span>
            O que isso significou pra você
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Eu te respondi de uma forma onde você não se sentiu respeitada. Não teve nada a ver com ciúme, 
            mas com a falta de cuidado na minha resposta. Eu não levei a sério o que você sentiu e isso foi um erro.
          </p>
        </div>
        <div class="p-4 sm:p-5 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <h4 class="text-purple-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
            O que eu aprendi
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Aprendi que "é só uma piada" nunca é desculpa quando você machucou alguém. 
            Não importa a intenção – o que importa é o impacto. Quero aprender a medir 
            melhor as palavras, especialmente com você.
          </p>
        </div>
        <div class="mt-6 flex justify-center">
             <img src="/piada_autista.jpg" class="rounded-lg shadow-lg max-w-full h-auto max-h-[300px] border border-white/10" alt="Meme Autista" />
        </div>
      </div>
    `
  },
  {
    id: 2,
    episodeNumber: 'Cap. 2',
    title: 'A foto da capinha',
    description: 'Quando algo pequeno significou muito mais.',
    image: '/capinha_7kbet.jpg',
    duration: '~4 min',
    content: `
      <div class="space-y-8">
        <div class="p-4 sm:p-5 rounded-xl bg-red-500/10 border border-red-500/20">
          <h4 class="text-red-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-red-400 rounded-full"></span>
            O que aconteceu
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Aquela situação da foto da capinha... Eu não dei a devida importância. 
            Tratei como algo irrelevante quando pra você era um sinal de cuidado, 
            de querer estar presente de um jeito especial.
          </p>
        </div>
        <div class="p-4 sm:p-5 rounded-xl bg-pink-500/10 border border-pink-500/20">
          <h4 class="text-pink-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-pink-400 rounded-full"></span>
            O que isso significou pra você
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Você deve ter se sentido rejeitada. Como se suas demonstrações de carinho 
            não fossem boas o suficiente. Como se eu não valorizasse os gestos que você 
            faz por nós. E isso é horrível de sentir.
          </p>
        </div>
        <div class="p-4 sm:p-5 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <h4 class="text-purple-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
            O que eu aprendi
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Entendi que cada gesto seu carrega amor. Não importa se parece "simples" 
            pra mim – se vem de você, é importante. Preciso valorizar cada forma que 
            você encontra de mostrar que me ama.
          </p>
        </div>
        <div class="mt-6 flex justify-center">
             <img src="/capinha_7kbet.jpg" class="rounded-lg shadow-lg max-w-full h-auto max-h-[300px] border border-white/10" alt="Foto Capinha" />
        </div>
      </div>
    `
  },
  {
    id: 3,
    episodeNumber: 'Cap. 3',
    title: 'O foguinho do TikTok',
    description: 'Minha reação foi de criança quando você pediu atenção.',
    image: '/tiktok_foguinho.jpg',
    duration: '~4 min',
    content: `
      <div class="space-y-8">
        <div class="p-4 sm:p-5 rounded-xl bg-red-500/10 border border-red-500/20">
          <h4 class="text-red-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-red-400 rounded-full"></span>
            O que aconteceu
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Você me disse que pararia de mandar vídeos porque eu nunca respondia. 
            E ao invés de entender sua frustração, eu respondi seco: "Apaga aí então". 
            Eu transformei um pedido seu de atenção em uma briga de ego.
          </p>
        </div>
        <div class="p-4 sm:p-5 rounded-xl bg-pink-500/10 border border-pink-500/20">
          <h4 class="text-pink-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-pink-400 rounded-full"></span>
            O que isso significou pra você
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Você apenas sentiu que eu não fazia questão 
            de receber coisas suas. Minha resposta fez parecer que tanto fazia pra mim, 
            e isso não é verdade.
          </p>
        </div>
        <div class="p-4 sm:p-5 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <h4 class="text-purple-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
            O que eu aprendi
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Que quando você reclama, é porque quer conexão, não briga. Eu deveria ter dito 
            "Desculpa, vou responder mais", e não agido com descaso. Atenção se dá, não se nega.
          </p>
        </div>
        <div class="mt-6 flex justify-center">
             <img src="/tiktok_foguinho.jpg" class="rounded-lg shadow-lg max-w-full h-auto max-h-[300px] border border-white/10" alt="TikTok Foguinho" />
        </div>
      </div>
    `
  },
  {
    id: 4,
    episodeNumber: 'Cap. 4',
    title: 'O grupo (que você JÁ pertence)',
    description: 'Você acha que não, mas você é parte fundamental.',
    image: '/grupo_peixonautas.jpg',
    duration: '~4 min',
    content: `
      <div class="space-y-8">
        <div class="p-4 sm:p-5 rounded-xl bg-red-500/10 border border-red-500/20">
          <h4 class="text-red-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-red-400 rounded-full"></span>
            O que acontece
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Muitas vezes você diz que não faz parte do grupo, que se sente intrusa. 
            Mas amor, isso não é verdade. A gente inclui você, brinca junto, e todo mundo ali gosta da sua presença.
          </p>
        </div>
        <div class="p-4 sm:p-5 rounded-xl bg-pink-500/10 border border-pink-500/20">
          <h4 class="text-pink-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-pink-400 rounded-full"></span>
            A verdade
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Você faz parte sim. Só que as vezes você não acha que faz. 
            O grupo não seria o mesmo sem você lá. Você é nossa amiga, não apenas minha namorada.
          </p>
        </div>
        <div class="p-4 sm:p-5 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <h4 class="text-purple-400 font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
            O que eu aprendi
          </h4>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
            Que eu preciso te reforçar isso até você acreditar. Que seu lugar é garantido e que 
            você é querida por todos nós. Não vou deixar essa insegurança (que é só coisa da cabeça!) te afastar.
          </p>
        </div>
        <div class="mt-6 flex justify-center">
             <img src="/grupo_peixonautas.jpg" class="rounded-lg shadow-lg max-w-full h-auto max-h-[300px] border border-white/10" alt="Grupo" />
        </div>
      </div>
    `
  },
];

const bastidores = [
  {
    id: 1,
    title: 'Você nunca foi a chata',
    subtitle: 'A verdade que preciso que você entenda',
    icon: '❤️',
    gradient: 'from-rose-600 to-red-700',
    image: '/motoweek.png',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Letícia, eu preciso que você grave isso: <span class="text-white font-semibold">você nunca foi a chata. Nunca.</span>
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Todas as vezes que você pediu respeito, atenção, limites... você só estava 
        fazendo o que qualquer pessoa que se ama deveria fazer: exigir ser tratada bem.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Eu que demorei pra entender. Eu que confundi paciência com permissão pra 
        continuar errando. Mas isso não faz de você a difícil da relação.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        Faz de você a mais corajosa – por continuar exigindo o melhor mesmo quando 
        eu teimava em não entregar. 💪
      </p>
    `
  },
  {
    id: 2,
    title: 'Quando você fica quieta',
    subtitle: 'O que passa na minha cabeça',
    icon: '💭',
    gradient: 'from-purple-600 to-pink-700',
    image: '/dormindo.png',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Quando você fica quieta, eu entro em parafuso. Fico tentando adivinhar 
        o que eu fiz, o que eu falei, o que passou despercebido.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        E agora eu entendo por que você fica quieta às vezes. Não é frescura. 
        É cansaço. Cansaço de ter que repetir as mesmas coisas, de sentir que 
        suas palavras não têm peso.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        Eu quero aprender a ouvir antes de você precisar se calar. Quero que 
        suas palavras pesem tanto pra mim quanto pesam pra você. 🤫
      </p>
    `
  },
  {
    id: 3,
    title: 'Eu já comecei a mudar',
    subtitle: 'E não quero parar',
    icon: '🌱',
    gradient: 'from-emerald-600 to-teal-700',
    image: '/season2.png',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Eu sei que falar é fácil. Que promessa de mudança já perdeu o peso 
        depois de tantas vezes. Mas eu preciso que você saiba: <span class="text-white font-semibold">eu estou tentando.</span>
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Cada vez que eu seguro uma piada, que eu paro pra pensar antes de responder, 
        que eu escolho ouvir antes de me defender... é uma pequena vitória contra 
        o cara que eu era antes.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        Demorei? Demais. Mas eu tô aqui, disposto a ser a pessoa que você merece. 
        Não perfeito – mas melhor. Todo dia um pouco melhor. 📈
      </p>
    `
  },
];

const promessas = [
  {
    id: 1,
    title: 'Menos fala, mais escuta',
    description: 'Ouvir até o fim antes de responder.',
    icon: '👂',
    gradient: 'from-green-500 via-emerald-600 to-teal-600',
    image: '/season2.png',
    duration: '~2 min',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Minha boca às vezes é mais rápida que meu cérebro. Eu respondo antes 
        de processar, defendo antes de entender, e isso te machuca.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        <span class="text-white font-semibold">Minha promessa:</span> vou aprender a escutar até a última palavra. Sem interromper, 
        sem já formular resposta antes de você terminar.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        Porque você merece ser ouvida. De verdade. 💯
      </p>
    `
  },
  {
    id: 2,
    title: 'Me avise sempre',
    description: 'Se eu errar, me dê o toque.',
    icon: '🎯',
    gradient: 'from-teal-500 via-cyan-600 to-blue-600',
    image: '/season2.png',
    duration: '~2 min',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        As vezes eu solto piadas e não noto que machucou. Não é por mal, 
        mas eu sei que chateia.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        <span class="text-white font-semibold">Minha promessa:</span> por favor, me alerte a cada piada que você não gostar. 
        Se você não falar, eu vou demorar a perceber. Mas se você falar, eu prometo parar na hora e não retrucar.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        Eu preciso dessa ajuda sua pra ser melhor. ✋
      </p>
    `
  },
  {
    id: 3,
    title: 'Te amar pra sempre',
    description: 'Minha única certeza.',
    icon: '❤️',
    gradient: 'from-blue-500 via-indigo-600 to-purple-600',
    image: '/season2.png',
    duration: '~2 min',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        No meio de tantos erros e acertos, existe uma coisa que nunca mudou e nunca vai mudar: o quanto eu sou louco por você.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        <span class="text-white font-semibold">Minha promessa:</span> eu te amo muito e prometo te amar pelo resto da vida. 
        Não importa o que aconteça, meu amor por você é a base de tudo.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        Pra sempre. 👫
      </p>
    `
  },
  {
    id: 4,
    title: 'Você nunca é repetitiva',
    description: 'Sua voz importa, sempre.',
    icon: '🗣️',
    gradient: 'from-purple-500 via-pink-600 to-rose-600',
    image: '/season2.png',
    duration: '~2 min',
    content: `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        Se você precisa falar a mesma coisa várias vezes, é porque eu não estou ouvindo direito. O erro é meu, não seu.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        <span class="text-white font-semibold">Minha promessa:</span> eu prometo nunca achar que você é repetitiva. 
        Prometo ouvir com atenção cada palavra, até entender de verdade o que você sente.
      </p>
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
        Pode falar. Eu quero ouvir. 👂
      </p>
    `
  },
];

// ==================== APP COMPONENT ====================

// Add Youtube IDs
episodiosDificeis.forEach(ep => ep.youtubeId = '6EGg0_l-edc');
bastidores.forEach(i => i.youtubeId = 'Wsl2PJZvphs');
promessas.forEach(p => p.youtubeId = 'UuFuVqQqJT4');

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '', gradient: '', image: null });
  const [mainLetterOpen, setMainLetterOpen] = useState(false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);

  const openModal = (title, content, gradient = 'from-red-600 via-pink-600 to-purple-600', image = null, youtubeId = null) => {
    setModalContent({ title, content, gradient, image, youtubeId });
    setModalOpen(true);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar onEasterEgg={() => setEasterEggOpen(true)} />

      <Hero
        onWatchNow={() => setMainLetterOpen(true)}
        onDetails={() => scrollToSection('episodios-dificeis')}
      />

      {/* Melhores Momentos */}
      <Carousel
        title="Melhores Momentos"
        subtitle="As cenas que eu nunca quero esquecer"
      >
        {melhoresMomentos.map((ep) => (
          <EpisodeCard
            key={ep.id}
            {...ep}
            onClick={() => openModal(ep.title, ep.content, ep.gradient, ep.image, ep.youtubeId)}
          />
        ))}
      </Carousel>

      {/* Episódios Difíceis */}
      <div id="episodios-dificeis">
        <Carousel
          title="Episódios Difíceis (mas importantes)"
          subtitle="As cenas que doeram, mas geraram aprendizado"
        >
          {episodiosDificeis.map((ep) => (
            <EpisodeCard
              key={ep.id}
              {...ep}
              onClick={() => openModal(ep.title, ep.content, ep.gradient, ep.image, ep.youtubeId)}
            />
          ))}
        </Carousel>
      </div>

      {/* Bastidores */}
      <section id="bastidores" className="py-12 sm:py-20">
        <div className="container-custom">
          <h2 className="section-title mb-2">Bastidores</h2>
          <p className="text-gray-500 text-sm sm:text-base mb-8 sm:mb-12 pl-7">
            O que eu sinto de verdade (e talvez nunca tenha conseguido dizer)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {bastidores.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openModal(item.title, item.content, item.gradient, item.image, item.youtubeId)}
                className={`group relative p-6 sm:p-8 rounded-2xl ${!item.image ? `bg-gradient-to-br ${item.gradient}` : 'bg-cover bg-center'
                  } cursor-pointer transform hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  ...(item.image ? { backgroundImage: `url(${item.image})` } : {})
                }}
              >
                {/* Image Overlay */}
                {item.image && <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/40"></div>}

                {/* Background pattern (only if no image, or subtle) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white blur-2xl"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="text-4xl sm:text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm sm:text-base mb-4">{item.subtitle}</p>

                  <div className="flex items-center text-white/50 text-sm group-hover:text-white/80 transition-colors">
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

      {/* Próxima Temporada */}
      <div id="proxima-temporada">
        <Carousel
          title="Próxima Temporada"
          subtitle="Se depender de mim, a continuação é assim"
        >
          {promessas.map((ep) => (
            <EpisodeCard
              key={ep.id}
              episodeNumber={`Promessa ${ep.id}`}
              title={ep.title}
              description={ep.description}
              gradient={ep.gradient}
              image={ep.image}
              duration={ep.duration}
              onClick={() => openModal(ep.title, ep.content, ep.gradient, ep.image, ep.youtubeId)}
            />
          ))}
        </Carousel>
      </div>

      {/* Créditos Finais */}
      <section id="creditos" className="py-20 sm:py-32 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 via-transparent to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/5 blur-3xl"></div>
        </div>

        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-wider gradient-text mb-12 sm:mb-16">
              CRÉDITOS FINAIS
            </h2>

            {/* Credits List */}
            <div className="space-y-1 mb-16">
              <div className="credits-item">
                <span className="credits-role">Protagonista</span>
                <h3 className="credits-name gradient-text">Letícia</h3>
              </div>
              <div className="credits-item">
                <span className="credits-role">Co-protagonista em evolução</span>
                <h3 className="credits-name">Igor</h3>
              </div>
              <div className="credits-item">
                <span className="credits-role">Direção</span>
                <h3 className="credits-name text-base sm:text-lg">Nossas escolhas (e teimosias)</h3>
              </div>
              <div className="credits-item">
                <span className="credits-role">Gênero</span>
                <h3 className="credits-name text-base sm:text-lg">Romance caótico com potencial de final feliz</h3>
              </div>
              <div className="credits-item">
                <span className="credits-role">Temporadas</span>
                <h3 className="credits-name text-base sm:text-lg">1ª de infinitas (eu espero)</h3>
              </div>
            </div>

            {/* Final Message */}
            <div className="glass-card p-6 sm:p-10 rounded-2xl text-left space-y-5 sm:space-y-6 mb-10">
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Letícia, se você chegou até aqui... <span className="text-white font-medium">obrigado</span>. De verdade.
              </p>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Eu sei que palavras e sites não apagam o que aconteceu. Mas eu precisava
                que você visse que eu realmente ouvi. Que o silêncio não foi em vão.
                Que cada coisa que você falou ficou em mim.
              </p>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Você nunca foi a chata. Você foi a corajosa que continuou exigindo respeito
                mesmo quando eu demorava a entregar.
              </p>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Não tô te pressionando pra nada. Só quero que você saiba: se ainda houver
                um espaço pra mim, eu quero ocupar esse espaço sendo <span className="text-white font-medium">melhor</span>.
              </p>
              <p className="text-xl sm:text-2xl font-semibold text-white text-center pt-4">
                Quando você estiver pronta, eu tô aqui. ❤️
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => window.open('https://wa.me/5561982543112', '_blank')}
              className="btn-netflix text-base sm:text-lg"
            >
              <span>💬</span>
              Vamos conversar quando você quiser
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 border-t border-white/5 text-center">
        <p className="text-gray-600 text-xs sm:text-sm">
          NOSSOFLIX © 2024–∞ | Feito com muito amor e arrependimento sincero
        </p>
        <p className="text-gray-700 text-xs mt-2">
          Uma produção Igor Originals 🎬
        </p>
      </footer>

      {/* ==================== MODALS ==================== */}

      {/* Main Letter Modal */}
      <Modal
        isOpen={mainLetterOpen}
        onClose={() => setMainLetterOpen(false)}
        title="Carta pra você, Letícia"
        gradient="from-rose-600 via-red-600 to-pink-600"
      >
        <div className="space-y-5 sm:space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p>
            Oi, minha teimosa favorita. 💕
          </p>
          <p>
            Eu sei que você tá magoada. E você tem todo o direito. Não vou pedir
            pra você esquecer, porque não é sobre esquecer – é sobre eu finalmente
            entender.
          </p>
          <p>
            Esse site não é pra me justificar. É pra mostrar que eu ouvi. Cada
            reclamação, cada silêncio, cada olhar de decepção que eu fingia não ver...
            eu guardei tudo. E agora eu entendo.
          </p>
          <p>
            <span className="text-white font-medium">Você não é exagerada. Você não é chata.</span> Você só queria ser tratada
            com o mesmo respeito e carinho que você sempre me deu. E eu falhei nisso
            mais vezes do que deveria.
          </p>
          <p>
            Minhas "brincadeiras" passaram do limite. Minimizei coisas que eram
            importantes pra você. Te fiz sentir de fora quando você só queria
            pertencer. E pior: demorei demais pra acordar.
          </p>
          <p>
            Mas eu acordei. E não foi da boca pra fora. Tô aqui, disposto a provar
            com ações – não com promessas vazias.
          </p>
          <p>
            Navega pelo site. Vê os episódios que eu lembrei. Os erros que eu reconheço.
            As promessas que eu quero cumprir.
          </p>
          <p className="text-xl sm:text-2xl font-semibold text-white text-center pt-4">
            Eu tô aqui, Letícia. Esperando, aprendendo, evoluindo. Por nós. ❤️
          </p>
        </div>
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
      <Modal
        isOpen={easterEggOpen}
        onClose={() => setEasterEggOpen(false)}
        title=""
        gradient="from-pink-600 via-red-600 to-rose-600"
      >
        <div className="text-center space-y-6 py-4">
          <div className="text-6xl sm:text-7xl animate-heartbeat">❤️</div>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
            Se você chegou até aqui, só queria que você soubesse:
          </p>
          <p className="text-2xl sm:text-3xl font-bold gradient-text leading-tight">
            Eu ainda te escolho, mesmo com todos os meus defeitos.
          </p>
          <p className="text-gray-400 text-base sm:text-lg">
            E se você me deixar, vou te escolher de novo amanhã.
          </p>
          <p className="text-gray-500">E depois. E sempre.</p>
        </div>
      </Modal>

      {/* Background Music (Home) - Stops when modal opens */}
      {!modalOpen && (
        <div className="fixed bottom-0 right-0 w-1 h-1 opacity-0 overflow-hidden pointer-events-none">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/lBNGn_XU7Rw?autoplay=1&loop=1&playlist=lBNGn_XU7Rw&controls=0&showinfo=0"
            title="Home Audio"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
