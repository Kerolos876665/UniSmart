
import React, { useState, useEffect } from 'react';
import { User, UserRole, Subject, ScheduleItem } from '../types';
import { MOCK_SUBJECTS, MOCK_SCHEDULE, MOCK_USERS } from '../constants';
import { 
  Users, 
  BookOpen, 
  AlertTriangle, 
  GraduationCap, 
  TrendingDown,
  Sparkles,
  Mail,
  UserCheck,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getAcademicAdvice } from '../services/geminiService';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    if (user.role === UserRole.STUDENT) {
      fetchAdvice();
    }
  }, [user.role]);

  const fetchAdvice = async () => {
    setLoadingAdvice(true);
    const result = await getAcademicAdvice(18, MOCK_SUBJECTS.map(s => s.name).join(', '));
    setAdvice(result || '');
    setLoadingAdvice(false);
  };

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`${color} p-3 rounded-xl text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );

  const AdminStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="إجمالي الطلاب" value={MOCK_USERS.filter(u => u.role === UserRole.STUDENT).length + 449} icon={GraduationCap} color="bg-blue-600" />
      <StatCard label="أعضاء هيئة التدريس" value={MOCK_USERS.filter(u => u.role === UserRole.DOCTOR || u.role === UserRole.TA).length + 28} icon={Users} color="bg-indigo-600" />
      <StatCard label="المواد النشطة" value={MOCK_SUBJECTS.length} icon={BookOpen} color="bg-emerald-600" />
      <StatCard label="جلسات اليوم" value="12" icon={CalendarDays} color="bg-amber-600" />
    </div>
  );

  const DoctorStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="المعيدين المسجلين" value="12" icon={Users} color="bg-blue-500" />
      <StatCard label="المواد تحت الإشراف" value="3" icon={BookOpen} color="bg-indigo-500" />
      <StatCard label="إجمالي الطلاب" value="450" icon={UserCheck} color="bg-emerald-500" />
      <StatCard label="حالات الإنذار" value="14" icon={AlertTriangle} color="bg-amber-500" />
    </div>
  );

  const TAStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="المجموعات (Sections)" value="8" icon={Users} color="bg-cyan-500" />
      <StatCard label="ساعات التدريس" value="24" icon={BookOpen} color="bg-purple-500" />
      <StatCard label="متوسط الحضور" value="88%" icon={UserCheck} color="bg-green-500" />
      <StatCard label="تواصل الطلاب" value="22" icon={Mail} color="bg-blue-400" />
    </div>
  );

  return (
    <div dir="rtl">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 leading-tight">مرحباً، {user.name} 👋</h1>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <span className="text-sm font-medium">{user.username}</span>
            <span className="mx-2 text-slate-300">|</span>
            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">
              {user.role === UserRole.ADMIN ? 'مدير النظام' : user.role === UserRole.DOCTOR ? 'رئيس المادة' : user.role === UserRole.TA ? 'معيد' : 'طالب'}
            </span>
          </div>
        </div>
      </div>

      {user.role === UserRole.ADMIN && <AdminStats />}
      {user.role === UserRole.DOCTOR && <DoctorStats />}
      {user.role === UserRole.TA && <TAStats />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">الجدول الأكاديمي</h3>
            <div className="space-y-4">
              {MOCK_SCHEDULE.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-slate-50 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-700">
                    <span className="text-[10px] font-bold uppercase">{item.day.slice(0, 3)}</span>
                    <span className="text-lg font-black leading-none">{item.startTime.split(':')[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{MOCK_SUBJECTS.find(s => s.id === item.subjectId)?.name}</p>
                    <p className="text-xs text-slate-500">{item.type === 'Lecture' ? 'محاضرة' : 'سكشن'} • {item.room}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-700">{item.startTime}</p>
                    <p className="text-[10px] text-slate-400">-{item.endTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <Sparkles className="absolute -top-4 -right-4 w-32 h-32 text-white/10" />
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles size={20} /> مساعد الذكاء الاصطناعي
            </h3>
            <p className="text-sm opacity-90 leading-relaxed mb-4">
              {user.role === UserRole.ADMIN
                ? "بصفتك مديراً، يمكنك تحسين توزيع الجداول والقاعات بناءً على كثافة الطلاب."
                : user.role === UserRole.DOCTOR 
                ? "بصفتك رئيس المادة، يمكنك تحليل أداء المعيدين وتوزيع المهام بذكاء."
                : user.role === UserRole.TA
                ? "يمكنك توليد تقارير حضور آلية لطلابك بضغطة زر."
                : "تلقى نصائح دراسية مخصصة بناءً على مستوى حضورك."}
            </p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-sm font-medium transition-all">
              ابدأ التحليل الذكي
            </button>
          </div>
          
          {user.role === UserRole.ADMIN && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
               <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <ShieldCheck size={18} className="text-blue-600" /> حالة النظام
               </h4>
               <div className="space-y-3">
                 <div className="flex justify-between text-xs">
                   <span className="text-slate-500">خادم البيانات</span>
                   <span className="text-green-600 font-bold">متصل</span>
                 </div>
                 <div className="flex justify-between text-xs">
                   <span className="text-slate-500">تشفير الرموز (QR)</span>
                   <span className="text-green-600 font-bold">نشط</span>
                 </div>
                 <div className="flex justify-between text-xs">
                   <span className="text-slate-500">تحديثات الجدول</span>
                   <span className="text-blue-600 font-bold">آنية</span>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
