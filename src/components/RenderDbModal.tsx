import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink, 
  RefreshCw, 
  Play, 
  Unplug, 
  ShieldCheck, 
  Copy, 
  Check, 
  Cpu, 
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RenderDbModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RenderDbModal: React.FC<RenderDbModalProps> = ({ isOpen, onClose }) => {
  const { 
    renderDbStatus, 
    connectToRenderDb, 
    disconnectRenderDb, 
    testRenderDbQuery, 
    syncWithRenderDb 
  } = useApp();

  const [dbUrl, setDbUrl] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [queryResult, setQueryResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const isConnected = !!renderDbStatus?.connected;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUrl.trim()) {
      setActionMessage({ type: 'error', text: 'Please enter a valid PostgreSQL connection string.' });
      return;
    }

    setConnecting(true);
    setActionMessage(null);
    try {
      const res = await connectToRenderDb(dbUrl.trim());
      if (res.success) {
        setActionMessage({ type: 'success', text: res.message || 'Successfully connected to Render PostgreSQL!' });
        setDbUrl('');
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Connection failed. Please verify credentials.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Error connecting to database server.' });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectRenderDb();
      setActionMessage({ type: 'info', text: 'Disconnected from Render PostgreSQL. Switched to offline storage.' });
      setQueryResult(null);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: 'Failed to disconnect.' });
    }
  };

  const handleTestQuery = async () => {
    setTesting(true);
    setActionMessage(null);
    try {
      const res = await testRenderDbQuery();
      if (res.success) {
        setActionMessage({ type: 'success', text: 'Test query succeeded! PostgreSQL server is responsive.' });
        setQueryResult(JSON.stringify(res.data, null, 2));
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Test query failed.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Query execution error.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setActionMessage(null);
    try {
      const res = await syncWithRenderDb();
      if (res.success) {
        setActionMessage({ type: 'success', text: res.message || 'All courses, users, and transactions synced to Render DB!' });
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Sync failed.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Data synchronization error.' });
    } finally {
      setSyncing(false);
    }
  };

  const copySampleUrl = () => {
    const sample = 'postgresql://render_user:pass123@dpg-c0123456789-a.oregon-postgres.render.com/courserax_db';
    navigator.clipboard.writeText(sample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-[#002147] text-white p-6 flex items-start justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sky-500/20 text-sky-200 border border-sky-400/30">
                  Cloud Infrastructure
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                  isConnected 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}>
                  {isConnected ? '● Connected' : '○ Standby / Local Mode'}
                </span>
              </div>
              <h3 className="text-xl font-bold flex items-center gap-2.5">
                <Database className="w-5 h-5 text-sky-300" />
                Render PostgreSQL Database
              </h3>
              <p className="text-xs text-sky-100/80 mt-1 max-w-lg">
                Manage your managed PostgreSQL database deployed on Render Cloud (Free Tier ready).
              </p>
            </div>

            <button
              onClick={onClose}
              className="relative z-10 p-2 text-sky-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Status Alert Banner */}
            {actionMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl flex items-start gap-3 border text-xs leading-relaxed ${
                  actionMessage.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : actionMessage.type === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-sky-50 border-sky-200 text-sky-800'
                }`}
              >
                {actionMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{actionMessage.text}</span>
              </motion.div>
            )}

            {/* Connection Status Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {isConnected ? 'PostgreSQL Connection Active' : 'Offline / In-Memory Mode'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isConnected 
                        ? `Host: ${renderDbStatus?.maskedHost || 'Render Cloud'} (${renderDbStatus?.databaseEngine || 'PostgreSQL'})` 
                        : 'Application currently uses browser and local server storage.'}
                    </p>
                  </div>
                </div>

                {isConnected && (
                  <button
                    onClick={handleDisconnect}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors self-start sm:self-auto"
                  >
                    <Unplug className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                )}
              </div>

              {/* Connected Details Grid */}
              {isConnected && renderDbStatus?.tables && (
                <div className="grid grid-cols-3 gap-2.5 pt-3">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Users</span>
                    <span className="text-sm font-extrabold text-[#002147]">{renderDbStatus.tables.users ?? 0}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Courses</span>
                    <span className="text-sm font-extrabold text-[#002147]">{renderDbStatus.tables.courses ?? 0}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Transactions</span>
                    <span className="text-sm font-extrabold text-[#002147]">{renderDbStatus.tables.transactions ?? 0}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons for Connected state */}
              {isConnected && (
                <div className="flex flex-wrap gap-2.5 pt-3 mt-1">
                  <button
                    onClick={handleTestQuery}
                    disabled={testing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#002147] bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 text-sky-600 ${testing ? 'animate-spin' : ''}`} />
                    {testing ? 'Testing...' : 'Run Query Test'}
                  </button>

                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#002147] hover:bg-[#072c59] rounded-xl shadow-xs transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync Local Data to Render'}
                  </button>
                </div>
              )}

              {queryResult && (
                <div className="mt-3 bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-36">
                  <span className="text-slate-400 text-[10px] block mb-1">Query Response:</span>
                  <pre>{queryResult}</pre>
                </div>
              )}
            </div>

            {/* Connect Form */}
            {!isConnected && (
              <form onSubmit={handleConnect} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Render PostgreSQL Connection String
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={dbUrl}
                      onChange={(e) => setDbUrl(e.target.value)}
                      placeholder="postgresql://user:password@dpg-xxxxxx.oregon-postgres.render.com/dbname"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#002147] focus:bg-white transition-all pr-24"
                    />
                    <button
                      type="button"
                      onClick={() => setDbUrl('postgresql://render_user:pass@dpg-c0123456789-a.oregon-postgres.render.com/courserax_db')}
                      className="absolute right-2 top-2 px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-semibold transition-colors"
                    >
                      Fill Sample
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Found in your Render Dashboard under PostgreSQL database &rarr; "Internal/External Database URL".
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={connecting}
                  className="w-full py-2.5 px-4 bg-[#002147] hover:bg-[#072c59] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Database className="w-4 h-4 text-sky-400" />
                  {connecting ? 'Testing Connection...' : 'Connect to Render Database'}
                </button>
              </form>
            )}

            {/* Deployment & Setup Guide */}
            <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-[#002147] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  How to setup a Free PostgreSQL Database on Render.com:
                </h5>
                <a
                  href="https://dashboard.render.com/new/database"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 underline"
                >
                  Open Render <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside pl-1">
                <li>Sign up or login at <strong className="text-slate-800">dashboard.render.com</strong>.</li>
                <li>Click <strong className="text-slate-800">New +</strong> and select <strong className="text-slate-800">PostgreSQL</strong>.</li>
                <li>Set Name to <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">courserax-db</code> and choose the <strong className="text-slate-800">Free Instance Type</strong> ($0/month).</li>
                <li>Once provisioned, copy the <strong className="text-slate-800">External Database URL</strong> and paste it above or set <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">DATABASE_URL</code> in Render Web Service environment variables.</li>
              </ol>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              Full-Stack Node.js &amp; Express on Render
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
