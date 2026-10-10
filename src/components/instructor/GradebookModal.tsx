import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  Award, 
  FileText, 
  MessageSquare, 
  ExternalLink, 
  Check, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { AssignmentSubmission } from '../../types';
import { useApp } from '../../context/AppContext';

interface GradebookModalProps {
  submission: AssignmentSubmission | null;
  onClose: () => void;
}

export const GradebookModal: React.FC<GradebookModalProps> = ({ submission, onClose }) => {
  const { gradeSubmission } = useApp();

  const [score, setScore] = useState<number>(submission?.grade ?? 95);
  const [feedback, setFeedback] = useState(
    submission?.feedback || 'Well-structured implementation. Excellent modularity and clear code comments.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!submission) return null;

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    gradeSubmission(submission.id, Number(score), feedback);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Header - Oxford Blue */}
        <div className="bg-[#002147] text-white p-5 px-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              Lecturer Assessment Suite
            </span>
            <h3 className="text-base font-bold tracking-tight">
              Grade Student Assignment
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleGrade} className="p-6 space-y-4">
          {/* Student Info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <img 
              src={submission.studentAvatar} 
              alt={submission.studentName} 
              className="w-10 h-10 rounded-full object-cover border border-slate-300"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">{submission.studentName}</h4>
              <p className="text-[11px] text-slate-500 truncate">{submission.studentEmail}</p>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-mono">
              {new Date(submission.submittedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Submission Details */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-[#f0f5fa] space-y-2 text-xs">
            <div className="font-bold text-[#002147]">{submission.lessonTitle}</div>
            
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">Submitted File:</span>
              <span className="font-mono font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {submission.fileName} ({submission.fileSize})
              </span>
            </div>

            {submission.githubUrl && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">Repository:</span>
                <a 
                  href={submission.githubUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>View Code</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {submission.textSubmission && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-1">Student Notes:</span>
                <p className="text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                  "{submission.textSubmission}"
                </p>
              </div>
            )}
          </div>

          {/* Score & Feedback Inputs */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Score (out of {submission.maxGrade || 100})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={submission.maxGrade || 100}
                  value={score}
                  onChange={e => setScore(Number(e.target.value))}
                  className="w-28 text-lg font-bold font-mono text-[#002147] bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#002147]"
                />
                <span className="text-sm font-semibold text-slate-400">/ {submission.maxGrade || 100} Points</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Lecturer Constructive Feedback
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Write specific feedback on logic, performance, or recommendations..."
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-3 focus:outline-hidden focus:border-[#002147]"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Grade and feedback submitted! Student progress updated.</span>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Submit Official Grade</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
