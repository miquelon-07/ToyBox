import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateCategory: (cat: string) => void;
  categories?: string[];
  activeCategory?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onNavigateCategory,
  categories = ['Todos'],
  activeCategory = 'Todos',
}) => {
  const displayNavCategories = categories.slice(0, 5);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="group flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white flex items-center justify-center shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight font-toy text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 block leading-none">
                ToyBox
              </span>
              <span className="text-[11px] font-semibold text-rose-500 tracking-tight block mt-1">
                ¡Todo lo que te gusta en un solo lugar!
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-600">
          {displayNavCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onNavigateCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 text-left cursor-pointer ${
                activeCategory === cat
                  ? 'bg-pink-100 text-pink-700 font-extrabold shadow-2xs'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat === 'Todos' ? '⭐ Catálogo' : cat}
            </button>
          ))}
        </nav>

        {/* Zone 3: Cart Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir Carrito"
            className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 text-amber-200" />
            <span className="hidden sm:inline">Carrito</span>
            <span className="bg-amber-300 text-slate-900 font-extrabold px-2 py-0.5 rounded-full text-[11px] tabular-nums shadow-xs">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
