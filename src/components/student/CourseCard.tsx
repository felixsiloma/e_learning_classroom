import React from 'react';
import { motion } from 'motion/react';
import { Star, Clock, BookOpen, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { Course } from '../../types';
import { useApp } from '../../context/AppContext';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  onOpenPlayer: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, onOpenPlayer }) => {
  const { currentUser, completedLessonIds, openPaymentModal } = useApp();

  const isEnrolled = currentUser?.enrolledCourseIds?.includes(course.id) ?? false;

  // Calculate student progress
  const allLessons = course.modules.flatMap(m => m.lessons);
  const totalLessons = allLessons.length;
  const completedInCourse = allLessons.filter(l => completedLessonIds.includes(l.id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col group cursor-pointer"
      onClick={() => onSelect(course)}
    >
      {/* Thumbnail with Institution Tag */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Institution Badge on Image */}
        <div className="absolute top-3 left-3 bg-[#002147]/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20">
          {course.institution}
        </div>

        {isEnrolled && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Enrolled</span>
          </div>
        )}

        {/* Level Tag */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-2">
          <span>{course.level}</span>
          <span aria-hidden="true">·</span>
          <span>{course.duration}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1">
            {course.category}
          </div>
          <h3 className="font-bold text-[#002147] text-base leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {course.subtitle}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-2">
          {/* Instructor & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="truncate max-w-[150px] font-medium text-slate-700">
              {course.instructorName}
            </span>
            <div className="flex items-center gap-1 font-semibold text-slate-900">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.rating.toFixed(1)}</span>
              <span className="text-[11px] text-slate-400 font-normal">({course.reviewsCount})</span>
            </div>
          </div>

          {/* Progress or Pricing Footer */}
          {isEnrolled ? (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Progress</span>
                <span className="font-bold text-[#002147] font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#002147] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPlayer(course);
                }}
                className="w-full mt-2 py-2 px-3 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-base font-extrabold text-[#002147] font-mono">
                  KES {course.price.toLocaleString()}
                </span>
                {course.originalPrice && (
                  <span className="text-[11px] text-slate-400 line-through ml-1.5 font-mono">
                    KES {course.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openPaymentModal(course);
                }}
                className="py-1.5 px-3 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Enroll (KES)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
