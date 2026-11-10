export interface Producto {
  id: string | number;
  nombre: string;
  descripcion: string;
  material: string;
  precio: number;
  color: string;
  colores_disponibles?: string[];
  imagen: string;
  categoria: string;
  destacado?: boolean;
  tiempo_impresion?: string;
  dimensiones?: string;
  relleno?: string;
}

export interface CartItem {
  cart_item_id: string; // unique ID in cart for product + color combo
  producto_id: string | number;
  nombre: string;
  material: string;
  color: string;
  precio: number;
  imagen: string;
  cantidad: number;
  tiempo_impresion?: string;
}

export interface CheckoutCustomerData {
  nombre: string;
  telefono: string;
  metodo_entrega: 'retiro' | 'envio';
  direccion?: string;
  ciudad?: string;
  notas?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  error?: string | null;
}
