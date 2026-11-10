import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Producto } from './types';
import { DEFAULT_PRODUCTS, MATERIALES } from './data/defaultProducts';
import { fetchProductosFromSupabase, getSupabaseCredentials } from './services/supabase';
import { useCart } from './hooks/useCart';
import { DEFAULT_WHATSAPP_PHONE } from './utils/whatsapp';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppCheckoutModal } from './components/WhatsAppCheckoutModal';
import { SupabaseModal } from './components/SupabaseModal';
import { Footer } from './components/Footer';

import { Search, X, SlidersHorizontal, Sparkles, ArrowUpDown, RefreshCw, AlertCircle, MessageCircle } from 'lucide-react';

export default function App() {
  const [productos, setProductos] = useState<Producto[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [, setSupabaseMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('Todos');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'destacados' | 'precio-asc' | 'precio-desc' | 'nombre'>('destacados');

  // Modals & Drawers
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Producto | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState<boolean>(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'retiro' | 'envio'>('retiro');

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  // Cart hook with localStorage persistence
  const {
    items: cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount: cartTotalCount,
    subtotal: cartSubtotal,
  } = useCart();

  const catalogSectionRef = useRef<HTMLDivElement>(null);

  // Fetch products from Supabase on mount and whenever credentials change
  const loadProducts = async () => {
    setLoading(true);
    const { isCustom } = getSupabaseCredentials();

    if (!isCustom) {
      setProductos(DEFAULT_PRODUCTS);
      setIsSupabaseConnected(false);
      setSupabaseMessage('Modo catálogo de demostración activo');
      setLoading(false);
      return;
    }

    const res = await fetchProductosFromSupabase();
    if (res.isConnected && res.data && res.data.length > 0) {
      setProductos(res.data);
      setIsSupabaseConnected(true);
      setSupabaseMessage(`Conectado a Supabase: ${res.data.length} productos cargados.`);
    } else if (res.isConnected && res.data && res.data.length === 0) {
      setProductos(DEFAULT_PRODUCTS);
      setIsSupabaseConnected(true);
      setSupabaseMessage('Conectado a Supabase (la tabla productos está vacía).');
    } else {
      setProductos(DEFAULT_PRODUCTS);
      setIsSupabaseConnected(false);
      setSupabaseMessage(res.error || 'No se pudo conectar a Supabase, usando catálogo local.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleAddToCartWithToast = (producto: Producto, color?: string, quantity: number = 1) => {
    addToCart(producto, color, quantity);
    const chosenColor = color || producto.color;
    showToast(`✓ Agregado "${producto.nombre}" (${chosenColor})`);
  };

  const handleNavigateCategory = (cat: string) => {
    setSelectedCategoria(cat);
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCatalog = () => {
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Derived categories from current products
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('Todos');
    productos.forEach((p) => {
      if (p.categoria) cats.add(p.categoria.trim());
    });
    return Array.from(cats);
  }, [productos]);

  // Derived materials from current products
  const availableMateriales = useMemo(() => {
    const mats = new Set<string>();
    mats.add('Todos');
    productos.forEach((p) => {
      if (p.material) mats.add(p.material.trim());
    });
    return Array.from(mats);
  }, [productos]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return productos
      .filter((p) => {
        // Category filter
        if (selectedCategoria !== 'Todos') {
          if (p.categoria.toLowerCase() !== selectedCategoria.toLowerCase()) {
            return false;
          }
        }

        // Material filter
        if (selectedMaterial !== 'Todos') {
          if (!p.material.toLowerCase().includes(selectedMaterial.toLowerCase().replace('+', ''))) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.nombre.toLowerCase().includes(q);
          const matchDesc = p.descripcion.toLowerCase().includes(q);
          const matchMaterial = p.material.toLowerCase().includes(q);
          const matchColor = p.color.toLowerCase().includes(q);
          const matchCat = p.categoria.toLowerCase().includes(q);
          return matchName || matchDesc || matchMaterial || matchColor || matchCat;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'precio-asc') return a.precio - b.precio;
        if (sortBy === 'precio-desc') return b.precio - a.precio;
        if (sortBy === 'nombre') return a.nombre.localeCompare(b.nombre);
        if (a.destacado && !b.destacado) return -1;
        if (!a.destacado && b.destacado) return 1;
        return Number(a.id) - Number(b.id);
      });
  }, [productos, selectedCategoria, selectedMaterial, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-toy-mesh text-slate-900 selection:bg-pink-500 selection:text-white">
      {/* Main Header */}
      <Header
        cartCount={cartTotalCount}
        onOpenCart={() => setCartDrawerOpen(true)}
        onNavigateCategory={handleNavigateCategory}
        categories={availableCategories}
        activeCategory={selectedCategoria}
      />

      {/* Centered Hero Section */}
      <Hero onExplore={scrollToCatalog} productCount={productos.length} />

      {/* Main Catalog Viewport */}
      <main ref={catalogSectionRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        
        {/* Search & Filters Bar */}
        <section className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-pink-100 shadow-lg space-y-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre (ej. Stitch, Taza, Ta-Te-Ti), material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-3 text-xs bg-pink-50/40 hover:bg-pink-50/70 focus:bg-white border border-pink-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-500 transition-all placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Secondary Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Material Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 hidden sm:inline">Material:</span>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-pink-500 cursor-pointer"
                >
                  {availableMateriales.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-pink-500 cursor-pointer"
                >
                  <option value="destacados">Destacados</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="nombre">Nombre (A-Z)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Category Filter Buttons (Functional Tabs) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            <span className="text-xs font-extrabold text-pink-600 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1 font-toy">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Categorías:
            </span>
            {availableCategories.map((cat) => {
              const isActive = selectedCategoria === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoria(cat)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white shadow-md transform scale-105'
                      : 'bg-pink-50/60 hover:bg-pink-100/80 text-slate-700 hover:text-pink-600'
                  }`}
                >
                  {cat === 'Todos' ? '⭐ Todos los Artículos' : cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section Header & Results count */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold font-toy text-slate-900 tracking-tight">
              {selectedCategoria === 'Todos' ? 'Colección ToyBox' : selectedCategoria}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
              <span className="font-bold text-pink-600">{filteredProducts.length} creaciones listas</span>
              {selectedMaterial !== 'Todos' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-purple-600">Filtro: {selectedMaterial}</span>
                </>
              )}
              {searchQuery && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Búsqueda: "{searchQuery}"</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadProducts}
              title="Recargar catálogo desde Supabase"
              disabled={loading}
              className="p-2.5 text-pink-600 hover:text-pink-700 bg-white border border-pink-200 rounded-2xl hover:bg-pink-50 transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Grid Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-12">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-pink-100 p-4 space-y-3 animate-pulse"
              >
                <div className="aspect-4/3 bg-pink-100/50 rounded-2xl" />
                <div className="h-4 bg-pink-100/60 rounded-md w-3/4" />
                <div className="h-3 bg-pink-100/40 rounded-md w-1/2" />
                <div className="h-8 bg-pink-100/50 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-pink-100 p-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-500 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-toy text-slate-900">
                No encontramos productos con estos filtros
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Prueba buscando otro nombre o haz clic abajo para ver todo lo que tenemos.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoria('Todos');
                setSelectedMaterial('Todos');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAddToCart={(prod, col) => handleAddToCartWithToast(prod, col, 1)}
                onViewDetails={(prod) => setSelectedProductModal(prod)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Floating WhatsApp Quick Contact Button (Bottom Left) */}
      <aside aria-label="Contacto rápido" className="fixed bottom-6 left-6 z-40">
        <a
          href={`https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent('¡Hola ToyBox! Quiero consultar por un producto de la tienda.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs px-4 py-3 rounded-full shadow-2xl hover:shadow-emerald-500/40 transform hover:-translate-y-1 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 fill-current" />
          </div>
          <span className="hidden sm:inline">Chatea con ToyBox</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </aside>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-pink-500/30 animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="ml-2 text-pink-400 hover:text-pink-300 underline font-extrabold cursor-pointer"
          >
            Ver Carrito
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductModal
        producto={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        onAddToCart={handleAddToCartWithToast}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        onProceedToCheckout={() => {
          setCartDrawerOpen(false);
          setCheckoutModalOpen(true);
        }}
        deliveryMethod={deliveryMethod}
        onSetDeliveryMethod={setDeliveryMethod}
      />

      {/* WhatsApp Checkout Modal */}
      <WhatsAppCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        deliveryMethod={deliveryMethod}
        onOrderCompleted={() => {
          clearCart();
        }}
      />

      {/* Supabase Configuration Modal */}
      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        onCredentialsUpdated={() => {
          loadProducts();
        }}
        isCurrentlyConnected={isSupabaseConnected}
      />

      {/* Footer with Contacts */}
      <Footer />
    </div>
  );
}
