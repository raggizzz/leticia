import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

/**
 * QR Code Generator - Gera QR Code romântico para o site
 * Versão melhorada usando qrcode.react (local, sem API externa)
 */
export default function QRCodeGenerator({ siteUrl, siteName = 'NossoFlix', onClose, isPremium = false }) {
    const [downloading, setDownloading] = useState(false);
    const [copied, setCopied] = useState(false);
    const qrRef = useRef(null);

    // Garantir URL completa
    const fullUrl = siteUrl?.startsWith('http') ? siteUrl : `https://nossoflix.com/${siteUrl}`;

    const handleDownload = async () => {
        setDownloading(true);

        try {
            // Criar canvas para combinar QR + design elegante
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = 600;
            canvas.height = 800;

            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, 600, 800);
            gradient.addColorStop(0, '#0a0a0a');
            gradient.addColorStop(1, '#1a0a1a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 600, 800);

            // Decorative glow circle
            ctx.beginPath();
            ctx.arc(300, 400, 280, 0, Math.PI * 2);
            const circleGradient = ctx.createRadialGradient(300, 400, 0, 300, 400, 280);
            circleGradient.addColorStop(0, 'rgba(236, 72, 153, 0.15)');
            circleGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = circleGradient;
            ctx.fill();

            // Title
            ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText(siteName || 'NossoFlix', 300, 100);

            // Subtitle
            ctx.font = '16px -apple-system, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillText('Escaneie para assistir nossa história ❤️', 300, 140);

            // QR Code background area
            const qrSize = 320;
            const qrX = (600 - qrSize) / 2;
            const qrY = 200;

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 16);
            ctx.fill();

            // Get SVG from QR component and draw to canvas
            const svgElement = qrRef.current?.querySelector('svg');
            if (svgElement) {
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);

                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

                    // Bottom branding
                    if (!isPremium) {
                        ctx.font = '14px -apple-system, sans-serif';
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                        ctx.textAlign = 'center';
                        ctx.fillText('Criado com ❤️ no NossoFlix.com', 300, 620);
                    }

                    // Hearts decoration
                    ctx.font = '24px Arial';
                    ctx.fillStyle = '#ec4899';
                    ctx.fillText('💕', 100, 700);
                    ctx.fillText('💕', 500, 700);

                    // Short URL
                    ctx.font = '16px -apple-system, sans-serif';
                    ctx.fillStyle = '#ec4899';
                    ctx.fillText(fullUrl.replace('https://', ''), 300, 750);

                    // Download
                    const link = document.createElement('a');
                    link.download = `${(siteName || 'nossoflix').replace(/\s+/g, '-').toLowerCase()}-qrcode.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                    URL.revokeObjectURL(url);
                    setDownloading(false);
                };

                img.onerror = () => {
                    setDownloading(false);
                };

                img.src = url;
            } else {
                setDownloading(false);
            }
        } catch (error) {
            console.error('Error generating QR:', error);
            setDownloading(false);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Erro ao copiar:', error);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: siteName || 'Meu NossoFlix',
                    text: 'Veja nossa história de amor! 💕',
                    url: fullUrl,
                });
            } catch (error) {
                // User cancelled
            }
        } else {
            handleCopyLink();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            padding: '16px',
        }}>
            <div style={{
                background: 'linear-gradient(180deg, rgba(18,18,18,0.98) 0%, rgba(10,10,10,0.98) 100%)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                maxWidth: '400px',
                width: '100%',
                position: 'relative',
            }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                    }}
                >
                    ✕
                </button>

                {/* Header */}
                <div style={{
                    padding: '28px 28px 20px',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(244,63,94,0.1) 0%, rgba(168,85,247,0.08) 100%)',
                }}>
                    <div style={{ fontSize: '42px', marginBottom: '12px' }}>📲</div>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
                        Compartilhe por QR Code
                    </h2>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        Perfeito para imprimir e presentear!
                    </p>
                </div>

                {/* QR Preview */}
                <div style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }} ref={qrRef}>
                    <div style={{
                        padding: '16px',
                        background: '#ffffff',
                        borderRadius: '16px',
                        marginBottom: '16px',
                    }}>
                        <QRCodeSVG
                            value={fullUrl}
                            size={180}
                            level="H"
                            includeMargin={false}
                            fgColor="#000000"
                            bgColor="#ffffff"
                        />
                    </div>

                    {/* URL Display */}
                    <div style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                    }}>
                        <span style={{
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.6)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                        }}>
                            {fullUrl}
                        </span>
                        <button
                            onClick={handleCopyLink}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#ec4899',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {copied ? '✓ Copiado!' : 'Copiar'}
                        </button>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                        <button
                            onClick={handleShare}
                            style={{
                                flex: 1,
                                padding: '14px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                            }}
                        >
                            <span>📤</span> Compartilhar
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            style={{
                                flex: 1,
                                padding: '14px',
                                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: downloading ? 'wait' : 'pointer',
                                opacity: downloading ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                            }}
                        >
                            <span>📥</span> {downloading ? 'Gerando...' : 'Baixar PNG'}
                        </button>
                    </div>

                    {/* Tips */}
                    <div style={{
                        marginTop: '20px',
                        padding: '14px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '12px',
                        width: '100%',
                    }}>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>
                            💡 <strong>Dica:</strong> Imprima em papel fotográfico e cole em um cartão, caixa de presente ou quadro para surpreender!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
