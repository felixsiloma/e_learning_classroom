import React, { useState } from 'react';
import { 
  Building2, 
  Database, 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WebsiteFooter: React.FC = () => {
  const { siteSettings } = useApp();

  return (
    <>
      <footer className="bg-[#001733] text-white border-t border-[#072c59] text-xs">
        {/* Main Footer Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-[#002147] flex items-center justify-center font-bold text-lg font-serif">
                HS
              </div>
              <div>
                <div className="text-base font-extrabold tracking-tight text-white leading-none">
                  {siteSettings.platformName}
                </div>
                <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                  Oxford Academy of Architecture & Built Environment
                </div>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-xs max-w-sm">
              The premier interactive academy for sustainable architecture, computational mass-timber engineering, and tropical bioclimatic urbanism. Accredited studio courseware with verified diploma certificates.
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Broad Street, Oxford OX1 3BD, United Kingdom</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>registrar@hyclass.oxford.ac.uk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+254 712 345 678 (Kenya Admissions Desk)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Academic Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Academic Portals</span>
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Student Studio Desk</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Faculty Instructor Studio</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Dean & Registrar Console</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">BIM & CAD Submissions Desk</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Verified Certificate Registry</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Studio Curricula */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Studio Specializations</span>
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Sustainable Mass-Timber Design</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Bioclimatic Thermal Simulation</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Parametric Rhino & Grasshopper</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Tropical Resilient Urbanism</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Circular Construction & LCA</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Database & Storage Engine */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Database Engine</span>
            </h4>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-200">Engine Type</span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  JSON &amp; Relational
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Persistent local file storage with full PHP REST APIs, SQLite / PostgreSQL compatibility, and client offline cache.
              </p>
            </div>
            <div className="text-[10px] text-slate-400">
              <span>Admin Limit: </span>
              <strong className="text-amber-300">2 Administrators maximum</strong>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="border-t border-white/10 bg-[#001126] py-5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} {siteSettings.platformName}.</span>
              <span>All rights reserved.</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span>M-Pesa STK Push Gateway</span>
              <span>·</span>
              <span>RIBA & BREEAM Standards</span>
              <span>·</span>
              <span>Accredited Studio Registry</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
