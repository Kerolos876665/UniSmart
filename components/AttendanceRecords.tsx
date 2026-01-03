
import React, { useState } from 'react';
import { User, UserRole, Subject } from '../types';
import { MOCK_USERS, MOCK_SUBJECTS } from '../constants';
import { 
  UserX, 
  UserCheck, 
  AlertOctagon, 
  Search, 
  FileDown, 
  Filter, 
  MailWarning,
  ArrowLeftRight
} from 'lucide-react';

const AttendanceRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'present' | 'absent' | 'barred'>('all');

  // محاكاة بيانات الحضور التراكمية
  const studentsAttendance = MOCK_USERS.filter(u => u.role === UserRole.STUDENT).map(s => {
    // توليد نسب عشوائية للعرض
    const absenceRate = s.username === 'omar_student' ? 28 : Math.floor(Math.random() * 20);
    return {
      ...s,
      presentCount: 15,
      absentCount: Math.floor(absenceRate / 2),
      rate: absenceRate,
      isBarred: absenceRate > 25
    };
  });

  const filteredData = studentsAttendance.filter(s => {
    const matchesSearch = s.name.includes(searchTerm) || s.username.includes(searchTerm);
    if (activeFilter === 'barred') return matchesSearch && s.isBarred;
    if (activeFilter === 'absent') return matchesSearch && s.rate > 10 && !s.isBarred;
    if (activeFilter === 'present') return matchesSearch && s.rate <= 10;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">سجلات المتابعة الأكاديمية</h1>
          <p className="text-slate-500 text-sm mt-1">إدارة قوائم الحضور والغياب وقرارات الحرمان من الامتحانات.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FileDown size={18} />
            تصدير كـ PDF
          </button>
        </div>
      </div>

      {/* بطاقات الإحصاء السريع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl">
            <UserCheck size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">حضور منتظم</p>
            <p className="text-2xl font-black text-slate-800">85%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl">
            <UserX size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">متغيبون (إنذار)</p>
            <p className="text-2xl font-black text-slate-800">12%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="bg-rose-100 text-rose-600 p-4 rounded-2xl">
            <AlertOctagon size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">محرومون من الامتحان</p>
            <p className="text-2xl font-black text-rose-600">{studentsAttendance.filter(s => s.isBarred).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* أدوات التصفية */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="بحث عن طالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-11 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >الكل</button>
            <button 
              onClick={() => setActiveFilter('present')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'present' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'}`}
            >المنضبطين</button>
            <button 
              onClick={() => setActiveFilter('barred')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'barred' ? 'bg-rose-100 text-rose-700' : 'text-slate-500'}`}
            >المحرومين</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">اسم الطالب</th>
                <th className="px-6 py-4">المادة</th>
                <th className="px-6 py-4">مرات الحضور</th>
                <th className="px-6 py-4">مرات الغياب</th>
                <th className="px-6 py-4">نسبة الغياب</th>
                <th className="px-6 py-4">الحالة الأكاديمية</th>
                <th className="px-6 py-4">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((student) => (
                <tr key={student.id} className={`${student.isBarred ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'} transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${student.isBarred ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                        <p className="text-[10px] text-slate-400">{student.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">Computer Architecture</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{student.presentCount}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{student.absentCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${student.isBarred ? 'bg-rose-500' : 'bg-blue-500'}`} 
                          style={{width: `${student.rate}%`}}
                        ></div>
                      </div>
                      <span className={`text-xs font-bold ${student.isBarred ? 'text-rose-600' : 'text-slate-600'}`}>{student.rate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {student.isBarred ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black">
                        <AlertOctagon size={12} /> محروم من الامتحان
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black">
                        <UserCheck size={12} /> مؤهل للدخول
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="إرسال إنذار">
                      <MailWarning size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecords;
