import { CartItem, CheckoutCustomerData } from '../types';

export const DEFAULT_WHATSAPP_PHONE = '5493888418186'; // ToyBox Official WhatsApp
export const CONTACT_EMAIL = 'miquel.lopez047@gmail.com';
export const CONTACT_INSTAGRAM = 'miquel.lopezz';
export const CONTACT_INSTAGRAM_URL = 'https://instagram.com/miquel.lopezz';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderNumber(): string {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `TB-${day}${month}-${randomPart}`;
}

export function buildWhatsAppMessage(
  orderId: string,
  items: CartItem[],
  customer: CheckoutCustomerData,
  subtotal: number,
  shippingCost: number,
  total: number
): string {
  const dateStr = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const lines: string[] = [
    `¡Hola *ToyBox*! 🧸✨ ¡Todo lo que te gusta en un solo lugar!`,
    `Quiero confirmar un nuevo pedido desde la tienda:`,
    ``,
    `📋 *ORDEN:* ${orderId}`,
    `📅 *Fecha:* ${dateStr}`,
    `👤 *Cliente:* ${customer.nombre.trim()}`,
    `📱 *WhatsApp:* ${customer.telefono.trim()}`,
    `🚚 *Entrega:* ${
      customer.metodo_entrega === 'retiro'
        ? 'Retiro en Taller (Gratis)'
        : `Envío a domicilio (${customer.direccion || 'Dirección a coordinar'}, ${customer.ciudad || ''})`
    }`,
    ``,
    `🛒 *DETALLE DEL PEDIDO:*`,
    `───────────────────────`,
  ];

  items.forEach((item, index) => {
    const itemSubtotal = item.precio * item.cantidad;
    lines.push(
      `${index + 1}. *${item.nombre}*`,
      `   • Cantidad: ${item.cantidad} u.`,
      `   • Material: ${item.material}`,
      `   • Color: ${item.color}`,
      `   • Precio unitario: ${formatCurrency(item.precio)}`,
      `   • Subtotal: ${formatCurrency(itemSubtotal)}`,
      ``
    );
  });

  lines.push(
    `───────────────────────`,
    `Subtotal: ${formatCurrency(subtotal)}`,
    shippingCost > 0 ? `Costo de envío: ${formatCurrency(shippingCost)}` : `Envío: ¡GRATIS! 🎉`,
    `*TOTAL A PAGAR: ${formatCurrency(total)}*`,
    `───────────────────────`
  );

  if (customer.notas && customer.notas.trim()) {
    lines.push(
      ``,
      `💬 *Notas o personalización:*`,
      `"${customer.notas.trim()}"`
    );
  }

  lines.push(
    ``,
    `¿Podrían confirmarme los tiempos de impresión y los datos para el pago? ¡Muchas gracias! 🙌`
  );

  return lines.join('\n');
}

export function openWhatsAppCheckout(
  phoneNumber: string,
  message: string
): void {
  // Clean phone number (strip spaces, symbols)
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}
