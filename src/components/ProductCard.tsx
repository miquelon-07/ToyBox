import React, { useState } from 'react';
import { Producto } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { Plus, Check, Eye, Box, Clock } from 'lucide-react';

interface ProductCardProps {
  producto: Producto;
  onAddToCart: (producto: Producto, selectedColor?: string) => void;
  onViewDetails: (producto: Producto) => void;
}

// Map color names to approximate hex codes for color swatches
const COLOR_HEX_MAP: Record<string, string> = {
  'Esmeralda & Oro': 'linear-gradient(135deg, #059669 50%, #d97706 50%)',
  'Púrpura Galáctico': '#7c3aed',
  'Negro Obsidiana': '#18181b',
  'Rojo Rubí': '#dc2626',
  'Blanco Marfil Cálido': '#fef3c7',
  'Arena Texturada': '#d6d3d1',
  'Gris Perla': '#94a3b8',
  'Terracota Mate': '#c2410c',
  'Verde Salvia': '#65a30d',
  'Mostaza Cálido': '#ca8a04',
  'Gris Concreto': '#64748b',
  'Negro Mate & Cyan': 'linear-gradient(135deg, #18181b 50%, #06b6d4 50%)',
  'Blanco Ártico & Rojo': 'linear-gradient(135deg, #ffffff 50%, #ef4444 50%)',
  'Gris Grafito Puro': '#334155',
  'Turquesa & Magenta': 'linear-gradient(135deg, #06b6d4 50%, #ec4899 50%)',
  'Dorado Real': '#eab308',
  'Azul Océano': '#0284c7',
  'Violeta Neón': '#8b5cf6',
  'Blanco Lunar': '#f8fafc',
  'Mármol Suave': '#e2e8f0',
  'Gris Carbón': '#27272a',
  'Azul Petróleo': '#0f766e',
  'Blanco Hueso': '#f5f5f4',
  'Gris Armadura': '#475569',
  'Negro Mate Imprimado': '#09090b',
  'Bronce Envejecido': '#78350f',
  'Blanco & Negro Minimalista': 'linear-gradient(135deg, #ffffff 50%, #000000 50%)',
  'Rojo Carmesí': '#b91c1c',
  'Negro Stealth': '#171717',
  'Bronce Cobrizo': '#92400e',
  'Champagne Metalizado': '#d4b996',
  'Azul Profundo': '#1e3a8a',
  'Rosa Pastel & Blanco': 'linear-gradient(135deg, #fbcfe8 50%, #ffffff 50%)',
  'Menta Suave': '#a7f3d0',
  'Blanco Puro': '#ffffff',
  'Verde Flúor': '#4ade80',
  'Naranja Neón': '#fb923c',
  'Negro Mate': '#18181b',
  'Azul Eléctrico': '#2563eb',
  // Direct colors from Supabase
  'Violeta': '#8b5cf6',
  'Blanco': '#ffffff',
  'Verde': '#10b981',
  'Amarillo': '#facc15',
  'Azul': '#2563eb',
  'Rojo': '#ef4444',
  'Negro': '#18181b',
  'Rosa': '#ec4899',
  'Gris': '#64748b',
  'Naranja': '#f97316',
};

function getSwatchStyle(colorName: string): React.CSSProperties {
  const normalized = colorName.trim();
  const matched = COLOR_HEX_MAP[normalized];
  if (matched) {
    if (matched.startsWith('linear-gradient')) {
      return { background: matched };
    }
    return { backgroundColor: matched };
  }

  // Check simple lowercase matches
  const lower = normalized.toLowerCase();
  if (lower.includes('violeta') || lower.includes('morado') || lower.includes('púrpura')) return { backgroundColor: '#8b5cf6' };
  if (lower.includes('blanco')) return { backgroundColor: '#ffffff', border: '1px solid #d4d4d8' };
  if (lower.includes('verde')) return { backgroundColor: '#10b981' };
  if (lower.includes('amarillo')) return { backgroundColor: '#facc15' };
  if (lower.includes('azul') || lower.includes('cyan')) return { backgroundColor: '#2563eb' };
  if (lower.includes('rojo')) return { backgroundColor: '#ef4444' };
  if (lower.includes('negro')) return { backgroundColor: '#18181b' };
  if (lower.includes('rosa')) return { backgroundColor: '#ec4899' };
  if (lower.includes('gris')) return { backgroundColor: '#64748b' };
  if (lower.includes('naranja')) return { backgroundColor: '#f97316' };

  return { backgroundColor: '#a1a1aa' };
}

export const ProductCard: React.FC<ProductCardProps> = ({
  producto,
  onAddToCart,
  onViewDetails,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    producto.colores_disponibles?.[0] || producto.color
  );
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(producto, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const availableColors = producto.colores_disponibles || [producto.color];

  return (
    <article className="group relative flex flex-col bg-white rounded-3xl border border-pink-100/90 overflow-hidden hover:border-pink-300 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image Area with Fallback */}
      <div
        onClick={() => onViewDetails(producto)}
        className="relative aspect-4/3 w-full bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 overflow-hidden cursor-pointer"
      >
        {!imgError ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-400">
            <Box className="w-12 h-12 text-pink-400 mb-2 stroke-[1.5]" />
            <span className="text-xs font-bold text-slate-600 text-center font-toy">
              ToyBox 3D Studio
            </span>
          </div>
        )}

        {/* Quick View Floating Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(producto);
            }}
            className="px-4 py-2 bg-white/95 hover:bg-white text-pink-600 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Detalles</span>
          </button>
        </div>

        {/* Top badges (Material & Print time) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
            {producto.material}
          </span>
          {producto.tiempo_impresion && (
            <span className="text-[11px] font-semibold bg-white/95 backdrop-blur-xs text-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Clock className="w-3 h-3 text-amber-500" />
              {producto.tiempo_impresion}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & Material Metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <span className="font-bold text-pink-600">{producto.categoria}</span>
          <span aria-hidden="true" className="text-pink-300">·</span>
          <span>Infill 20%</span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onViewDetails(producto)}
          className="text-base font-bold font-toy text-slate-900 hover:text-pink-600 transition-colors cursor-pointer line-clamp-1 mb-1.5"
          title={producto.nombre}
        >
          {producto.nombre}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {producto.descripcion}
        </p>

        {/* Color Selector Area */}
        <div className="mb-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-500 font-semibold">Color:</span>
            <span className="font-bold text-purple-700 text-[11px] truncate max-w-[150px]">
              {selectedColor}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {availableColors.map((colorName) => {
              const isSelected = selectedColor === colorName;
              return (
                <button
                  key={colorName}
                  type="button"
                  onClick={() => setSelectedColor(colorName)}
                  title={colorName}
                  className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-pink-500 ring-offset-2 scale-110 border-white shadow-xs'
                      : 'border-slate-300 opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                  style={getSwatchStyle(colorName)}
                />
              );
            })}
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Precio
            </span>
            <span className="text-xl font-extrabold text-pink-600 font-toy tabular-nums">
              {formatCurrency(producto.precio)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
