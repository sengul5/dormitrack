import { useState, useEffect } from 'react';

// --- ÇEVİRİ SÖZLÜĞÜ ---
const DICTIONARY = {
  en: {
    sidebar: {
      dashboard: 'Dashboard',
      staff: 'Staff Management',
      requests: 'Requests Center', // Admin İçin
      myRequests: 'My Requests',   // Öğrenci İçin
      newRequest: 'New Request',   // Öğrenci İçin
      complaints: 'Complaints',
      categories: 'Categories',
      settings: 'Settings',
      feedback: 'Feedbacks',
      logout: 'Switch Role (Test)', // Test için ismini değiştirdim
      mode: 'Dark Mode'
    },
    // ... settings çevirileri aynı kalabilir ...
  },
  tr: {
    sidebar: {
      dashboard: 'Kontrol Paneli',
      staff: 'Personel Yönetimi',
      requests: 'Talep Merkezi', // Admin İçin
      myRequests: 'Taleplerim',  // Öğrenci İçin
      newRequest: 'Yeni Talep',  // Öğrenci İçin
      complaints: 'Şikayetler',
      categories: 'Kategoriler',
      settings: 'Ayarlar',
      feedback: 'Geri Bildirimler',
      logout: 'Rol Değiştir (Test)',
      mode: 'Karanlık Mod'
    },
    // ... settings çevirileri aynı kalabilir ...
  }
};

export const useAppConfig = () => {
  const [lang, setLangState] = useState('en');
  // YENİ: Başlangıç rolü 'admin'. Seçenekler: 'admin', 'student', 'staff'
  const [role, setRoleState] = useState('admin'); 

  useEffect(() => {
    const savedLang = localStorage.getItem('dormi_lang') || 'en';
    const savedRole = localStorage.getItem('dormi_role') || 'admin'; // Rolü hafızadan oku
    
    setLangState(savedLang);
    setRoleState(savedRole);

    const handleStorageChange = () => {
        setLangState(localStorage.getItem('dormi_lang') || 'en');
        setRoleState(localStorage.getItem('dormi_role') || 'admin');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('appConfigChange', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('appConfigChange', handleStorageChange);
    };
  }, []);

  const setLanguage = (code) => {
    localStorage.setItem('dormi_lang', code);
    setLangState(code);
    window.dispatchEvent(new Event('appConfigChange'));
  };

  // YENİ: Rol Değiştirme Fonksiyonu
  const setUserRole = (newRole) => {
    localStorage.setItem('dormi_role', newRole);
    setRoleState(newRole);
    window.dispatchEvent(new Event('appConfigChange'));
    // Rol değişince ana sayfaya at ki dashboard yenilensin
    if(window.location.pathname !== '/') {
        window.location.href = '/';
    } else {
        window.location.reload();
    }
  };

  return {
    lang,
    setLanguage,
    role,         // Hangi roldeyiz?
    setUserRole,  // Rolü değiştir
    t: DICTIONARY[lang]
  };
};