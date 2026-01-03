
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Video, Plus, ExternalLink, Clock, Users, Play, Calendar } from 'lucide-react';
import { MOCK_SUBJECTS } from '../constants';

interface Meeting {
  id: string;
  title: string;
  subjectId: string;
  instructor: string;
  startTime: string;
  status: 'live' | 'scheduled' | 'ended';
  url: string;
}

interface VirtualClassroomProps {
  user: User;
}

const VirtualClassroom: React.FC<VirtualClassroomProps> = ({ user }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 'm1',
      title: 'مراجعة معمارية الحاسب - الفصل الأول',
      subjectId: 's1',
      instructor: 'د. خالد العمري',
      startTime: '10:30 AM',
      status: 'live',
      url: 'https://zoom.us/j/mock_meeting_1'
    },
    {
      id: 'm2',
      title: 'تدريب عملي: خوارزميات البحث',
      subjectId: 's2',
      instructor: 'م. سارة محمود',
      startTime: '01:00 PM',
      status: 'scheduled',
      url: 'https://zoom.us/j/mock_meeting_2'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(MOCK_SUBJECTS[0].id);

  // الأدمن والدكاترة والمعيدين يملكون صلاحية إنشاء الاجتماعات
  const isInstructor = user.role === UserRole.DOCTOR || user.role === UserRole.TA || user.role === UserRole.ADMIN;

  const handleCreateMeeting = () => {
    if (!newTitle) return;
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: newTitle,
      subjectId: selectedSubject,
      instructor: user.name,
      startTime: 'الآن',
      status: 'live',
      url: 'https://zoom.us/j/new_meeting_' + Math.random().toString(36).substring(7)
    };
    setMeetings([newMeeting, ...meetings]);
    setShowCreateModal(false);
    setNewTitle('');
    window.open(newMeeting.url, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الفصول الافتراضية</h1>
          <p className="text-slate-500 text-sm">تواصل مباشرة مع طلابك وزملائك عبر تقنيات الفيديو.</p>
        </div>
        {isInstructor && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} />
            بدء حصة مباشرة (Zoom)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className={`p-4 ${meeting.status === 'live' ? 'bg-rose-50' : 'bg-slate-50'} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                {meeting.status === 'live' ? (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                ) : <Clock size={14} className="text-slate-400" />}
                <span className={`text-[10px] font-black uppercase tracking-wider ${meeting.status === 'live' ? 'text-rose-600' : 'text-slate-500'}`}>
                  {meeting.status === 'live' ? 'مباشر الآن' : 'مجدول'}
                </span>
              </div>
              <div className="text-[10px] font-bold text-slate-400">
                {meeting.startTime}
              </div>
            </div>
            
            <div className="p-6 flex-1">
              <div className="mb-4">
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                  {MOCK_SUBJECTS.find(s => s.id === meeting.subjectId)?.name}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2 line-clamp-2 leading-snug">
                  {meeting.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 uppercase">
                  {meeting.instructor.charAt(0)}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-700">{meeting.instructor}</p>
                  <p className="text-slate-400">المحاضر</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 mt-auto">
              <a 
                href={meeting.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  meeting.status === 'live' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {meeting.status === 'live' ? <Play size={18} fill="currentColor" /> : <Calendar size={18} />}
                {meeting.status === 'live' ? 'انضمام الآن' : 'التذكير لاحقاً'}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal لإنشاء اجتماع */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold">بدء فصل افتراضي جديد</h3>
              <Video size={24} />
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الحصة</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثلاً: مناقشة المشروع النهائي"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">المادة العلمية</label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  {MOCK_SUBJECTS.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={handleCreateMeeting}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                  بدء الاجتماع الآن
                </button>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualClassroom;
