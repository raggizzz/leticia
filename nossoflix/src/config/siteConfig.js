/**
 * ============================================
 * NOSSOFLIX - CONFIGURAÇÃO DO SITE
 * ============================================
 * 
 * Este arquivo contém TODAS as informações personalizáveis do site.
 * Para criar um novo site para um casal, basta modificar este arquivo!
 * 
 * INSTRUÇÕES:
 * 1. Substitua os nomes, fotos e textos
 * 2. Adicione suas próprias fotos na pasta /public
 * 3. Customize as cores se desejar
 * 4. Personalize as mensagens e episódios
 */

// ==================== INFORMAÇÕES DO CASAL ====================
export const coupleInfo = {
    // Nome de quem está criando o site (quem escreve)
    creator: {
        name: 'Igor',
        nickname: 'Amor', // Como a pessoa é chamada carinhosamente
    },

    // Nome de quem vai receber o site
    partner: {
        name: 'Letícia',
        nickname: 'minha teimosa favorita', // Apelido carinhoso
    },

    // Informações do relacionamento
    relationship: {
        startDate: '2024-01-01', // Data de início do namoro (YYYY-MM-DD)
        currentSeason: 1, // Qual "temporada" do relacionamento
    },

    // Contato
    contact: {
        whatsapp: '5561982543112', // Número do WhatsApp (apenas números, com código do país)
        whatsappMessage: 'Oi amor! Vi o site... 💕', // Mensagem pré-preenchida (opcional)
    },
};

// ==================== CONFIGURAÇÃO VISUAL ====================
export const themeConfig = {
    // Cores principais (gradientes)
    colors: {
        primary: 'from-red-600 via-pink-600 to-purple-600',
        secondary: 'from-rose-600 to-red-700',
        accent: 'from-purple-600 to-pink-700',
    },

    // Imagem de fundo do Hero (banner principal)
    heroBackground: '/season2.png',

    // Logo customizado (opcional - deixe null para usar o padrão)
    customLogo: null,

    // Ano de criação do site
    year: 2024,
};

// ==================== HERO (BANNER PRINCIPAL) ====================
export const heroContent = {
    // Badges/tags que aparecem no topo
    badges: ['Romance', 'Drama', 'Comédia', 'Relacionamento'],

    // Número da temporada exibido
    seasonLabel: 'T1',

    // Título principal
    title: 'NOSSOFLIX',

    // Subtítulo/tagline
    subtitle: 'Uma série original sobre nós dois',

    // Descrição curta
    description: 'Uma história de amor, aprendizado e crescimento. Com altos, baixos, e muita vontade de acertar.',

    // Match/compatibilidade (opcional, para dar o clima Netflix)
    matchPercentage: '98%',

    // Texto do botão principal
    primaryButtonText: '▶ Assistir Carta',

    // Texto do botão secundário
    secondaryButtonText: 'ℹ Mais Informações',
};

// ==================== CARTA PRINCIPAL ====================
export const mainLetter = {
    title: 'Carta pra você, Letícia',
    gradient: 'from-rose-600 via-red-600 to-pink-600',
    paragraphs: [
        'Oi, minha teimosa favorita. 💕',
        'Eu sei que você tá magoada. E você tem todo o direito. Não vou pedir pra você esquecer, porque não é sobre esquecer – é sobre eu finalmente entender.',
        'Esse site não é pra me justificar. É pra mostrar que eu ouvi. Cada reclamação, cada silêncio, cada olhar de decepção que eu fingia não ver... eu guardei tudo. E agora eu entendo.',
        '<strong>Você não é exagerada. Você não é chata.</strong> Você só queria ser tratada com o mesmo respeito e carinho que você sempre me deu. E eu falhei nisso mais vezes do que deveria.',
        'Minhas "brincadeiras" passaram do limite. Minimizei coisas que eram importantes pra você. Te fiz sentir de fora quando você só queria pertencer. E pior: demorei demais pra acordar.',
        'Mas eu acordei. E não foi da boca pra fora. Tô aqui, disposto a provar com ações – não com promessas vazias.',
        'Navega pelo site. Vê os episódios que eu lembrei. Os erros que eu reconheço. As promessas que eu quero cumprir.',
    ],
    closing: 'Eu tô aqui, Letícia. Esperando, aprendendo, evoluindo. Por nós. ❤️',
};

// ==================== MELHORES MOMENTOS ====================
export const bestMoments = [
    {
        id: 1,
        episodeNumber: 'Ep. 1',
        title: 'A paz no caos do Moto Week',
        description: 'Quando você dormiu voltando pra casa e eu entendi tudo.',
        image: '/motoweek.png',
        duration: '~2 min',
        isTop: true,
        youtubeId: 'UuFuVqQqJT4', // ID do vídeo do YouTube para música de fundo
        paragraphs: [
            'Lembra quando voltamos do Moto Week? Todo aquele barulho, aquela agitação da festa... e no meio de tudo isso, voltando para casa, você dormiu.',
            'Ali, vendo você descansar segura comigo, eu entendi algo gigante: eu quero ser isso pra você sempre. Eu quero ser o seu descanso, a sua segurança, o lugar pra onde você volta quando o mundo tá barulhento demais.',
            'Você dormindo tranquila do meu lado foi a melhor parte do meu dia. ❤️',
        ],
    },
    {
        id: 2,
        episodeNumber: 'Ep. 2',
        title: 'O nosso test-drive',
        description: 'Uma semana direto na sua casa (e eu não queria ir embora).',
        image: '/casa1.png',
        duration: '~2 min',
        youtubeId: 'UuFuVqQqJT4',
        paragraphs: [
            'Aquela semana que fiquei direto na sua casa... não foi só "ficar junto" por conveniência. Foi um spoiler da vida que eu quero ter com você.',
            'Acordar com você, te ver na rotina, rir das nossas manias, dividir o espaço. Foi ali que minha casa deixou de ser um endereço e passou a ser uma pessoa: você.',
            'Por mim, aquela semana duraria pra sempre. 🏠',
        ],
    },
    {
        id: 3,
        episodeNumber: 'Ep. 3',
        title: 'Nossa sintonia em Brasília',
        description: 'Show do Nattanzinho: a gente na mesma frequência.',
        image: '/nattanzinho.png',
        duration: '~2 min',
        youtubeId: 'UuFuVqQqJT4',
        paragraphs: [
            'Esse dia no show do Nattanzinho... ver você feliz, cantando, curtindo, me preenche de um jeito que eu não sei explicar.',
            'Ali não era só sobre a música ou a festa. Era sobre a gente estar conectado, na mesma vibe. Eu olhava pra você e pensava: <strong>"é com ela que eu quero viver todas as festas e todos os silêncios"</strong>.',
            'Obrigado por ser minha melhor companhia, em qualquer lugar. 🎉',
        ],
    },
    {
        id: 4,
        episodeNumber: 'Ep. 4',
        title: 'A foto da discórdia (que virou amor)',
        description: 'Matheus e Kauan e a famosa capinha.',
        image: '/matheus.png',
        duration: '~2 min',
        youtubeId: 'UuFuVqQqJT4',
        paragraphs: [
            'O dia da famosa foto da capinha! Sei que o contexto desse dia ("foto da capinha") teve seus momentos tensos que eu causei, mas olhando pra essa foto nossa no show do Matheus e Kauan, eu só vejo o quanto a gente é real.',
            'A gente tem nossos momentos difíceis, a gente se estranha, mas a gente se ajeita. Sua insistência em querer estar perto (até na capinha) é o que me fez acordar.',
            'Eu não trocaria nosso "caos" pela "paz" de ninguém. 💞',
        ],
    },
    {
        id: 5,
        episodeNumber: 'Ep. 5',
        title: 'A prova do crime (e do amor)',
        description: 'Você me pegou dormindo... e eu amei.',
        image: '/dormindo.png',
        duration: '~2 min',
        youtubeId: 'UuFuVqQqJT4',
        paragraphs: [
            'Você tirou essa foto quando eu tava completamente apagado do seu lado... e com esse filtro maravilhoso! 😂',
            'Mas sabe de uma coisa? Eu amo essa foto. Porque mostra a gente sem filtro (metaforicamente falando), sem pose. Mostra a intimidade e a confiança de poder dormir tranquilo ao lado de quem a gente ama.',
            'E mostra que você me ama até quando eu tô babando (eu espero). Te amo, minha fotógrafa favorita. 📸',
        ],
    },
];

// ==================== EPISÓDIOS DIFÍCEIS ====================
export const difficultEpisodes = [
    {
        id: 1,
        episodeNumber: 'Cap. 1',
        title: 'A piada que não teve graça',
        description: 'Quando minhas "brincadeiras" passaram do ponto.',
        image: '/piada_autista.jpg',
        duration: '~4 min',
        youtubeId: '6EGg0_l-edc',
        sections: {
            whatHappened: {
                title: 'O que aconteceu',
                color: 'red',
                text: 'Eu fiz uma piada achando que era engraçado, mas não era. Pro meu senso de humor poderia até parecer leve, mas pra você foi uma pequena humilhação. E o pior: eu não percebi na hora.',
            },
            whatItMeant: {
                title: 'O que isso significou pra você',
                color: 'pink',
                text: 'Eu te respondi de uma forma onde você não se sentiu respeitada. Não teve nada a ver com ciúme, mas com a falta de cuidado na minha resposta. Eu não levei a sério o que você sentiu e isso foi um erro.',
            },
            whatILearned: {
                title: 'O que eu aprendi',
                color: 'purple',
                text: 'Aprendi que "é só uma piada" nunca é desculpa quando você machucou alguém. Não importa a intenção – o que importa é o impacto. Quero aprender a medir melhor as palavras, especialmente com você.',
            },
        },
        showImage: true,
    },
    {
        id: 2,
        episodeNumber: 'Cap. 2',
        title: 'A foto da capinha',
        description: 'Quando algo pequeno significou muito mais.',
        image: '/capinha_7kbet.jpg',
        duration: '~4 min',
        youtubeId: '6EGg0_l-edc',
        sections: {
            whatHappened: {
                title: 'O que aconteceu',
                color: 'red',
                text: 'Aquela situação da foto da capinha... Eu não dei a devida importância. Tratei como algo irrelevante quando pra você era um sinal de cuidado, de querer estar presente de um jeito especial.',
            },
            whatItMeant: {
                title: 'O que isso significou pra você',
                color: 'pink',
                text: 'Você deve ter se sentido rejeitada. Como se suas demonstrações de carinho não fossem boas o suficiente. Como se eu não valorizasse os gestos que você faz por nós. E isso é horrível de sentir.',
            },
            whatILearned: {
                title: 'O que eu aprendi',
                color: 'purple',
                text: 'Entendi que cada gesto seu carrega amor. Não importa se parece "simples" pra mim – se vem de você, é importante. Preciso valorizar cada forma que você encontra de mostrar que me ama.',
            },
        },
        showImage: true,
    },
    {
        id: 3,
        episodeNumber: 'Cap. 3',
        title: 'O foguinho do TikTok',
        description: 'Minha reação foi de criança quando você pediu atenção.',
        image: '/tiktok_foguinho.jpg',
        duration: '~4 min',
        youtubeId: '6EGg0_l-edc',
        sections: {
            whatHappened: {
                title: 'O que aconteceu',
                color: 'red',
                text: 'Você me disse que pararia de mandar vídeos porque eu nunca respondia. E ao invés de entender sua frustração, eu respondi seco: "Apaga aí então". Eu transformei um pedido seu de atenção em uma briga de ego.',
            },
            whatItMeant: {
                title: 'O que isso significou pra você',
                color: 'pink',
                text: 'Você apenas sentiu que eu não fazia questão de receber coisas suas. Minha resposta fez parecer que tanto fazia pra mim, e isso não é verdade.',
            },
            whatILearned: {
                title: 'O que eu aprendi',
                color: 'purple',
                text: 'Que quando você reclama, é porque quer conexão, não briga. Eu deveria ter dito "Desculpa, vou responder mais", e não agido com descaso. Atenção se dá, não se nega.',
            },
        },
        showImage: true,
    },
    {
        id: 4,
        episodeNumber: 'Cap. 4',
        title: 'O grupo (que você JÁ pertence)',
        description: 'Você acha que não, mas você é parte fundamental.',
        image: '/grupo_peixonautas.jpg',
        duration: '~4 min',
        youtubeId: '6EGg0_l-edc',
        sections: {
            whatHappened: {
                title: 'O que acontece',
                color: 'red',
                text: 'Muitas vezes você diz que não faz parte do grupo, que se sente intrusa. Mas amor, isso não é verdade. A gente inclui você, brinca junto, e todo mundo ali gosta da sua presença.',
            },
            whatItMeant: {
                title: 'A verdade',
                color: 'pink',
                text: 'Você faz parte sim. Só que as vezes você não acha que faz. O grupo não seria o mesmo sem você lá. Você é nossa amiga, não apenas minha namorada.',
            },
            whatILearned: {
                title: 'O que eu aprendi',
                color: 'purple',
                text: 'Que eu preciso te reforçar isso até você acreditar. Que seu lugar é garantido e que você é querida por todos nós. Não vou deixar essa insegurança (que é só coisa da cabeça!) te afastar.',
            },
        },
        showImage: true,
    },
];

// ==================== BASTIDORES ====================
export const behindTheScenes = [
    {
        id: 1,
        title: 'Você nunca foi a chata',
        subtitle: 'A verdade que preciso que você entenda',
        icon: '❤️',
        gradient: 'from-rose-600 to-red-700',
        image: '/motoweek.png',
        youtubeId: 'Wsl2PJZvphs',
        paragraphs: [
            'Letícia, eu preciso que você grave isso: <strong>você nunca foi a chata. Nunca.</strong>',
            'Todas as vezes que você pediu respeito, atenção, limites... você só estava fazendo o que qualquer pessoa que se ama deveria fazer: exigir ser tratada bem.',
            'Eu que demorei pra entender. Eu que confundi paciência com permissão pra continuar errando. Mas isso não faz de você a difícil da relação.',
            'Faz de você a mais corajosa – por continuar exigindo o melhor mesmo quando eu teimava em não entregar. 💪',
        ],
    },
    {
        id: 2,
        title: 'Quando você fica quieta',
        subtitle: 'O que passa na minha cabeça',
        icon: '💭',
        gradient: 'from-purple-600 to-pink-700',
        image: '/dormindo.png',
        youtubeId: 'Wsl2PJZvphs',
        paragraphs: [
            'Quando você fica quieta, eu entro em parafuso. Fico tentando adivinhar o que eu fiz, o que eu falei, o que passou despercebido.',
            'E agora eu entendo por que você fica quieta às vezes. Não é frescura. É cansaço. Cansaço de ter que repetir as mesmas coisas, de sentir que suas palavras não têm peso.',
            'Eu quero aprender a ouvir antes de você precisar se calar. Quero que suas palavras pesem tanto pra mim quanto pesam pra você. 🤫',
        ],
    },
    {
        id: 3,
        title: 'Eu já comecei a mudar',
        subtitle: 'E não quero parar',
        icon: '🌱',
        gradient: 'from-emerald-600 to-teal-700',
        image: '/season2.png',
        youtubeId: 'Wsl2PJZvphs',
        paragraphs: [
            'Eu sei que falar é fácil. Que promessa de mudança já perdeu o peso depois de tantas vezes. Mas eu preciso que você saiba: <strong>eu estou tentando.</strong>',
            'Cada vez que eu seguro uma piada, que eu paro pra pensar antes de responder, que eu escolho ouvir antes de me defender... é uma pequena vitória contra o cara que eu era antes.',
            'Demorei? Demais. Mas eu tô aqui, disposto a ser a pessoa que você merece. Não perfeito – mas melhor. Todo dia um pouco melhor. 📈',
        ],
    },
];

// ==================== PROMESSAS / PRÓXIMA TEMPORADA ====================
export const promises = [
    {
        id: 1,
        title: 'Menos fala, mais escuta',
        description: 'Ouvir até o fim antes de responder.',
        icon: '👂',
        gradient: 'from-green-500 via-emerald-600 to-teal-600',
        image: '/season2.png',
        duration: '~2 min',
        youtubeId: 'UuFuVqQqJT4',
        paragraphs: [
            'Minha boca às vezes é mais rápida que meu cérebro. Eu respondo antes de processar, defendo antes de entender, e isso te machuca.',
            '<strong>Minha promessa:</strong> vou aprender a escutar até a última palavra. Sem interromper, sem já formular resposta antes de você terminar.',
            'Porque você merece ser ouvida. De verdade. 💯',
        ],
    },
    {
        id: 2,
        title: 'Me avise sempre',
        description: 'Se eu errar, me dê o toque.',
        icon: '🎯',
        gradient: 'from-teal-500 via-cyan-600 to-blue-600',
        image: '/season2.png',
        duration: '~2 min',
        youtubeId: 'UuFuVqQqJT4',
        paragraphs: [
            'As vezes eu solto piadas e não noto que machucou. Não é por mal, mas eu sei que chateia.',
            '<strong>Minha promessa:</strong> por favor, me alerte a cada piada que você não gostar. Se você não falar, eu vou demorar a perceber. Mas se você falar, eu prometo parar na hora e não retrucar.',
            'Eu preciso dessa ajuda sua pra ser melhor. ✋',
        ],
    },
    {
        id: 3,
        title: 'Te amar pra sempre',
        description: 'Minha única certeza.',
        icon: '❤️',
        gradient: 'from-blue-500 via-indigo-600 to-purple-600',
        image: '/season2.png',
        duration: '~2 min',
        youtubeId: 'UuFuVqQqJT4',
        paragraphs: [
            'No meio de tantos erros e acertos, existe uma coisa que nunca mudou e nunca vai mudar: o quanto eu sou louco por você.',
            '<strong>Minha promessa:</strong> eu te amo muito e prometo te amar pelo resto da vida. Não importa o que aconteça, meu amor por você é a base de tudo.',
            'Pra sempre. 👫',
        ],
    },
    {
        id: 4,
        title: 'Você nunca é repetitiva',
        description: 'Sua voz importa, sempre.',
        icon: '🗣️',
        gradient: 'from-purple-500 via-pink-600 to-rose-600',
        image: '/season2.png',
        duration: '~2 min',
        youtubeId: 'UuFuVqQqJT4',
        paragraphs: [
            'Se você precisa falar a mesma coisa várias vezes, é porque eu não estou ouvindo direito. O erro é meu, não seu.',
            '<strong>Minha promessa:</strong> eu prometo nunca achar que você é repetitiva. Prometo ouvir com atenção cada palavra, até entender de verdade o que você sente.',
            'Pode falar. Eu quero ouvir. 👂',
        ],
    },
];

// ==================== CRÉDITOS FINAIS ====================
export const credits = {
    title: 'CRÉDITOS FINAIS',
    roles: [
        { role: 'Protagonista', name: 'Letícia', highlight: true },
        { role: 'Co-protagonista em evolução', name: 'Igor', highlight: false },
        { role: 'Direção', name: 'Nossas escolhas (e teimosias)', highlight: false },
        { role: 'Gênero', name: 'Romance caótico com potencial de final feliz', highlight: false },
        { role: 'Temporadas', name: '1ª de infinitas (eu espero)', highlight: false },
    ],
    finalMessage: {
        paragraphs: [
            'Letícia, se você chegou até aqui... <strong>obrigado</strong>. De verdade.',
            'Eu sei que palavras e sites não apagam o que aconteceu. Mas eu precisava que você visse que eu realmente ouvi. Que o silêncio não foi em vão. Que cada coisa que você falou ficou em mim.',
            'Você nunca foi a chata. Você foi a corajosa que continuou exigindo respeito mesmo quando eu demorava a entregar.',
            'Não tô te pressionando pra nada. Só quero que você saiba: se ainda houver um espaço pra mim, eu quero ocupar esse espaço sendo <strong>melhor</strong>.',
        ],
        closing: 'Quando você estiver pronta, eu tô aqui. ❤️',
    },
    ctaButton: {
        icon: '💬',
        text: 'Vamos conversar quando você quiser',
    },
    footer: {
        copyright: 'NOSSOFLIX © 2024–∞ | Feito com muito amor e arrependimento sincero',
        signature: 'Uma produção Igor Originals 🎬',
    },
};

// ==================== EASTER EGG ====================
export const easterEgg = {
    gradient: 'from-pink-600 via-red-600 to-rose-600',
    icon: '❤️',
    message: 'Se você chegou até aqui, só queria que você soubesse:',
    mainText: 'Eu ainda te escolho, mesmo com todos os meus defeitos.',
    subText: 'E se você me deixar, vou te escolher de novo amanhã.',
    closing: 'E depois. E sempre.',
};

// ==================== MÚSICA DE FUNDO ====================
export const backgroundMusic = {
    // ID do vídeo do YouTube para música de fundo
    youtubeId: 'lBNGn_XU7Rw',
    // Tocar automaticamente?
    autoplay: true,
    // Loop infinito?
    loop: true,
};

// ==================== SEÇÕES HABILITADAS ====================
// Defina como false para esconder uma seção
export const enabledSections = {
    bestMoments: true,
    difficultEpisodes: true,
    behindTheScenes: true,
    promises: true,
    credits: true,
    easterEgg: true,
    backgroundMusic: true,
};
