
import React, { useState } from 'react';
import { 
  Globe, 
  Share2, 
  Settings, 
  Database, 
  ShieldCheck, 
  Copy, 
  CheckCircle, 
  Server,
  CloudZap,
  Lock
} from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">إعدادات ونشر النظام</h1>
        <p className="text-slate-500 text-sm mt-1">إدارة النسخة الحية من UniSmart وتجهيزها للاستخدام الجامعي.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* حالة النشر */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">رابط النسخة الحية</h3>
                  <p className="text-xs text-slate-400">هذا هو الرابط الذي سيستخدمه الطلاب للوصول للنظام.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Production Live</span>
            </div>

            <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <code className="flex-1 text-sm text-blue-600 font-mono overflow-hidden whitespace-nowrap text-left" dir="ltr">
                {appUrl}
              </code>
              <button 
                onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
              >
                {copied ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
                {copied ? 'تم النسخ' : 'نسخ الرابط'}
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Server size={18} className="text-slate-400" /> البنية التحتية
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">قاعدة البيانات:</span>
                    <span className="font-bold text-slate-800">Cloud Firestore (Active)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">موقع الخادم:</span>
                    <span className="font-bold text-slate-800">Europe (Frankfurt)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-slate-400" /> الأمان والتشفير
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">تشفير البيانات:</span>
                    <span className="font-bold text-emerald-600">AES-256 Bit (Active)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">شهادة SSL:</span>
                    <span className="font-bold text-emerald-600">Valid & Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
               <CloudZap size={20} className="text-amber-500" /> خدمات الذكاء الاصطناعي (Gemini)
             </h3>
             <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                <div>
                   <p className="text-sm font-bold text-indigo-900">مفتاح الربط النشط</p>
                   <p className="text-xs text-indigo-600 mt-1">تتم معالجة كافة النصائح والتقارير عبر Gemini 3.0</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-emerald-700 uppercase">Connected</span>
                </div>
             </div>
          </div>
        </div>

        {/* دعوة المستخدمين */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
            <Share2 className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
            <h3 className="text-lg font-bold mb-4">مشاركة النظام</h3>
            <p className="text-sm opacity-70 leading-relaxed mb-6">
              بمجرد مشاركة الرابط، يمكن للطلاب والمعيدين البدء في إنشاء حساباتهم. بصفتك مديراً، ستصلك إشعارات بكل تسجيل جديد.
            </p>
            <button 
              onClick={copyLink}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
            >
              <Share2 size={18} />
              مشاركة مع الجامعة
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Lock size={18} className="text-rose-500" /> سياسات الوصول
            </h4>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">تفعيل التسجيل المفتوح</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">طلب بريد جامعي رسمي (@edu)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">موافقة الأدمن على الحسابات الجديدة</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
