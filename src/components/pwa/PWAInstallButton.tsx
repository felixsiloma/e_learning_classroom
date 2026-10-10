import React, { useState } from 'react';
import { Download, Globe, Monitor } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallButton: React.FC<{ variant?: 'navbar' | 'bottomNav' | 'banner' }> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  if (isInstalled && variant !== 'banner') {
    return null;
  }

  if (variant === 'bottomNav') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex flex-col items-center justify-center py-1 px-2 text-[#002147] hover:text-[#072c59] transition-colors"
          title="Install Web App"
        >
          <div className="w-6 h-6 rounded-lg bg-amber-400 text-[#002147] flex items-center justify-center font-bold text-xs mb-0.5 shadow-xs">
            <Download className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold">Install</span>
        </button>
        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'banner') {
    return (
      <>
        <div className="p-3 bg-gradient-to-r from-[#002147] to-[#072c59] text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-[#0a2e5c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#002147] flex items-center justify-center shrink-0 shadow-sm font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>CourseraX Academic Web Application</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-400 text-[#002147] rounded-sm">PWA Web App</span>
              </div>
              <p className="text-[11px] text-sky-200">
                Install as a standalone web application on your desktop or mobile browser for fast, offline-ready learning.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="py-2 px-4 bg-amber-400 hover:bg-amber-300 text-[#002147] font-extrabold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install Web App</span>
          </button>
        </div>
        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#002147] font-extrabold text-xs shadow-sm transition-all"
        title="Install Web App"
      >
        <Monitor className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install Web App</span>
        <span className="sm:hidden">Install</span>
      </button>
      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
