
import React, { useState, useEffect } from 'react';
import { User, UserRole, ScheduleItem } from '../types';
import { MOCK_SCHEDULE, MOCK_SUBJECTS, MOCK_USERS } from '../constants';
import { QrCode, Camera, CheckCircle2, Clock, MapPin, Mail, AlertCircle, Timer, ShieldCheck, UserX } from 'lucide-react';

interface AttendanceProps {
  user: User;
}

const Attendance: React.FC<AttendanceProps> = ({ user }) => {
  const [activeSession, setActiveSession] = useState<ScheduleItem | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [simulatedSessionId, setSimulatedSessionId] = useState<string | null>(null);

  // تحديث الوقت كل دقيقة
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // البحث عن سكشن نشط بناءً على الجدول الحالي
  useEffect(() => {
    const today = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    const session = MOCK_SCHEDULE.find(item => {
      if (simulatedSessionId) return item.id === simulatedSessionId;
      if (item.day !== today) return false;

      const [startH, startM] = item.startTime.split(':').map(Number);
      const startTotalMinutes = startH * 60 + startM;
      const endTotalMinutes = startTotalMinutes + 120; // نافذة الساعتين

      return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
    });

    setActiveSession(session || null);
  }, [currentTime, simulatedSessionId]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('تم تسجيل حضورك بنجاح في السكشن النشط حالياً.');
    }, 2000);
  };

  const isAdmin = user.role === UserRole.ADMIN;
  const isStaff = user.role === UserRole.DOCTOR || user.role === UserRole.TA || isAdmin;
  
  // الأدمن يملك صلاحية الإشراف على أي سكشن، بينما المعيد والدكتور يلتزمون بمسؤولياتهم
  const canManageQR = isAdmin || activeSession?.instructorId === user.id;

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">نظام الحضور الموثق</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin ? 'بصفتك مديراً، تملك صلاحية الإشراف الكامل على كافة الرموز.' : 'يتحكم المحاضر المسؤول في عرض الرمز بناءً على الجدول المعتمد.'}
          </p>
        </div>
        
        <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-tighter">محاكاة الوقت:</span>
          <select 
            className="text-xs bg-slate-50 border-none outline-none font-bold text-blue-600 rounded-lg p-1"
            onChange={(e) => setSimulatedSessionId(e.target.value || null)}
            value={simulatedSessionId || ''}
          >
            <option value="">الوقت الفعلي</option>
            {MOCK_SCHEDULE.map(s => (
              <option key={s.id} value={s.id}>
                {s.day.slice(0,3)}: {MOCK_SUBJECTS.find(sub => sub.id === s.subjectId)?.name} ({s.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* معلومات الجلسة الحالية */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">الجلسة الحالية</h3>
            {activeSession ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                  <p className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">{activeSession.type}</p>
                  <p className="font-bold text-slate-800">{MOCK_SUBJECTS.find(s => s.id === activeSession.subjectId)?.name}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <Clock size={14} /> {activeSession.startTime} - {activeSession.endTime}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <MapPin size={14} /> {activeSession.room}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">المحاضر المسؤول</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                      {MOCK_USERS.find(u => u.id === activeSession.instructorId)?.name.charAt(0)}
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      {MOCK_USERS.find(u => u.id === activeSession.instructorId)?.name}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">لا يوجد سكشن نشط في هذا الوقت.</p>
            )}
          </div>

          <div className="bg-slate-800 p-6 rounded-3xl text-white relative overflow-hidden">
            <ShieldCheck className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
            <h4 className="font-bold mb-2 flex items-center gap-2 text-blue-400">
              <ShieldCheck size={18} /> نظام حماية الحضور
            </h4>
            <p className="text-xs opacity-70 leading-relaxed">
              يتم قفل الرمز تلقائياً لضمان النزاهة. بصفتك إدارياً، يمكنك التدخل في أي وقت لتعديل حالة الحضور.
            </p>
          </div>
        </div>

        {/* منطقة العمل */}
        <div className="lg:col-span-2">
          {!activeSession ? (
            <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center min-h-[450px]">
              <Clock size={48} className="text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-400">خارج أوقات العمل</h3>
              <p className="text-slate-400 text-sm mt-2">لا توجد محاضرات نشطة حالياً حسب جدول الإدارة.</p>
            </div>
          ) : isStaff ? (
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-4 border-blue-600 flex flex-col items-center justify-center text-center h-full min-h-[450px] relative">
              {canManageQR ? (
                <div className="animate-in zoom-in duration-500 flex flex-col items-center">
                  <div className="mb-8 p-6 bg-white rounded-3xl shadow-inner border border-slate-100">
                    <div className="w-64 h-64 bg-white relative">
                      <div className="grid grid-cols-10 gap-1 w-full h-full">
                        {Array.from({length: 100}).map((_, i) => (
                          <div key={i} className={`w-full h-full rounded-sm ${Math.random() > 0.4 ? 'bg-slate-900' : 'bg-white'}`}></div>
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="bg-white p-3 rounded-2xl shadow-xl border border-blue-50">
                           <QrCode size={40} className="text-blue-600" />
                         </div>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800">
                    {isAdmin ? 'إشراف الأدمن العام' : 'اعرض الرمز للطلاب'}
                  </h2>
                  <p className="text-slate-500 mt-2 text-sm">
                    {isAdmin ? 'أنت تراقب هذا السكشن بصلاحيات المدير.' : 'أنت المحاضر المسؤول عن هذا السكشن.'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center max-w-xs animate-in fade-in">
                  <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-rose-50/50">
                    <UserX size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">وصول غير مصرح</h3>
                  <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                    عذراً {user.name}، هذا السكشن من مسؤولية 
                    <span className="text-blue-600 font-bold"> {MOCK_USERS.find(u => u.id === activeSession.instructorId)?.name} </span>.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* واجهة الطالب */
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center h-full min-h-[450px]">
              {isScanning ? (
                <div className="space-y-6">
                  <div className="relative w-64 h-64 mx-auto rounded-3xl overflow-hidden bg-slate-900 border-4 border-blue-500 shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(96,165,250,1)]"></div>
                  </div>
                  <p className="font-bold text-slate-800 animate-pulse">جاري المسح والتحقق من الموقع...</p>
                </div>
              ) : scanResult ? (
                <div className="space-y-6 animate-in zoom-in">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">تم إثبات الحضور!</h3>
                    <p className="text-slate-500 text-sm mt-2">{scanResult}</p>
                  </div>
                  <button onClick={() => setScanResult(null)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">إغلاق</button>
                </div>
              ) : (
                <div className="space-y-8 w-full max-w-xs">
                  <div className="p-8 bg-blue-50 rounded-full w-32 h-32 mx-auto flex items-center justify-center text-blue-600 shadow-inner">
                    <Camera size={48} />
                  </div>
                  <button onClick={handleScan} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                    <QrCode size={24} /> فتح الكاميرا
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
};

export default Attendance;
