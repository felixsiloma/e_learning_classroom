import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  ExternalLink,
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course, AssignmentSubmission } from '../types';
import { GradebookModal } from './instructor/GradebookModal';

interface AssignmentsViewProps {
  onOpenPlayer: (course: Course) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({ onOpenPlayer }) => {
  const { currentRole, submissions, courses, currentUser } = useApp();
  const [selectedSubForGrade, setSelectedSubForGrade] = useState<AssignmentSubmission | null>(null);

  // Student view: their own submissions + pending assignments from enrolled courses
  const studentSubmissions = submissions.filter(s => s.studentId === currentUser?.id);

  // Find all assignments across enrolled courses
  const enrolledCourses = courses.filter(c => currentUser?.enrolledCourseIds?.includes(c.id));
  const enrolledAssignments: { course: Course; lesson: any; submission?: AssignmentSubmission }[] = [];

  enrolledCourses.forEach(c => {
    c.modules.forEach(m => {
      m.lessons.forEach(l => {
        if (l.type === 'assignment') {
          const sub = studentSubmissions.find(s => s.courseId === c.id && s.lessonId === l.id);
          enrolledAssignments.push({
            course: c,
            lesson: l,
            submission: sub
          });
        }
      });
    });
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-[#002147] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0a2e5c]">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
          <ClipboardCheck className="w-4 h-4" />
          <span>{currentRole === 'instructor' ? 'Faculty Evaluation Desk' : 'Academic Coursework & Submissions'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {currentRole === 'instructor' ? 'Instructor Gradebook & Assignments' : 'My Graded Coursework & Labs'}
        </h1>
        <p className="text-xs sm:text-sm text-sky-200 mt-1">
          {currentRole === 'instructor'
            ? 'Review and grade student laboratory implementations, project repositories, and technical writeups.'
            : 'Track the status of your project submissions, deadlines, and view detailed faculty feedback.'}
        </p>
      </div>

      {/* Role-Specific View */}
      {currentRole === 'instructor' ? (
        /* Instructor View: List of submissions */
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#002147]">Submissions Awaiting Grading ({submissions.filter(s => s.status === 'submitted').length})</h2>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {submissions.map(sub => (
              <div key={sub.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <img src={sub.studentAvatar} alt={sub.studentName} className="w-10 h-10 rounded-full object-cover border border-slate-300" referrerPolicy="no-referrer" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{sub.studentName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        sub.status === 'submitted' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {sub.status === 'submitted' ? 'Pending Review' : `Graded: ${sub.grade}/${sub.maxGrade}`}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#002147] mt-0.5">{sub.lessonTitle}</div>
                    <div className="text-[11px] text-slate-500 font-mono">File: {sub.fileName} · Date: {new Date(sub.submittedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSubForGrade(sub)}
                  className="py-2 px-4 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-xs self-end sm:self-auto flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{sub.status === 'submitted' ? 'Evaluate Submission' : 'Update Grade'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Student View: Assignments across enrolled courses */
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#002147]">
            Enrolled Coursework & Lab Assignments ({enrolledAssignments.length})
          </h2>

          <div className="space-y-3">
            {enrolledAssignments.map(({ course, lesson, submission }) => (
              <div 
                key={lesson.id} 
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#002147]">
                    {course.title}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {lesson.assignmentPrompt}
                  </p>

                  {/* Submission Status pill */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    {submission ? (
                      submission.status === 'graded' ? (
                        <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Graded: {submission.grade}/{submission.maxGrade} pts</span>
                        </span>
                      ) : (
                        <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Submitted · Awaiting Lecturer Evaluation</span>
                        </span>
                      )
                    ) : (
                      <span className="font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        Not Yet Submitted (Max: {lesson.maxPoints || 100} pts)
                      </span>
                    )}

                    {submission?.feedback && (
                      <div className="text-slate-600 italic text-xs bg-slate-50 p-2 rounded-xl border border-slate-100 w-full mt-1">
                        <span className="font-semibold text-[#002147] not-italic">Feedback: </span>
                        "{submission.feedback}"
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onOpenPlayer(course)}
                  className="py-2.5 px-4 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <span>{submission ? 'View in Classroom' : 'Start & Submit'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}

            {enrolledAssignments.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">No active assignments</h3>
                <p className="text-xs text-slate-500 mt-1">Enroll in courses from the catalog to take on hands-on project assignments.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedSubForGrade && (
        <GradebookModal
          submission={selectedSubForGrade}
          onClose={() => setSelectedSubForGrade(null)}
        />
      )}
    </div>
  );
};
