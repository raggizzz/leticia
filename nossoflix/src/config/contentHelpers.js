/**
 * ============================================
 * NOSSOFLIX - HELPERS DE CONTEÚDO
 * ============================================
 * 
 * Funções auxiliares para renderizar conteúdo dinâmico
 * a partir da configuração do site.
 */

/**
 * Converte um array de parágrafos em HTML formatado
 * @param {string[]} paragraphs - Array de parágrafos
 * @param {boolean} isClosing - Se é parágrafo de fechamento (estilo diferente)
 * @returns {string} HTML formatado
 */
export function paragraphsToHtml(paragraphs, closingText = null) {
    let html = paragraphs.map((p, index) => {
        const isLast = index === paragraphs.length - 1 && !closingText;
        return `
      <p class="text-gray-300 text-base sm:text-lg leading-relaxed ${isLast ? '' : 'mb-6'}">
        ${p}
      </p>
    `;
    }).join('');

    if (closingText) {
        html += `
      <p class="text-xl sm:text-2xl font-semibold text-white text-center pt-4">
        ${closingText}
      </p>
    `;
    }

    return html;
}

/**
 * Renderiza o conteúdo de um episódio difícil com seções coloridas
 * @param {object} episode - Objeto do episódio difícil
 * @returns {string} HTML formatado
 */
export function renderDifficultEpisodeContent(episode) {
    const colorMap = {
        red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
        pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400', dot: 'bg-pink-400' },
        purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-400' },
    };

    const sections = Object.values(episode.sections).map(section => {
        const colors = colorMap[section.color] || colorMap.purple;
        return `
      <div class="p-4 sm:p-5 rounded-xl ${colors.bg} border ${colors.border}">
        <h4 class="${colors.text} font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
          <span class="w-2 h-2 ${colors.dot} rounded-full"></span>
          ${section.title}
        </h4>
        <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
          ${section.text}
        </p>
      </div>
    `;
    }).join('');

    const imageHtml = episode.showImage ? `
    <div class="mt-6 flex justify-center">
      <img src="${episode.image}" class="rounded-lg shadow-lg max-w-full h-auto max-h-[300px] border border-white/10" alt="${episode.title}" />
    </div>
  ` : '';

    return `
    <div class="space-y-8">
      ${sections}
      ${imageHtml}
    </div>
  `;
}

/**
 * Renderiza o conteúdo da carta principal
 * @param {object} letter - Objeto da carta principal
 * @returns {string} HTML formatado
 */
export function renderMainLetterContent(letter) {
    return `
    <div class="space-y-5 sm:space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed">
      ${letter.paragraphs.map(p => `<p>${p}</p>`).join('')}
      <p class="text-xl sm:text-2xl font-semibold text-white text-center pt-4">
        ${letter.closing}
      </p>
    </div>
  `;
}

/**
 * Gera o link do WhatsApp formatado
 * @param {object} contact - Objeto de contato do config
 * @returns {string} URL do WhatsApp
 */
export function getWhatsAppLink(contact) {
    const baseUrl = 'https://wa.me/';
    const message = contact.whatsappMessage
        ? `?text=${encodeURIComponent(contact.whatsappMessage)}`
        : '';
    return `${baseUrl}${contact.whatsapp}${message}`;
}

/**
 * Formata a data de início do relacionamento
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {object} Objeto com dias, meses e anos
 */
export function getRelationshipDuration(dateString) {
    const start = new Date(dateString);
    const now = new Date();

    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    return {
        days: diffDays,
        months: diffMonths,
        years: diffYears,
        formatted: diffYears > 0
            ? `${diffYears} ano${diffYears > 1 ? 's' : ''} juntos`
            : diffMonths > 0
                ? `${diffMonths} ${diffMonths > 1 ? 'meses' : 'mês'} juntos`
                : `${diffDays} dias juntos`,
    };
}
