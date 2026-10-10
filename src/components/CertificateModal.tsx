import React from 'react';
import { motion } from 'motion/react';
import { X, Award, Download, Share2, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CertificateModal: React.FC = () => {
  const { selectedCourseForCertificate, closeCertificateModal, currentUser } = useApp();

  if (!selectedCourseForCertificate) return null;

  const verificationId = `HS-ARCH-CERT-${selectedCourseForCertificate.id.slice(-6).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Header Bar - Oxford Blue */}
        <div className="bg-[#002147] text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold tracking-tight">Verified Architectural Credential</span>
          </div>
          <button 
            onClick={closeCertificateModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-6 sm:p-10 bg-[#fafcfd]">
          <div className="relative border-8 border-double border-[#002147] p-6 sm:p-10 bg-white rounded-xl shadow-md text-center">
            {/* Corner Ornamental Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600" />

            {/* Top Crest / Institution */}
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-amber-400 font-serif">
                HS
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#002147] uppercase tracking-widest">
                  {selectedCourseForCertificate.institution}
                </div>
                <div className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                  HYCLASS STUDIO · Oxford Faculty of Architecture & Built Environment
                </div>
              </div>
            </div>

            <div className="text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-1">
              Certificate of Architectural Mastery & Specialization
            </div>

            <div className="text-xs text-slate-500 mb-2">This is to officially certify that</div>

            {/* Student Name */}
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#002147] mb-2 tracking-tight">
              {currentUser?.name || 'Felix Siloma'}
            </h1>

            <div className="text-xs text-slate-600 max-w-md mx-auto mb-4 leading-relaxed">
              has successfully completed all rigorous studio design modules, bioclimatic laboratory calculations, and graded coursework for
            </div>

            {/* Course Title */}
            <div className="bg-[#f0f5fa] border border-[#d2e0f0] rounded-xl py-2.5 px-4 mb-4 max-w-lg mx-auto">
              <div className="text-sm sm:text-base font-bold text-[#002147]">
                {selectedCourseForCertificate.title}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {selectedCourseForCertificate.duration} · Architecture & Built Environment Professional Track
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 mt-6 items-end">
              <div className="text-center">
                <div className="font-serif italic text-base text-slate-800 border-b border-slate-300 pb-1 mb-1">
                  {selectedCourseForCertificate.instructorName}
                </div>
                <div className="text-[10px] font-medium text-slate-500">
                  {selectedCourseForCertificate.instructorTitle}
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-1">
                  {dateStr}
                </div>
                <div className="text-[10px] font-medium text-slate-500">
                  Date of Studio Accreditation
                </div>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified by Hyclass Studio Academic Governance</span>
              </div>
              <div className="font-mono">{verificationId}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 px-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => window.print()}
            className="flex-1 py-3 px-4 bg-[#002147] hover:bg-[#072c59] text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF Certificate
          </button>
          <button 
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
            }}
            className="py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share Credential
          </button>
        </div>
      </motion.div>
    </div>
  );
};
