import React, { useState } from 'react';
import { CartItem, CheckoutCustomerData } from '../types';
import {
  buildWhatsAppMessage,
  generateOrderNumber,
  openWhatsAppCheckout,
  DEFAULT_WHATSAPP_PHONE,
  formatCurrency,
} from '../utils/whatsapp';
import confetti from 'canvas-confetti';
import { X, MessageSquare, Send, CheckCircle2, Phone, User, MapPin } from 'lucide-react';

interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  deliveryMethod: 'retiro' | 'envio';
  onOrderCompleted: () => void;
}

export const WhatsAppCheckoutModal: React.FC<WhatsAppCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  deliveryMethod,
  onOrderCompleted,
}) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [notas, setNotas] = useState('');
  const [storePhone, setStorePhone] = useState(DEFAULT_WHATSAPP_PHONE);
  const [showConfigPhone, setShowConfigPhone] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [orderNumber] = useState(() => generateOrderNumber());

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 35000;
  const STANDARD_SHIPPING_COST = 3200;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = deliveryMethod === 'retiro' ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shippingCost;

  const customerData: CheckoutCustomerData = {
    nombre: nombre || 'Cliente',
    telefono: telefono || '-',
    metodo_entrega: deliveryMethod,
    direccion,
    ciudad,
    notas,
  };

  const generatedMessage = buildWhatsAppMessage(
    orderNumber,
    items,
    customerData,
    subtotal,
    shippingCost,
    total
  );

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('Por favor ingresa tu nombre para el pedido.');
      return;
    }

    // Launch confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    // Open WhatsApp
    openWhatsAppCheckout(storePhone, generatedMessage);

    setOrderSent(true);
  };

  const handleFinish = () => {
    onOrderCompleted();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-toy text-slate-900 leading-tight">
                Cierre de Pedido por WhatsApp
              </h2>
              <span className="text-xs text-slate-500">
                Orden <strong className="text-pink-600 font-bold">{orderNumber}</strong> · ToyBox
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-8 h-8 rounded-full bg-white hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {orderSent ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold font-display text-neutral-900">
                ¡Pedido Enviado a WhatsApp!
              </h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                Se abrió la ventana de WhatsApp con todos los datos y el desglose de tu orden. 
                Si la ventana no se abrió automáticamente, puedes hacer clic en el botón de abajo.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => openWhatsAppCheckout(storePhone, generatedMessage)}
                  className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer"
                >
                  Reabrir WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Listo, Vaciar Carrito
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendToWhatsApp} className="space-y-6">
              {/* Customer Info Form */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  1. Tus Datos de Contacto
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Nombre y Apellido *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Ej. Lucas Gómez"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Tu Teléfono / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="Ej. 11 5555 4444"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>
                </div>

                {deliveryMethod === 'envio' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Dirección de Envío *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Calle, Número, Piso/Depto"
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Ciudad / Localidad
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. CABA, Córdoba, Rosario..."
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Notas adicionales o personalizaciones (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Grabado de nombre, combinación de colores especial..."
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Message Live Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    2. Vista Previa del Mensaje Estructurado
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowConfigPhone(!showConfigPhone)}
                    className="text-[11px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                  >
                    {showConfigPhone ? 'Ocultar número tienda' : 'Cambiar número de WhatsApp'}
                  </button>
                </div>

                {showConfigPhone && (
                  <div className="p-3 bg-neutral-100 rounded-xl text-xs space-y-1">
                    <label className="font-medium text-slate-700 block">
                      Número de WhatsApp de ToyBox (ej. 5493888418186):
                    </label>
                    <input
                      type="text"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg"
                    />
                  </div>
                )}

                <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-neutral-200/80 text-neutral-800 text-xs font-mono whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed shadow-inner">
                  {generatedMessage}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-500 block">Total a transferir / abonar:</span>
                  <span className="text-xl font-bold font-display text-neutral-950 tabular-nums">
                    {formatCurrency(total)}
                  </span>
                </div>
                <div className="text-right text-xs text-neutral-500">
                  <span>{items.reduce((acc, i) => acc + i.cantidad, 0)} productos</span>
                  <span className="block text-[11px] text-emerald-600 font-semibold">
                    {deliveryMethod === 'retiro' ? 'Retiro en Taller' : 'Envío a Domicilio'}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Confirmar y Enviar a WhatsApp</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
