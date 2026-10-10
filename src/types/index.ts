export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  title?: string;
  bio?: string;
  institution?: string;
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  learningHours: number;
  streakDays: number;
  status: 'active' | 'suspended' | 'pending_approval';
  registeredAt?: string;
}

export interface SiteSettings {
  platformName: string;
  tagline: string;
  announcementText: string;
  institutionName: string;
  frontPageHeroTitle: string;
  frontPageHeroSubtitle: string;
  frontPageHeroImage: string;
  studentWelcomeHeadline: string;
  studentSubtitle: string;
  instructorWelcomeHeadline: string;
  royaltySharePercent: number;
  currencyCode: string;
}

export type LessonType = 'video' | 'reading' | 'quiz' | 'assignment';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface RubricItem {
  criterion: string;
  maxPoints: number;
  description: string;
}

export interface MediaAttachment {
  id: string;
  name: string;
  url: string;
  type: 'video' | 'image' | 'pdf' | 'doc';
  size: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  summary: string;
  videoUrl?: string;
  videoPoster?: string;
  transcript?: { time: string; text: string }[];
  readingContent?: string;
  mediaAttachments?: MediaAttachment[];
  quizQuestions?: QuizQuestion[];
  assignmentPrompt?: string;
  assignmentRubric?: RubricItem[];
  maxPoints?: number;
  deadline?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructorId: string;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  institution: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  enrolledCount: number;
  thumbnail: string;
  skills: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  modules: Module[];
  published: boolean;
  featured: boolean;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  assignmentTitle?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  submittedAt: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  textSubmission?: string;
  submissionText?: string;
  githubUrl?: string;
  status: 'submitted' | 'graded' | 'resubmit_required';
  grade?: number;
  maxGrade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export type PaymentMethod = 'mpesa' | 'credit_card' | 'airtel_money' | 'pesalink';

export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    last4?: string;
    phone?: string;
    mpesaReceipt?: string;
    bankReference?: string;
  };
  status: 'completed' | 'refunded';
  timestamp: string;
  receiptNumber: string;
}

export interface UserNote {
  id: string;
  userId?: string;
  courseId: string;
  lessonId: string;
  timestamp: string;
  text: string;
  createdAt: string;
}
