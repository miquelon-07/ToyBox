import React from 'react';
import { Sparkles, MessageCircle, ArrowDown, Heart, Package, Zap } from 'lucide-react';
import { DEFAULT_WHATSAPP_PHONE } from '../utils/whatsapp';

interface HeroProps {
  onExplore: () => void;
  productCount: number;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, productCount }) => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-b border-pink-100 bg-slate-900 text-white">
      {/* Background Video & Photo Collage with Vibrant Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80"
          className="w-full h-full object-cover opacity-25 scale-105 filter blur-[1px]"
        >
          {/* High-quality looping creative 3D printing / art video asset */}
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dynamic colorful gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-purple-950/70 to-slate-950/90" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
      </div>

      {/* Main Centered Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Floating playful badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-pink-400/40 backdrop-blur-md text-pink-300 text-xs font-bold tracking-wide shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Fábrica Creativa de Regalos, Figuras y Coleccionables</span>
          <span className="text-amber-300">★</span>
        </div>

        {/* Big Centered Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-toy tracking-tight leading-[1.05]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">
              ToyBox
            </span>
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold font-toy text-white text-balance drop-shadow-md">
            ¡Todo lo que te gusta en un solo lugar!
          </p>
        </div>

        {/* Centered Primary Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onExplore}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white font-extrabold text-sm rounded-2xl shadow-xl hover:shadow-pink-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Ver Catálogo ({productCount} Diseños)</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <a
            href={`https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent('¡Hola ToyBox! Me interesa hacer un pedido personalizado.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Consultar x WhatsApp</span>
          </a>
        </div>

        {/* Centered Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <Zap className="w-5 h-5 text-amber-300 mx-auto" />
            <h4 className="text-xs font-bold text-white">Impresión Rápida</h4>
            <p className="text-[11px] text-slate-300">Material PLA resistente</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <Heart className="w-5 h-5 text-pink-400 mx-auto" />
            <h4 className="text-xs font-bold text-white">Personalizado</h4>
            <p className="text-[11px] text-slate-300">Colores a tu elección</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <Package className="w-5 h-5 text-cyan-300 mx-auto" />
            <h4 className="text-xs font-bold text-white">Listos para Regalo</h4>
            <p className="text-[11px] text-slate-300">Packaging protegido</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <MessageCircle className="w-5 h-5 text-emerald-300 mx-auto" />
            <h4 className="text-xs font-bold text-white">Pedido x WhatsApp</h4>
            <p className="text-[11px] text-slate-300">Atención uno a uno</p>
          </div>
        </div>

      </div>
    </section>
  );
};
