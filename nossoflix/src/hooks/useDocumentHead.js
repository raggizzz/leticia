import { useEffect } from 'react';

/**
 * Hook para atualizar dinamicamente o título e meta tags da página
 * Implementação completa de SEO para cada site individual
 */
export function useDocumentHead({ title, description, image, url, type = 'website', siteName = 'NossoFlix' }) {
    useEffect(() => {
        // Atualizar título
        if (title) {
            document.title = title;
            updateMetaTag('og:title', title);
            updateMetaTag('twitter:title', title);
            updateMetaTag('title', title, 'name');
        }

        // Atualizar descrição
        if (description) {
            updateMetaTag('description', description, 'name');
            updateMetaTag('og:description', description);
            updateMetaTag('twitter:description', description);
        }

        // Atualizar imagem
        if (image) {
            const imageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;
            updateMetaTag('og:image', imageUrl);
            updateMetaTag('twitter:image', imageUrl);
            updateMetaTag('og:image:alt', title || 'NossoFlix');
        }

        // Atualizar URL
        if (url) {
            updateMetaTag('og:url', url);
            updateMetaTag('twitter:url', url);
            updateOrCreateLink('canonical', url);
        }

        // Tipo e site name
        updateMetaTag('og:type', type);
        updateMetaTag('og:site_name', siteName);

        // Cleanup
        return () => { };
    }, [title, description, image, url, type, siteName]);
}

/**
 * Helper para atualizar meta tags
 */
function updateMetaTag(key, value, attribute = 'property') {
    let element = document.querySelector(`meta[${attribute}="${key}"]`);

    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }

    element.setAttribute('content', value);
}

/**
 * Helper para atualizar ou criar link tags
 */
function updateOrCreateLink(rel, href) {
    let element = document.querySelector(`link[rel="${rel}"]`);

    if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
    }

    element.setAttribute('href', href);
}

/**
 * Injeta JSON-LD structured data no head
 */
function injectStructuredData(id, data) {
    // Remover script anterior se existir
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
}

/**
 * Hook completo para SEO de um site específico
 * Inclui meta tags, Open Graph, Twitter Cards e Structured Data
 */
export function useSiteHead(siteData) {
    const coupleInfo = siteData?.config?.coupleInfo;
    const heroContent = siteData?.config?.heroContent;
    const themeConfig = siteData?.config?.themeConfig;

    const name1 = coupleInfo?.creator?.name || 'Você';
    const name2 = coupleInfo?.partner?.name || 'Seu amor';
    const coupleNames = `${name1} e ${name2}`;

    // Título dinâmico
    const title = heroContent?.title
        ? `${heroContent.title} | ${coupleNames}`
        : `${coupleNames} | NossoFlix`;

    // Descrição otimizada para SEO
    const description = heroContent?.description ||
        `Uma série original sobre a história de amor de ${coupleNames}. Episódios emocionantes, melhores momentos e muito carinho. Criado com NossoFlix.`;

    // Imagem para compartilhamento
    const image = themeConfig?.heroBackground || '/og-image.png';
    const imageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

    // URL canônica
    const url = siteData?.slug
        ? `${window.location.origin}/${siteData.slug}`
        : window.location.origin;

    // Aplicar meta tags
    useDocumentHead({
        title,
        description,
        image: imageUrl,
        url,
        type: 'website',
        siteName: 'NossoFlix',
    });

    // Structured Data para o site do casal
    useEffect(() => {
        if (!siteData?.slug) return;

        // WebPage Schema
        injectStructuredData('ld-webpage', {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": title,
            "description": description,
            "url": url,
            "image": imageUrl,
            "inLanguage": "pt-BR",
            "isPartOf": {
                "@type": "WebSite",
                "name": "NossoFlix",
                "url": "https://nossoflix.com"
            },
            "about": {
                "@type": "Person",
                "name": coupleNames
            },
            "dateCreated": siteData.created_at || new Date().toISOString(),
            "dateModified": siteData.updated_at || new Date().toISOString()
        });

        // CreativeWork Schema (para o conteúdo de série)
        injectStructuredData('ld-creativework', {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": heroContent?.title || `A Série de ${coupleNames}`,
            "description": description,
            "url": url,
            "image": imageUrl,
            "author": {
                "@type": "Person",
                "name": name1
            },
            "about": {
                "@type": "Person",
                "name": name2
            },
            "genre": ["Romance", "Drama", "Comédia"],
            "inLanguage": "pt-BR",
            "isFamilyFriendly": true,
            "publisher": {
                "@type": "Organization",
                "name": "NossoFlix",
                "url": "https://nossoflix.com"
            }
        });

        // Cleanup
        return () => {
            document.getElementById('ld-webpage')?.remove();
            document.getElementById('ld-creativework')?.remove();
        };
    }, [siteData, title, description, url, imageUrl, coupleNames, name1, name2, heroContent]);
}

/**
 * Hook para SEO da Landing Page
 */
export function useLandingPageHead() {
    useDocumentHead({
        title: 'NossoFlix - Transforme sua história de amor em série 🎬❤️',
        description: 'Crie um site cinematográfico personalizado para seu relacionamento. O presente mais criativo e emocionante para surpreender quem você ama!',
        image: '/og-image.png',
        url: window.location.origin,
        type: 'website',
    });

    // Structured Data para a landing
    useEffect(() => {
        injectStructuredData('ld-product', {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "NossoFlix",
            "description": "Transforme sua história de amor em uma série cinematográfica personalizada",
            "image": `${window.location.origin}/og-image.png`,
            "brand": {
                "@type": "Brand",
                "name": "NossoFlix"
            },
            "offers": {
                "@type": "AggregateOffer",
                "lowPrice": "0",
                "highPrice": "99",
                "priceCurrency": "BRL",
                "offerCount": "3"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1247",
                "bestRating": "5"
            }
        });

        return () => {
            document.getElementById('ld-product')?.remove();
        };
    }, []);
}
