import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  BookOpen, 
  Receipt, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Sparkles,
  Search,
  Filter,
  Eye,
  CreditCard,
  Smartphone,
  Sliders,
  Edit3,
  UserCheck,
  UserX,
  Save,
  Globe,
  Layers,
  Check,
  Clock,
  LayoutTemplate,
  KeyRound,
  Database,
  Server,
  Play,
  RefreshCw,
  Copy,
  ExternalLink,
  HardDrive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, Course, Transaction, SiteSettings } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    courses, 
    users, 
    transactions, 
    updateCourse, 
    deleteCourse, 
    updateUserStatus, 
    updateUserRole, 
    updateUser,
    addUser,
    refundTransaction,
    siteSettings,
    updateSiteSettings,
    approveInstructor,
    rejectInstructor,
    currentUser,
    adminResetPassword,
    adminCount,
    maxAdmins,
    renderDbStatus,
    connectToRenderDb,
    disconnectRenderDb,
    testRenderDbQuery,
    syncWithRenderDb
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'cms_editor' | 'approvals' | 'courses' | 'transactions' | 'users' | 'render_db'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [txnSearch, setTxnSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  // Render DB Live Diagnostic & Connection State
  const [dbTesting, setDbTesting] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<any>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [adminRenderDbUrl, setAdminRenderDbUrl] = useState('');
  const [adminRenderConnecting, setAdminRenderConnecting] = useState(false);
  const [adminRenderSyncing, setAdminRenderSyncing] = useState(false);
  const [adminRenderNotice, setAdminRenderNotice] = useState<{ text: string; isError: boolean } | null>(null);

  const handleAdminConnectRenderDb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminRenderDbUrl.trim()) return;
    setAdminRenderConnecting(true);
    setAdminRenderNotice(null);
    const res = await connectToRenderDb(adminRenderDbUrl.trim());
    setAdminRenderConnecting(false);
    if (res.success) {
      setAdminRenderNotice({ text: res.message || 'Connected to Render PostgreSQL!', isError: false });
    } else {
      setAdminRenderNotice({ text: res.message || 'Connection failed', isError: true });
    }
  };

  const handleAdminDisconnectRenderDb = async () => {
    setAdminRenderConnecting(true);
    await disconnectRenderDb();
    setAdminRenderConnecting(false);
    setAdminRenderNotice({ text: 'Disconnected from Render database. Switched to resilient local storage.', isError: false });
  };

  const handleAdminSyncRenderDb = async () => {
    setAdminRenderSyncing(true);
    const res = await syncWithRenderDb();
    setAdminRenderSyncing(false);
    setAdminRenderNotice({ text: res.message, isError: !res.success });
  };

  const handleRunDbTest = async () => {
    setDbTesting(true);
    const result = await testRenderDbQuery();
    setDbTestResult(result);
    setDbTesting(false);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    platform_name TEXT NOT NULL DEFAULT 'CourseraX Academy',
    contact_email TEXT NOT NULL DEFAULT 'admissions@courserax.edu',
    allow_registrations BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    instructor_id TEXT NOT NULL,
    category TEXT NOT NULL,
    price_kes NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read on courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read on users" ON public.users FOR SELECT USING (true);`);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  // Admin Priority Password Reset State
  const [resetPasswordTargetUser, setResetPasswordTargetUser] = useState<User | null>(null);
  const [adminOverridePassword, setAdminOverridePassword] = useState('HYCLASS#2026!');
  const [passwordResetToast, setPasswordResetToast] = useState<string | null>(null);

  // CMS Form State
  const [cmsForm, setCmsForm] = useState<SiteSettings>({ ...siteSettings });
  const [cmsSavedToast, setCmsSavedToast] = useState(false);

  // Course Quick & Full Edit State
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCoursePrice, setEditCoursePrice] = useState<number>(0);
  const [editCourseSubtitle, setEditCourseSubtitle] = useState('');
  const [editCourseCategory, setEditCourseCategory] = useState('');
  const [editCourseLevel, setEditCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [editCourseThumbnail, setEditCourseThumbnail] = useState('');

  // User Edit State (Admin editing user dashboard & profiles)
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserTitle, setEditUserTitle] = useState('');
  const [editUserInstitution, setEditUserInstitution] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('student');
  const [editUserStatus, setEditUserStatus] = useState<'active' | 'suspended' | 'pending_approval'>('active');
  const [editUserHours, setEditUserHours] = useState(0);
  const [editUserStreak, setEditUserStreak] = useState(0);
  const [userSavedToast, setUserSavedToast] = useState(false);

  // Add User State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [newUserTitle, setNewUserTitle] = useState('');
  const [newUserInstitution, setNewUserInstitution] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('+254 7');

  // Pending instructors
  const pendingInstructors = users.filter(u => u.status === 'pending_approval');

  // Financial calculations
  const totalGrossRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);

  const platformShareRate = (100 - (siteSettings.royaltySharePercent || 85)) / 100;
  const platformRevenue = totalGrossRevenue * platformShareRate;

  const totalEnrollments = courses.reduce((acc, c) => acc + c.enrolledCount, 0);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t => 
    t.studentName.toLowerCase().includes(txnSearch.toLowerCase()) ||
    t.receiptNumber.toLowerCase().includes(txnSearch.toLowerCase()) ||
    t.courseTitle.toLowerCase().includes(txnSearch.toLowerCase()) ||
    t.paymentMethod.toLowerCase().includes(txnSearch.toLowerCase())
  );

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(cmsForm);
    setCmsSavedToast(true);
    setTimeout(() => setCmsSavedToast(false), 2500);
  };

  const handleStartEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setEditCourseTitle(course.title);
    setEditCoursePrice(course.price);
    setEditCourseSubtitle(course.subtitle);
    setEditCourseCategory(course.category);
    setEditCourseLevel(course.level);
    setEditCourseThumbnail(course.thumbnail);
  };

  const handleSaveCourseEdit = (courseId: string) => {
    updateCourse(courseId, {
      title: editCourseTitle,
      price: editCoursePrice,
      subtitle: editCourseSubtitle,
      category: editCourseCategory,
      level: editCourseLevel,
      thumbnail: editCourseThumbnail
    });
    setEditingCourseId(null);
  };

  const handleStartEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserTitle(user.title || '');
    setEditUserInstitution(user.institution || '');
    setEditUserPhone(user.phone || '');
    setEditUserRole(user.role);
    setEditUserStatus(user.status);
    setEditUserHours(user.learningHours || 0);
    setEditUserStreak(user.streakDays || 0);
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      name: editUserName,
      email: editUserEmail,
      title: editUserTitle,
      institution: editUserInstitution,
      phone: editUserPhone,
      role: editUserRole,
      status: editUserStatus,
      learningHours: editUserHours,
      streakDays: editUserStreak
    });
    setEditingUser(null);
    setUserSavedToast(true);
    setTimeout(() => setUserSavedToast(false), 2500);
  };

  const handleOpenAdminPasswordReset = (user: User) => {
    setResetPasswordTargetUser(user);
    setAdminOverridePassword(`HYCLASS#${Math.floor(1000 + Math.random() * 9000)}!`);
  };

  const handleConfirmAdminPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordTargetUser) return;
    const res = adminResetPassword(resetPasswordTargetUser.id, adminOverridePassword);
    setPasswordResetToast(res.message);
    setResetPasswordTargetUser(null);
    setTimeout(() => setPasswordResetToast(null), 5000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    if (newUserRole === 'admin' && adminCount >= (maxAdmins || 2)) {
      setPasswordResetToast(`Governance Rule: HYCLASS Studio Academy strictly permits a maximum of ${maxAdmins || 2} administrators.`);
      setTimeout(() => setPasswordResetToast(null), 5000);
      return;
    }

    const created: User = {
      id: `user-${newUserRole}-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      password: 'password123',
      role: newUserRole,
      avatar: newUserRole === 'instructor'
        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
        : newUserRole === 'admin'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: newUserPhone,
      title: newUserTitle || (newUserRole === 'instructor' ? 'Architectural Lecturer' : newUserRole === 'admin' ? 'Academy Admin' : 'Architecture Student'),
      institution: newUserInstitution || 'Oxford School of Architecture & Built Environment',
      enrolledCourseIds: [],
      completedCourseIds: [],
      learningHours: 0,
      streakDays: 1,
      status: 'active',
      registeredAt: new Date().toISOString()
    };
    addUser(created);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserTitle('');
    setUserSavedToast(true);
    setTimeout(() => setUserSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Admin Command Center Header - Oxford Blue */}
      <div className="bg-[#002147] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0a2e5c] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 max-w-2xl leading-relaxed">
            Full platform authority: Customize front page & dashboards, approve faculty instructors, moderate course pricing in KES, and manage transactions.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-1.5 bg-[#072c59] p-1.5 rounded-2xl border border-sky-400/20 shrink-0">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'cms_editor', label: 'Site & Dashboard Editor' },
            { id: 'approvals', label: `Faculty Approvals (${pendingInstructors.length})` },
            { id: 'courses', label: 'Course Catalog' },
            { id: 'transactions', label: 'Kenyan Ledger' },
            { id: 'users', label: 'Users' },
            { id: 'render_db', label: 'Render & PostgreSQL' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all relative ${
                activeAdminTab === tab.id
                  ? 'bg-white text-[#002147] shadow-sm'
                  : 'text-sky-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === 'approvals' && pendingInstructors.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Platform Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-[#002147] font-mono">
            KES {platformRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">{100 - (siteSettings.royaltySharePercent || 85)}% Platform cut</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Gross Transactions</span>
            <Receipt className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-extrabold text-[#002147] font-mono">
            KES {totalGrossRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{transactions.length} Total orders</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Pending Faculty</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 font-mono">
            {pendingInstructors.length}
          </div>
          <span className="text-[10px] text-amber-700 font-medium">Awaiting Admin acceptance</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Architecture Catalog</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-[#002147] font-mono">
            {courses.length}
          </div>
          <span className="text-[10px] text-slate-500">Live studio courses</span>
        </div>
      </div>

      {/* 1. Overview Tab */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider">
                Recent Gateway Settlements (KES)
              </h3>
              <button 
                onClick={() => setActiveAdminTab('transactions')}
                className="text-xs text-sky-700 font-semibold hover:underline"
              >
                View all ({transactions.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {transactions.slice(0, 5).map(txn => (
                <div key={txn.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{txn.studentName}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{txn.courseTitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-[#002147]">KES {txn.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{txn.paymentMethod.replace('_', ' ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CMS & Platform Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider">
              Quick Administrative Access
            </h3>

            <div className="space-y-3 text-xs">
              <div 
                onClick={() => setActiveAdminTab('cms_editor')}
                className="p-3 bg-[#f0f5fa] hover:bg-[#e4effc] cursor-pointer rounded-xl border border-[#d4e2f2] flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-[#002147] flex items-center gap-1.5">
                    <LayoutTemplate className="w-4 h-4 text-[#002147]" />
                    <span>Live Site & Dashboard Editor (CMS)</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">Customize platform name, hero headers, student & instructor dashboards</div>
                </div>
                <span className="text-xs font-bold text-[#002147]">Edit →</span>
              </div>

              <div 
                onClick={() => setActiveAdminTab('approvals')}
                className="p-3 bg-amber-50 hover:bg-amber-100 cursor-pointer rounded-xl border border-amber-200 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Faculty Approvals Queue</span>
                  </div>
                  <div className="text-amber-800 mt-0.5">{pendingInstructors.length} instructor candidates awaiting review</div>
                </div>
                <span className="text-xs font-bold text-amber-800">Review →</span>
              </div>

              <div 
                onClick={() => setActiveAdminTab('courses')}
                className="p-3 bg-slate-50 hover:bg-slate-100 cursor-pointer rounded-xl border border-slate-200 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-slate-700" />
                    <span>Course & Pricing Customizer (KES)</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">Edit titles, descriptions, and tuition pricing in Kenya Shillings</div>
                </div>
                <span className="text-xs font-bold text-slate-700">Manage →</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Site & Dashboard Editor (CMS) Tab */}
      {activeAdminTab === 'cms_editor' && (
        <form onSubmit={handleSaveCMS} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#002147]">
                Master Site & Dashboard Customizer (CMS)
              </h3>
              <p className="text-xs text-slate-500">
                Edit the public front page, student dashboard welcome headers, instructor portals, and platform branding in real time.
              </p>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Save & Publish All Changes</span>
            </button>
          </div>

          {cmsSavedToast && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All platform names, headers, and dashboard copy have been updated across the entire platform!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section A: Global Branding */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#002147]" />
                <span>Global Platform Branding</span>
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Platform Name</label>
                <input
                  type="text"
                  value={cmsForm.platformName}
                  onChange={e => setCmsForm({ ...cmsForm, platformName: e.target.value })}
                  placeholder="HYCLASS Studio Academy"
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden focus:border-[#002147]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={cmsForm.tagline}
                  onChange={e => setCmsForm({ ...cmsForm, tagline: e.target.value })}
                  placeholder="Oxford Academy of Architecture & Built Environment"
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:border-[#002147]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Top Bar Text</label>
                <input
                  type="text"
                  value={cmsForm.announcementText}
                  onChange={e => setCmsForm({ ...cmsForm, announcementText: e.target.value })}
                  placeholder="Term 1 Admissions Open · Accredited RIBA / BREEAM Studio Courses in Kenya Shillings"
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:border-[#002147]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Currency Code</label>
                  <input
                    type="text"
                    value={cmsForm.currencyCode}
                    onChange={e => setCmsForm({ ...cmsForm, currencyCode: e.target.value })}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-mono font-bold text-[#002147]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Royalty Share (%)</label>
                  <input
                    type="number"
                    value={cmsForm.royaltySharePercent}
                    onChange={e => setCmsForm({ ...cmsForm, royaltySharePercent: Number(e.target.value) })}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-mono font-bold text-[#002147]"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Public Front Page */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
                <LayoutTemplate className="w-4 h-4 text-[#002147]" />
                <span>Public Front Page (Landing Page)</span>
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Main Title</label>
                <input
                  type="text"
                  value={cmsForm.frontPageHeroTitle}
                  onChange={e => setCmsForm({ ...cmsForm, frontPageHeroTitle: e.target.value })}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden focus:border-[#002147]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Subtitle</label>
                <textarea
                  rows={3}
                  value={cmsForm.frontPageHeroSubtitle}
                  onChange={e => setCmsForm({ ...cmsForm, frontPageHeroSubtitle: e.target.value })}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:border-[#002147]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Featured Image URL</label>
                <input
                  type="text"
                  value={cmsForm.frontPageHeroImage}
                  onChange={e => setCmsForm({ ...cmsForm, frontPageHeroImage: e.target.value })}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-mono text-slate-700 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Section C: Student Dashboard View */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#002147]" />
                <span>Student Dashboard Copy</span>
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Welcome Header</label>
                <input
                  type="text"
                  value={cmsForm.studentWelcomeHeadline}
                  onChange={e => setCmsForm({ ...cmsForm, studentWelcomeHeadline: e.target.value })}
                  placeholder="Welcome to your Architecture Studio"
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Motivation Subtitle</label>
                <textarea
                  rows={2}
                  value={cmsForm.studentSubtitle}
                  onChange={e => setCmsForm({ ...cmsForm, studentSubtitle: e.target.value })}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800"
                />
              </div>
            </div>

            {/* Section D: Instructor Dashboard View */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#002147]" />
                <span>Instructor Dashboard Copy</span>
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instructor Welcome Header</label>
                <input
                  type="text"
                  value={cmsForm.instructorWelcomeHeadline}
                  onChange={e => setCmsForm({ ...cmsForm, instructorWelcomeHeadline: e.target.value })}
                  placeholder="Faculty Studio & Evaluation Desk"
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Accreditation Mark</label>
                <input
                  type="text"
                  value={cmsForm.institutionName}
                  onChange={e => setCmsForm({ ...cmsForm, institutionName: e.target.value })}
                  placeholder="Oxford School of Architecture & Built Environment"
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 3. Faculty Approvals Desk Tab */}
      {activeAdminTab === 'approvals' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#002147]">
              Faculty Candidate Approvals Desk
            </h3>
            <p className="text-xs text-slate-500">
              When an instructor registers, an Administrator must verify and accept their profile before they are granted access to the Instructor Dashboard.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingInstructors.map(candidate => (
              <div key={candidate.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/40 p-4 rounded-2xl border border-amber-200 my-2">
                <div className="flex items-start gap-3.5">
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{candidate.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                        Pending Acceptance
                      </span>
                    </div>
                    <div className="text-xs text-[#002147] font-semibold mt-0.5">{candidate.title}</div>
                    <div className="text-xs text-slate-600 mt-0.5">Institution: {candidate.institution}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Email: {candidate.email} · Phone: {candidate.phone || 'N/A'} · Applied: {candidate.registeredAt || 'Recently'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => approveInstructor(candidate.id)}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Accept & Approve Instructor</span>
                  </button>

                  <button
                    onClick={() => rejectInstructor(candidate.id)}
                    className="py-2 px-3 border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-medium rounded-xl transition-colors flex items-center gap-1"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingInstructors.length === 0 && (
              <div className="text-center py-12 text-xs text-slate-500 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="font-bold text-slate-700 text-sm">All Instructor Applications Processed</div>
                <p>New faculty applicants will appear here for review and acceptance.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Course Catalog & Pricing Editor Tab */}
      {activeAdminTab === 'courses' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#002147]">
                Course Catalog & Pricing Management (KES)
              </h3>
              <p className="text-xs text-slate-500">Edit titles, subtitles, tuition pricing in Kenya Shillings, and publication state</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {courses.map(course => {
              const isEditing = editingCourseId === course.id;

              return (
                <div key={course.id} className="py-4 space-y-3">
                  {isEditing ? (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Course Title</label>
                          <input
                            type="text"
                            value={editCourseTitle}
                            onChange={e => setEditCourseTitle(e.target.value)}
                            className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Tuition Price (KES)</label>
                          <input
                            type="number"
                            value={editCoursePrice}
                            onChange={e => setEditCoursePrice(Number(e.target.value))}
                            className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-[#002147]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Subtitle / Headline</label>
                        <input
                          type="text"
                          value={editCourseSubtitle}
                          onChange={e => setEditCourseSubtitle(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Academic Category</label>
                          <input
                            type="text"
                            value={editCourseCategory}
                            onChange={e => setEditCourseCategory(e.target.value)}
                            className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Level</label>
                          <select
                            value={editCourseLevel}
                            onChange={e => setEditCourseLevel(e.target.value as any)}
                            className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Thumbnail Cover Image URL</label>
                        <input
                          type="text"
                          value={editCourseThumbnail}
                          onChange={e => setEditCourseThumbnail(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-mono text-[11px]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveCourseEdit(course.id)}
                          className="py-1.5 px-3 bg-[#002147] text-white text-xs font-semibold rounded-lg"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCourseId(null)}
                          className="py-1.5 px-3 border border-slate-300 text-slate-700 text-xs rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{course.title}</h4>
                          <div className="text-xs text-slate-500">
                            Instructor: {course.instructorName} · {course.institution}
                          </div>
                          <div className="text-xs font-mono font-bold text-[#002147] mt-0.5">
                            Tuition: KES {course.price.toLocaleString()} · {course.enrolledCount} Learners
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleStartEditCourse(course)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Details</span>
                        </button>

                        <button
                          onClick={() => updateCourse(course.id, { published: !course.published })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            course.published
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {course.published ? 'Published' : 'Draft'}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Permanently delete "${course.title}"?`)) {
                              deleteCourse(course.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Kenyan Transactions Ledger Tab */}
      {activeAdminTab === 'transactions' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#002147]">
                Kenya Financial Ledger & M-Pesa Audit Trail
              </h3>
              <p className="text-xs text-slate-500">Real-time payment logs, Safaricom receipts, and refund actions</p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={txnSearch}
                onChange={e => setTxnSearch(e.target.value)}
                placeholder="Search receipt, student..."
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-8 focus:outline-hidden focus:border-[#002147]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f0f5fa] text-[#002147] uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Receipt / Txn ID</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3">Gateway</th>
                  <th className="py-2.5 px-3">Amount (KES)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] font-semibold text-slate-800">
                      {t.receiptNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{t.studentName}</div>
                      <div className="text-[10px] text-slate-400">{t.studentEmail}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 truncate max-w-[180px]">
                      {t.courseTitle}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium capitalize bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                        {t.paymentMethod === 'mpesa' ? 'Safaricom M-Pesa' : t.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#002147]">
                      KES {t.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        t.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedReceipt(t)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600"
                          title="Inspect Receipt"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {t.status === 'completed' && (
                          <button
                            onClick={() => {
                              if (confirm(`Issue refund of KES ${t.amount.toLocaleString()} to ${t.studentName}?`)) {
                                refundTransaction(t.id);
                              }
                            }}
                            className="p-1 hover:bg-rose-50 rounded text-rose-600"
                            title="Issue Refund"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Users Management Tab */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#002147]">
                User Accounts & Profile Management
              </h3>
              <p className="text-xs text-slate-500">Edit student, instructor, and admin profiles, titles, institutions, and roles</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search user..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-8 focus:outline-hidden focus:border-[#002147]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="py-2 px-3 bg-[#002147] hover:bg-[#072c59] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <span>+ Add User</span>
              </button>
            </div>
          </div>

          {userSavedToast && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>User account details updated successfully!</span>
            </div>
          )}

          {passwordResetToast && (
            <div className="p-3 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs flex items-center gap-2 font-semibold shadow-xs">
              <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{passwordResetToast}</span>
            </div>
          )}

          {/* Administrator Quota & Render Database Status Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#002147]" />
              <span className="text-xs font-bold text-slate-800">Admin Quota:</span>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                adminCount >= (maxAdmins || 2) 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {adminCount} / {maxAdmins || 2} Active ({adminCount >= (maxAdmins || 2) ? 'Locked - Max 2 Reached' : '1 Seat Open'})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Render Database: {renderDbStatus?.isConnected ? 'Connected & Synced' : 'Ready (Render Free Tier)'}</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredUsers.map(user => (
              <div key={user.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{user.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'instructor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : user.status === 'pending_approval'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {user.status === 'pending_approval' ? 'Pending Acceptance' : user.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">{user.title || 'Studio Member'}</div>
                    <div className="text-[10px] text-slate-400">
                      {user.email} · {user.institution || 'Independent'} · {user.learningHours || 0} hrs · {user.streakDays || 0}d streak
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleStartEditUser(user)}
                    className="px-2.5 py-1.5 bg-[#f0f5fa] hover:bg-[#e4effc] text-[#002147] text-xs font-bold rounded-lg transition-colors flex items-center gap-1 border border-[#d4e2f2]"
                    title="Edit user profile details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Admin Priority Password Reset Button */}
                  <button
                    onClick={() => handleOpenAdminPasswordReset(user)}
                    className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 border border-amber-200"
                    title="Priority Password Reset (Admin Authority)"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reset Password</span>
                  </button>

                  <select
                    value={user.role}
                    onChange={e => {
                      const newRole = e.target.value as UserRole;
                      if (newRole === 'admin' && adminCount >= (maxAdmins || 2) && user.role !== 'admin') {
                        setPasswordResetToast(`Governance Rule: Maximum of ${maxAdmins || 2} administrators reached. Please demote an existing admin first.`);
                        setTimeout(() => setPasswordResetToast(null), 5000);
                        return;
                      }
                      updateUserRole(user.id, newRole);
                    }}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-slate-700"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option 
                      value="admin" 
                      disabled={adminCount >= (maxAdmins || 2) && user.role !== 'admin'}
                    >
                      Admin {adminCount >= (maxAdmins || 2) && user.role !== 'admin' ? '(Quota Full)' : ''}
                    </option>
                  </select>

                  <button
                    onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      user.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    {user.status === 'active' ? 'Active' : 'Suspended'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Render Database & Cloud Deployment Tab */}
      {activeAdminTab === 'render_db' && (
        <div className="space-y-6">
          {/* Top Info Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Render Cloud PostgreSQL Database</span>
                </div>
                <h3 className="text-xl font-bold text-[#002147]">
                  Render Cloud Database & Hosting Console
                </h3>
                <p className="text-xs text-slate-500">
                  Manage relational database connectivity, table schema counts, synchronize courses and users with Render PostgreSQL, and host free at $0/month.
                </p>
              </div>

              <button
                onClick={handleRunDbTest}
                disabled={dbTesting}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 self-start sm:self-auto"
              >
                {dbTesting ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Play className="w-4 h-4 text-white" />}
                <span>{dbTesting ? 'Pinging Render DB...' : 'Test Connection'}</span>
              </button>
            </div>

            {/* Diagnostic Results Banner if executed */}
            {dbTestResult && (
              <div className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-xs border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 font-sans font-bold text-xs">
                  <span>Render Database Diagnostic Output:</span>
                  <span className={dbTestResult.success ? 'text-emerald-400' : 'text-rose-400'}>
                    {dbTestResult.success ? 'Connected' : 'Connection Error'}
                  </span>
                </div>
                <pre className="overflow-x-auto p-2 bg-black/40 rounded-xl text-[11px] text-emerald-300">
                  {JSON.stringify(dbTestResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Interactive Connect to Render Database Card */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#002147] flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>Connect Web App to Render PostgreSQL Database</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your Internal or External Database Connection String from your Render Dashboard (PostgreSQL &rarr; Connections).
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  renderDbStatus?.isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {renderDbStatus?.isConnected ? '🟢 Connected to Render DB' : '⚪ Offline Local Mode'}
                </span>
              </div>

              {adminRenderNotice && (
                <div className={`p-3 rounded-xl text-xs font-medium border ${
                  adminRenderNotice.isError ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {adminRenderNotice.text}
                </div>
              )}

              <form onSubmit={handleAdminConnectRenderDb} className="space-y-3 pt-1">
                <div className="w-full">
                  <input
                    type="text"
                    value={adminRenderDbUrl}
                    onChange={e => setAdminRenderDbUrl(e.target.value)}
                    placeholder={renderDbStatus?.databaseUrl || 'postgresql://user:password@dpg-xxxxxx.oregon-postgres.render.com/dbname'}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl p-3 font-mono text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    disabled={adminRenderConnecting}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    {adminRenderConnecting ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Database className="w-4 h-4 text-white" />}
                    <span>{adminRenderConnecting ? 'Connecting...' : (renderDbStatus?.isConnected ? 'Update Connection String' : 'Connect to Render PostgreSQL')}</span>
                  </button>

                  {renderDbStatus?.isConnected && (
                    <>
                      <button
                        type="button"
                        onClick={handleAdminSyncRenderDb}
                        disabled={adminRenderSyncing}
                        className="py-2.5 px-4 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-semibold text-slate-700 text-xs flex items-center gap-1.5"
                      >
                        {adminRenderSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                        <span>Sync All Data to Render Database</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleAdminDisconnectRenderDb}
                        className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl font-semibold text-rose-700 text-xs"
                      >
                        Disconnect
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Database Engine</span>
                </div>
                <div className="text-sm font-extrabold text-[#002147] mt-1.5">
                  Render PostgreSQL
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">Free Tier Plan ($0/mo)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Users Table</span>
                </div>
                <div className="text-base font-extrabold text-[#002147] mt-1.5 font-mono">
                  {users.length} Registered Users
                </div>
                <span className="text-[10px] text-slate-500">
                  {adminCount} Admin(s) active
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Courses Table</span>
                </div>
                <div className="text-base font-extrabold text-[#002147] mt-1.5 font-mono">
                  {courses.length} Active Courses
                </div>
                <span className="text-[10px] text-slate-500">Curricula & Modules</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Transactions Ledger</span>
                </div>
                <div className="text-base font-extrabold text-[#002147] mt-1.5 font-mono">
                  {transactions.length} M-Pesa Records
                </div>
                <span className="text-[10px] text-slate-500">Kenya Shillings (KES)</span>
              </div>
            </div>
          </div>

          {/* Schema & Deployment Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Render PostgreSQL Schema */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#002147] flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-700" />
                  <span>Render PostgreSQL SQL Schema</span>
                </h4>
                <button
                  onClick={handleCopySchema}
                  className="py-1 px-3 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedSchema ? 'Copied!' : 'Copy Schema'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Run this SQL schema on your Render PostgreSQL instance via psql or database client to ensure all tables exist with appropriate indexes.
              </p>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto border border-slate-800 space-y-1">
                <div className="text-emerald-400">-- Render PostgreSQL Schema</div>
                <div>CREATE TABLE IF NOT EXISTS users (</div>
                <div className="pl-4">id TEXT PRIMARY KEY,</div>
                <div className="pl-4">name TEXT NOT NULL,</div>
                <div className="pl-4">email TEXT UNIQUE NOT NULL,</div>
                <div className="pl-4">password TEXT,</div>
                <div className="pl-4">role TEXT NOT NULL</div>
                <div>);</div>
                <div>CREATE TABLE IF NOT EXISTS courses (</div>
                <div className="pl-4">id TEXT PRIMARY KEY,</div>
                <div className="pl-4">title TEXT NOT NULL,</div>
                <div className="pl-4">price_kes NUMERIC NOT NULL DEFAULT 0</div>
                <div>);</div>
              </div>
            </div>

            {/* Right: Step-by-Step Render Free Deploy Guide */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-[#002147] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3-Step Render Free Tier Deployment Guide ($0/mo)</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-[#002147]">Step 1: Create Free PostgreSQL on Render</div>
                  <p className="text-slate-600 mt-1">
                    Sign in to <a href="https://dashboard.render.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline">dashboard.render.com</a>, click <strong>New +</strong> &rarr; <strong>PostgreSQL</strong>, choose the <strong>Free</strong> plan ($0/mo), and click Create.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-[#002147]">Step 2: Create Free Web Service</div>
                  <p className="text-slate-600 mt-1">
                    Click <strong>New +</strong> &rarr; <strong>Web Service</strong>, connect your repository, select the <strong>Free</strong> instance type, set Build Command to <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">npm install && npm run build</code> and Start Command to <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">npm start</code>.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="font-bold text-emerald-950">Step 3: Connect DATABASE_URL Environment Variable</div>
                  <p className="text-emerald-900 mt-1">
                    In your Render Web Service settings, add the environment variable <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">DATABASE_URL</code> using your Internal Connection String. Your web app will automatically connect on startup!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                <div>
                  <strong>Complete Blueprint:</strong> Configured in <code className="font-mono font-bold">render.yaml</code> and <code className="font-mono font-bold">RENDER_DEPLOYMENT_GUIDE.md</code>.
                </div>
                <a
                  href="https://dashboard.render.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shrink-0 flex items-center gap-1"
                >
                  <span>Open Render</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl my-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#002147]">
                  Edit User Profile & Dashboard ({editingUser.name})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Update student or faculty name, title, role, status, and learning hours
                </p>
              </div>
              <button 
                onClick={() => setEditingUser(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editUserName}
                    onChange={e => setEditUserName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden focus:border-[#002147]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editUserEmail}
                    onChange={e => setEditUserEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden focus:border-[#002147]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Title / Sub-Headline</label>
                <input
                  type="text"
                  value={editUserTitle}
                  onChange={e => setEditUserTitle(e.target.value)}
                  placeholder="e.g. Architecture & Urban Design Scholar"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden focus:border-[#002147]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institution Affiliation</label>
                  <input
                    type="text"
                    value={editUserInstitution}
                    onChange={e => setEditUserInstitution(e.target.value)}
                    placeholder="e.g. Oxford Academy of Architecture"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden focus:border-[#002147]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kenyan Phone (+254)</label>
                  <input
                    type="text"
                    value={editUserPhone}
                    onChange={e => setEditUserPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 focus:outline-hidden focus:border-[#002147]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Role</label>
                  <select
                    value={editUserRole}
                    onChange={e => setEditUserRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-hidden focus:border-[#002147]"
                  >
                    <option value="student">Student (Learner)</option>
                    <option value="instructor">Instructor (Lecturer)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Access Status</label>
                  <select
                    value={editUserStatus}
                    onChange={e => setEditUserStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-hidden focus:border-[#002147]"
                  >
                    <option value="active">Active (Access Granted)</option>
                    <option value="pending_approval">Pending Admin Approval</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Learning Hours</label>
                  <input
                    type="number"
                    value={editUserHours}
                    onChange={e => setEditUserHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Study Streak Days</label>
                  <input
                    type="number"
                    value={editUserStreak}
                    onChange={e => setEditUserStreak(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#002147] hover:bg-[#072c59] text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Save User Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="py-2.5 px-4 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl my-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#002147]">
                  Create New Account
                </h3>
                <p className="text-[11px] text-slate-500">
                  Provision a new student, lecturer, or administrator directly
                </p>
              </div>
              <button 
                onClick={() => setShowAddUserModal(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    placeholder="e.g. Felix Siloma"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    placeholder="name@hyclass.oxford.ac.uk"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Role</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold"
                  >
                    <option value="student">Student (Learner)</option>
                    <option value="instructor">Instructor (Lecturer)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kenyan Phone</label>
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={e => setNewUserPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Designation</label>
                <input
                  type="text"
                  value={newUserTitle}
                  onChange={e => setNewUserTitle(e.target.value)}
                  placeholder="e.g. Sustainable Architecture Scholar"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Institution</label>
                <input
                  type="text"
                  value={newUserInstitution}
                  onChange={e => setNewUserInstitution(e.target.value)}
                  placeholder="Oxford Academy of Architecture & Built Environment"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#002147] hover:bg-[#072c59] text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Create & Activate Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="py-2.5 px-4 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Priority Password Reset Modal */}
      {resetPasswordTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 border border-slate-200 shadow-2xl my-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002147]">
                    Admin Password Reset Override
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Priority credential override for {resetPasswordTargetUser.name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setResetPasswordTargetUser(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Target User Info Card */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img 
                src={resetPasswordTargetUser.avatar} 
                alt={resetPasswordTargetUser.name} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">{resetPasswordTargetUser.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{resetPasswordTargetUser.email}</div>
                <div className="text-[10px] text-sky-700 font-bold capitalize mt-0.5">{resetPasswordTargetUser.role} Account</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <span className="font-bold block mb-0.5">👑 Administrator Priority Authority</span>
              This immediately updates the user's login password in the Render PostgreSQL / JSON database without requiring email tokens. The user will be able to log in with this new password instantly.
            </div>

            <form onSubmit={handleConfirmAdminPasswordReset} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">Set New Password</label>
                  <button
                    type="button"
                    onClick={() => setAdminOverridePassword(`HYCLASS#${Math.floor(1000 + Math.random() * 9000)}!`)}
                    className="text-[10px] text-sky-700 hover:text-[#002147] font-bold underline"
                  >
                    Generate Matrix Key
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={adminOverridePassword}
                  onChange={e => setAdminOverridePassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#002147]"
                  placeholder="Enter new password"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#002147] hover:bg-[#072c59] text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Confirm Password Override</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResetPasswordTargetUser(null)}
                  className="py-2.5 px-4 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
