import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  KeyRound,
  X,
  Check,
  Database,
  Server
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RenderDbModal } from '../RenderDbModal';

interface LoginPageProps {
  onBackToFront: () => void;
  onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToFront, onGoToRegister }) => {
  const { login, siteSettings, users, resetUserPassword, renderDbStatus } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [renderModalOpen, setRenderModalOpen] = useState(false);

  // Forgot Password Matrix Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'new_password' | 'done'>('request');
  const [securityMatrixCode, setSecurityMatrixCode] = useState('');
  const [enteredMatrixCode, setEnteredMatrixCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (!result.success) {
        setErrorMsg(result.error || 'Authentication error.');
      }
    }, 400);
  };

  const handleQuickLogin = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('password123');
    setErrorMsg(null);
    setLoading(true);
    setTimeout(() => {
      login(presetEmail, 'password123');
      setLoading(false);
    }, 350);
  };

  // Forgot Password Matrix Handlers
  const handleRequestMatrix = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    const target = users.find(u => u.email.toLowerCase() === forgotEmail.trim().toLowerCase());
    if (!target) {
      setForgotError('No registered account found with this email. Please check your spelling or register.');
      return;
    }
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    setSecurityMatrixCode(generatedCode);
    setForgotStep('verify');
  };

  const handleVerifyMatrix = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (enteredMatrixCode.trim() !== securityMatrixCode.trim()) {
      setForgotError('Invalid Security Matrix Code. Please enter the 6-digit key shown on your terminal.');
      return;
    }
    setForgotStep('new_password');
  };

  const handleFinalizePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('New passwords do not match. Please re-enter.');
      return;
    }

    const res = resetUserPassword(forgotEmail, newPassword);
    if (!res.success) {
      setForgotError(res.message);
    } else {
      setForgotSuccess(res.message);
      setForgotStep('done');
      setPassword(newPassword);
      setEmail(forgotEmail);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafcfd] flex flex-col justify-between font-sans">
      {/* Top Header */}
      <div className="bg-[#002147] text-white p-4 px-6 flex items-center justify-between border-b border-[#0a2e5c]">
        <button
          onClick={onBackToFront}
          className="flex items-center gap-2 text-xs font-semibold text-sky-200 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRenderModalOpen(true)}
            className="py-1 px-2.5 text-xs font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/30 hover:bg-sky-500/30 rounded-lg transition-colors flex items-center gap-1.5"
            title="Render PostgreSQL Database Status"
          >
            <Server className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden sm:inline">Render DB</span>
            <span className={`w-1.5 h-1.5 rounded-full ${renderDbStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </button>
          <div className="w-7 h-7 rounded-lg bg-white text-[#002147] flex items-center justify-center font-bold text-xs font-serif">
            HS
          </div>
          <span className="text-xs font-extrabold tracking-tight hidden sm:inline">{siteSettings.platformName}</span>
        </div>
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto p-4 sm:p-6 my-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6"
        >
          {/* Top Brand Emblem */}
          <div className="text-center space-y-2">
            <div className="relative flex flex-col items-center justify-center">
              <motion.div 
                animate={loading ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
                className="relative w-14 h-14 rounded-2xl bg-[#002147] text-white flex items-center justify-center shadow-lg font-serif text-xl font-bold z-10 border border-[#0a2e5c]"
              >
                HS
              </motion.div>

              <div className="relative w-full max-w-[220px] h-7 flex items-center justify-center mt-1">
                {loading ? (
                  <div className="text-[10px] font-mono text-[#002147] font-bold tracking-wider animate-pulse">
                    VERIFYING CREDENTIALS...
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="h-[2px] w-6 bg-gradient-to-r from-transparent via-[#002147]/50 to-transparent rounded-full" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#002147]" />
                    <div className="h-[2px] w-6 bg-gradient-to-l from-transparent via-[#002147]/50 to-transparent rounded-full" />
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#002147] tracking-tight">
              Sign In to Your Workspace
            </h1>
            <p className="text-xs text-slate-500">
              Access your dedicated Student, Instructor, or Admin portal
            </p>
          </div>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 shadow-xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">{errorMsg}</span>
                {errorMsg.toLowerCase().includes('password') && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgotModal(true);
                    }}
                    className="text-rose-900 font-bold underline hover:text-black flex items-center gap-1 text-[11px]"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Reset this password now using Matrix →</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Standard Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@hyclass.oxford.ac.uk"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 focus:outline-hidden focus:border-[#002147]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] font-bold text-sky-700 hover:text-[#002147] hover:underline transition-colors flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3 text-sky-700" />
                  <span>Forgot Password Matrix?</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 focus:outline-hidden focus:border-[#002147]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Tiles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick 1-Click Demo Profiles
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('felixsiloma@gmail.com')}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-[#002147] border border-blue-200 rounded-xl text-center transition-colors font-medium"
              >
                <div className="text-xs mb-0.5">🎓</div>
                <div className="font-bold truncate">Felix S.</div>
                <div className="text-[9px] text-slate-500">Student</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('julian.sterling@hyclass.oxford.ac.uk')}
                className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-center transition-colors font-medium"
              >
                <div className="text-xs mb-0.5">👨‍🏫</div>
                <div className="font-bold truncate">Prof. Julian</div>
                <div className="text-[9px] text-slate-500">Instructor</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('registrar@hyclass.oxford.ac.uk')}
                className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-center transition-colors font-medium"
              >
                <div className="text-xs mb-0.5">🛡️</div>
                <div className="font-bold truncate">Dr. Sarah</div>
                <div className="text-[9px] text-slate-500">Admin (1/2)</div>
              </button>
            </div>

            {/* Render PostgreSQL Connection Status Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setRenderModalOpen(true)}
                className="text-[11px] text-[#002147] hover:text-black font-semibold bg-sky-50 hover:bg-sky-100 border border-sky-200 py-1.5 px-3 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5 text-[#002147]" />
                <span>{renderDbStatus?.connected ? 'Render PostgreSQL: Connected' : '⚡ Connect Render PostgreSQL Database'}</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            <span>Don't have an account? </span>
            <button
              onClick={onGoToRegister}
              className="font-bold text-[#002147] hover:underline"
            >
              Register here
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-slate-400">
        {siteSettings.platformName} · {siteSettings.tagline}
      </div>

      {/* FORGOT PASSWORD MATRIX MODAL */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 border border-slate-200 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#002147] text-amber-400 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#002147]">
                      Password Reset Matrix
                    </h3>
                    <p className="text-[10px] text-slate-500">Self-Service Account Recovery</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotStep('request');
                    setForgotError(null);
                  }}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {forgotError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{forgotError}</span>
                </div>
              )}

              {/* Step 1: Request Matrix */}
              {forgotStep === 'request' && (
                <form onSubmit={handleRequestMatrix} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enter the email address associated with your studio profile. An automated 6-digit cryptographic verification key will be issued for instant recovery.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Account Email
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="e.g. felixsiloma@gmail.com"
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-[#002147]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Generate Security Key</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Step 2: Verify Matrix Key */}
              {forgotStep === 'verify' && (
                <form onSubmit={handleVerifyMatrix} className="space-y-4">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">
                      Generated Matrix Key
                    </span>
                    <span className="text-2xl font-mono font-extrabold text-[#002147] tracking-widest block">
                      {securityMatrixCode}
                    </span>
                    <span className="text-[10px] text-amber-700 block">
                      Simulated Terminal Dispatch for {forgotEmail}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Enter 6-Digit Key
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={enteredMatrixCode}
                      onChange={e => setEnteredMatrixCode(e.target.value)}
                      placeholder="Enter the 6-digit key above"
                      className="w-full text-center tracking-widest font-mono text-base font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#002147]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Step 3: New Password */}
              {forgotStep === 'new_password' && (
                <form onSubmit={handleFinalizePasswordReset} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save & Update Password</span>
                  </button>
                </form>
              )}

              {/* Step 4: Done */}
              {forgotStep === 'done' && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Password Successfully Reset!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Your credentials have been updated in the database. You can now log into your dashboard.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotStep('request');
                    }}
                    className="w-full py-2.5 bg-[#002147] hover:bg-[#072c59] text-white font-bold rounded-xl transition-all shadow-md"
                  >
                    Return to Sign In
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <RenderDbModal 
        isOpen={renderModalOpen} 
        onClose={() => setRenderModalOpen(false)} 
      />
    </div>
  );
};
