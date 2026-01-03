
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR', // دكتور المادة - رئيس المعيدين
  TA = 'TA',         // معيد المادة
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  role: UserRole;
  batchId?: string;
  specialty?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  totalHours: number;
}

export interface ScheduleItem {
  id: string;
  subjectId: string;
  instructorId: string; // المعرف الخاص بالدكتور أو المعيد المسؤول
  type: 'Lecture' | 'Section' | 'GD';
  startTime: string;
  endTime: string;
  day: string;
  room: string;
  sectionNumber?: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  scheduleId: string;
  timestamp: string;
  status: 'Present' | 'Absent';
}

export interface Resource {
  id: string;
  subjectId: string;
  title: string;
  type: 'PDF' | 'PPT' | 'Link';
  url: string;
  uploadedBy: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'Warning' | 'Info' | 'Reminder';
  read: boolean;
}
