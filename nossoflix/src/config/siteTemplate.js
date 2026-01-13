/**
 * ============================================
 * NOSSOFLIX - TEMPLATE PADRÃO PARA NOVOS SITES
 * ============================================
 * 
 * Este template é baseado no site do Igor & Letícia.
 * Novos clientes recebem este conteúdo como exemplo
 * e só precisam personalizar com seus próprios dados.
 */

/**
 * Gera um template completo para um novo site
 * @param {string} name1 - Nome de quem está criando
 * @param {string} name2 - Nome do(a) parceiro(a)
 * @returns {Object} - Configuração completa do site
 */
export function generateSiteTemplate(name1, name2) {
    return {
        // ==================== INFORMAÇÕES DO CASAL ====================
        coupleInfo: {
            creator: {
                name: name1,
                nickname: 'Amor',
            },
            partner: {
                name: name2,
                nickname: 'meu amor',
            },
            relationship: {
                startDate: new Date().toISOString().split('T')[0],
                currentSeason: 1,
            },
            contact: {
                whatsapp: '',
                whatsappMessage: `Oi amor! Vi o site... 💕`,
            },
        },

        // ==================== CONFIGURAÇÃO VISUAL ====================
        themeConfig: {
            colors: {
                primary: 'from-red-600 via-pink-600 to-purple-600',
                secondary: 'from-rose-600 to-red-700',
                accent: 'from-purple-600 to-pink-700',
            },
            heroBackground: null,
            customLogo: null,
            year: new Date().getFullYear(),
        },

        // ==================== HERO (BANNER PRINCIPAL) ====================
        heroContent: {
            badges: ['Romance', 'Drama', 'Comédia', 'Relacionamento'],
            seasonLabel: 'T1',
            title: 'NOSSOFLIX',
            subtitle: `Uma série original sobre ${name1} e ${name2}`,
            description: 'Uma história de amor, aprendizado e crescimento. Com altos, baixos, e muita vontade de acertar.',
            matchPercentage: '98%',
            primaryButtonText: '▶ Assistir Carta',
            secondaryButtonText: 'ℹ Mais Informações',
        },

        // ==================== CARTA PRINCIPAL ====================
        mainLetter: {
            title: `Carta pra você, ${name2}`,
            gradient: 'from-rose-600 via-red-600 to-pink-600',
            paragraphs: [
                `Oi, meu amor. 💕`,
                `Eu criei esse site especialmente pra você. Não é só uma declaração - é um jeito de mostrar o quanto você significa pra mim.`,
                `Cada seção aqui foi pensada com carinho. Navega pelo site e descobre tudo que eu preparei pra você.`,
                `<strong>Você é a pessoa mais importante da minha vida.</strong> E eu quero que você saiba disso de uma forma diferente, especial.`,
                `Espero que você goste! ❤️`,
            ],
            closing: `Com todo meu amor, ${name1}. ❤️`,
        },

        // ==================== MELHORES MOMENTOS ====================
        bestMoments: [
            {
                id: 1,
                episodeNumber: 'Ep. 1',
                title: 'Nosso primeiro encontro',
                description: 'O dia em que tudo começou.',
                image: null,
                duration: '~2 min',
                isTop: true,
                youtubeId: null,
                paragraphs: [
                    'Descreva aqui o momento especial do seu relacionamento...',
                    'Conte como foi, o que você sentiu, por que foi importante.',
                    'Adicione uma foto para deixar ainda mais especial! 📸',
                ],
            },
            {
                id: 2,
                episodeNumber: 'Ep. 2',
                title: 'Uma viagem inesquecível',
                description: 'Aquele momento que ficou na memória.',
                image: null,
                duration: '~2 min',
                youtubeId: null,
                paragraphs: [
                    'Conte sobre uma viagem ou passeio especial que vocês fizeram juntos.',
                    'O que tornou esse momento tão especial pra vocês?',
                ],
            },
            {
                id: 3,
                episodeNumber: 'Ep. 3',
                title: 'O dia que eu percebi',
                description: 'Quando eu soube que era você.',
                image: null,
                duration: '~2 min',
                youtubeId: null,
                paragraphs: [
                    'Teve aquele momento em que você olhou pro lado e pensou: "É essa pessoa"?',
                    'Conta pra ela/ele quando e como foi. ❤️',
                ],
            },
        ],

        // ==================== EPISÓDIOS DIFÍCEIS ====================
        difficultEpisodes: [
            {
                id: 1,
                episodeNumber: 'Cap. 1',
                title: 'Quando erramos juntos',
                description: 'Os momentos que nos fizeram crescer.',
                image: null,
                duration: '~4 min',
                youtubeId: null,
                sections: {
                    whatHappened: {
                        title: 'O que aconteceu',
                        color: 'red',
                        text: 'Descreva brevemente um momento difícil que vocês superaram...',
                    },
                    whatItMeant: {
                        title: 'O que isso significou',
                        color: 'pink',
                        text: 'Como isso afetou o relacionamento de vocês?',
                    },
                    whatILearned: {
                        title: 'O que eu aprendi',
                        color: 'purple',
                        text: 'O que você aprendeu com essa experiência?',
                    },
                },
                showImage: true,
            },
        ],

        // ==================== BASTIDORES ====================
        behindTheScenes: [
            {
                id: 1,
                title: 'O que eu sinto por você',
                subtitle: 'Um pensamento sincero',
                icon: '❤️',
                gradient: 'from-rose-600 to-red-700',
                image: null,
                youtubeId: null,
                paragraphs: [
                    `${name2}, eu preciso que você saiba o quanto você é especial pra mim.`,
                    'Escreva aqui seus pensamentos mais sinceros...',
                    'Essa é a seção perfeita pra falar direto do coração. 💕',
                ],
            },
            {
                id: 2,
                title: 'Meus planos pra nós',
                subtitle: 'O futuro que eu imagino',
                icon: '💭',
                gradient: 'from-purple-600 to-pink-700',
                image: null,
                youtubeId: null,
                paragraphs: [
                    'Conte sobre os sonhos que você tem pro futuro de vocês dois.',
                    'Viagens, conquistas, momentos que você quer viver junto...',
                ],
            },
        ],

        // ==================== PROMESSAS ====================
        promises: [
            {
                id: 1,
                title: 'Minha primeira promessa',
                description: 'Um compromisso de coração.',
                icon: '🤝',
                gradient: 'from-green-500 via-emerald-600 to-teal-600',
                image: null,
                duration: '~2 min',
                youtubeId: null,
                paragraphs: [
                    'Escreva aqui uma promessa sincera que você quer fazer...',
                    '<strong>Minha promessa:</strong> vou sempre [complete com seu compromisso].',
                    'Porque você merece. 💯',
                ],
            },
            {
                id: 2,
                title: 'Te amar pra sempre',
                description: 'Minha única certeza.',
                icon: '❤️',
                gradient: 'from-blue-500 via-indigo-600 to-purple-600',
                image: null,
                duration: '~2 min',
                youtubeId: null,
                paragraphs: [
                    `No meio de tantos erros e acertos, existe uma coisa que nunca mudou: o quanto eu amo você, ${name2}.`,
                    '<strong>Minha promessa:</strong> eu te amo e vou te amar pelo resto da vida.',
                    'Pra sempre. 👫',
                ],
            },
        ],

        // ==================== CRÉDITOS FINAIS ====================
        credits: {
            title: 'CRÉDITOS FINAIS',
            roles: [
                { role: 'Protagonista', name: name2, highlight: true },
                { role: 'Co-protagonista', name: name1, highlight: false },
                { role: 'Direção', name: 'Nossas escolhas e amor', highlight: false },
                { role: 'Gênero', name: 'Romance com final feliz', highlight: false },
                { role: 'Temporadas', name: '1ª de infinitas', highlight: false },
            ],
            finalMessage: {
                paragraphs: [
                    `${name2}, se você chegou até aqui... <strong>obrigado</strong>. De verdade.`,
                    'Eu criei esse site pra você saber o quanto você é importante pra mim.',
                    'Espero que tenha gostado de cada detalhe. Tudo foi feito pensando em você.',
                ],
                closing: 'Te amo, hoje e sempre. ❤️',
            },
            ctaButton: {
                icon: '💬',
                text: 'Vamos conversar',
            },
            footer: {
                copyright: `NOSSOFLIX © ${new Date().getFullYear()} | Feito com muito amor`,
                signature: `Uma produção ${name1} Originals 🎬`,
            },
        },

        // ==================== EASTER EGG ====================
        easterEgg: {
            gradient: 'from-pink-600 via-red-600 to-rose-600',
            icon: '❤️',
            message: 'Se você chegou até aqui, só queria que você soubesse:',
            mainText: 'Eu te escolho, todos os dias.',
            subText: 'E vou continuar te escolhendo.',
            closing: 'Sempre.',
        },

        // ==================== MÚSICA DE FUNDO ====================
        backgroundMusic: {
            youtubeId: '',
            autoplay: false,
            loop: true,
        },

        // ==================== SEÇÕES HABILITADAS ====================
        enabledSections: {
            bestMoments: true,
            difficultEpisodes: true,
            behindTheScenes: true,
            promises: true,
            credits: true,
            easterEgg: true,
            backgroundMusic: false,
        },
    };
}

// Template vazio para referência
export const EMPTY_TEMPLATE = {
    coupleInfo: {
        creator: { name: '', nickname: '' },
        partner: { name: '', nickname: '' },
        relationship: { startDate: '', currentSeason: 1 },
        contact: { whatsapp: '', whatsappMessage: '' },
    },
    heroContent: { title: 'NOSSOFLIX', subtitle: '', description: '', badges: [] },
    mainLetter: { title: '', paragraphs: [], closing: '' },
    bestMoments: [],
    difficultEpisodes: [],
    behindTheScenes: [],
    promises: [],
    credits: { title: '', roles: [], finalMessage: { paragraphs: [], closing: '' } },
};
