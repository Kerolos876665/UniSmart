
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  Key, 
  Trash2, 
  Search, 
  FileUp, 
  Loader2,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import { processUserListAI } from '../services/geminiService';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rawText, setRawText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // نماذج الإدخال اليدوي
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: UserRole.STUDENT,
    specialty: ''
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `u-${Date.now()}`,
      ...formData,
      password: '123' // افتراضي
    };
    setUsers([newUser, ...users]);
    setShowManualModal(false);
    setFormData({ name: '', email: '', username: '', role: UserRole.STUDENT, specialty: '' });
  };

  const handleAIProcess = async () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    const aiResults = await processUserListAI(rawText);
    if (aiResults && Array.isArray(aiResults)) {
      const formattedUsers: User[] = aiResults.map((u: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        name: u.name,
        email: u.email,
        username: u.username,
        role: u.role as UserRole,
        password: u.password
      }));
      setUsers([...formattedUsers, ...users]);
      setShowAIModal(false);
      setRawText('');
    }
    setIsProcessing(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة حسابات الجامعة</h1>
          <p className="text-slate-500 text-sm mt-1">إضافة وإدارة صلاحيات الطلاب والمعيدين والدكاترة.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Sparkles size={20} />
            إنشاء ذكي (AI)
          </button>
          <button 
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <UserPlus size={20} />
            إضافة يدوية
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="بحث بالاسم أو اسم المستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-11 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 text-xs font-bold">
             <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">الكل: {users.length}</span>
             <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">طلاب: {users.filter(u => u.role === UserRole.STUDENT).length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">المستخدم</th>
                <th className="px-6 py-4">الدور</th>
                <th className="px-6 py-4">اسم المستخدم</th>
                <th className="px-6 py-4">البريد</th>
                <th className="px-6 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase ${
                      u.role === UserRole.DOCTOR ? 'bg-indigo-100 text-indigo-700' :
                      u.role === UserRole.TA ? 'bg-amber-100 text-amber-700' :
                      u.role === UserRole.ADMIN ? 'bg-rose-100 text-rose-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{u.username}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setUsers(users.filter(usr => usr.id !== u.id))}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: إضافة يدوية */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold">إضافة مستخدم جديد</h3>
              <UserPlus size={24} />
            </div>
            <form onSubmit={handleManualSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">الاسم الكامل</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="مثلاً: محمد أحمد" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">اسم المستخدم</label>
                  <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="m_ahmed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الدور</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={UserRole.STUDENT}>طالب</option>
                    <option value={UserRole.TA}>معيد</option>
                    <option value={UserRole.DOCTOR}>دكتور</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
                <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="m@unismart.edu" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">حفظ الحساب</button>
                <button type="button" onClick={() => setShowManualModal(false)} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: المعالجة بالذكاء الاصطناعي */}
      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles size={24} />
                <h3 className="text-xl font-bold">المعالجة الذكية للقوائم</h3>
              </div>
              <ShieldCheck size={24} />
            </div>
            <div className="p-8 space-y-6">
              <div>
                <p className="text-sm text-slate-600 mb-4">
                  الصق أسماء الطلاب من ملف (Excel أو Word) وسيقوم Gemini بإنشاء حسابات كاملة لهم تلقائياً.
                </p>
                <textarea 
                  rows={8}
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  placeholder="مثال:&#10;1. أحمد محمد علي - طالب قسم الحاسب&#10;2. سارة محمود - معيدة خوارزميات&#10;..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                ></textarea>
              </div>
              
              <div className="flex gap-4">
                <button 
                  disabled={isProcessing || !rawText.trim()}
                  onClick={handleAIProcess}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <UserCheck size={20} />}
                  {isProcessing ? 'جاري التحليل وتوليد الحسابات...' : 'توليد الحسابات فوراً'}
                </button>
                <button 
                  onClick={() => setShowAIModal(false)}
                  className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                <CheckCircle size={14} /> يتم تشفير كلمات المرور تلقائياً
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
