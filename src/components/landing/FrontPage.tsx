import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Users, 
  BookOpen, 
  Smartphone, 
  CheckCircle2, 
  Compass,
  Star,
  Lock,
  LogIn,
  UserPlus,
  Database,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

interface FrontPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onSelectCourse: (course: Course) => void;
}

export const FrontPage: React.FC<FrontPageProps> = ({ 
  onOpenLogin, 
  onOpenRegister, 
  onSelectCourse 
}) => {
  const { courses, siteSettings } = useApp();

  return (
    <div className="min-h-screen bg-[#fafcfd] text-slate-900 font-sans selection:bg-[#002147] selection:text-white">
      {/* Top Banner Announcement */}
      {siteSettings.announcementText && (
        <div className="bg-[#001733] text-amber-300 text-xs px-4 py-2 text-center font-medium border-b border-white/10 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{siteSettings.announcementText}</span>
        </div>
      )}

      {/* Public Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#002147] text-white shadow-md border-b border-[#0a2e5c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#002147] flex items-center justify-center font-bold text-lg shadow-sm font-serif">
              HS
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white leading-none flex items-center gap-1.5">
                <span>{siteSettings.platformName}</span>
                <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-amber-400 text-[#002147] font-black">
                  STUDIO
                </span>
              </div>
              <p className="text-[10px] text-sky-200 mt-0.5 hidden sm:block font-medium">
                {siteSettings.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenLogin}
              className="py-2 px-3.5 text-xs font-semibold text-sky-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={onOpenRegister}
              className="py-2 px-4 bg-white text-[#002147] hover:bg-slate-100 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#002147]" />
              <span>Register</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#002147] to-[#041a33] text-white py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300 backdrop-blur-xs">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{siteSettings.institutionName}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {siteSettings.frontPageHeroTitle}
            </h1>

            <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-2xl">
              {siteSettings.frontPageHeroSubtitle}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onOpenRegister}
                className="py-3 px-6 bg-amber-400 hover:bg-amber-300 text-[#002147] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <span>Enroll as Student</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenRegister}
                className="py-3 px-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <span>Apply as Instructor</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15 max-w-lg text-xs">
              <div>
                <div className="text-lg font-bold font-mono text-amber-400">KES / Ksh</div>
                <div className="text-sky-200 text-[11px]">M-Pesa STK Push</div>
              </div>
              <div>
                <div className="text-lg font-bold font-mono text-white">RIBA & BREEAM</div>
                <div className="text-sky-200 text-[11px]">Studio Accreditation</div>
              </div>
              <div>
                <div className="text-lg font-bold font-mono text-emerald-400">1:1 Reviews</div>
                <div className="text-sky-200 text-[11px]">Faculty Feedback</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 aspect-4/3">
              <img 
                src={siteSettings.frontPageHeroImage} 
                alt="Architecture Studio" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Featured Oxford Studio
                </span>
                <h4 className="font-bold text-sm">Sustainable Bioclimatic Architecture</h4>
                <p className="text-[11px] text-slate-300">Taught by Prof. Julian Sterling, RIBA Fellow</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Architecture Courses Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#002147] uppercase tracking-wider">
              Studio Curriculum
            </span>
            <h2 className="text-2xl font-extrabold text-[#002147] tracking-tight mt-1">
              Accredited Architecture & Built Environment Courses
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pay in Kenya Shillings via Safaricom M-Pesa and unlock hands-on laboratory coursework
            </p>
          </div>
          <button
            onClick={onOpenRegister}
            className="text-xs font-bold text-[#002147] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col group"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#002147]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                  {course.institution}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block mb-1">
                    {course.category}
                  </span>
                  <h3 className="font-bold text-[#002147] text-base group-hover:text-sky-700 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {course.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Studio Tuition</div>
                    <div className="text-base font-extrabold text-[#002147] font-mono">
                      KES {course.price.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenRegister();
                    }}
                    className="py-1.5 px-3 bg-[#002147] text-white text-xs font-semibold rounded-xl hover:bg-[#072c59] transition-colors"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Role Architecture Explainer */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#002147] uppercase tracking-wider">
              Three-Tier User Architecture
            </span>
            <h2 className="text-2xl font-extrabold text-[#002147]">
              Tailored Spaces for Students, Lecturers & Administrators
            </h2>
            <p className="text-xs text-slate-600">
              Each user enters a distinct, dedicated workspace configured specifically for their academic responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002147] flex items-center justify-center font-bold">
                🎓
              </div>
              <h3 className="text-base font-bold text-[#002147]">Student Workspace</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse specializations, pay studio tuition via M-Pesa or card, watch video lectures, take quizzes, upload section drawings and BIM files, track grades, and receive verified certificates.
              </p>
              <button 
                onClick={onOpenRegister}
                className="text-xs font-bold text-[#002147] hover:underline flex items-center gap-1 pt-1"
              >
                <span>Register as Student</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                👨‍🏫
              </div>
              <h3 className="text-base font-bold text-[#002147]">Instructor Studio</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Architectural lecturers apply with credentials. Once accepted by the Admin, lecturers publish curriculum, upload lecture videos and handouts, evaluate studio assignments, and earn 85% tuition royalties.
              </p>
              <button 
                onClick={onOpenRegister}
                className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 pt-1"
              >
                <span>Apply as Instructor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                🛡️
              </div>
              <h3 className="text-base font-bold text-[#002147]">Admin Command Console</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Total administrative control: Edit headlines, prices, and front page content. Accept or decline instructor applicants. Review Kenya Shillings M-Pesa ledgers and issue refunds.
              </p>
              <button 
                onClick={onOpenLogin}
                className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 pt-1"
              >
                <span>Admin Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#002147] text-white py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-200">
          <div>
            <span className="font-bold text-white">{siteSettings.platformName}</span> · {siteSettings.tagline}
          </div>
          <div>
            Accredited Architectural Education & Sustainable Built Environment
          </div>
        </div>
      </footer>
    </div>
  );
};
