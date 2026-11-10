import React from 'react';
import { Sparkles, MessageCircle, Instagram, Mail, Heart, Send } from 'lucide-react';
import {
  DEFAULT_WHATSAPP_PHONE,
  CONTACT_EMAIL,
  CONTACT_INSTAGRAM_URL,
} from '../utils/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 text-slate-300 pt-16 pb-12 border-t border-purple-900/50 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner '¡Escríbenos!' movido de la parte superior al pié de página */}
        <div className="mb-12 p-6 rounded-3xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-indigo-500/15 border border-pink-400/25 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center lg:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="bg-pink-500 text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wide">
                  ¡Escríbenos! 🚀
                </span>
                <span className="text-xs font-semibold text-pink-200">
                  Atención personalizada en ToyBox
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-toy text-white">
                ¿Consultas, pedidos especiales o dudas? ¡Estamos para ayudarte!
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent('¡Hola ToyBox! Quiero hacer una consulta.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-extrabold transition-all shadow-md active:scale-95"
              title="Escribir a WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp: +54 9 3888 418186</span>
            </a>

            {/* Instagram */}
            <a
              href={CONTACT_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-extrabold transition-all shadow-md active:scale-95"
              title="Instagram @miquel.lopezz"
            >
              <Instagram className="w-4 h-4" />
              <span>@miquel.lopezz</span>
            </a>

            {/* Gmail */}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Consulta ToyBox - ¡Todo lo que te gusta en un solo lugar!')}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition-all shadow-md active:scale-95"
              title="Enviar correo a miquel.lopez047@gmail.com"
            >
              <Mail className="w-4 h-4" />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand & Slogan */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white flex items-center justify-center font-bold shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-3xl font-extrabold font-toy tracking-tight text-white">
                ToyBox
              </span>
            </div>
            
            <p className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">
              «¡Todo lo que te gusta en un solo lugar!»
            </p>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Taller de impresión 3D, regalos originales, figuras coleccionables y accesorios personalizados. Transformamos polímeros biodegradables en felicidad.
            </p>
          </div>

          {/* Social Channels & Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300">
              Canales de Contacto Directo
            </h4>
            <ul className="text-xs space-y-2.5">
              <li>
                <a
                  href={`https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent('¡Hola ToyBox!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                  <span>WhatsApp: +54 9 3888 418186</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-400 hover:text-pink-300 font-medium transition-colors"
                >
                  <Instagram className="w-4 h-4 shrink-0" />
                  <span>Instagram: @miquel.lopezz</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Consulta%20ToyBox`}
                  className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Gmail: {CONTACT_EMAIL}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Direct CTA Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              ¿Tienes una idea en mente?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hacemos pedidos personalizados por mayor y menor con envíos a todo el país.
            </p>
            <a
              href={`https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent('¡Hola ToyBox! Quiero pedir un presupuesto para una idea personalizada.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Chatear ahora</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ToyBox. ¡Todo lo que te gusta en un solo lugar!</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Hecho con</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span>para creadores y fanáticos</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
