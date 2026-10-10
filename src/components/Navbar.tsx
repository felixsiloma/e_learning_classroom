import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  BookOpen, 
  LogOut,
  Database,
  Menu,
  X,
  Compass,
  FileCheck2,
  FolderKanban,
  CheckCircle2,
  CloudLightning
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentUser, 
    siteSettings,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rolesList: { role: UserRole; label: string; icon: any; desc: string; badge: string }[] = [
    {
      role: 'student',
      label: 'Student',
      icon: GraduationCap,
      desc: 'Browse courses, pay to enroll, study lessons & submit assignments',
      badge: 'Learner'
    },
    {
      role: 'instructor',
      label: 'Instructor',
      icon: BookOpen,
      desc: 'Publish courses, upload studio media, grade student work',
      badge: 'Lecturer'
    },
    {
      role: 'admin',
      label: 'Administrator',
      icon: ShieldCheck,
      desc: 'Manage all users, enforce 2-admin rule, oversee database & finances',
      badge: 'Super Admin'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setMobileMenuOpen(false);
    if (role === 'student') setActiveTab('explore');
    else if (role === 'instructor') setActiveTab('instructor_studio');
    else if (role === 'admin') setActiveTab('admin_console');
  };

  return (
    <>
      <header className="bg-[#002147] text-white sticky top-0 z-40 shadow-lg border-b border-[#0a2e5c]">
        {/* Top Mini Bar */}
        <div className="bg-[#001733] px-4 sm:px-6 py-1.5 text-[11px] text-sky-200 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white truncate">{siteSettings.institutionName}</span>
            <span className="hidden md:inline text-sky-300">· Accredited Architectural Studio</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">Database: <strong className="text-emerald-300">Active</strong></span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="text-amber-300 font-bold">Currency: {siteSettings.currencyCode}</span>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (currentRole === 'student') setActiveTab('explore');
                else if (currentRole === 'instructor') setActiveTab('instructor_studio');
                else setActiveTab('admin_console');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-[#002147] flex items-center justify-center font-bold text-lg shadow-sm border border-white/20 group-hover:scale-105 transition-transform tracking-tight font-serif">
                HS
              </div>
              <div>
                <div className="text-base font-extrabold tracking-tight text-white leading-none flex items-center gap-1.5">
                  <span>{siteSettings.platformName}</span>
                  <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-amber-400 text-[#002147] font-black">
                    STUDIO
                  </span>
                </div>
                <p className="text-[10px] text-sky-200 mt-0.5 hidden sm:block font-medium truncate max-w-xs">
                  {siteSettings.tagline}
                </p>
              </div>
            </button>
          </div>

          {/* Center: Navigation Links for Web */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#052449] p-1 rounded-2xl border border-sky-400/20">
            {currentRole === 'student' && (
              <>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'explore' ? 'bg-white text-[#002147] font-bold shadow-xs' : 'text-sky-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Explore Courses</span>
                </button>
                <button
                  onClick={() => setActiveTab('my_learning')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'my_learning' ? 'bg-white text-[#002147] font-bold shadow-xs' : 'text-sky-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>My Learning</span>
                </button>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'assignments' ? 'bg-white text-[#002147] font-bold shadow-xs' : 'text-sky-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Studio Assignments</span>
                </button>
              </>
            )}

            {currentRole === 'instructor' && (
              <>
                <button
                  onClick={() => setActiveTab('instructor_studio')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'instructor_studio' ? 'bg-white text-[#002147] font-bold shadow-xs' : 'text-sky-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Faculty Studio</span>
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'explore' ? 'bg-white text-[#002147] font-bold shadow-xs' : 'text-sky-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Browse Catalog</span>
                </button>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'assignments' ? 'bg-white text-[#002147] font-bold shadow-xs' : 'text-sky-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Student Submissions</span>
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('admin_console')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'admin_console' ? 'bg-white text-[#002147] font-bold shadow-xs' : 'text-sky-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Admin Console</span>
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'explore' ? 'bg-white text-[#002147] font-bold shadow-xs' : 'text-sky-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Catalog Preview</span>
                </button>
              </>
            )}
          </nav>

          {/* Right: Role Switcher & User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Quick Role Switcher Pills (Desktop) */}
            <div className="hidden sm:flex items-center bg-[#072c59] p-1 rounded-2xl border border-sky-400/20">
              {rolesList.map(({ role, label, icon: Icon }) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    currentRole === role
                      ? 'bg-white text-[#002147] shadow-xs font-bold'
                      : 'text-sky-100 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Switch to ${label} role`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="capitalize hidden md:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* User Profile Avatar with Name & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              {currentUser && (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-white truncate max-w-[120px]">
                  {currentUser?.name || 'Guest'}
                </div>
                <div className="text-[10px] text-sky-200 capitalize">
                  {currentRole}
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign Out to Front Page"
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/10 hover:bg-rose-900/60 text-sky-100 hover:text-rose-200 transition-colors flex items-center gap-1 text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Logout</span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#031d3d] border-t border-sky-400/20 px-4 py-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">
              Navigation Links
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {currentRole === 'student' && (
                <>
                  <button
                    onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl flex items-center gap-2 text-left ${activeTab === 'explore' ? 'bg-white text-[#002147] font-bold' : 'bg-white/5 text-white'}`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore Courses</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('my_learning'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl flex items-center gap-2 text-left ${activeTab === 'my_learning' ? 'bg-white text-[#002147] font-bold' : 'bg-white/5 text-white'}`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>My Learning</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('assignments'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl flex items-center gap-2 text-left ${activeTab === 'assignments' ? 'bg-white text-[#002147] font-bold' : 'bg-white/5 text-white'}`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Assignments</span>
                  </button>
                </>
              )}

              {currentRole === 'instructor' && (
                <>
                  <button
                    onClick={() => { setActiveTab('instructor_studio'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl flex items-center gap-2 text-left ${activeTab === 'instructor_studio' ? 'bg-white text-[#002147] font-bold' : 'bg-white/5 text-white'}`}
                  >
                    <FolderKanban className="w-4 h-4" />
                    <span>Faculty Studio</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl flex items-center gap-2 text-left ${activeTab === 'explore' ? 'bg-white text-[#002147] font-bold' : 'bg-white/5 text-white'}`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Course Catalog</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('assignments'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl flex items-center gap-2 text-left ${activeTab === 'assignments' ? 'bg-white text-[#002147] font-bold' : 'bg-white/5 text-white'}`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Submissions</span>
                  </button>
                </>
              )}

              {currentRole === 'admin' && (
                <>
                  <button
                    onClick={() => { setActiveTab('admin_console'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl flex items-center gap-2 text-left ${activeTab === 'admin_console' ? 'bg-white text-[#002147] font-bold' : 'bg-white/5 text-white'}`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Console</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl flex items-center gap-2 text-left ${activeTab === 'explore' ? 'bg-white text-[#002147] font-bold' : 'bg-white/5 text-white'}`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Catalog Preview</span>
                  </button>
                </>
              )}
            </div>

            {/* Switch Role on Mobile */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-2">
                Switch Role
              </div>
              <div className="grid grid-cols-3 gap-2">
                {rolesList.map(({ role, label, icon: Icon }) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-xs ${currentRole === role ? 'bg-white text-[#002147] font-bold' : 'bg-white/5 text-white'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

