import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Plus, 
  Trash2, 
  Video, 
  FileText, 
  HelpCircle, 
  FileCheck, 
  Upload, 
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import { Course, Module, Lesson, LessonType, MediaAttachment } from '../../types';
import { useApp } from '../../context/AppContext';

interface CourseCreatorModalProps {
  onClose: () => void;
}

export const CourseCreatorModal: React.FC<CourseCreatorModalProps> = ({ onClose }) => {
  const { addCourse, currentUser } = useApp();

  // Basic Course info
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [institution, setInstitution] = useState('Oxford School of Architecture & Built Environment');
  const [category, setCategory] = useState('Architecture & Built Environment');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [duration, setDuration] = useState('4 Weeks (6 hrs/wk)');
  const [price, setPrice] = useState<number>(49.00);
  const [skillsText, setSkillsText] = useState('Passive House, Mass Timber, Daylighting, BIM Level 3');
  const [learningOutcomesText, setLearningOutcomesText] = useState('Design climate-responsive bioclimatic building envelopes\nCalculate operational and embodied carbon footprint\nProduce construction-ready mass timber structural layouts');
  const [thumbnailUrl, setThumbnailUrl] = useState('/src/assets/images/arch_sustainable_building_1791294293441.jpg');

  // Modules & Lessons
  const [modules, setModules] = useState<Module[]>([
    {
      id: `mod-${Date.now()}-1`,
      title: 'Module 1: Bioclimatic Strategies & Site Microclimates',
      description: 'Solar geometry, wind tunnel analysis, natural ventilation, and material thermal mass.',
      duration: '1 hr 45 min',
      order: 1,
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: '1.1 Video Lecture: Solar Path Geometry & Envelope Overhangs',
          type: 'video',
          duration: '18 min',
          summary: 'In-depth studio lecture on solar azimuth calculations and daylight penetration.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          mediaAttachments: [
            {
              id: 'att-demo-1',
              name: 'Oxford_Architectural_Detailing_Handbook.pdf',
              url: '#',
              type: 'pdf',
              size: '4.8 MB'
            }
          ]
        },
        {
          id: `les-${Date.now()}-2`,
          title: '1.2 Graded Studio Lab: Passive Solar Section Drawing',
          type: 'assignment',
          duration: '60 min',
          summary: 'Produce a 1:100 scale architectural section demonstrating daylight and airflow strategy.',
          assignmentPrompt: 'Produce a detailed architectural section drawing showing seasonal sun penetration angles and thermal envelope insulation layers.',
          maxPoints: 100,
          deadline: 'End of Module 1'
        }
      ]
    }
  ]);

  // Active step
  const [step, setStep] = useState<'info' | 'curriculum'>('info');
  const [createdSuccess, setCreatedSuccess] = useState(false);

  // New Lesson form state inside a module
  const [selectedModuleIdForLesson, setSelectedModuleIdForLesson] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<LessonType>('video');
  const [newLessonDuration, setNewLessonDuration] = useState('15 min');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [newLessonReadingText, setNewLessonReadingText] = useState('');
  const [newLessonAssignmentPrompt, setNewLessonAssignmentPrompt] = useState('');
  const [attachedMediaName, setAttachedMediaName] = useState('');

  const handleAddModule = () => {
    const newMod: Module = {
      id: `mod-${Date.now()}`,
      title: `Module ${modules.length + 1}: Advanced Concepts`,
      description: 'Progressive mastery and lab practices.',
      duration: '2 hrs',
      order: modules.length + 1,
      lessons: []
    };
    setModules([...modules, newMod]);
  };

  const handleAddLesson = (moduleId: string) => {
    if (!newLessonTitle.trim()) return;

    const attachments: MediaAttachment[] = attachedMediaName ? [
      {
        id: `att-${Date.now()}`,
        name: attachedMediaName,
        url: '#',
        type: attachedMediaName.endsWith('.pdf') ? 'pdf' : 'video',
        size: '5.2 MB'
      }
    ] : [];

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: newLessonTitle,
      type: newLessonType,
      duration: newLessonDuration,
      summary: `Comprehensive ${newLessonType} lesson curated by ${currentUser?.name || 'Faculty Member'}.`,
      videoUrl: newLessonType === 'video' ? newLessonVideoUrl : undefined,
      readingContent: newLessonType === 'reading' ? newLessonReadingText : undefined,
      assignmentPrompt: newLessonType === 'assignment' ? newLessonAssignmentPrompt : undefined,
      maxPoints: newLessonType === 'assignment' ? 100 : undefined,
      mediaAttachments: attachments
    };

    setModules(prev =>
      prev.map(m => (m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m))
    );

    // Reset lesson form
    setNewLessonTitle('');
    setAttachedMediaName('');
    setNewLessonReadingText('');
    setNewLessonAssignmentPrompt('');
    setSelectedModuleIdForLesson(null);
  };

  const handleDeleteModule = (modId: string) => {
    setModules(modules.filter(m => m.id !== modId));
  };

  const handleDeleteLesson = (modId: string, lesId: string) => {
    setModules(prev =>
      prev.map(m =>
        m.id === modId ? { ...m, lessons: m.lessons.filter(l => l.id !== lesId) } : m
      )
    );
  };

  const handleSaveCourse = () => {
    if (!title.trim()) {
      alert('Please enter a course title');
      return;
    }

    const skills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    const learningOutcomes = learningOutcomesText.split('\n').map(o => o.trim()).filter(Boolean);

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title,
      subtitle: subtitle || 'Master foundational and advanced techniques with real-world projects.',
      description: description || 'Designed by leading faculty to empower learners worldwide with practical skills.',
      instructorId: currentUser?.id || 'user-inst-1',
      instructorName: currentUser?.name || 'Prof. Julian Sterling, RIBA',
      instructorTitle: currentUser?.title || 'Senior Academic Lecturer',
      instructorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      institution: institution || 'Oxford International Institute',
      category,
      level,
      duration,
      price: Number(price) || 4900,
      originalPrice: Number(price) ? Number(price) + 2500 : 7500,
      rating: 5.0,
      reviewsCount: 1,
      enrolledCount: 1,
      thumbnail: thumbnailUrl,
      skills: skills.length > 0 ? skills : ['Specialization Mastery', 'Applied Systems'],
      learningOutcomes: learningOutcomes.length > 0 ? learningOutcomes : ['Gain hands-on competencies in this field'],
      prerequisites: ['Basic foundation in the chosen subject'],
      modules,
      published: true,
      featured: true,
      createdAt: new Date().toISOString()
    };

    addCourse(newCourse);
    setCreatedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header - Oxford Blue */}
        <div className="bg-[#002147] text-white p-5 px-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
              HYCLASS Studio Curriculum Builder
            </span>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              Create New Academic Course & Upload Materials
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setStep('info')}
            className={`py-3 border-b-2 transition-all ${
              step === 'info'
                ? 'border-[#002147] text-[#002147]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Course Details & Tuition
          </button>
          <button
            onClick={() => setStep('curriculum')}
            className={`py-3 border-b-2 transition-all ${
              step === 'curriculum'
                ? 'border-[#002147] text-[#002147]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Curriculum, Lessons & Media Uploads ({modules.length} Modules)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {createdSuccess ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-500">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#002147]">Course Successfully Published!</h3>
              <p className="text-xs text-slate-600">Students can now enroll, pay tuition, and access your lecture materials.</p>
            </div>
          ) : (
            <>
              {step === 'info' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Distributed Systems & High-Frequency Architectures"
                      className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-[#002147] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subtitle / Headline
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={e => setSubtitle(e.target.value)}
                      placeholder="e.g. Master consensus protocols, Paxos, Raft, and distributed fault tolerance"
                      className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-[#002147]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Academic Category</label>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden"
                      >
                        <option value="Architecture & Built Environment">Architecture & Built Environment</option>
                        <option value="Urban Design & Infrastructure">Urban Design & Infrastructure</option>
                        <option value="Computational Architecture & BIM">Computational Architecture & BIM</option>
                        <option value="Construction Technology & Materials">Construction Technology & Materials</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Difficulty Level</label>
                      <select
                        value={level}
                        onChange={e => setLevel(e.target.value as any)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Tuition Price (KES / Ksh)</label>
                      <input
                        type="number"
                        step="100"
                        value={price}
                        onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 4900"
                        className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-hidden focus:border-[#002147]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Institution Name</label>
                      <input
                        type="text"
                        value={institution}
                        onChange={e => setInstitution(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Duration Commitment</label>
                      <input
                        type="text"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        placeholder="e.g. 4 Weeks (6 hrs/wk)"
                        className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Thumbnail selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Course Cover Image
                    </label>
                    <div className="flex items-center gap-3">
                      <img 
                        src={thumbnailUrl} 
                        alt="Preview" 
                        className="w-20 h-14 rounded-xl object-cover border border-slate-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={thumbnailUrl}
                          onChange={e => setThumbnailUrl(e.target.value)}
                          placeholder="Paste image URL or use generated assets"
                          className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-700 focus:outline-hidden"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setThumbnailUrl('/src/assets/images/arch_sustainable_building_1791294293441.jpg')}
                            className="text-[10px] text-sky-700 hover:underline"
                          >
                            Sustainable Architecture
                          </button>
                          <button
                            type="button"
                            onClick={() => setThumbnailUrl('/src/assets/images/arch_urban_planning_1791294308855.jpg')}
                            className="text-[10px] text-sky-700 hover:underline"
                          >
                            Urban Masterplan
                          </button>
                          <button
                            type="button"
                            onClick={() => setThumbnailUrl('/src/assets/images/arch_bim_parametric_1791294323108.jpg')}
                            className="text-[10px] text-sky-700 hover:underline"
                          >
                            Parametric BIM
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Outcomes & Skills */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Skills Gained (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={skillsText}
                      onChange={e => setSkillsText(e.target.value)}
                      placeholder="e.g. Distributed Consensus, Raft, Paxos, Vector Clocks"
                      className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Learning Outcomes (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={learningOutcomesText}
                      onChange={e => setLearningOutcomesText(e.target.value)}
                      placeholder="Explain what the learner will be able to perform..."
                      className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {step === 'curriculum' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider">
                        Syllabus Modules & Lecture Uploads
                      </h3>
                      <p className="text-xs text-slate-500">
                        Add video lectures, architectural blueprints, reading notes, and studio assignments
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddModule}
                      className="py-1.5 px-3 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Module</span>
                    </button>
                  </div>

                  {/* Modules List */}
                  <div className="space-y-4">
                    {modules.map((mod, modIdx) => (
                      <div key={mod.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={mod.title}
                            onChange={e => {
                              const val = e.target.value;
                              setModules(modules.map(m => m.id === mod.id ? { ...m, title: val } : m));
                            }}
                            className="font-bold text-sm text-[#002147] bg-white border border-slate-300 rounded-lg px-2.5 py-1 flex-1 mr-2"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteModule(mod.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Lessons in this module */}
                        <div className="space-y-2">
                          {mod.lessons.map(lesson => (
                            <div key={lesson.id} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs">
                              <div className="flex items-center gap-2 truncate">
                                {lesson.type === 'video' && <Video className="w-4 h-4 text-sky-600 shrink-0" />}
                                {lesson.type === 'reading' && <FileText className="w-4 h-4 text-amber-600 shrink-0" />}
                                {lesson.type === 'assignment' && <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                                <span className="font-semibold text-slate-800 truncate">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] font-mono text-slate-400">{lesson.duration}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLesson(mod.id, lesson.id)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Lesson form trigger */}
                        {selectedModuleIdForLesson === mod.id ? (
                          <div className="p-4 bg-white border border-slate-300 rounded-xl space-y-3 mt-2">
                            <h4 className="text-xs font-bold text-[#002147] uppercase">
                              New Lesson Material
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-medium text-slate-600 mb-1">Title</label>
                                <input
                                  type="text"
                                  value={newLessonTitle}
                                  onChange={e => setNewLessonTitle(e.target.value)}
                                  placeholder="e.g. 1.3 Video: Consensus Algorithms"
                                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-medium text-slate-600 mb-1">Material Type</label>
                                <select
                                  value={newLessonType}
                                  onChange={e => setNewLessonType(e.target.value as LessonType)}
                                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                                >
                                  <option value="video">Video Lecture</option>
                                  <option value="reading">Reading / Article</option>
                                  <option value="assignment">Graded Assignment</option>
                                </select>
                              </div>
                            </div>

                            {newLessonType === 'video' && (
                              <div>
                                <label className="block text-[11px] font-medium text-slate-600 mb-1">Video Stream URL</label>
                                <input
                                  type="text"
                                  value={newLessonVideoUrl}
                                  onChange={e => setNewLessonVideoUrl(e.target.value)}
                                  placeholder="https://...mp4 or embed url"
                                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                                />
                              </div>
                            )}

                            {newLessonType === 'reading' && (
                              <div>
                                <label className="block text-[11px] font-medium text-slate-600 mb-1">Reading Content</label>
                                <textarea
                                  rows={2}
                                  value={newLessonReadingText}
                                  onChange={e => setNewLessonReadingText(e.target.value)}
                                  placeholder="Enter reading content or markdown notes..."
                                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                                />
                              </div>
                            )}

                            {newLessonType === 'assignment' && (
                              <div>
                                <label className="block text-[11px] font-medium text-slate-600 mb-1">Assignment Prompt</label>
                                <textarea
                                  rows={2}
                                  value={newLessonAssignmentPrompt}
                                  onChange={e => setNewLessonAssignmentPrompt(e.target.value)}
                                  placeholder="Instructions for students to implement and submit..."
                                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                                />
                              </div>
                            )}

                            {/* Attach Media files */}
                            <div className="flex items-center gap-2 pt-1">
                              <label className="text-xs text-sky-700 font-semibold cursor-pointer flex items-center gap-1 hover:underline">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Attach Lecture Slides / File</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) setAttachedMediaName(file.name);
                                  }}
                                />
                              </label>
                              {attachedMediaName && (
                                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                                  {attachedMediaName}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => handleAddLesson(mod.id)}
                                className="py-2 px-4 bg-[#002147] text-white text-xs font-semibold rounded-lg hover:bg-[#072c59]"
                              >
                                Save Lesson
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedModuleIdForLesson(null)}
                                className="py-2 px-3 border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-slate-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedModuleIdForLesson(mod.id)}
                            className="w-full py-2 border border-dashed border-slate-300 hover:border-[#002147] hover:bg-white text-slate-600 hover:text-[#002147] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Material to Module {modIdx + 1}</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!createdSuccess && (
          <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            {step === 'info' ? (
              <div />
            ) : (
              <button
                type="button"
                onClick={() => setStep('info')}
                className="py-2.5 px-4 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-white"
              >
                Back to Details
              </button>
            )}

            <div className="flex items-center gap-2">
              {step === 'info' ? (
                <button
                  type="button"
                  onClick={() => setStep('curriculum')}
                  className="py-2.5 px-6 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Next: Add Modules & Media
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveCourse}
                  className="py-2.5 px-6 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Publish Course Online</span>
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
