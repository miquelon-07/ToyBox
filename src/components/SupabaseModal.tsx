import React, { useState, useEffect } from 'react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
  SUPABASE_SQL_SCRIPT,
  PLACEHOLDER_URL,
  PLACEHOLDER_KEY,
} from '../services/supabase';
import { X, Database, Check, AlertCircle, Copy, CheckCheck, RefreshCw } from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCredentialsUpdated: () => void;
  isCurrentlyConnected: boolean;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onCredentialsUpdated,
  isCurrentlyConnected,
}) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url);
      setKey(creds.key);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(url, key);
    setTestResult(result);
    setTesting(false);

    if (result.success) {
      saveSupabaseCredentials(url, key);
      onCredentialsUpdated();
    }
  };

  const handleSaveAnyway = () => {
    saveSupabaseCredentials(url, key);
    onCredentialsUpdated();
    onClose();
  };

  const handleResetToDemo = () => {
    clearSupabaseCredentials();
    setUrl(PLACEHOLDER_URL);
    setKey(PLACEHOLDER_KEY);
    setTestResult({
      success: true,
      message: 'Restablecido al catálogo local de LA CASITA 3D.',
    });
    onCredentialsUpdated();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
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
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-emerald-200 flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-neutral-900 leading-tight">
                Conexión a Base de Datos Supabase
              </h2>
              <span className="text-xs text-neutral-500">
                Consumo de la tabla <code className="bg-neutral-200 px-1 py-0.5 rounded text-[11px] font-mono">productos</code>
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

        {/* Tab switch */}
        <div className="flex border-b border-neutral-200 px-6 pt-3 bg-neutral-50/40">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 text-xs font-semibold px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Configuración & Credenciales
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 text-xs font-semibold px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sql'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Script SQL para Crear la Tabla
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'config' ? (
            <form onSubmit={handleSaveAndTest} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-neutral-100/70 border border-neutral-200 text-xs text-neutral-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isCurrentlyConnected ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />
                  <strong className="text-neutral-900">
                    Estado actual:{' '}
                    {isCurrentlyConnected
                      ? 'Conectado a Supabase en Vivo'
                      : 'Modo Local / Demostración'}
                  </strong>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Ingresa tu <strong>URL</strong> y <strong>Anon Key</strong> de tu proyecto Supabase para sincronizar los productos en tiempo real desde la tabla <code>productos</code>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Supabase URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Valor solicitado: [INSERTAR_TU_SUPABASE_URL]
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Supabase Anon Key
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Valor solicitado: [INSERTAR_TU_SUPABASE_ANON_KEY]
                </span>
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {testResult.success ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block">
                      {testResult.success ? 'Conexión Exitosa' : 'Aviso de Conexión'}
                    </span>
                    <span className="text-[11px] leading-relaxed">{testResult.message}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={handleResetToDemo}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Cargar Datos Locales</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAnyway}
                    className="px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Guardar
                  </button>

                  <button
                    type="submit"
                    disabled={testing}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {testing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Probando...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Probar y Conectar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-600">
                  Copia y pega este script en el <strong>SQL Editor</strong> de tu proyecto Supabase para inicializar la tabla <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">productos</code> con el esquema requerido:
                </p>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 text-xs font-semibold bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
                >
                  {copiedSql ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed selection:bg-amber-400 selection:text-neutral-950">
                {SUPABASE_SQL_SCRIPT}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
