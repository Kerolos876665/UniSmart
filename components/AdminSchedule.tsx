
import React, { useState } from 'react';
import { ScheduleItem, User, UserRole, Subject } from '../types';
import { MOCK_SCHEDULE, MOCK_USERS, MOCK_SUBJECTS } from '../constants';
import { Plus, Trash2, Calendar, Clock, MapPin, User as UserIcon, BookOpen, AlertCircle } from 'lucide-react';

const AdminSchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(MOCK_SCHEDULE);
  const [showModal, setShowModal] = useState(false);
  
  // حقول الإضافة الجديدة
  const [subjectId, setSubjectId] = useState(MOCK_SUBJECTS[0].id);
  const [instructorId, setInstructorId] = useState(MOCK_USERS.find(u => u.role !== UserRole.STUDENT)?.id || '');
  const [type, setType] = useState<'Lecture' | 'Section' | 'GD'>('Lecture');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [room, setRoom] = useState('');
  const [sectionNumber, setSectionNumber] = useState('');

  const instructors = MOCK_USERS.filter(u => u.role === UserRole.DOCTOR || u.role === UserRole.TA);

  const handleAddItem = () => {
    const newItem: ScheduleItem = {
      id: `sc-${Date.now()}`,
      subjectId,
      instructorId,
      type,
      day,
      startTime,
      endTime,
      room: room || 'قاعة عامة',
      sectionNumber: sectionNumber ? parseInt(sectionNumber) : undefined
    };
    setSchedule([newItem, ...schedule]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setRoom('');
    setSectionNumber('');
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الجلسة من الجدول؟')) {
      setSchedule(schedule.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة الجداول الدراسية</h1>
          <p className="text-slate-500 text-sm mt-1">بصفتك مديراً للنظام، يمكنك تعيين الدكاترة والمعيدين للمحاضرات والسكشنات.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} />
          إضافة حصة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {schedule.map((item) => {
          const subject = MOCK_SUBJECTS.find(s => s.id === item.subjectId);
          const instructor = MOCK_USERS.find(u => u.id === item.instructorId);
          return (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-all">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.type === 'Lecture' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {item.type === 'Lecture' ? <BookOpen size={28} /> : <UserIcon size={28} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">{subject?.name}</h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${item.type === 'Lecture' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.type === 'Lecture' ? 'محاضرة' : `سكشن ${item.sectionNumber || ''}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    المحاضر: <span className="font-bold text-slate-700">{instructor?.name}</span> ({instructor?.role === UserRole.DOCTOR ? 'دكتور' : 'معيد'})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-sm font-medium">{item.day}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={16} className="text-slate-400" />
                  <span className="text-sm font-medium">{item.startTime} - {item.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-sm font-medium">{item.room}</span>
                </div>
              </div>

              <button 
                onClick={() => handleDelete(item.id)}
                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal إضافة حصة */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold">تخطيط حصة جديدة</h3>
              <Calendar size={24} />
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">المادة</label>
                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                  {MOCK_SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">المحاضر المسؤول (دكتور/معيد)</label>
                <select value={instructorId} onChange={(e) => setInstructorId(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                  {instructors.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">نوع الجلسة</label>
                <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Lecture">محاضرة عامة</option>
                  <option value="Section">سكشن عملي</option>
                  <option value="GD">مناقشة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">رقم السكشن (اختياري)</label>
                <input type="number" value={sectionNumber} onChange={(e) => setSectionNumber(e.target.value)} placeholder="مثلاً: 5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اليوم</label>
                <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Sunday">الأحد</option>
                  <option value="Monday">الاثنين</option>
                  <option value="Tuesday">الثلاثاء</option>
                  <option value="Wednesday">الأربعاء</option>
                  <option value="Thursday">الخميس</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">من</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">إلى</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">المكان (القاعة/المعمل)</label>
                <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="مثلاً: مدرج 1 أو معمل 4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2 pt-4 flex gap-3">
                <button onClick={handleAddItem} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">حفظ في الجدول</button>
                <button onClick={() => setShowModal(false)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">إلغاء</button>
              </div>
            </div>
            <div className="p-4 bg-amber-50 flex items-center gap-3 border-t border-amber-100">
              <AlertCircle size={18} className="text-amber-500" />
              <p className="text-[10px] text-amber-800">سيتم تفعيل الرمز تلقائياً لهذا المحاضر في الوقت والمكان المحددين.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchedule;
