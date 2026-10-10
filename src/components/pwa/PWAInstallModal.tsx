import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Download, 
  CheckCircle2, 
  Share2, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Sparkles,
  WifiOff,
  Cpu,
  Layers,
  Monitor
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  const handleDownloadManifest = () => {
    const manifestData = {
      name: "CourseraX - Modern Learning & Academy Platform",
      short_name: "CourseraX",
      start_url: "/",
      display: "standalone",
      background_color: "#002147",
      theme_color: "#002147",
      description: "CourseraX Modern Learning Platform Web Application",
      icons: [
        { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" }
      ]
    };
    const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'courserax-webapp.webmanifest';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl my-auto text-slate-800"
      >
        {/* Header Hero Banner */}
        <div className="bg-[#002147] text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
          <div className="absolute right-6 bottom-4 opacity-10 text-white font-serif font-black text-7xl select-none">
            CX
          </div>

          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#002147] flex items-center justify-center font-bold text-xl shadow-md border border-white/20 font-serif">
                CX
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-amber-400 text-[#002147] uppercase">
                    Official Web Application
                  </span>
                  <span className="text-[10px] text-sky-200 font-mono">v2.4.0</span>
                </div>
                <h2 className="text-xl font-extrabold tracking-tight text-white mt-0.5">
                  CourseraX Learning Platform
                </h2>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-sky-200 mt-3 leading-relaxed relative z-10">
            Install as a standalone progressive web application on your desktop, laptop, or mobile browser for a distraction-free learning experience.
          </p>
        </div>

        {/* Features Checklist */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <Monitor className="w-5 h-5 text-[#002147] mx-auto" />
              <div className="text-[11px] font-bold text-slate-900">Standalone UI</div>
              <div className="text-[9px] text-slate-500">Dedicated window</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <WifiOff className="w-5 h-5 text-amber-600 mx-auto" />
              <div className="text-[11px] font-bold text-slate-900">Offline Ready</div>
              <div className="text-[9px] text-slate-500">Cached course notes</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <Cpu className="w-5 h-5 text-emerald-600 mx-auto" />
              <div className="text-[11px] font-bold text-slate-900">Fast Storage</div>
              <div className="text-[9px] text-slate-500">Render PostgreSQL & Local Sync</div>
            </div>
          </div>

          {/* Installation Action Section */}
          <div className="space-y-3 pt-1">
            {isInstalled ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-900">Application Already Installed</div>
                <div className="text-[11px] text-emerald-700">You are currently running CourseraX in standalone web app mode.</div>
              </div>
            ) : isInstallable ? (
              <button
                onClick={handleNativeInstall}
                className="w-full py-3.5 px-4 bg-[#002147] hover:bg-[#072c59] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm group"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>Install CourseraX Web App Now</span>
              </button>
            ) : (
              <div className="space-y-3">
                {/* Browser Guidance */}
                <div className="p-4 bg-[#f0f5fa] border border-[#d4e2f2] rounded-2xl space-y-2 text-xs">
                  <div className="font-bold text-[#002147] flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#002147]" />
                    <span>How to Install in Your Web Browser:</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-700 text-[11px]">
                    <li>In <strong>Google Chrome, Microsoft Edge, or Brave</strong>, click the <strong>Install</strong> icon in the browser address bar.</li>
                    <li>Or click the <strong>three dots menu (⋮)</strong> &rarr; <strong>"Install CourseraX"</strong> or <strong>"Add to Home Screen"</strong>.</li>
                    <li>The web app will launch in its own clean window with full offline access!</li>
                  </ol>
                </div>

                {isIOS && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-amber-700" />
                      <span>For Safari (iOS / iPadOS / macOS):</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Tap the <strong>Share</strong> button in Safari toolbar, scroll down, and tap <strong>"Add to Home Screen"</strong> or <strong>"Add to Dock"</strong>.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Download WebManifest Package / Offline Config */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                PWA Manifest & Configuration:
              </span>
              <button
                onClick={handleDownloadManifest}
                className="px-3 py-1.5 text-[11px] font-bold text-sky-700 hover:text-[#002147] bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors flex items-center gap-1 border border-sky-200"
              >
                <Download className="w-3 h-3" />
                <span>{downloadSuccess ? 'Downloaded!' : 'Download Manifest File'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Web Application · HTML5 / PWA Standards</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
