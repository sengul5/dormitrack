import React from 'react';
import { useAppConfig } from '../../hooks/useAppConfig';

// Admin Bileşenleri
import StatsRow from './StatsRow';
import NewRequests from './NewRequests';
import NewComplaints from './NewComplaints';
import FeedbackChart from './FeedbackChart';
import AvailableStaff from './AvailableStaff';

// Öğrenci Bileşeni
import StudentDashboard from './StudentDashboard';

const DashboardManager = () => {
  const { role } = useAppConfig();

  // --- ÖĞRENCİ GÖRÜNÜMÜ ---
  if (role === 'student') {
    return <StudentDashboard />;
  }

  // --- PERSONEL GÖRÜNÜMÜ ---
  if (role === 'staff') {
    return (
        <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
            <h2 className="text-2xl font-bold">Staff Dashboard</h2>
            <p>Tasks assigned to you will appear here.</p>
        </div>
    );
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