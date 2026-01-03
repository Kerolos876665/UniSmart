
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { MOCK_USERS } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import Reports from './components/Reports';
import VirtualClassroom from './components/VirtualClassroom';
import AdminSchedule from './components/AdminSchedule';
import AttendanceRecords from './components/AttendanceRecords';
import { GraduationCap, ShieldAlert, ArrowRight, Lock, User as UserIcon, Mail, UserPlus, LogIn, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  useEffect(() => {
    const saved = localStorage.getItem('unismart_user');
    const savedUsers = localStorage.getItem('unismart_all_users');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('unismart_user');
      }
    }
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (e) {
        setUsers(MOCK_USERS);
      }
    } else {
      localStorage.setItem('unismart_all_users', JSON.stringify(MOCK_USERS));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      const foundUser = users.find(u => 
        (u.email.toLowerCase() === identifier.toLowerCase() || u.username === identifier) && 
        u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('unismart_user', JSON.stringify(foundUser));
      } else {
        setError('بيانات الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const exists = users.some(u => u.username === identifier || u.email === identifier);
      if (exists) {
        setError('اسم المستخدم أو البريد الإلكتروني مسجل بالفعل.');
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        username: identifier,
        email: identifier.includes('@') ? identifier : `${identifier}@unismart.edu`,
        password,
        role
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('unismart_all_users', JSON.stringify(updatedUsers));
      
      setUser(newUser);
      localStorage.setItem('unismart_user', JSON.stringify(newUser));
      setIsLoading(false);
    }, 1200);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('unismart_user');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">UniSmart</h1>
            <p className="text-slate-500 mt-2 text-center">نظام الإدارة الذكي للجامعة</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 transition-all duration-500">
            <div className="flex gap-4 mb-8 p-1 bg-slate-50 rounded-2xl">
              <button 
                onClick={() => { setIsRegistering(false); setError(''); }}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${!isRegistering ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LogIn size={18} /> دخول
              </button>
              <button 
                onClick={() => { setIsRegistering(true); setError(''); }}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isRegistering ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <UserPlus size={18} /> تسجيل جديد
              </button>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-6 text-right">
              {isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex gap-2 items-center text-right border border-red-100">
                <ShieldAlert size={18} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4 text-right">
              {isRegistering && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">الاسم بالكامل</label>
                  <div className="relative">
                    <UserIcon className="absolute right-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: د. أحمد محمد"
                      className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {isRegistering ? 'اسم المستخدم' : 'اسم المستخدم أو البريد'}
                </label>
                <div className="relative">
                  {isRegistering ? <Mail className="absolute right-4 top-3.5 text-slate-400" size={18} /> : <UserIcon className="absolute right-4 top-3.5 text-slate-400" size={18} />}
                  <input 
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={isRegistering ? "m_ahmed" : "اسم المستخدم"}
                    className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {isRegistering && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-400">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">هويتك في الجامعة</label>
                  <div className="relative">
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none font-bold text-blue-700"
                    >
                      <option value={UserRole.STUDENT}>طالب (Student)</option>
                      <option value={UserRole.TA}>معيد (TA)</option>
                      <option value={UserRole.DOCTOR}>دكتور (Doctor)</option>
                    </select>
                    <ChevronDown className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-4 ${isRegistering ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' : 'bg-blue-600 shadow-blue-100 hover:bg-blue-700'} text-white`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isRegistering ? 'تفعيل الحساب' : 'دخول'} 
                    <ArrowRight size={20} className="rotate-180" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <p className="text-center text-slate-400 text-xs mt-8">
            &copy; 2024 UniSmart Ltd. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'admin_users': return <UserManagement />;
      case 'admin_schedule': return <AdminSchedule />;
      case 'attendance_records': return <AttendanceRecords />;
      case 'virtual': return <VirtualClassroom user={user} />;
      case 'attendance': return <Attendance user={user} />;
      case 'reports': return <Reports user={user} />;
      case 'profile':
        return (
          <div className="max-w-2xl mx-auto space-y-6" dir="rtl">
            <h1 className="text-2xl font-bold text-slate-800 text-center">الملف الشخصي</h1>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-4xl text-blue-700 font-bold mb-6 ring-4 ring-blue-50">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mt-1">{user.role}</p>
              <div className="w-full mt-10 space-y-4 text-right">
                <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-800 font-semibold text-sm">{user.username}</span>
                  <span className="text-slate-500 text-sm">اسم المستخدم</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-800 font-semibold text-sm">{user.email}</span>
                  <span className="text-slate-500 text-sm">البريد الإلكتروني</span>
                </div>
              </div>
            </div>
          </div>
        );
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
