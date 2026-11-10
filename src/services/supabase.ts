import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Producto } from '../types';

// Default Supabase credentials provided for LA CASITA 3D
export const DEFAULT_SUPABASE_URL = 'https://hqeylvcybysheaqsttko.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_zsWekB4wFaTwujMWL46n1g_F36BuF2t';
export const PLACEHOLDER_URL = DEFAULT_SUPABASE_URL;
export const PLACEHOLDER_KEY = DEFAULT_SUPABASE_KEY;

const STORAGE_KEY_URL = 'la_casita_3d_supabase_url';
const STORAGE_KEY_ANON = 'la_casita_3d_supabase_anon_key';

let cachedClient: SupabaseClient | null = null;
let currentUrl: string = '';
let currentKey: string = '';

export function getSupabaseCredentials(): { url: string; key: string; isCustom: boolean } {
  // Check localStorage first (user-entered or modified in UI)
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ANON) : null;

  if (storedUrl && storedKey) {
    return { url: storedUrl.trim(), key: storedKey.trim(), isCustom: true };
  }

  // Next check environment variables if defined
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (envUrl && envKey && !envUrl.includes('INSERTAR') && !envKey.includes('INSERTAR')) {
    return { url: envUrl, key: envKey, isCustom: true };
  }

  // Use provided official Supabase instance by default
  return {
    url: DEFAULT_SUPABASE_URL,
    key: DEFAULT_SUPABASE_KEY,
    isCustom: true,
  };
}

export function saveSupabaseCredentials(url: string, key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_ANON, key.trim());
  }
  cachedClient = null; // force re-create client
}

export function clearSupabaseCredentials(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_ANON);
  }
  cachedClient = null;
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key) {
    return null;
  }

  if (cachedClient && currentUrl === url && currentKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });
    currentUrl = url;
    currentKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Error al inicializar cliente de Supabase:', err);
    return null;
  }
}

/**
 * Test a specific URL and Key pair
 */
export async function testSupabaseConnection(
  testUrl: string,
  testKey: string
): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    if (!testUrl || !testKey) {
      return { success: false, message: 'La URL y la Key no pueden estar vacías.' };
    }

    const client = createClient(testUrl.trim(), testKey.trim());
    const { data, error, count } = await client
      .from('productos')
      .select('*', { count: 'exact', head: false })
      .limit(1);

    if (error) {
      return {
        success: false,
        message: `Error de Supabase: ${error.message} (Código: ${error.code || 'Desconocido'})`,
      };
    }

    return {
      success: true,
      message: `¡Conexión exitosa con la tabla 'productos'! Encontrados ${count ?? data?.length ?? 0} registros.`,
      count: count ?? data?.length ?? 0,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Error al conectar: ${err?.message || 'Verifica la URL y la Key.'}`,
    };
  }
}

/**
 * Smartly infer category if not present in row
 */
function inferCategory(nombre: string = '', descripcion: string = ''): string {
  const text = `${nombre} ${descripcion}`.toLowerCase();
  if (text.includes('taza') || text.includes('vaso') || text.includes('plato') || text.includes('mate')) {
    return 'Hogar & Bazar';
  }
  if (text.includes('soporte') || text.includes('cepillo') || text.includes('baño') || text.includes('organizador')) {
    return 'Organizadores & Hogar';
  }
  if (text.includes('ta-te-ti') || text.includes('juego') || text.includes('mesa') || text.includes('articulado')) {
    return 'Juegos & Entretenimiento';
  }
  if (text.includes('stitch') || text.includes('figura') || text.includes('peluche') || text.includes('coleccionable') || text.includes('muñeco')) {
    return 'Figuras & Coleccionables';
  }
  if (text.includes('maceta') || text.includes('planta') || text.includes('jardín')) {
    return 'Macetas & Deco';
  }
  if (text.includes('lámpara') || text.includes('lampara') || text.includes('luz') || text.includes('led')) {
    return 'Lámparas';
  }
  if (text.includes('gamer') || text.includes('auricular') || text.includes('mando') || text.includes('joystick')) {
    return 'Gamer & Tech';
  }
  return 'Diseño 3D';
}

/**
 * Clean and parse color strings (e.g. "Violeta, Blanco, Verde", "Violeta, Blanco, Amarillo.")
 */
function parseColors(colorField: any, colorArrayField?: any): { primaryColor: string; availableColors: string[] } {
  if (Array.isArray(colorArrayField) && colorArrayField.length > 0) {
    const cleaned = colorArrayField.map((c) => String(c).replace(/\.$/, '').trim()).filter(Boolean);
    return { primaryColor: cleaned[0] || 'Multicolor', availableColors: cleaned };
  }

  if (typeof colorField === 'string' && colorField.trim()) {
    // Check if it's comma-separated
    const parts = colorField
      .split(/[,/]/)
      .map((c) => c.replace(/\.$/, '').trim())
      .filter((c) => c.length > 0);

    if (parts.length > 1) {
      return {
        primaryColor: parts[0],
        availableColors: parts,
      };
    }

    const single = colorField.replace(/\.$/, '').trim();
    return {
      primaryColor: single,
      availableColors: [single],
    };
  }

  return { primaryColor: 'Multicolor', availableColors: ['Multicolor'] };
}

/**
 * Fetch products from the 'productos' table in Supabase
 */
export async function fetchProductosFromSupabase(): Promise<{
  data: Producto[] | null;
  error: string | null;
  isConnected: boolean;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      data: null,
      error: 'Supabase no está configurado.',
      isConnected: false,
    };
  }

  try {
    const { data, error } = await client
      .from('productos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('Error al consultar tabla productos en Supabase:', error);
      return {
        data: null,
        error: `Error en tabla 'productos': ${error.message}`,
        isConnected: false,
      };
    }

    if (!data || data.length === 0) {
      return {
        data: [],
        error: null,
        isConnected: true,
      };
    }

    // Map database fields to the application Producto type
    const mapped: Producto[] = data.map((item: any) => {
      const { primaryColor, availableColors } = parseColors(item.color, item.colores_disponibles);
      const categoria = item.categoria || inferCategory(item.nombre, item.descripcion);

      // Resolve image: priority to imagen_url, then imagen
      const imagen =
        item.imagen_url ||
        item.imagen ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

      return {
        id: item.id,
        nombre: item.nombre || 'Producto 3D',
        descripcion: item.descripcion || 'Pieza impresa en 3D de alta precisión.',
        material: item.material || 'Filamento PLA',
        precio: Number(item.precio) || 0,
        color: primaryColor,
        colores_disponibles: availableColors,
        imagen,
        categoria,
        destacado: Boolean(item.destacado ?? false),
        tiempo_impresion: item.tiempo_impresion || '6-10 hs',
        dimensiones: item.dimensiones || 'Estándar',
        relleno: item.relleno || '20% Gyroid',
      };
    });

    return {
      data: mapped,
      error: null,
      isConnected: true,
    };
  } catch (err: any) {
    console.error('Excepción al conectar con Supabase:', err);
    return {
      data: null,
      error: err?.message || 'Error de conexión de red con Supabase',
      isConnected: false,
    };
  }
}

/**
 * SQL script template for reference or adding more items
 */
export const SUPABASE_SQL_SCRIPT = `-- ==========================================
-- SCRIPT SQL PARA LA CASITA 3D EN SUPABASE
-- ==========================================

-- Tabla 'productos' existente:
-- id (bigint), created_at (timestamptz), nombre (text),
-- descripcion (text), material (text), imagen_url (text),
-- color (text), precio (numeric)

SELECT * FROM productos;
`;
