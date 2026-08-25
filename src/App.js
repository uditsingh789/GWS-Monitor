import React, { useState, useEffect } from 'react';
import { LogOut, Activity, UserPlus, FileText } from 'lucide-react';
import { supabase } from './supabase';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ManageStudentsTab from './components/ManageStudentsTab';
import StudentsTab from './components/StudentsTab';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [activities, setActivities] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('schoolAppUser');
    if (savedUser) setCurrentUser(savedUser);
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: studentsData } = await supabase.from('students').select('*').order('id', { ascending: true });
    if (studentsData) setStudents(studentsData);

    const { data: activitiesData } = await supabase.from('activities').select('*').order('timestamp', { ascending: false }).limit(20);
    if (activitiesData) setActivities(activitiesData);
  };

  const handleLogin = async (username) => {
    setCurrentUser(username);
    localStorage.setItem('schoolAppUser', username);
    
    await supabase.from('activities').insert([
      { user_name: username, action: 'Authenticated successfully' }
    ]);
    fetchData();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('schoolAppUser');
    setActiveTab('dashboard');
  };

  const handleRecordPayment = async (studentId, amount, currentPending, studentName) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const newPending = currentPending - amount;

    await supabase.from('students').update({ pendingFee: newPending, lastPaid: dateStr }).eq('id', studentId);
    await supabase.from('activities').insert([{ user_name: currentUser, action: `Processed payment of ₹${amount.toLocaleString()} for ${studentName}` }]);
    fetchData();
  };

  const handleAddStudent = async (newStudentData) => {
    await supabase.from('students').insert([newStudentData]);
    await supabase.from('activities').insert([{ user_name: currentUser, action: `Added new student record: ${newStudentData.name}` }]);
    fetchData();
  };

  const handleEditStudent = async (studentId, updatedData, studentName) => {
    await supabase.from('students').update(updatedData).eq('id', studentId);
    await supabase.from('activities').insert([{ user_name: currentUser, action: `Edited student record: ${studentName}` }]);
    fetchData();
  };

  const handleRemoveStudent = async (studentId, studentName) => {
    await supabase.from('students').delete().eq('id', studentId);
    await supabase.from('activities').insert([{ user_name: currentUser, action: `Removed student record: ${studentName}` }]);
    fetchData();
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/50 flex flex-col md:flex-row font-sans">
      <div className="w-full md:w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-10 relative">
        <div className="p-8 bg-slate-950 flex flex-col items-center justify-center border-b border-slate-800">
          <div className="w-full h-14 bg-slate-800 flex items-center justify-center text-xl font-bold tracking-widest rounded-sm mb-1 uppercase shadow-inner">
            LOGO
          </div>
          <div className="text-slate-500 text-xs w-4/5 text-center border-t border-slate-700 pt-1.5 font-bold tracking-widest uppercase">
            Inventory Manager
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-semibold ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity size={20} />
            <span>Overview Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('manage')}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-semibold ${
              activeTab === 'manage' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserPlus size={20} />
            <span>Manage Students</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-semibold ${
              activeTab === 'students' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText size={20} />
            <span>Database</span>
          </button>
        </nav>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Session</span>
              <span className="text-sm font-bold text-white capitalize truncate">{currentUser}</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all" title="Sign Out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 h-screen overflow-auto bg-slate-50">
        <header className="bg-white shadow-sm border-b border-slate-200 p-4 flex items-center justify-between md:hidden sticky top-0 z-20">
          <h1 className="font-bold text-slate-800 text-lg">System Management</h1>
          <button onClick={handleLogout} className="text-slate-500 hover:text-rose-500 p-2">
            <LogOut size={20} />
          </button>
        </header>

        <main className="max-w-7xl mx-auto pb-12">
          {activeTab === 'dashboard' && <Dashboard user={currentUser} activities={activities} students={students} />}
          {activeTab === 'manage' && <ManageStudentsTab students={students} onAddStudent={handleAddStudent} onRemoveStudent={handleRemoveStudent} />}
          {activeTab === 'students' && <StudentsTab students={students} onRecordPayment={handleRecordPayment} onEditStudent={handleEditStudent} />}
        </main>
      </div>
    </div>
  );
}