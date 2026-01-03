
import { UserRole, User, Subject, ScheduleItem } from './types';

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981'
};

export const MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'المدير العام', 
    email: 'kr@unismart.edu', 
    username: 'KR',
    password: '123',
    role: UserRole.ADMIN 
  },
  { 
    id: '2', 
    name: 'د. خالد العمري', 
    email: 'khaled@unismart.edu', 
    username: 'khaled_dr',
    password: '123',
    role: UserRole.DOCTOR,
    specialty: 'Computer Architecture'
  },
  { 
    id: '3', 
    name: 'م. سارة محمود', 
    email: 'sara@unismart.edu', 
    username: 'sara_ta',
    password: '123',
    role: UserRole.TA,
    specialty: 'Algorithms'
  },
  { 
    id: '4', 
    name: 'عمر القحطاني', 
    email: 'omar@unismart.edu', 
    username: 'omar_student',
    password: '123',
    role: UserRole.STUDENT, 
    batchId: 'B-2024' 
  }
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: 's1', name: 'Computer Architecture', code: 'CS301', totalHours: 40 },
  { id: 's2', name: 'Machine Learning', code: 'AI202', totalHours: 45 },
  { id: 's3', name: 'Mobile Computing', code: 'CS405', totalHours: 35 }
];

export const MOCK_SCHEDULE: ScheduleItem[] = [
  { 
    id: 'sc1', 
    subjectId: 's1', 
    instructorId: '2', // د. خالد
    type: 'Lecture', 
    startTime: '09:00', 
    endTime: '11:00', 
    day: 'Monday', 
    room: 'Hall A' 
  },
  { 
    id: 'sc2', 
    subjectId: 's2', 
    instructorId: '3', // م. سارة
    type: 'Section', 
    startTime: '12:00', 
    endTime: '14:00', 
    day: 'Tuesday', 
    room: 'Lab 4', 
    sectionNumber: 5 
  },
  { 
    id: 'sc3', 
    subjectId: 's3', 
    instructorId: '2', // د. خالد
    type: 'Lecture', 
    startTime: '10:00', 
    endTime: '12:00', 
    day: 'Wednesday', 
    room: 'Hall C' 
  }
];
