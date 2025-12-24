import React from 'react';
import { useAppConfig } from '../../hooks/useAppConfig';

// Admin Bileşenleri
import StatsRow from './StatsRow';
import NewRequests from './NewRequests';
import NewComplaints from './NewComplaints';
import FeedbackChart from './FeedbackChart';
import AvailableStaff from './AvailableStaff';

// Öğrenci ve Personel Bileşenleri
import StudentDashboard from './StudentDashboard';
import StaffDashboard from './StaffDashboard'; // <--- 1. YENİ: Bunu ekle

const DashboardManager = () => {
  const { role } = useAppConfig();

  // --- ÖĞRENCİ GÖRÜNÜMÜ ---
  if (role === 'student') {
    return <StudentDashboard />;
  }

  // --- PERSONEL GÖRÜNÜMÜ ---
  if (role === 'staff') {
    // 2. YENİ: Burayı güncelledik, artık boş div yerine gerçek dashboard var.
    return <StaffDashboard />;
  }

  // --- ADMIN GÖRÜNÜMÜ (Varsayılan) ---
  return (
    <>
      <StatsRow />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10 items-start">
        <div className="lg:col-span-2 flex flex-col gap-8">
            <NewRequests />
            <NewComplaints />
        </div>
        <div className="flex flex-col gap-8 sticky top-6">
          <FeedbackChart />
          <AvailableStaff />
        </div>
      </div>
    </>
  );
};

export default DashboardManager;