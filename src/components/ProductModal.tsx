import React, { useState, useEffect } from 'react';
import { Producto } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { X, Layers, Clock, ShieldCheck, Box, Plus, Minus, Check, ShoppingBag } from 'lucide-react';

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
  onAddToCart: (producto: Producto, selectedColor?: string, quantity?: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  producto,
  onClose,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  useEffect(() => {
    if (producto) {
      setSelectedColor(producto.colores_disponibles?.[0] || producto.color);
      setQuantity(1);
      setAdded(false);
    }
  }, [producto]);

  if (!producto) return null;

  const availableColors = producto.colores_disponibles || [producto.color];

  const handleAdd = () => {
    onAddToCart(producto, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-600 hover:text-neutral-900 flex items-center justify-center shadow-md transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-neutral-100 relative min-h-[260px] md:min-h-full flex items-center justify-center">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md">
            {producto.categoria}
          </div>
        </div>

        {/* Right: Technical Details & Actions */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                <span className="font-semibold text-amber-700">{producto.material}</span>
                <span aria-hidden="true">·</span>
                <span>Calidad Premium</span>
              </div>
              <h2 className="text-2xl font-bold font-toy text-slate-900 leading-tight">
                {producto.nombre}
              </h2>
              <p className="text-2xl font-extrabold text-pink-600 font-toy mt-1 tabular-nums">
                {formatCurrency(producto.precio)}
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {producto.descripcion}
            </p>

            {/* Technical 3D specs grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Tiempo Impresión</span>
                  <span className="font-bold text-slate-800">{producto.tiempo_impresion || '8 hs'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Dimensiones</span>
                  <span className="font-bold text-slate-800">{producto.dimensiones || '15 x 12 cm'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Relleno (Infill)</span>
                  <span className="font-bold text-slate-800">{producto.relleno || '20% Gyroid'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Material</span>
                  <span className="font-bold text-slate-800 truncate max-w-[100px]">{producto.material}</span>
                </div>
              </div>
            </div>

            {/* Color selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Selecciona tu Color: <span className="font-semibold text-pink-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedColor === c
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Cantidad:
              </label>
              <div className="inline-flex items-center border border-slate-300 rounded-xl p-1 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-extrabold font-toy tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAdd}
            className={`w-full py-4 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Agregado a tu pedido!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Agregar al Carrito • {formatCurrency(producto.precio * quantity)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
