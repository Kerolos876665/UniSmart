
import React from 'react';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  UserRound, 
  LogOut, 
  Bell, 
  QrCode,
  BarChart3,
  Video,
  CalendarDays,
  Users,
  ClipboardList
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.TA, UserRole.STUDENT] },
    { id: 'admin_users', label: 'إدارة المستخدمين', icon: Users, roles: [UserRole.ADMIN] },
    { id: 'admin_schedule', label: 'إدارة الجداول', icon: CalendarDays, roles: [UserRole.ADMIN] },
    { id: 'attendance_records', label: 'سجلات المتابعة', icon: ClipboardList, roles: [UserRole.ADMIN] },
    { id: 'virtual', label: 'الفصول الافتراضية', icon: Video, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.TA, UserRole.STUDENT] },
    { id: 'attendance', label: 'تسجيل الحضور', icon: QrCode, roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.TA, UserRole.DOCTOR] },
    { id: 'reports', label: 'التقارير والتحليلات', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.DOCTOR] },
    { id: 'profile', label: 'الملف الشخصي', icon: UserRound, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.TA, UserRole.STUDENT] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case UserRole.DOCTOR: return 'دكتور المادة';
      case UserRole.TA: return 'معيد';
      case UserRole.ADMIN: return 'مدير النظام';
      default: return 'طالب';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">UniSmart</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="md:hidden flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <span className="font-bold">UniSmart</span>
          </div>
          
          <div className="flex-1 flex justify-end items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-none mb-1">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">{getRoleLabel(user.role)}</p>
              </div>
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold uppercase ring-2 ring-blue-50">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </section>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex bg-white border-t border-slate-200 px-2 py-1 items-center justify-around">
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
