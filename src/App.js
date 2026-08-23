import React, { useState, useEffect } from 'react';
import { Search, LogOut, Activity, Users, AlertCircle, CheckCircle2, DollarSign, TrendingUp, CreditCard, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE SETUP ---
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const GRADES = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const SECTIONS = ['A', 'B'];

// --- COMPONENTS ---

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-64 h-24 bg-slate-900 text-white flex items-center justify-center text-3xl font-bold tracking-wider rounded-sm shadow-xl uppercase">
          LOGO
        </div>
        <div className="w-48 text-center text-slate-500 font-bold tracking-widest mt-1 text-xs border-t-2 border-slate-300 pt-1 uppercase">
          Inventory Manager
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">System Access</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-md hover:shadow-lg mt-4"
          >
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = ({ user, activities, students }) => {
  const totalStudents = students.length;
  const totalExpected = students.reduce((sum, s) => sum + Number(s.totalFee), 0);
  const totalPending = students.reduce((sum, s) => sum + Number(s.pendingFee), 0);
  const totalCollected = totalExpected - totalPending;

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
        <Activity className="mr-3 text-blue-600" size={32} />
        Overview Dashboard
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
          <div className="bg-blue-50 p-4 rounded-xl mr-4">
            <Users size={28} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
            <p className="text-3xl font-bold text-slate-800">{totalStudents}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
          <div className="bg-emerald-50 p-4 rounded-xl mr-4">
            <TrendingUp size={28} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Fees Collected</p>
            <p className="text-3xl font-bold text-slate-800">₹{totalCollected.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
          <div className="bg-rose-50 p-4 rounded-xl mr-4">
            <DollarSign size={28} className="text-rose-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Dues</p>
            <p className="text-3xl font-bold text-slate-800">₹{totalPending.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-700 text-lg">System Activity Log</h3>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Live</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="p-5 hover:bg-slate-50 transition-colors flex items-start group">
              <div className="bg-slate-100 group-hover:bg-blue-100 transition-colors p-2.5 rounded-full mr-4 mt-0.5">
                <Activity size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
              </div>
              <div>
                <p className="text-slate-800 font-medium">
                  <span className="text-blue-600 font-bold capitalize">{activity.user_name}</span> {activity.action}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="p-8 text-center text-slate-500">No recent activities found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StudentCard = ({ student, onRecordPayment }) => {
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const pendingFee = Number(student.pendingFee);
  const totalFee = Number(student.totalFee);
  const hasPending = pendingFee > 0;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    if (amount > 0 && amount <= pendingFee) {
      onRecordPayment(student.id, amount, pendingFee, student.name);
      setShowPaymentInput(false);
      setPaymentAmount('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-all duration-300 relative group flex flex-col h-full">
      <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-300 ${hasPending ? 'bg-rose-500' : 'bg-emerald-500'}`} />
      
      <div className="flex justify-between items-start mb-5 mt-1">
        <div>
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{student.name}</h3>
          <p className="text-sm text-slate-400 font-mono font-semibold mt-1">{student.roll}</p>
        </div>
        <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-wider">
          {student.grade} - {student.section}
        </div>
      </div>

      <div className="space-y-3 mt-auto border-t border-slate-100 pt-5">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-500">Total Fee</span>
          <span className="font-bold text-slate-800">₹{totalFee.toLocaleString()}</span>
        </div>
        
        <div className={`flex justify-between items-center p-3 rounded-xl ${hasPending ? 'bg-rose-50' : 'bg-emerald-50'}`}>
          <span className="text-sm font-bold text-slate-700">Pending</span>
          <span className={`font-bold text-lg ${hasPending ? 'text-rose-600' : 'text-emerald-600'}`}>
            ₹{pendingFee.toLocaleString()}
          </span>
        </div>
      </div>

      {!showPaymentInput ? (
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center text-xs font-semibold text-slate-400">
            {hasPending ? <AlertCircle size={14} className="mr-1.5 text-rose-500" /> : <CheckCircle2 size={14} className="mr-1.5 text-emerald-500" />}
            Last: {student.lastPaid || 'N/A'}
          </div>
          {hasPending && (
            <button 
              onClick={() => setShowPaymentInput(true)}
              className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <CreditCard size={12} className="mr-1" /> Pay
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handlePaymentSubmit} className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-2 animate-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-600">Enter Amount (₹)</label>
            <button type="button" onClick={() => setShowPaymentInput(false)} className="text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          </div>
          <div className="flex gap-2">
            <input 
              type="number" 
              max={pendingFee}
              min="1"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full text-sm p-2 rounded-lg border border-slate-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder={`Max: ${pendingFee}`}
              required
            />
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3 rounded-lg transition-colors">
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const StudentsTab = ({ students, onRecordPayment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.roll.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'All' || student.grade === selectedGrade;
    const matchesSection = selectedSection === 'All' || student.section === selectedSection;
    const pendingFee = Number(student.pendingFee);
    const matchesStatus = statusFilter === 'All' ? true : 
                          statusFilter === 'Pending' ? pendingFee > 0 : 
                          pendingFee === 0;
    
    return matchesSearch && matchesGrade && matchesSection && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
        <Users className="mr-3 text-blue-600" size={32} />
        Student Directory
      </h2>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search student name or roll ID..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors min-w-[140px]"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="All">All Grades</option>
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors min-w-[140px]"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="All">All Sections</option>
            {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
          </select>
          <select
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors min-w-[140px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending Dues</option>
            <option value="Cleared">Fully Cleared</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <StudentCard key={student.id} student={student} onRecordPayment={onRecordPayment} />
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm mt-4 flex flex-col items-center justify-center">
          <Users size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-600">No matching records found</h3>
          <p className="text-sm text-slate-400 mt-1">Adjust your filters or search term to try again.</p>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP CONTAINER ---

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
    
    // Log login to Supabase
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

    // Update Student in Supabase
    await supabase.from('students')
      .update({ pendingFee: newPending, lastPaid: dateStr })
      .eq('id', studentId);

    // Log Activity in Supabase
    await supabase.from('activities').insert([
      { user_name: currentUser, action: `Processed payment of ₹${amount.toLocaleString()} for ${studentName}` }
    ]);

    // Refresh Data
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
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-semibold ${
              activeTab === 'students' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users size={20} />
            <span>Student Database</span>
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
          {activeTab === 'dashboard' ? (
            <Dashboard user={currentUser} activities={activities} students={students} />
          ) : (
            <StudentsTab students={students} onRecordPayment={handleRecordPayment} />
          )}
        </main>
      </div>
    </div>
  );
}