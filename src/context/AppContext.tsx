import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  UserRole, 
  Course, 
  AssignmentSubmission, 
  Transaction, 
  PaymentMethod, 
  UserNote,
  SiteSettings
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_COURSES, 
  INITIAL_SUBMISSIONS, 
  INITIAL_TRANSACTIONS,
  INITIAL_SETTINGS
} from '../data/initialData';

export interface RenderDbStatus {
  connected: boolean;
  isConnected: boolean;
  databaseUrlConfigured: boolean;
  databaseUrl?: string;
  databaseEngine: string;
  maskedHost: string;
  tables: {
    users: number;
    courses: number;
    transactions: number;
    submissions: number;
  };
}

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole) => void;
  users: User[];
  courses: Course[];
  submissions: AssignmentSubmission[];
  transactions: Transaction[];
  completedLessonIds: string[];
  userNotes: UserNote[];
  deviceFrame: boolean;
  setDeviceFrame: (enabled: boolean) => void;
  selectedCourseForPayment: Course | null;
  openPaymentModal: (course: Course) => void;
  closePaymentModal: () => void;
  selectedCourseForCertificate: Course | null;
  openCertificateModal: (course: Course) => void;
  closeCertificateModal: () => void;
  
  // Render Cloud & PostgreSQL Database integration
  renderDbStatus: RenderDbStatus | null;
  connectToRenderDb: (connectionString: string) => Promise<{ success: boolean; message: string }>;
  disconnectRenderDb: () => Promise<void>;
  testRenderDbQuery: () => Promise<{ success: boolean; message: string; data?: any }>;
  syncWithRenderDb: () => Promise<{ success: boolean; message: string }>;
  
  // Site CMS Settings edited by Admin
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Authentication & Session
  isAuthenticated: boolean;
  activeAuthView: 'landing' | 'login' | 'register' | null;
  setActiveAuthView: (view: 'landing' | 'login' | 'register' | null) => void;
  login: (email: string, password?: string) => { success: boolean; error?: string; user?: User };
  register: (data: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone?: string;
    institution?: string;
    title?: string;
  }) => { success: boolean; message?: string; user?: User };
  logout: () => void;
  resetUserPassword: (email: string, newPassword: string) => { success: boolean; message: string };
  adminResetPassword: (userId: string, newPassword: string) => { success: boolean; message: string };
  approveInstructor: (userId: string) => void;
  rejectInstructor: (userId: string) => void;
  adminCount: number;
  maxAdmins: number;

  // Actions
  enrollInCourse: (courseId: string, method: PaymentMethod, details: any, amount: number) => { success: boolean; transaction: Transaction };
  toggleLessonCompletion: (courseId: string, lessonId: string) => void;
  submitAssignment: (submissionData: {
    courseId: string;
    courseTitle: string;
    lessonId: string;
    lessonTitle?: string;
    assignmentTitle?: string;
    submissionText?: string;
    textSubmission?: string;
    fileName?: string;
    fileSize?: string;
    fileUrl?: string;
    githubUrl?: string;
  }) => void;
  gradeSubmission: (submissionId: string, grade: number, feedback: string) => void;
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  updateUserStatus: (userId: string, status: 'active' | 'pending_approval' | 'suspended') => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  addUser: (user: User) => { success: boolean; message?: string };
  refundTransaction: (transactionId: string) => void;
  addUserNote: (
    noteOrCourseId: Omit<UserNote, 'id' | 'createdAt'> | string,
    lessonId?: string,
    timestamp?: string,
    text?: string
  ) => void;
  deleteUserNote: (noteId: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'courserax_users_v2',
  COURSES: 'courserax_courses_v2',
  SUBMISSIONS: 'courserax_submissions_v2',
  TRANSACTIONS: 'courserax_transactions_v2',
  CURRENT_USER_ID: 'courserax_current_user_id_v2',
  COMPLETED_LESSONS: 'courserax_completed_lessons_v2',
  NOTES: 'courserax_user_notes_v2',
  DEVICE_FRAME: 'courserax_device_frame_v2',
  SETTINGS: 'courserax_site_settings_v2',
};

const MAX_ADMINS = 2; // Strict 2-Admin invariant

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data from storage or fallback
  const getInitialUsers = (): User[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  };

  const getInitialCourses = (): Course[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COURSES);
      return stored ? JSON.parse(stored) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  };

  const [users, setUsers] = useState<User[]>(getInitialUsers);
  const [courses, setCourses] = useState<Course[]>(getInitialCourses);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return stored ? JSON.parse(stored) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      const storedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return storedId || 'stu-1'; // Default to student Felix Siloma
    } catch {
      return 'stu-1';
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    const user = users.find(u => u.id === currentUserId);
    return user ? user.role : 'student';
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
      return stored ? JSON.parse(stored) : ['l101'];
    } catch {
      return ['l101'];
    }
  });

  const [userNotes, setUserNotes] = useState<UserNote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [deviceFrame, setDeviceFrame] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DEVICE_FRAME);
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const [activeAuthView, setActiveAuthView] = useState<'landing' | 'login' | 'register' | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) ? null : 'landing';
    } catch {
      return 'landing';
    }
  });

  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<Course | null>(null);
  const [selectedCourseForCertificate, setSelectedCourseForCertificate] = useState<Course | null>(null);

  // Render Database State
  const [renderDbStatus, setRenderDbStatus] = useState<RenderDbStatus | null>(null);

  const fetchDbStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/db/status');
      const data = await res.json();
      setRenderDbStatus({
        connected: Boolean(data.connected),
        isConnected: Boolean(data.connected),
        databaseUrlConfigured: Boolean(data.databaseUrlConfigured),
        databaseEngine: data.databaseEngine || 'Render Cloud Ready (Free Tier)',
        maskedHost: data.maskedHost || 'render-postgres',
        tables: {
          users: data.tables?.users || users.length,
          courses: data.tables?.courses || courses.length,
          transactions: data.tables?.transactions || transactions.length,
          submissions: data.tables?.submissions || submissions.length,
        },
      });
    } catch {
      setRenderDbStatus({
        connected: false,
        isConnected: false,
        databaseUrlConfigured: false,
        databaseEngine: 'Render Cloud Ready (Free Tier)',
        maskedHost: 'render-postgres-offline',
        tables: {
          users: users.length,
          courses: courses.length,
          transactions: transactions.length,
          submissions: submissions.length,
        },
      });
    }
  }, [users.length, courses.length, transactions.length, submissions.length]);

  useEffect(() => {
    fetchDbStatus();
  }, [fetchDbStatus]);

  const connectToRenderDb = async (connectionString: string) => {
    try {
      const res = await fetch('/api/render/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString }),
      });
      const data = await res.json();
      await fetchDbStatus();
      return { success: data.success, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Connection failed.' };
    }
  };

  const disconnectRenderDb = async () => {
    try {
      await fetch('/api/render/disconnect', { method: 'POST' });
      await fetchDbStatus();
    } catch {}
  };

  const testRenderDbQuery = async () => {
    try {
      const res = await fetch('/api/db/test-query', { method: 'POST' });
      const data = await res.json();
      return {
        success: data.success,
        message: data.success ? `Query executed in ${data.durationMs}ms on ${data.source}` : (data.error || 'Query failed'),
        data: data.data,
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Test query failed' };
    }
  };

  const syncWithRenderDb = async () => {
    try {
      const res = await fetch('/api/render/sync', { method: 'POST' });
      const data = await res.json();
      await fetchDbStatus();
      return { success: data.success, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Sync failed' };
    }
  };

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(userNotes));
  }, [userNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEVICE_FRAME, JSON.stringify(deviceFrame));
  }, [deviceFrame]);

  // Current active user
  const currentUser: User | null = users.find(u => u.id === currentUserId) || null;

  const adminCount = users.filter(u => u.role === 'admin').length;

  const openPaymentModal = (course: Course) => setSelectedCourseForPayment(course);
  const closePaymentModal = () => setSelectedCourseForPayment(null);
  const openCertificateModal = (course: Course) => setSelectedCourseForCertificate(course);
  const closeCertificateModal = () => setSelectedCourseForCertificate(null);

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...updates }));
  };

  const login = (email: string, password?: string): { success: boolean; error?: string; user?: User } => {
    const cleanEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'User with this email not found. Please register or verify spelling.' };
    }
    if (user.status === 'suspended') {
      return { success: false, error: 'Your account has been suspended by the academy administrator.' };
    }
    if (password && user.password && user.password !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    setCurrentUserId(user.id);
    setCurrentRole(user.role);
    setActiveAuthView(null);
    return { success: true, user };
  };

  const register = (data: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone?: string;
    institution?: string;
    title?: string;
  }): { success: boolean; message?: string; user?: User } => {
    const cleanEmail = data.email.toLowerCase().trim();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    if (data.role === 'admin' && adminCount >= MAX_ADMINS) {
      return { 
        success: false, 
        message: `Maximum administrator limit (${MAX_ADMINS}) reached. Only existing administrators can assign roles.` 
      };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: data.role,
      avatar: data.role === 'instructor' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      phone: data.phone || '+254 700 000 000',
      title: data.title || (data.role === 'instructor' ? 'Studio Lecturer' : 'Student Architect'),
      bio: data.role === 'instructor' ? 'Architectural practitioner and studio leader.' : 'Passionate learner of built environments.',
      institution: data.institution || siteSettings.institutionName,
      enrolledCourseIds: [],
      completedCourseIds: [],
      learningHours: 0,
      streakDays: 1,
      status: data.role === 'instructor' ? 'pending_approval' : 'active',
      registeredAt: new Date().toISOString(),
      password: data.password || 'password123'
    };

    setUsers(prev => [newUser, ...prev]);

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUserId(null);
    setCurrentRole('student');
    setActiveAuthView('landing');
  };

  const resetUserPassword = (email: string, newPassword: string): { success: boolean; message: string } => {
    const cleanEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'No registered user found with this email address.' };
    }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, password: newPassword } : u));
    return { success: true, message: `Password for ${user.name} has been successfully updated.` };
  };

  const adminResetPassword = (userId: string, newPassword: string): { success: boolean; message: string } => {
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: 'User not found.' };
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPassword } : u));
    return { success: true, message: `Administrator override applied: password for ${user.name} reset.` };
  };

  const approveInstructor = (userId: string) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, status: 'active' } : u)));
  };

  const rejectInstructor = (userId: string) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, status: 'suspended' } : u)));
  };

  const enrollInCourse = (
    courseId: string,
    method: PaymentMethod,
    details: any,
    amount: number
  ): { success: boolean; transaction: Transaction } => {
    const course = courses.find(c => c.id === courseId);
    const receiptNum = `RCP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      receiptNumber: receiptNum,
      studentId: currentUser?.id || 'stu-guest',
      studentName: currentUser?.name || 'Guest Student',
      studentEmail: currentUser?.email || 'guest@hyclass.edu',
      courseId,
      courseTitle: course?.title || 'Studio Architecture Course',
      amount,
      currency: siteSettings.currencyCode,
      paymentMethod: method,
      paymentDetails: details,
      status: 'completed',
      timestamp: new Date().toISOString()
    };

    setTransactions(prev => [newTxn, ...prev]);

    if (currentUser) {
      setUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          const currentEnrolled = u.enrolledCourseIds || [];
          if (!currentEnrolled.includes(courseId)) {
            return { ...u, enrolledCourseIds: [...currentEnrolled, courseId] };
          }
        }
        return u;
      }));
    }

    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, enrolledCount: (c.enrolledCount || 0) + 1 };
      }
      return c;
    }));

    return { success: true, transaction: newTxn };
  };

  const toggleLessonCompletion = (courseId: string, lessonId: string) => {
    setCompletedLessonIds(prev => {
      const exists = prev.includes(lessonId);
      const next = exists ? prev.filter(id => id !== lessonId) : [...prev, lessonId];
      return next;
    });
  };

  const submitAssignment = (submissionData: {
    courseId: string;
    courseTitle: string;
    lessonId: string;
    lessonTitle?: string;
    assignmentTitle?: string;
    submissionText?: string;
    textSubmission?: string;
    fileName?: string;
    fileSize?: string;
    fileUrl?: string;
    githubUrl?: string;
  }) => {
    const newSub: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      courseId: submissionData.courseId,
      courseTitle: submissionData.courseTitle,
      lessonId: submissionData.lessonId,
      lessonTitle: submissionData.lessonTitle || 'Studio Assignment',
      assignmentTitle: submissionData.assignmentTitle || 'Architectural Submission',
      studentId: currentUser?.id || 'stu-1',
      studentName: currentUser?.name || 'Felix Siloma',
      studentEmail: currentUser?.email || 'felixsiloma@gmail.com',
      studentAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      submissionText: submissionData.submissionText || submissionData.textSubmission || '',
      fileName: submissionData.fileName,
      fileSize: submissionData.fileSize,
      fileUrl: submissionData.fileUrl,
      githubUrl: submissionData.githubUrl,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    setSubmissions(prev => [newSub, ...prev]);
  };

  const gradeSubmission = (submissionId: string, grade: number, feedback: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          grade,
          feedback,
          status: 'graded',
        };
      }
      return s;
    }));
  };

  const addCourse = (course: Course) => {
    setCourses(prev => [course, ...prev]);
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => (c.id === courseId ? { ...c, ...updates } : c)));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const updateUserStatus = (userId: string, status: 'active' | 'pending_approval' | 'suspended') => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, status } : u)));
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    if (role === 'admin' && adminCount >= MAX_ADMINS) {
      alert(`Cannot grant Administrator privileges. Maximum of ${MAX_ADMINS} administrators permitted.`);
      return;
    }
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role } : u)));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updates } : u)));
  };

  const addUser = (user: User): { success: boolean; message?: string } => {
    const existing = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'User with this email already exists.' };
    }
    if (user.role === 'admin' && adminCount >= MAX_ADMINS) {
      return { success: false, message: `Admin quota limit (${MAX_ADMINS}) reached.` };
    }
    setUsers(prev => [user, ...prev]);
    return { success: true };
  };

  const refundTransaction = (transactionId: string) => {
    setTransactions(prev => prev.map(t => (t.id === transactionId ? { ...t, status: 'refunded' } : t)));
  };

  const addUserNote = (
    noteOrCourseId: Omit<UserNote, 'id' | 'createdAt'> | string,
    lessonId?: string,
    timestamp?: string,
    text?: string
  ) => {
    let newNote: UserNote;
    if (typeof noteOrCourseId === 'object') {
      newNote = {
        ...noteOrCourseId,
        id: `note-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
    } else {
      newNote = {
        id: `note-${Date.now()}`,
        userId: currentUser?.id || 'stu-1',
        courseId: noteOrCourseId,
        lessonId: lessonId || 'l101',
        timestamp: timestamp || '00:00',
        text: text || '',
        createdAt: new Date().toISOString()
      };
    }
    setUserNotes(prev => [newNote, ...prev]);
  };

  const deleteUserNote = (noteId: string) => {
    setUserNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const resetDemoData = () => {
    setUsers(INITIAL_USERS);
    setCourses(INITIAL_COURSES);
    setSubmissions(INITIAL_SUBMISSIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSiteSettings(INITIAL_SETTINGS);
    setCompletedLessonIds(['l101']);
    setCurrentUserId('stu-1');
    setCurrentRole('student');
    setActiveAuthView('landing');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        users,
        courses,
        submissions,
        transactions,
        completedLessonIds,
        userNotes,
        deviceFrame,
        setDeviceFrame,
        selectedCourseForPayment,
        openPaymentModal,
        closePaymentModal,
        selectedCourseForCertificate,
        openCertificateModal,
        closeCertificateModal,
        renderDbStatus,
        connectToRenderDb,
        disconnectRenderDb,
        testRenderDbQuery,
        syncWithRenderDb,
        siteSettings,
        updateSiteSettings,
        isAuthenticated: !!currentUser,
        activeAuthView,
        setActiveAuthView,
        login,
        register,
        logout,
        resetUserPassword,
        adminResetPassword,
        approveInstructor,
        rejectInstructor,
        adminCount,
        maxAdmins: MAX_ADMINS,
        enrollInCourse,
        toggleLessonCompletion,
        submitAssignment,
        gradeSubmission,
        addCourse,
        updateCourse,
        deleteCourse,
        updateUserStatus,
        updateUserRole,
        updateUser,
        addUser,
        refundTransaction,
        addUserNote,
        deleteUserNote,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
