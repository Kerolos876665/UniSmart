
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Users, AlertCircle, FileDown, CheckCircle } from 'lucide-react';
import { User, UserRole } from '../types';

interface ReportsProps {
  user: User;
}

const Reports: React.FC<ReportsProps> = ({ user }) => {
  const subjectData = [
    { name: 'CS301', rate: 88, target: 75, students: 120 },
    { name: 'AI202', rate: 72, target: 75, students: 85 },
    { name: 'CS405', rate: 94, target: 75, students: 45 },
    { name: 'MATH101', rate: 65, target: 75, students: 200 },
  ];

  const sectionBreakdown = [
    { section: 'سكشن 1', attendance: '95%', status: 'ممتاز' },
    { section: 'سكشن 2', attendance: '88%', status: 'جيد جداً' },
    { section: 'سكشن 3', attendance: '70%', status: 'تحت المراجعة' },
    { section: 'المحاضرة العامة', attendance: '92%', status: 'ممتاز' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">التقارير التحليلية</h1>
          <p className="text-slate-500 text-sm">متابعة دقيقة لنسب الحضور التراكمية لكل المجموعات.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
          <FileDown size={18} />
          تصدير تقرير PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">متوسط الحضور العام</p>
          <p className="text-2xl font-black text-slate-800 mt-1">82.4%</p>
          <div className="mt-2 flex items-center gap-1 text-green-600 text-xs font-bold">
             <TrendingUp size={14} /> +2.5% عن الأسبوع الماضي
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">سكشنات منخفضة الحضور</p>
          <p className="text-2xl font-black text-slate-800 mt-1">2</p>
          <div className="mt-2 flex items-center gap-1 text-amber-600 text-xs font-bold">
             <AlertCircle size={14} /> تتطلب تدخل الدكتور
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">إجمالي الجلسات المكتملة</p>
          <p className="text-2xl font-black text-slate-800 mt-1">48</p>
          <div className="mt-2 flex items-center gap-1 text-blue-600 text-xs font-bold">
             <CheckCircle size={14} /> تم تجميع كافة البيانات
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">أداء المواد (تراكمي)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]} barSize={40}>
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rate < entry.target ? '#f43f5e' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">تفصيل السكشنات (CS301)</h3>
          <div className="space-y-4">
            {sectionBreakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-800">{item.section}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{item.status}</p>
                </div>
                <div className="text-left">
                  <p className="text-xl font-black text-blue-600">{item.attendance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
