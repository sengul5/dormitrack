import React, { useState, useEffect } from 'react'
import {
  Check,
  Shield,
  AlertTriangle,
  Globe,
  Bell,
  User,
  Settings as SettingsIcon,
  Loader2,
  Save
} from 'lucide-react'
import { Card } from '@ui/Card.component'
import Button from '@ui/Button.component'
import { Input } from '@ui/Input.component'
import Switch from '@ui/Switch.component'
import Avatar from '@ui/Avatar.component'

// Dil Yönetimi Mock Hook (Gerçek projede Context'ten gelir)
const useAppConfig = () => {
  const [lang, setLang] = useState<'en' | 'tr'>('en')
  return { lang, setLanguage: setLang }
}

const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile')
  const { lang, setLanguage } = useAppConfig()
  
  // KULLANICI STATE'İ
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    photo: '',
  })

  // ŞİFRE STATE'İ
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  // --- 1. KULLANICI BİLGİLERİNİ ÇEKME ---
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        // BURASI İLERİDE: const data = await authService.getMe();
        await new Promise((resolve) => setTimeout(resolve, 600)) // Simülasyon

        setUserProfile({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@dormitrack.com',
          photo: 'https://i.pravatar.cc/150?u=admin',
        })
      } catch (error) {
        console.error('Profil yüklenemedi', error)
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === 'profile') {
        fetchProfile()
    }
  }, [activeTab])

  // --- 2. PROFİL GÜNCELLEME ---
  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
        // BURASI İLERİDE: await userService.updateProfile(userProfile);
        await new Promise((resolve) => setTimeout(resolve, 1000))
        alert('Profile updated successfully!')
    } catch (error) {
        alert('Failed to update profile.')
    } finally {
        setIsSaving(false)
    }
  }

  // --- 3. ŞİFRE GÜNCELLEME ---
  const handleUpdatePassword = async () => {
    if (passwords.new !== passwords.confirm) {
        alert('New passwords do not match!')
        return
    }
    // API Call simülasyonu...
    alert('Password update request sent.')
    setPasswords({ current: '', new: '', confirm: '' })
  }

  // DİL VERİLERİ
  const text = {
    en: {
      tabs: { profile: 'Profile', security: 'Security', preferences: 'Preferences' },
      profile: {
        title: 'Personal Information',
        btnChange: 'Change Photo',
        name: 'First Name',
        last: 'Last Name',
        email: 'Email Address',
        save: 'Save Changes',
      },
      security: {
        title: 'Login & Security',
        passTitle: 'Change Password',
        curPass: 'Current Password',
        newPass: 'New Password',
        confirm: 'Confirm Password',
        updateBtn: 'Update Password',
        delTitle: 'Delete Account',
        delDesc: 'Once you delete your account, there is no going back. Please be certain.',
        delBtn: 'Delete Account',
      },
      pref: {
        title: 'System Preferences',
        langTitle: 'Language',
        notifTitle: 'Notifications',
        emailNotif: 'Email Notifications',
        pushNotif: 'Push Notifications',
      },
    },
    tr: {
      tabs: { profile: 'Profil', security: 'Güvenlik', preferences: 'Tercihler' },
      profile: {
        title: 'Kişisel Bilgiler',
        btnChange: 'Fotoğrafı Değiştir',
        name: 'Ad',
        last: 'Soyad',
        email: 'E-posta',
        save: 'Kaydet',
      },
      security: {
        title: 'Giriş & Güvenlik',
        passTitle: 'Şifre Değiştir',
        curPass: 'Mevcut Şifre',
        newPass: 'Yeni Şifre',
        confirm: 'Şifreyi Onayla',
        updateBtn: 'Şifreyi Güncelle',
        delTitle: 'Hesabı Sil',
        delDesc: 'Hesabınızı sildiğinizde geri dönüşü yoktur. Lütfen emin olun.',
        delBtn: 'Hesabı Sil',
      },
      pref: {
        title: 'Sistem Tercihleri',
        langTitle: 'Dil Seçimi',
        notifTitle: 'Bildirimler',
        emailNotif: 'E-posta Bildirimleri',
        pushNotif: 'Anlık Bildirimler',
      },
    },
  }

  const t = text[lang]

  const tabs = [
    { id: 'profile', label: t.tabs.profile, icon: User },
    { id: 'security', label: t.tabs.security, icon: Shield },
    { id: 'preferences', label: t.tabs.preferences, icon: SettingsIcon },
  ]

  return (
    <Card className="flex min-h-[600px] flex-col gap-8 p-8">
      {/* HEADER & TABS */}
      <div>
        <h2 className="mb-6 font-serif text-3xl font-bold text-gray-800">Settings</h2>
        <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-100 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-t-xl border-b-2 px-6 py-3 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 bg-blue-50/50 text-blue-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-3xl">
        {/* 1. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="mb-8 text-xl font-bold text-gray-800">{t.profile.title}</h3>

            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-400" /></div>
            ) : (
            <div className="flex flex-col items-start gap-8 md:flex-row">
              <div className="flex flex-col items-center gap-4">
                <Avatar
                  src={userProfile.photo}
                  size="lg"
                  className="h-32 w-32 border-4 border-gray-50"
                />
                <button className="text-xs font-bold text-blue-600 hover:underline">
                  {t.profile.btnChange}
                </button>
              </div>

              <div className="w-full flex-1 space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input 
                    label={t.profile.name} 
                    value={userProfile.firstName} 
                    onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                  />
                  <Input 
                    label={t.profile.last} 
                    value={userProfile.lastName} 
                    onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                  />
                </div>
                <Input 
                    label={t.profile.email} 
                    type="email" 
                    value={userProfile.email} 
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    disabled // Email genelde değiştirilemez
                />
                <div className="flex justify-end pt-2">
                  <Button size="lg" onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin mr-2" size={18}/> : <Save size={18} className="mr-2"/>}
                    {isSaving ? 'Saving...' : t.profile.save}
                  </Button>
                </div>
              </div>
            </div>
            )}
          </div>
        )}

        {/* 2. SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-12 duration-300">
            <div>
              <h3 className="mb-6 text-xl font-bold text-gray-800">{t.security.title}</h3>
              <div className="max-w-xl space-y-4">
                <Input 
                    type="password" 
                    label={t.security.curPass} 
                    placeholder="••••••••" 
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                />
                <Input 
                    type="password" 
                    label={t.security.newPass} 
                    placeholder="••••••••" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                />
                <Input 
                    type="password" 
                    label={t.security.confirm} 
                    placeholder="••••••••" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                />
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    className="w-full bg-gray-800 px-6 text-white hover:bg-black sm:w-auto"
                    onClick={handleUpdatePassword}
                  >
                    {t.security.updateBtn}
                  </Button>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="rounded-2xl border border-red-100 bg-red-50 p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-white p-3 text-red-600 shadow-sm">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-bold text-red-700">{t.security.delTitle}</h4>
                  <p className="mb-6 max-w-lg text-sm text-red-600/80">{t.security.delDesc}</p>
                  <Button variant="danger">{t.security.delBtn}</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PREFERENCES TAB */}
        {activeTab === 'preferences' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-12 duration-300">
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800">
                <Globe className="text-gray-400" size={20} /> {t.pref.langTitle}
              </h3>
              <div className="grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
                {['en', 'tr'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l as any)}
                    className={`flex items-center justify-between rounded-xl border-2 px-6 py-4 transition-all ${
                      lang === l
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-100 text-gray-600 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{l === 'en' ? '🇺🇸' : '🇹🇷'}</span>
                      <span className="font-bold">{l === 'en' ? 'English' : 'Türkçe'}</span>
                    </div>
                    {lang === l && (
                      <Check size={20} className="rounded-full bg-blue-600 p-0.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800">
                <Bell className="text-gray-400" size={20} /> {t.pref.notifTitle}
              </h3>
              <div className="max-w-xl space-y-4">
                <Switch label={t.pref.emailNotif} defaultChecked />
                <Switch label={t.pref.pushNotif} defaultChecked />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default SettingsManager