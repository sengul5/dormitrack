// ...
const StudentDashboard = () => {
  return (
    <div className="space-y-6">
        <div className="bg-blue-600 text-white p-8 rounded-[30px] shadow-lg shadow-blue-200 flex flex-col items-start relative overflow-hidden">
            {/* Dekoratif Arka Plan (Opsiyonel) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <h2 className="text-4xl font-bold relative z-10">Welcome, Student! 👋</h2>
            <p className="mt-2 text-blue-100 relative z-10 text-lg">Everything looks good in Room 101. Have a nice day!</p>
            
            {/* GÜNCELLENEN BUTON */}
            <a 
                href="/new-request" 
                className="mt-8 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg inline-flex items-center gap-2 relative z-10"
            >
                + Create New Request
            </a>
        </div>
        
        {/* ... Alt kısım aynı kalabilir ... */}
    </div>
  );
};
export default StudentDashboard;