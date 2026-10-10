import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  FileText, 
  HelpCircle, 
  FileCheck, 
  Download, 
  Upload, 
  Send, 
  Award, 
  MessageSquare, 
  BookOpen, 
  Sparkles,
  Github,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import { Course, Lesson, Module } from '../../types';
import { useApp } from '../../context/AppContext';

interface CoursePlayerProps {
  course: Course;
  onBack: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onBack }) => {
  const { 
    completedLessonIds, 
    toggleLessonCompletion, 
    submissions, 
    submitAssignment,
    openCertificateModal,
    userNotes,
    addUserNote,
    deleteUserNote,
    currentUser
  } = useApp();

  // Find first uncompleted or first lesson
  const allLessons = course.modules.flatMap(m => m.lessons);
  const [currentLessonId, setCurrentLessonId] = useState<string>(
    allLessons[0]?.id || ''
  );

  const currentLesson: Lesson | undefined = allLessons.find(l => l.id === currentLessonId) || allLessons[0];
  const isLessonCompleted = completedLessonIds.includes(currentLesson?.id || '');

  // Video player controls state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'content' | 'transcript' | 'notes' | 'discussion'>('content');

  // Notes state
  const [newNoteText, setNewNoteText] = useState('');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Assignment submission state
  const [textSubmission, setTextSubmission] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Check existing submission for this lesson
  const existingSubmission = submissions.find(
    s => s.courseId === course.id && s.lessonId === currentLesson?.id && s.studentId === currentUser?.id
  );

  // Calculate overall course progress
  const completedLessonsInCourse = allLessons.filter(l => completedLessonIds.includes(l.id)).length;
  const progressPercent = Math.round((completedLessonsInCourse / allLessons.length) * 100);
  const isCourseFinished = progressPercent === 100;

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !currentLesson) return;
    const currentTime = videoRef.current 
      ? `${Math.floor(videoRef.current.currentTime / 60)}:${Math.floor(videoRef.current.currentTime % 60).toString().padStart(2, '0')}`
      : '02:15';
    addUserNote(course.id, currentLesson.id, currentTime, newNoteText);
    setNewNoteText('');
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLesson) return;

    submitAssignment({
      courseId: course.id,
      courseTitle: course.title,
      lessonId: currentLesson.id,
      lessonTitle: currentLesson.title,
      fileName: uploadedFile?.name || 'project_solution.py',
      fileSize: uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : '42.5 KB',
      textSubmission,
      githubUrl
    });

    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 4000);
  };

  const courseNotes = userNotes.filter(n => n.courseId === course.id && n.lessonId === currentLesson?.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Learning Navigation Bar - Oxford Blue */}
      <div className="bg-[#002147] text-white px-4 sm:px-6 py-3 sticky top-0 z-30 flex items-center justify-between border-b border-[#0a2e5c]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[11px] text-sky-200 font-medium">{course.institution}</div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Progress Pill & Certificate Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-sky-200">Progress:</span>
            <span className="font-bold font-mono text-white">{progressPercent}%</span>
            <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>

          {isCourseFinished && (
            <button
              onClick={() => openCertificateModal(course)}
              className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-[#002147] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 animate-bounce"
            >
              <Award className="w-4 h-4 text-[#002147]" />
              <span>Get Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Classroom Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 p-0 lg:p-6">
        
        {/* Left Column: Lesson Player & Material Stage (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Active Lesson Stage */}
          <div className="bg-white rounded-none lg:rounded-2xl border-b lg:border border-slate-200 overflow-hidden shadow-xs">
            {currentLesson?.type === 'video' && (
              <div className="relative aspect-video bg-black flex items-center justify-center">
                {currentLesson.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={currentLesson.videoUrl}
                    poster={currentLesson.videoPoster}
                    controls
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                ) : (
                  <div className="text-center text-slate-400 p-6">
                    <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Video lecture loading...</p>
                  </div>
                )}

                {/* Speed Controls Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-lg border border-white/20 text-white text-[11px]">
                  {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`px-1.5 py-0.5 rounded transition-colors ${
                        playbackSpeed === speed ? 'bg-white text-black font-bold' : 'hover:bg-white/20'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stage Info Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  <span>{currentLesson?.type}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{currentLesson?.duration}</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-[#002147]">
                  {currentLesson?.title}
                </h1>
              </div>

              {/* Mark Complete Button */}
              <button
                onClick={() => currentLesson && toggleLessonCompletion(course.id, currentLesson.id)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isLessonCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                    : 'bg-[#002147] text-white hover:bg-[#072c59] shadow-sm'
                }`}
              >
                {isLessonCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>Mark as Completed</span>
                  </>
                )}
              </button>
            </div>

            {/* Secondary Tabs for Lesson View (Content, Notes, Discussion, Transcript) */}
            <div className="border-b border-slate-200 px-6 flex items-center gap-6 text-xs font-semibold text-slate-500">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-3 border-b-2 transition-all ${
                  activeTab === 'content'
                    ? 'border-[#002147] text-[#002147]'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                Lesson Material
              </button>
              {currentLesson?.transcript && (
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`py-3 border-b-2 transition-all ${
                    activeTab === 'transcript'
                      ? 'border-[#002147] text-[#002147]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  Transcript
                </button>
              )}
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3 border-b-2 transition-all ${
                  activeTab === 'notes'
                    ? 'border-[#002147] text-[#002147]'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                My Notes ({courseNotes.length})
              </button>
            </div>

            {/* Tab Panels */}
            <div className="p-6">
              {activeTab === 'content' && (
                <div className="space-y-6">
                  {/* Summary */}
                  {currentLesson?.summary && (
                    <div className="bg-[#f0f5fa] p-4 rounded-2xl border border-[#d6e3f2] text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-[#002147] block mb-1">Lesson Brief</span>
                      {currentLesson.summary}
                    </div>
                  )}

                  {/* Reading Article view */}
                  {currentLesson?.type === 'reading' && currentLesson.readingContent && (
                    <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed font-sans whitespace-pre-line bg-white p-4 rounded-xl border border-slate-100">
                      {currentLesson.readingContent}
                    </div>
                  )}

                  {/* Media Attachments */}
                  {currentLesson?.mediaAttachments && currentLesson.mediaAttachments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#002147] uppercase tracking-wider">
                        Lecture Attachments & Handouts
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentLesson.mediaAttachments.map(att => (
                          <div 
                            key={att.id}
                            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                              <span className="font-medium text-slate-800 truncate">{att.name}</span>
                            </div>
                            <span className="text-slate-400 font-mono text-[10px] shrink-0 ml-2">{att.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Quiz View */}
                  {currentLesson?.type === 'quiz' && currentLesson.quizQuestions && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider">
                        Concept Assessment
                      </h3>
                      {currentLesson.quizQuestions.map((q, qIdx) => (
                        <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                          <p className="text-sm font-semibold text-slate-900">
                            {qIdx + 1}. {q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedAnswers[q.id] === optIdx;
                              const isCorrect = q.correctAnswerIndex === optIdx;
                              let style = "bg-white border-slate-200 text-slate-700 hover:border-slate-300";

                              if (quizSubmitted) {
                                if (isCorrect) style = "bg-emerald-50 border-emerald-400 text-emerald-900 font-medium";
                                else if (isSelected && !isCorrect) style = "bg-rose-50 border-rose-300 text-rose-800";
                              } else if (isSelected) {
                                style = "bg-[#f0f5fa] border-[#002147] text-[#002147] font-semibold";
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => !quizSubmitted && setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${style}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className="text-xs p-3 rounded-xl bg-sky-50 text-sky-900 border border-sky-200">
                              <span className="font-bold">Explanation:</span> {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="pt-2">
                        {!quizSubmitted ? (
                          <button
                            type="button"
                            onClick={() => {
                              setQuizSubmitted(true);
                              toggleLessonCompletion(course.id, currentLesson.id);
                            }}
                            className="py-2.5 px-6 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                          >
                            Submit Quiz Answers
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setQuizSubmitted(false);
                              setSelectedAnswers({});
                            }}
                            className="py-2.5 px-4 border border-slate-300 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            Retake Quiz
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Assignment Submission Stage */}
                  {currentLesson?.type === 'assignment' && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#002147] uppercase tracking-wider">
                            Assignment Prompt & Instructions
                          </span>
                          <span className="text-xs font-semibold text-emerald-700 font-mono">
                            Max Points: {currentLesson.maxPoints || 100}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {currentLesson.assignmentPrompt}
                        </p>
                      </div>

                      {/* Rubric Matrix */}
                      {currentLesson.assignmentRubric && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Grading Rubric
                          </h4>
                          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                            {currentLesson.assignmentRubric.map((r, i) => (
                              <div key={i} className="p-3 text-xs flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-slate-800">{r.criterion}</div>
                                  <div className="text-[11px] text-slate-500">{r.description}</div>
                                </div>
                                <span className="font-mono font-bold text-[#002147] ml-3 shrink-0">
                                  {r.maxPoints} pts
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Existing Submission Status if submitted */}
                      {existingSubmission ? (
                        <div className="p-4 rounded-2xl bg-[#f0f5fa] border border-[#d2e0f0] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#002147] uppercase tracking-wider">
                              Your Submission Record
                            </span>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                              existingSubmission.status === 'graded'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {existingSubmission.status === 'graded' ? `Graded: ${existingSubmission.grade}/${existingSubmission.maxGrade}` : 'Awaiting Lecturer Review'}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 space-y-1">
                            <div>Submitted file: <span className="font-mono text-slate-800">{existingSubmission.fileName}</span></div>
                            {existingSubmission.githubUrl && (
                              <div>Repo: <a href={existingSubmission.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline font-mono">{existingSubmission.githubUrl}</a></div>
                            )}
                            <div>Submitted on: {new Date(existingSubmission.submittedAt).toLocaleString()}</div>
                          </div>

                          {existingSubmission.feedback && (
                            <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                              <span className="font-bold text-[#002147] block">Lecturer Feedback ({existingSubmission.gradedBy}):</span>
                              <p className="text-slate-700 italic">"{existingSubmission.feedback}"</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Submission Form */
                        <form onSubmit={handleAssignmentSubmit} className="space-y-4 border border-slate-200 rounded-2xl p-4 bg-white">
                          <h4 className="text-xs font-bold text-[#002147] uppercase tracking-wider">
                            Submit Your Work
                          </h4>

                          {/* File Drag & Drop / Upload simulator */}
                          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#002147] transition-colors cursor-pointer bg-slate-50">
                            <Upload className="w-8 h-8 text-[#002147] mx-auto mb-2 opacity-70" />
                            <label className="text-xs font-semibold text-[#002147] cursor-pointer hover:underline">
                              <span>Choose a file</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                              />
                            </label>
                            <span className="text-xs text-slate-500"> or drag and drop</span>
                            <div className="text-[11px] text-slate-400 mt-1">
                              Supports .py, .ipynb, .pdf, .zip, .png (Max 50MB)
                            </div>
                            {uploadedFile && (
                              <div className="mt-2 text-xs font-mono font-medium text-emerald-700 bg-emerald-50 py-1 px-3 rounded-lg inline-block">
                                Selected: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                              </div>
                            )}
                          </div>

                          {/* GitHub repository link */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                              GitHub Repository URL (Optional)
                            </label>
                            <div className="relative">
                              <input
                                type="url"
                                value={githubUrl}
                                onChange={e => setGithubUrl(e.target.value)}
                                placeholder="https://github.com/username/project-lab"
                                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-9 font-mono focus:outline-hidden focus:border-[#002147]"
                              />
                              <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            </div>
                          </div>

                          {/* Text / Summary Notes */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                              Solution Summary & Implementation Notes
                            </label>
                            <textarea
                              rows={3}
                              value={textSubmission}
                              onChange={e => setTextSubmission(e.target.value)}
                              placeholder="Describe your design choices, accuracy metrics, or test pass rate..."
                              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-hidden focus:border-[#002147]"
                            />
                          </div>

                          <button
                            type="submit"
                            className="py-3 px-6 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            <span>Upload & Submit for Grading</span>
                          </button>

                          {submissionSuccess && (
                            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Assignment submitted successfully! Sent to lecturer gradebook.</span>
                            </div>
                          )}
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Transcript Tab */}
              {activeTab === 'transcript' && currentLesson?.transcript && (
                <div className="space-y-3 font-sans">
                  {currentLesson.transcript.map((line, idx) => (
                    <div key={idx} className="flex gap-3 text-xs leading-relaxed group">
                      <span className="font-mono text-sky-700 font-semibold shrink-0 cursor-pointer group-hover:underline">
                        {line.time}
                      </span>
                      <p className="text-slate-700">{line.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-600">
                      Add Timestamped Note for this Lecture
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNoteText}
                        onChange={e => setNewNoteText(e.target.value)}
                        placeholder="Write a quick personal study note..."
                        className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#002147]"
                      />
                      <button
                        type="submit"
                        className="py-2 px-4 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
                      >
                        Save Note
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {courseNotes.map(n => (
                      <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-start">
                        <div>
                          <span className="font-mono text-[#002147] font-bold text-[11px] mr-2 bg-sky-100 px-1.5 py-0.5 rounded">
                            {n.timestamp}
                          </span>
                          <span className="text-slate-800">{n.text}</span>
                        </div>
                        <button
                          onClick={() => deleteUserNote(n.id)}
                          className="text-slate-400 hover:text-rose-600 text-[11px] ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {courseNotes.length === 0 && (
                      <div className="text-xs text-slate-400 text-center py-4">
                        No notes yet for this lecture. Type a note above to save key ideas!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Syllabus Module Navigation Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4 p-4 lg:p-0">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-[#f0f5fa] border-b border-[#d6e3f2]">
              <h3 className="text-xs font-bold text-[#002147] uppercase tracking-wider">
                Course Syllabus
              </h3>
              <div className="text-xs text-slate-600 mt-0.5 font-medium">
                {completedLessonsInCourse} of {allLessons.length} lessons completed
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="p-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">
                    Module {modIdx + 1}: {mod.title}
                  </div>
                  <div className="space-y-1">
                    {mod.lessons.map(lesson => {
                      const isCurrent = lesson.id === currentLesson?.id;
                      const isDone = completedLessonIds.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLessonId(lesson.id)}
                          className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                            isCurrent
                              ? 'bg-[#002147] text-white shadow-sm font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isDone ? (
                              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-emerald-300' : 'text-emerald-600'}`} />
                            ) : (
                              <Circle className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-white/60' : 'text-slate-300'}`} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className={`font-mono text-[10px] shrink-0 ml-2 ${isCurrent ? 'text-sky-200' : 'text-slate-400'}`}>
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
