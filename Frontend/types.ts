
export enum View {
  LANDING = 'LANDING',
  STUDENT_DASHBOARD = 'STUDENT_DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER'
}

export interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar: string;
  provider?: 'google' | 'github' | 'email';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface StudentData {
  name: string;
  major: string;
  year: string;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  time: string;
  location: string;
  instructor: string;
  color: string;
}

export interface StudentStats {
  gpa: number;
  credits: number;
  attendance: number;
  major: string;
  semester: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  type: 'academic' | 'social' | 'emergency';
}

