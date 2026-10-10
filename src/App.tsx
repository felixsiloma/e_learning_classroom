import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/student/StudentDashboard';
import { InstructorDashboard } from './components/instructor/InstructorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AssignmentsView } from './components/AssignmentsView';
import { CourseDetailModal } from './components/student/CourseDetailModal';
import { CoursePlayer } from './components/student/CoursePlayer';
import { PaymentModal } from './components/PaymentModal';
import { CertificateModal } from './components/CertificateModal';
import { FrontPage } from './components/landing/FrontPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { WebsiteFooter } from './components/WebsiteFooter';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { Course } from './types';

const MainAppContent: React.FC = () => {
  const { 
    currentUser, 
    currentRole, 
    isAuthenticated,
    activeAuthView,
    setActiveAuthView,
    siteSettings
  } = useApp();
  
  // Navigation active tab based on current role
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (currentRole === 'admin') return 'admin_console';
    if (currentRole === 'instructor') return 'instructor_studio';
    return 'explore';
  });

  // Automatically switch active tab when switching or logging in as another role
  React.useEffect(() => {
    if (currentRole === 'admin') {
      setActiveTab('admin_console');
    } else if (currentRole === 'instructor') {
      setActiveTab('instructor_studio');
    } else if (currentRole === 'student') {
      setActiveTab('explore');
    }
  }, [currentRole]);
  
  // Detail preview modal & Active player
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);
  const [activePlayerCourse, setActivePlayerCourse] = useState<Course | null>(null);

  // 1. If not authenticated or on an auth screen, render Public Landing / Login / Register
  if (!isAuthenticated || activeAuthView !== null) {
    if (activeAuthView === 'login') {
      return (
        <LoginPage
          onBackToFront={() => setActiveAuthView('landing')}
          onGoToRegister={() => setActiveAuthView('register')}
        />
      );
    }

    if (activeAuthView === 'register') {
      return (
        <RegisterPage
          onBackToFront={() => setActiveAuthView('landing')}
          onGoToLogin={() => setActiveAuthView('login')}
        />
      );
    }

    // Default: Public Front Page
    return (
      <div className="min-h-screen bg-[#fafcfd] text-slate-900 flex flex-col font-sans selection:bg-[#002147] selection:text-white">
        <FrontPage
          onOpenLogin={() => setActiveAuthView('login')}
          onOpenRegister={() => setActiveAuthView('register')}
          onSelectCourse={setSelectedCourseDetail}
        />
        <CourseDetailModal
          course={selectedCourseDetail}
          onClose={() => setSelectedCourseDetail(null)}
          onOpenPlayer={(course) => {
            setSelectedCourseDetail(null);
            setActiveAuthView('login');
          }}
        />
        <WebsiteFooter />
      </div>
    );
  }

  // 2. If CoursePlayer is active, render dedicated studio classroom
  if (activePlayerCourse) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          <CoursePlayer
            course={activePlayerCourse}
            onBack={() => setActivePlayerCourse(null)}
          />
        </div>
        <CertificateModal />
        <WebsiteFooter />
      </div>
    );
  }

  // 3. Authenticated Role-Specific Workspace as full Website
  return (
    <div className="min-h-screen bg-[#fafcfd] text-slate-900 flex flex-col font-sans selection:bg-[#002147] selection:text-white">
      {/* Main App Bar / Navbar with Role Switcher, Render DB Indicator & Logout */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Role-Segregated Workspace Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-16">
        {/* STUDENT VIEW */}
        {currentRole === 'student' && (
          <>
            {(activeTab === 'explore' || activeTab === 'my_learning') && (
              <StudentDashboard
                onSelectCourse={setSelectedCourseDetail}
                onOpenPlayer={setActivePlayerCourse}
              />
            )}
            {activeTab === 'assignments' && (
              <AssignmentsView onOpenPlayer={setActivePlayerCourse} />
            )}
          </>
        )}

        {/* INSTRUCTOR VIEW */}
        {currentRole === 'instructor' && (
          <>
            {(activeTab === 'instructor_studio' || activeTab === 'explore') && (
              <InstructorDashboard />
            )}
            {activeTab === 'assignments' && (
              <AssignmentsView onOpenPlayer={setActivePlayerCourse} />
            )}
          </>
        )}

        {/* ADMIN VIEW */}
        {currentRole === 'admin' && (
          <>
            {activeTab === 'admin_console' && (
              <AdminDashboard />
            )}
            {activeTab === 'explore' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                  <span className="font-bold">Admin Catalog Preview Mode:</span> This is how students view your courses. You can edit prices, titles, or site settings from the Admin Console.
                </div>
                <StudentDashboard
                  onSelectCourse={setSelectedCourseDetail}
                  onOpenPlayer={setActivePlayerCourse}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modern Academic Website Footer */}
      <WebsiteFooter />

      {/* Global Modals */}
      <CourseDetailModal
        course={selectedCourseDetail}
        onClose={() => setSelectedCourseDetail(null)}
        onOpenPlayer={setActivePlayerCourse}
      />
      <PaymentModal />
      <CertificateModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
      <OfflineIndicator />
    </AppProvider>
  );
}
