import { useState } from 'react';

/**
 * Componente de Input estilizado para o Admin - Premium Edition
 */
export function AdminInput({ label, value, onChange, type = 'text', placeholder, hint, required, multiline, rows = 3 }) {
    const baseClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:bg-white/[0.07] transition-all duration-300";

    return (
        <div className="space-y-2 group">
            {label && (
                <label className="block text-sm font-medium text-gray-300 group-focus-within:text-pink-400 transition-colors">
                    {label}
                    {required && <span className="text-pink-400 ml-1">*</span>}
                </label>
            )}
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    className={`${baseClasses} resize-none`}
                    style={{
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    }}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={baseClasses}
                    style={{
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    }}
                />
            )}
            {hint && <p className="text-xs text-gray-500">{hint}</p>}
        </div>
    );
}

/**
 * Componente de Upload de Imagem
 */
export function ImageUpload({ label, value, onChange, hint }) {
    const [preview, setPreview] = useState(value);
    const [dragging, setDragging] = useState(false);

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
            onChange(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}

            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${dragging ? 'border-pink-500 bg-pink-500/10' : 'border-white/20 hover:border-white/40'
                    }`}
            >
                {preview ? (
                    <div className="relative">
                        <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                        <button
                            onClick={() => { setPreview(null); onChange(null); }}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className="py-8">
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-gray-400 text-sm">Arraste uma imagem ou clique para selecionar</p>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>

            {hint && <p className="text-xs text-gray-500">{hint}</p>}
        </div>
    );
}

/**
 * Componente de Card colapsável para seções - Premium Edition
 */
export function AdminSection({ title, icon, children, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: isOpen ? '0 10px 40px -15px rgba(0,0,0,0.3)' : 'none',
            }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-all duration-300"
            >
                <div className="flex items-center gap-4">
                    <span className="text-2xl">{icon}</span>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                    style={{
                        background: isOpen ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid ' + (isOpen ? 'rgba(236,72,153,0.3)' : 'rgba(255,255,255,0.1)'),
                    }}
                >
                    <svg
                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-pink-400' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            <div
                className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
            >
                <div className="px-6 pb-6 space-y-4 border-t border-white/10 pt-5">
                    {children}
                </div>
            </div>
        </div>
    );
}

/**
 * Componente de Toggle/Switch
 */
export function AdminToggle({ label, value, onChange, hint }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-300">{label}</p>
                {hint && <p className="text-xs text-gray-500">{hint}</p>}
            </div>
            <button
                onClick={() => onChange(!value)}
                className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-pink-500' : 'bg-white/20'}`}
            >
                <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'left-7' : 'left-1'}`}
                />
            </button>
        </div>
    );
}

/**
 * Botão estilizado para o Admin
 */
export function AdminButton({ children, onClick, variant = 'primary', icon, disabled, className = '' }) {
    const variants = {
        primary: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white',
        secondary: 'bg-white/10 hover:bg-white/20 text-white',
        danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30',
        success: 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
}

/**
 * Lista de itens editável (para episódios, promessas, etc)
 */
export function EditableList({ items, onUpdate, renderItem, onAdd, addLabel = 'Adicionar item' }) {
    const handleMove = (index, direction) => {
        const newItems = [...items];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= items.length) return;
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        onUpdate(newItems);
    };

    const handleDelete = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        onUpdate(newItems);
    };

    const handleEdit = (index, newData) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], ...newData };
        onUpdate(newItems);
    };

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={item.id || index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                            #{index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleMove(index, -1)}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                ↑
                            </button>
                            <button
                                onClick={() => handleMove(index, 1)}
                                disabled={index === items.length - 1}
                                className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                ↓
                            </button>
                            <button
                                onClick={() => handleDelete(index)}
                                className="p-1 text-red-400 hover:text-red-300"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                    {renderItem(item, (newData) => handleEdit(index, newData))}
                </div>
            ))}

            <button
                onClick={onAdd}
                className="w-full py-3 border-2 border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2"
            >
                <span>➕</span>
                {addLabel}
            </button>
        </div>
    );
}
