import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Flame, 
  Clock, 
  Award, 
  BookOpen, 
  SlidersHorizontal, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Course } from '../../types';
import { useApp } from '../../context/AppContext';
import { CourseCard } from './CourseCard';

interface StudentDashboardProps {
  onSelectCourse: (course: Course) => void;
  onOpenPlayer: (course: Course) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  onSelectCourse, 
  onOpenPlayer 
}) => {
  const { courses, currentUser, completedLessonIds, openCertificateModal, siteSettings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const categories = [
    'all',
    'Architecture & Built Environment',
    'Urban Design & Infrastructure',
    'Computational Architecture & BIM'
  ];

  // Filter courses
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || c.level.toLowerCase() === selectedLevel.toLowerCase();
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const enrolledCourses = courses.filter(c => currentUser?.enrolledCourseIds?.includes(c.id));

  return (
    <div className="space-y-6 pb-20">
      {/* Learner Metric Hero Banner (Oxford Blue & Gold) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#002147] text-white p-6 sm:p-8 shadow-xl border border-[#0a2e5c]">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-10 top-6 hidden md:block">
          <img 
            src="/src/assets/images/arch_sustainable_building_1791294293441.jpg" 
            alt="HYCLASS STUDIO Architecture" 
            className="w-48 h-32 object-cover rounded-2xl border border-white/20 shadow-lg"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{siteSettings.tagline}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {siteSettings.studentWelcomeHeadline} · {currentUser?.name || 'Scholar'}
          </h1>

          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
            {siteSettings.studentSubtitle}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 max-w-sm">
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span className="font-mono">{currentUser?.streakDays || 1} Days</span>
              </div>
              <span className="text-[10px] text-sky-200 block mt-0.5">Study Streak</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-sky-300 text-xs font-bold">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{currentUser?.learningHours || 0} hrs</span>
              </div>
              <span className="text-[10px] text-sky-200 block mt-0.5">Time Learned</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold">
                <Award className="w-4 h-4" />
                <span className="font-mono">{enrolledCourses.length}</span>
              </div>
              <span className="text-[10px] text-sky-200 block mt-0.5">Courses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      {enrolledCourses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#002147] tracking-tight">
              My Active Learning Courses
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {enrolledCourses.length} in progress
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.map(course => {
              const allLessons = course.modules.flatMap(m => m.lessons);
              const completedCount = allLessons.filter(l => completedLessonIds.includes(l.id)).length;
              const percent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
              const is100 = percent === 100;

              return (
                <div 
                  key={course.id} 
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#002147] uppercase tracking-wider block">
                        {course.institution}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                        {course.title}
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {completedCount} of {allLessons.length} lessons completed
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Course Progress</span>
                      <span className="font-bold text-[#002147] font-mono">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#002147] rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onOpenPlayer(course)}
                      className="flex-1 py-2 px-3 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Resume Lecture</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {is100 && (
                      <button
                        onClick={() => openCertificateModal(course)}
                        className="py-2 px-3 bg-amber-400 hover:bg-amber-300 text-[#002147] text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Certificate</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Course Catalog & Search Filters */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#002147] tracking-tight">
              Explore Academic Programs & Specializations
            </h2>
            <p className="text-xs text-slate-500">
              Browse world-class curriculum with hands-on projects and certificates
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search courses, skills, faculty..."
              className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2.5 pl-9 text-slate-800 focus:outline-hidden focus:border-[#002147] shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Category Pills & Level Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${
                  selectedCategory === cat
                    ? 'bg-[#002147] text-white shadow-xs font-semibold'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Subjects' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Level:</span>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={onSelectCourse}
              onOpenPlayer={onOpenPlayer}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No courses match your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or searching with different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};
