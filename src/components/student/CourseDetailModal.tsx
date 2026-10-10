import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Star, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  FileCheck, 
  Lock, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Award,
  Users
} from 'lucide-react';
import { Course } from '../../types';
import { useApp } from '../../context/AppContext';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onOpenPlayer: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ 
  course, 
  onClose,
  onOpenPlayer 
}) => {
  const { currentUser, openPaymentModal } = useApp();
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);

  if (!course) return null;

  const isEnrolled = currentUser?.enrolledCourseIds?.includes(course.id) ?? false;

  const toggleModule = (id: string) => {
    setOpenModuleId(openModuleId === id ? null : id);
  };

  const allLessons = course.modules.flatMap(m => m.lessons);
  const videoCount = allLessons.filter(l => l.type === 'video').length;
  const readingCount = allLessons.filter(l => l.type === 'reading').length;
  const assignmentCount = allLessons.filter(l => l.type === 'assignment').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Top Header - Oxford Blue */}
        <div className="bg-[#002147] text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-sky-200">
            <span className="font-semibold uppercase tracking-wider">{course.institution}</span>
            <span aria-hidden="true">·</span>
            <span>{course.category}</span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Hero Banner with Course Title */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#002147] leading-tight">
              {course.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {course.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1 font-bold text-slate-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({course.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{course.enrolledCount.toLocaleString()} enrolled</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>

          {/* Instructor Box */}
          <div className="flex items-center gap-3.5 p-3.5 bg-[#f0f5fa] border border-[#d6e4f5] rounded-2xl">
            <img 
              src={course.instructorAvatar} 
              alt={course.instructorName} 
              className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="text-xs font-semibold text-[#002147]">Instructor</div>
              <div className="text-sm font-bold text-slate-900">{course.instructorName}</div>
              <div className="text-xs text-slate-500">{course.instructorTitle}</div>
            </div>
          </div>

          {/* What You Will Learn */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider">
              What You Will Learn
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Acquired */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider">
              Skills You'll Gain
            </h3>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="text-xs font-medium bg-[#f0f5fa] text-[#002147] border border-[#d0e0f2] px-3 py-1 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Syllabus Accordion */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider">
                Syllabus ({course.modules.length} Modules · {allLessons.length} Lessons)
              </h3>
              <div className="text-xs text-slate-500">
                {videoCount} Videos · {readingCount} Readings · {assignmentCount} Assignments
              </div>
            </div>

            <div className="space-y-2">
              {course.modules.map((mod, index) => {
                const isOpen = openModuleId === mod.id || index === 0;
                return (
                  <div key={mod.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-[#002147] uppercase">
                          Module {index + 1}
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">{mod.title}</h4>
                        <div className="text-xs text-slate-500 mt-0.5">{mod.duration} · {mod.lessons.length} lessons</div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white divide-y divide-slate-100">
                        {mod.lessons.map(lesson => (
                          <div key={lesson.id} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              {lesson.type === 'video' && <PlayCircle className="w-4 h-4 text-sky-600" />}
                              {lesson.type === 'reading' && <FileText className="w-4 h-4 text-amber-600" />}
                              {lesson.type === 'quiz' && <HelpCircle className="w-4 h-4 text-purple-600" />}
                              {lesson.type === 'assignment' && <FileCheck className="w-4 h-4 text-emerald-600" />}
                              <span className="font-medium text-slate-800">{lesson.title}</span>
                            </div>
                            <span className="text-slate-400 font-mono text-[11px]">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Footer Bar */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Studio Tuition Fee</div>
            <div className="text-lg sm:text-xl font-black text-[#002147] font-mono">
              KES {course.price.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEnrolled ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPlayer(course);
                }}
                className="py-3 px-6 bg-[#002147] hover:bg-[#072c59] text-white font-bold rounded-xl transition-all shadow-md text-sm"
              >
                Go to Classroom
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openPaymentModal(course);
                }}
                className="py-3 px-6 bg-[#002147] hover:bg-[#072c59] text-white font-bold rounded-xl transition-all shadow-md text-sm flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Enroll & Pay (KES)</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
