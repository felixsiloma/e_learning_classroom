import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Users, 
  DollarSign, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssignmentSubmission, Course } from '../../types';
import { CourseCreatorModal } from './CourseCreatorModal';
import { GradebookModal } from './GradebookModal';

export const InstructorDashboard: React.FC = () => {
  const { courses, submissions, currentUser, siteSettings } = useApp();
  const [showCourseCreator, setShowCourseCreator] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);

  // Instructor courses
  const myCourses = courses.filter(
    c => c.instructorId === currentUser?.id || c.instructorName.includes('Julian') || currentUser?.role === 'instructor'
  );

  // Submissions for their courses
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');

  const royaltySplitRate = (siteSettings.royaltySharePercent || 85) / 100;
  // Total enrolled students in their courses
  const totalStudents = myCourses.reduce((acc, c) => acc + c.enrolledCount, 0);
  // Total estimated earnings (using dynamic platform royalty split)
  const totalEarnings = myCourses.reduce((acc, c) => acc + (c.price * c.enrolledCount * royaltySplitRate), 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Lecturer Studio Hero */}
      <div className="bg-[#002147] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0a2e5c] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{siteSettings.institutionName || 'Oxford School of Architecture'} · Faculty Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {siteSettings.instructorWelcomeHeadline} · {currentUser?.name || 'Faculty Member'}
          </h1>
          <p className="text-xs sm:text-sm text-sky-200">
            Manage your academic curriculum, upload videos, reading notes and assignments, and review learner submissions.
          </p>
        </div>

        <button
          onClick={() => setShowCourseCreator(true)}
          className="py-3 px-5 bg-white text-[#002147] hover:bg-slate-100 font-bold text-xs rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-[#002147]" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-extrabold text-[#002147] font-mono">
            {totalStudents.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Across all active courses</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Faculty Net Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-[#002147] font-mono">
            KES {totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <span className="text-[10px] text-slate-500">{siteSettings.royaltySharePercent || 85}% Lecturer royalty split</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Published Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-[#002147] font-mono">
            {myCourses.length}
          </div>
          <span className="text-[10px] text-slate-500">Live on {siteSettings.platformName}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Pending Grading</span>
            <FileCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 font-mono">
            {pendingSubmissions.length}
          </div>
          <span className="text-[10px] text-amber-700 font-medium">Awaiting evaluation</span>
        </div>
      </div>

      {/* Submissions Queue for Grading */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#002147] tracking-tight">
              Student Assignment Submissions & Gradebook
            </h2>
            <p className="text-xs text-slate-500">Review student uploaded work and provide rubric grades</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {submissions.map(sub => {
            const isPending = sub.status === 'submitted';

            return (
              <div 
                key={sub.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <img 
                    src={sub.studentAvatar} 
                    alt={sub.studentName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{sub.studentName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isPending ? 'Needs Grading' : `Graded: ${sub.grade}/${sub.maxGrade}`}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#002147] mt-0.5">{sub.lessonTitle}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      File: {sub.fileName} · Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setGradingSubmission(sub)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                      isPending
                        ? 'bg-[#002147] text-white hover:bg-[#072c59]'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{isPending ? 'Grade & Review' : 'Edit Grade'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {submissions.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No submissions yet. As students complete assignments, their work appears here!
            </div>
          )}
        </div>
      </div>

      {/* Courses Managed by this Instructor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#002147] tracking-tight">
            My Courses & Curriculum Catalog
          </h2>
          <button
            onClick={() => setShowCourseCreator(true)}
            className="text-xs font-semibold text-[#002147] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCourses.map(course => (
            <div 
              key={course.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-[#002147] uppercase">{course.institution}</div>
                  <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">{course.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {course.modules.length} Modules · {course.modules.flatMap(m => m.lessons).length} Lessons
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#002147] font-mono">KES {course.price.toLocaleString()}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600">{course.enrolledCount.toLocaleString()} Learners</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                  Published
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showCourseCreator && (
        <CourseCreatorModal onClose={() => setShowCourseCreator(false)} />
      )}
      {gradingSubmission && (
        <GradebookModal 
          submission={gradingSubmission} 
          onClose={() => setGradingSubmission(null)} 
        />
      )}
    </div>
  );
};
