import React from 'react';
import { CartItem } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Truck, Store } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  deliveryMethod: 'retiro' | 'envio';
  onSetDeliveryMethod: (method: 'retiro' | 'envio') => void;
}

const FREE_SHIPPING_THRESHOLD = 35000;
const STANDARD_SHIPPING_COST = 3200;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  deliveryMethod,
  onSetDeliveryMethod,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = deliveryMethod === 'retiro' ? 0 : (isFreeShipping ? 0 : STANDARD_SHIPPING_COST);
  const grandTotal = subtotal + shippingCost;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-400 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-toy text-slate-900">
                  Carrito ToyBox
                </h2>
                <span className="text-xs text-rose-500 font-semibold">
                  {items.length === 0
                    ? 'Carrito vacío'
                    : `${items.reduce((acc, i) => acc + i.cantidad, 0)} artículos seleccionados`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-neutral-500 hover:text-red-600 transition-colors px-2 py-1 cursor-pointer"
                  title="Vaciar todo el carrito"
                >
                  Vaciar
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Cerrar carrito"
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Free shipping progress strip */}
          {items.length > 0 && (
            <div className="bg-amber-50/70 border-b border-amber-100 px-6 py-2.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-amber-900 mb-1">
                <span>
                  {isFreeShipping ? (
                    <strong className="text-emerald-700">¡Felicidades! Tenés Envío Gratis 🚀</strong>
                  ) : (
                    <span>
                      Sumá <strong className="tabular-nums">{formatCurrency(amountNeededForFreeShipping)}</strong> para Envío Gratis
                    </span>
                  )}
                </span>
                <span className="tabular-nums">{progressToFreeShipping}%</span>
              </div>
              <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isFreeShipping ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-neutral-500 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">Tu carrito está vacío</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    Explora nuestras figuras articuladas, lámparas y diseños exclusivos para comenzar.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-neutral-950 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="flex gap-4 p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 rounded-lg object-cover bg-white shrink-0 border border-neutral-200/60"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                          {item.nombre}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.cart_item_id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-neutral-500 space-x-1.5 mt-0.5">
                        <span>{item.material}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-neutral-700">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-neutral-200/50">
                      <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.cart_item_id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-l cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold font-display tabular-nums">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cart_item_id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-r cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-neutral-950 font-display tabular-nums">
                          {formatCurrency(item.precio * item.cantidad)}
                        </span>
                        {item.cantidad > 1 && (
                          <span className="block text-[10px] text-neutral-400 tabular-nums">
                            {formatCurrency(item.precio)} c/u
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals and WhatsApp CTA */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-neutral-50/50 space-y-4">
              
              {/* Delivery selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-700 block">
                  Método de Entrega:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSetDeliveryMethod('retiro')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      deliveryMethod === 'retiro'
                        ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                        : 'border-neutral-200 bg-neutral-50 hover:bg-white text-neutral-600'
                    }`}
                  >
                    <Store className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block text-neutral-900 leading-tight">Retiro Taller</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Gratis</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSetDeliveryMethod('envio')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      deliveryMethod === 'envio'
                        ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                        : 'border-neutral-200 bg-neutral-50 hover:bg-white text-neutral-600'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block text-neutral-900 leading-tight">Envío</span>
                      <span className="text-[10px] text-neutral-500 tabular-nums">
                        {isFreeShipping ? 'Gratis' : formatCurrency(STANDARD_SHIPPING_COST)}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-200/60">
                <div className="flex justify-between">
                  <span>Subtotal productos:</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">
                    {deliveryMethod === 'retiro'
                      ? 'Gratis (Retiro)'
                      : isFreeShipping
                      ? '¡Gratis!'
                      : formatCurrency(STANDARD_SHIPPING_COST)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>Total estimado:</span>
                  <span className="font-display tabular-nums text-amber-600">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* WhatsApp Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Finalizar Pedido por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-neutral-400">
                Se generará un mensaje estructurado con el resumen para enviar a nuestro WhatsApp.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
