import { useState } from 'react';

/**
 * EditableWrapper - Wrapper para tornar seções editáveis no modo visual
 * 
 * Adiciona:
 * - Hover effect com borda rosa
 * - Ícone de edição no canto
 * - Click handler para abrir editor
 */
export default function EditableWrapper({
    children,
    sectionId,
    sectionName,
    onEdit,
    isSelected = false,
    editMode = false,
}) {
    const [isHovered, setIsHovered] = useState(false);

    if (!editMode) {
        return children;
    }

    return (
        <div
            className="relative group"
            style={{
                position: 'relative',
                outline: isSelected
                    ? '3px solid #ec4899'
                    : isHovered
                        ? '2px dashed rgba(236, 72, 153, 0.6)'
                        : '2px dashed transparent',
                outlineOffset: '-2px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                borderRadius: '8px',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
                e.stopPropagation();
                onEdit?.(sectionId);
            }}
        >
            {children}

            {/* Edit Badge */}
            {(isHovered || isSelected) && (
                <div
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: isSelected
                            ? 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
                            : 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        animation: 'fadeIn 0.2s ease',
                    }}
                >
                    <span style={{ fontSize: '14px' }}>✏️</span>
                    <span style={{
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                    }}>
                        {isSelected ? `Editando: ${sectionName}` : `Editar ${sectionName}`}
                    </span>
                </div>
            )}

            {/* Selection overlay glow */}
            {isSelected && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        borderRadius: '8px',
                        boxShadow: 'inset 0 0 30px rgba(236, 72, 153, 0.15)',
                    }}
                />
            )}
        </div>
    );
}
