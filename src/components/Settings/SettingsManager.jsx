import React, { useState } from 'react';
import { useAppConfig } from '../../hooks/useAppConfig';
import { Check, Shield, AlertTriangle, Globe, Bell, User, Settings as SettingsIcon } from 'lucide-react';

const SettingsManager = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { lang, setLanguage } = useAppConfig();

  // DİL VERİLERİ
  const text = {
    en: {
        tabs: { profile: 'Profile', security: 'Security', preferences: 'Preferences' },
        profile: { title: 'Personal Information', btnChange: 'Change Photo', btnDel: 'Remove', name: 'First Name', last: 'Last Name', email: 'Email Address', save: 'Save Changes' },
        security: { title: 'Login & Security', passTitle: 'Change Password', curPass: 'Current Password', newPass: 'New Password', confirm: 'Confirm Password', updateBtn: 'Update Password', delTitle: 'Delete Account', delDesc: 'Once you delete your account, there is no going back. Please be certain.', delBtn: 'Delete Account' },
        pref: { title: 'System Preferences', langTitle: 'Language', notifTitle: 'Notifications', emailNotif: 'Email Notifications', pushNotif: 'Push Notifications' }
    },
    tr: {
        tabs: { profile: 'Profil', security: 'Güvenlik', preferences: 'Tercihler' },
        profile: { title: 'Kişisel Bilgiler', btnChange: 'Fotoğrafı Değiştir', btnDel: 'Kaldır', name: 'Ad', last: 'Soyad', email: 'E-posta', save: 'Kaydet' },
        security: { title: 'Giriş & Güvenlik', passTitle: 'Şifre Değiştir', curPass: 'Mevcut Şifre', newPass: 'Yeni Şifre', confirm: 'Şifreyi Onayla', updateBtn: 'Şifreyi Güncelle', delTitle: 'Hesabı Sil', delDesc: 'Hesabınızı sildiğinizde geri dönüşü yoktur. Lütfen emin olun.', delBtn: 'Hesabı Sil' },
        pref: { title: 'Sistem Tercihleri', langTitle: 'Dil Seçimi', notifTitle: 'Bildirimler', emailNotif: 'E-posta Bildirimleri', pushNotif: 'Anlık Bildirimler' }
    }
  };

  const t = text[lang];

  const tabs = [
    { id: 'profile', label: t.tabs.profile, icon: User },
    { id: 'security', label: t.tabs.security, icon: Shield },
    { id: 'preferences', label: t.tabs.preferences, icon: SettingsIcon },
  ];

  return (
    <div className="bg-white min-h-[600px] rounded-[30px] p-8 shadow-sm border border-gray-100 flex flex-col gap-8">
      
      {/* --- HEADER & TABS --- */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 font-serif">Settings</h2>
        <div className="flex items-center gap-2 border-b border-gray-100 pb-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="max-w-3xl w-full">
        
        {/* 1. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-8">{t.profile.title}</h3>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full border-4 border-gray-50 shadow-sm overflow-hidden">
                        <img src="https://i.pravatar.cc/150?u=admin" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button className="text-blue-600 text-xs font-bold hover:underline">{t.profile.btnChange}</button>
                </div>

                {/* Form */}
                <div className="flex-1 w-full space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.profile.name}</label>
                            <input type="text" defaultValue="Mesut Sefa" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.profile.last}</label>
                            <input type="text" defaultValue="Uçar" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.profile.email}</label>
                        <input type="email" defaultValue="admin@dormitrack.com" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                            {t.profile.save}
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* 2. SECURITY TAB (GÜNCELLENDİ: ALT ALTA YAPI) */}
        {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-12">
                
                {/* ÜST KISIM: ŞİFRE DEĞİŞTİRME */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">{t.security.title}</h3>
                    <div className="space-y-4 max-w-xl">
                        <div>
                             <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">{t.security.curPass}</label>
                             <input type="password" placeholder="••••••••" className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">{t.security.newPass}</label>
                             <input type="password" placeholder="••••••••" className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">{t.security.confirm}</label>
                             <input type="password" placeholder="••••••••" className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div className="pt-2">
                            <button className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors w-full sm:w-auto">
                                {t.security.updateBtn}
                            </button>
                        </div>
                    </div>
                </div>

                {/* AYIRICI ÇİZGİ */}
                <hr className="border-gray-100" />

                {/* ALT KISIM: HESAP SİLME (Danger Zone) */}
                <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-full text-red-600 shadow-sm">
                            <AlertTriangle size={24}/>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-red-700 mb-2">{t.security.delTitle}</h4>
                            <p className="text-sm text-red-600/80 mb-6 max-w-lg">{t.security.delDesc}</p>
                            <button className="bg-white text-red-600 border border-red-200 px-6 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                {t.security.delBtn}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        )}

        {/* 3. PREFERENCES TAB (GÜNCELLENDİ: ALT ALTA YAPI) */}
        {activeTab === 'preferences' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-12">
                
                {/* ÜST KISIM: DİL SEÇİMİ */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Globe className="text-gray-400" size={20} /> {t.pref.langTitle}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                        <button onClick={() => setLanguage('en')} className={`flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all ${lang === 'en' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🇺🇸</span> 
                                <span className="font-bold">English</span>
                            </div>
                            {lang === 'en' && <Check size={20} className="bg-blue-600 text-white rounded-full p-0.5"/>}
                        </button>
                        <button onClick={() => setLanguage('tr')} className={`flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all ${lang === 'tr' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🇹🇷</span> 
                                <span className="font-bold">Türkçe</span>
                            </div>
                            {lang === 'tr' && <Check size={20} className="bg-blue-600 text-white rounded-full p-0.5"/>}
                        </button>
                    </div>
                </div>

                {/* AYIRICI ÇİZGİ */}
                <hr className="border-gray-100" />

                {/* ALT KISIM: BİLDİRİMLER */}
                <div>
                     <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Bell className="text-gray-400" size={20} /> {t.pref.notifTitle}
                    </h3>
                    <div className="space-y-4 max-w-xl">
                        <label className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors">
                            <span className="font-bold text-gray-700">{t.pref.emailNotif}</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors">
                            <span className="font-bold text-gray-700">{t.pref.pushNotif}</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default SettingsManager;