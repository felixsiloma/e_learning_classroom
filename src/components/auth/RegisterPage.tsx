import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Phone,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface RegisterPageProps {
  onBackToFront: () => void;
  onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBackToFront, onGoToLogin }) => {
  const { register, siteSettings, adminCount, maxAdmins } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [institution, setInstitution] = useState('');
  const [title, setTitle] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pendingInstructorNotice, setPendingInstructorNotice] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      const res = register({
        name,
        email,
        password,
        role: selectedRole,
        phone,
        institution: institution || (selectedRole === 'instructor' ? 'Architectural Association of Kenya (AAK)' : 'Oxford Architecture Academy'),
        title: title || (selectedRole === 'instructor' ? 'Architectural Lecturer Candidate' : 'Architecture Student')
      });

      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.message || 'Registration failed.');
      } else {
        if (selectedRole === 'instructor') {
          setPendingInstructorNotice(true);
        } else {
          setSuccessMsg('Account created successfully! Redirecting to student studio...');
        }
      }
    }, 400);
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

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white text-[#002147] flex items-center justify-center font-bold text-xs font-serif">
            HS
          </div>
          <span className="text-xs font-extrabold tracking-tight">{siteSettings.platformName}</span>
        </div>
      </div>

      {/* Main Registration Form */}
      <div className="max-w-lg w-full mx-auto p-4 sm:p-6 my-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6"
        >
          {pendingInstructorNotice ? (
            /* Instructor Pending Approval Notice */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-400">
                <Clock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#002147]">
                Application Under Faculty Review
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Thank you for applying to teach at <span className="font-semibold text-slate-800">{siteSettings.platformName}</span>. Your architectural credentials have been routed to the <span className="font-semibold text-slate-800">Admin Governance Desk</span>.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
                Once an Administrator accepts your profile, your instructor studio and course creation tools will be fully unlocked.
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={onGoToLogin}
                  className="w-full py-2.5 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all"
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* HS Emblem & Dynamic Animation */}
              <div className="text-center space-y-2">
                <div className="relative flex flex-col items-center justify-center">
                  <motion.div 
                    animate={loading ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="relative w-14 h-14 rounded-2xl bg-[#002147] text-white flex items-center justify-center shadow-lg font-serif text-xl font-bold z-10 border border-[#0a2e5c]"
                  >
                    HS
                  </motion.div>

                  {/* Dynamic Animated Indicator Under HS */}
                  <div className="relative w-full max-w-[220px] h-9 flex items-center justify-center mt-1 overflow-visible">
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 my-0.5">
                          <motion.span 
                            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} 
                            transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} 
                            className="w-2 h-2 rounded-full bg-amber-400 shadow-xs shadow-amber-400" 
                          />
                          <motion.span 
                            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} 
                            transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} 
                            className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-xs shadow-sky-400" 
                          />
                          <motion.span 
                            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} 
                            transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} 
                            className="w-2 h-2 rounded-full bg-amber-400 shadow-xs shadow-amber-400" 
                          />
                        </div>
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="text-[10px] font-mono text-[#002147] font-bold tracking-wider"
                        >
                          PROVISIONING STUDIO ACCOUNT...
                        </motion.div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <motion.div 
                          animate={{ width: ['18px', '36px', '18px'] }} 
                          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }} 
                          className="h-[2px] bg-gradient-to-r from-transparent via-[#002147]/50 to-transparent rounded-full" 
                        />
                        <motion.span 
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} 
                          transition={{ repeat: Infinity, duration: 1.8 }} 
                          className="w-1.5 h-1.5 rounded-full bg-[#002147]" 
                        />
                        <motion.div 
                          animate={{ width: ['18px', '36px', '18px'] }} 
                          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }} 
                          className="h-[2px] bg-gradient-to-l from-transparent via-[#002147]/50 to-transparent rounded-full" 
                        />
                      </div>
                    )}
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-[#002147] tracking-tight">
                  Create Your Account
                </h1>
                <p className="text-xs text-slate-500">
                  Join the Oxford Academy of Architecture & Built Environment
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Your Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      selectedRole === 'student'
                        ? 'border-[#002147] bg-[#f0f5fa] text-[#002147] ring-2 ring-[#002147]/20 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#002147] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Student</div>
                      <div className="text-[9px] text-slate-500">Instant Access</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('instructor')}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      selectedRole === 'instructor'
                        ? 'border-[#002147] bg-[#f0f5fa] text-[#002147] ring-2 ring-[#002147]/20 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Instructor</div>
                      <div className="text-[9px] text-amber-700">Needs Review</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={adminCount >= (maxAdmins || 2)}
                    onClick={() => {
                      if (adminCount < (maxAdmins || 2)) {
                        setSelectedRole('admin');
                      }
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      adminCount >= (maxAdmins || 2)
                        ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                        : selectedRole === 'admin'
                        ? 'border-[#002147] bg-[#f0f5fa] text-[#002147] ring-2 ring-[#002147]/20 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Admin</div>
                      <div className="text-[9px] text-purple-700">
                        {adminCount >= (maxAdmins || 2) ? 'Locked (Max 2)' : `1 Seat Open`}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {selectedRole === 'admin' && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Administrator Seat:</strong> HYCLASS Studio Academy enforces a strict maximum of 2 platform administrators. You are registering for the second open administrator seat with full governance access.
                  </span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Felix Siloma / Arch. Jane Mwangi"
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 focus:outline-hidden focus:border-[#002147]"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-900 focus:outline-hidden focus:border-[#002147]"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password
                    </label>
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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kenya Mobile Phone (for M-Pesa notifications)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 pl-9 font-mono text-slate-900 focus:outline-hidden focus:border-[#002147]"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {selectedRole === 'instructor' && (
                  <div className="space-y-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-200">
                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        Professional Architecture Title / Specialization
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Senior Lecturer in Bioclimatic Urbanism"
                        className="w-full text-xs bg-white border border-amber-300 rounded-xl p-2.5 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        Professional Accreditation Body / University
                      </label>
                      <input
                        type="text"
                        value={institution}
                        onChange={e => setInstitution(e.target.value)}
                        placeholder="e.g. Architectural Association of Kenya (AAK) / BORAQS"
                        className="w-full text-xs bg-white border border-amber-300 rounded-xl p-2.5 text-slate-800"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{selectedRole === 'instructor' ? 'Submit Instructor Application' : 'Register & Enter Studio'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-xs text-slate-500">
                <span>Already registered? </span>
                <button
                  onClick={onGoToLogin}
                  className="font-bold text-[#002147] hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-slate-400">
        {siteSettings.platformName} · {siteSettings.tagline}
      </div>
    </div>
  );
};
