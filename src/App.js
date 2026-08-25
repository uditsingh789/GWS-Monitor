import React, { useState, useEffect } from 'react';
import { Search, LogOut, Activity, Users, AlertCircle, CheckCircle2, DollarSign, TrendingUp, CreditCard, X, UserPlus, Trash2, ArrowDownWideNarrow, ArrowUpNarrowWide, FileText, Edit2, Save } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE SETUP ---
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const GRADES = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const SECTIONS = ['A', 'B'];

// --- UTILS ---
const getAcademicMonth = () => {
  const currentMonth = new Date().getMonth() + 1;
  return currentMonth >= 4 ? currentMonth - 3 : currentMonth + 9;
};

const calculateCurrentlyDue = (student) => {
  const totalPaid = Number(student.totalFee) - Number(student.pendingFee);
  const monthlyFee = Number(student.totalFee) / 12;
  const expectedPayment = monthlyFee * getAcademicMonth();
  
  const baseTuitionDue = Math.max(0, expectedPayment - totalPaid);
  const previousBalance = Number(student.previousBalance || 0);
  const transportFee = Number(student.transportFee || 0);
  
  return baseTuitionDue + previousBalance + transportFee;
};

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
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Pending</p>
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

const ManageStudentsTab = ({ students, onAddStudent, onRemoveStudent }) => {
  const [newName, setNewName] = useState('');
  const [newRoll, setNewRoll] = useState('');
  const [newGrade, setNewGrade] = useState(GRADES[0]);
  const [newSection, setNewSection] = useState(SECTIONS[0]);
  
  const [parentName, setParentName] = useState('');
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState('');
  const [contact1, setContact1] = useState('');
  const [contact2, setContact2] = useState('');
  const [udiseStatus, setUdiseStatus] = useState('');
  const [aparId, setAparId] = useState('');
  const [remarks, setRemarks] = useState('');

  const [newTotalFee, setNewTotalFee] = useState('');
  const [newFeesSubmitted, setNewFeesSubmitted] = useState('');
  const [previousBalance, setPreviousBalance] = useState('');
  const [transportFee, setTransportFee] = useState('');
  const [newLastPaidDate, setNewLastPaidDate] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const calculatedPendingFee = Number(newTotalFee) - Number(newFeesSubmitted);

    onAddStudent({
      name: newName,
      roll: newRoll,
      grade: newGrade,
      section: newSection,
      parentName: parentName,
      address: address,
      distance: distance,
      contact1: contact1,
      contact2: contact2,
      udiseStatus: udiseStatus,
      aparId: aparId,
      remarks: remarks,
      previousBalance: Number(previousBalance || 0),
      transportFee: Number(transportFee || 0),
      totalFee: Number(newTotalFee),
      pendingFee: calculatedPendingFee,
      lastPaid: newLastPaidDate || null
    });
    
    // Reset form
    setNewName(''); setNewRoll(''); setParentName(''); setAddress('');
    setDistance(''); setContact1(''); setContact2(''); setUdiseStatus('');
    setAparId(''); setRemarks(''); setNewTotalFee(''); setNewFeesSubmitted('');
    setPreviousBalance(''); setTransportFee(''); setNewLastPaidDate('');
  };

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
        <UserPlus className="mr-3 text-blue-600" size={32} />
        Manage Students
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-fit">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center">
            <h3 className="font-bold text-slate-800 text-lg">Register New Student</h3>
          </div>
          <form onSubmit={handleAddSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Primary Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input type="text" required value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Roll / ID</label>
                  <input type="text" required value={newRoll} onChange={e => setNewRoll(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Grade</label>
                  <select value={newGrade} onChange={e => setNewGrade(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Section</label>
                  <select value={newSection} onChange={e => setNewSection(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                    {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">APAR ID</label>
                  <input type="text" value={aparId} onChange={e => setAparId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Contact & Operations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Parent's Name</label>
                  <input type="text" value={parentName} onChange={e => setParentName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact 1</label>
                  <input type="text" value={contact1} onChange={e => setContact1(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact 2</label>
                  <input type="text" value={contact2} onChange={e => setContact2(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Distance (Bus)</label>
                  <input type="text" value={distance} onChange={e => setDistance(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 5 km" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">UDISE Status</label>
                  <input type="text" value={udiseStatus} onChange={e => setUdiseStatus(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Remarks</label>
                  <input type="text" value={remarks} onChange={e => setRemarks(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Financials</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Yearly Fee (₹)</label>
                  <input type="number" required min="0" value={newTotalFee} onChange={e => setNewTotalFee(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Previous Year Balance (₹)</label>
                  <input type="number" min="0" value={previousBalance} onChange={e => setPreviousBalance(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Transport Fee (₹)</label>
                  <input type="number" min="0" value={transportFee} onChange={e => setTransportFee(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fees Submitted (₹)</label>
                  <input type="number" required min="0" value={newFeesSubmitted} onChange={e => setNewFeesSubmitted(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Submission</label>
                  <input type="date" value={newLastPaidDate} onChange={e => setNewLastPaidDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end">
              <button type="submit" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors shadow-sm w-full md:w-auto">
                Save to Database
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-[600px] flex flex-col xl:col-span-1">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Remove Student Record</h3>
            <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">{students.length} Total</span>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 p-2">
            {students.map(student => (
              <div key={student.id} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl transition-colors">
                <div>
                  <p className="font-bold text-slate-800">{student.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{student.roll} • {student.grade}-{student.section}</p>
                </div>
                <button 
                  onClick={() => {
                    if(window.confirm(`Are you sure you want to permanently delete ${student.name}'s record?`)) {
                      onRemoveStudent(student.id, student.name);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove Student"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentsTab = ({ students, onRecordPayment, onEditStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.pendingFee.toString().includes(searchTerm); 
      
    const matchesGrade = selectedGrade === 'All' || student.grade === selectedGrade;
    const matchesSection = selectedSection === 'All' || student.section === selectedSection;
    
    return matchesSearch && matchesGrade && matchesSection;
  }).sort((a, b) => {
    const dueA = calculateCurrentlyDue(a);
    const dueB = calculateCurrentlyDue(b);
    return sortDesc ? dueB - dueA : dueA - dueB;
  });

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500 relative">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
        <FileText className="mr-3 text-blue-600" size={32} />
        Database & Fee Collection
      </h2>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, roll ID, or pending fee amount..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <select
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors min-w-[130px]"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="All">All Grades</option>
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors min-w-[130px]"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="All">All Sections</option>
            {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button 
            onClick={() => setSortDesc(!sortDesc)}
            className="px-4 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors flex items-center gap-2 min-w-[150px] justify-center shadow-md"
          >
            {sortDesc ? <ArrowDownWideNarrow size={18} /> : <ArrowUpNarrowWide size={18} />}
            Sort by Due
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="hidden md:grid grid-cols-4 gap-4 p-5 border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="pl-6">Student Name</div>
          <div>ID & Class</div>
          <div>Total Yearly Pending</div>
          <div>Currently Due</div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {filteredStudents.map(student => {
            const currentlyDue = calculateCurrentlyDue(student);
            const hasCurrentDue = currentlyDue > 0;

            return (
              <div 
                key={student.id} 
                onClick={() => setSelectedStudent(student)}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 items-center hover:bg-blue-50/40 cursor-pointer transition-colors group relative"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${hasCurrentDue ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                
                <div className="pl-4 md:pl-6">
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{student.name}</h3>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 font-mono font-bold">{student.roll}</p>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs font-bold text-slate-600 mt-1 inline-block">
                    {student.grade} - {student.section}
                  </span>
                </div>
                
                <div>
                  <span className="md:hidden text-xs font-bold text-slate-400 mr-2 uppercase tracking-wide">Total Pending:</span>
                  <span className="font-bold text-slate-600 text-base">₹{Number(student.pendingFee).toLocaleString()}</span>
                </div>
                
                <div>
                  <span className="md:hidden text-xs font-bold text-slate-400 mr-2 uppercase tracking-wide">Currently Due:</span>
                  <span className={`font-bold inline-block px-3 py-1.5 rounded-lg border ${hasCurrentDue ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    ₹{currentlyDue.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <Users size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-600">No matching records found</h3>
            <p className="text-sm text-slate-400 mt-1">Adjust your filters or search term to try again.</p>
          </div>
        )}
      </div>

      {selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
          onRecordPayment={onRecordPayment} 
          onEditStudent={onEditStudent}
        />
      )}
    </div>
  );
};

const StudentDetailModal = ({ student, onClose, onRecordPayment, onEditStudent }) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...student });
  
  const pendingFee = Number(student.pendingFee);
  const totalFee = Number(student.totalFee);
  const totalPaid = totalFee - pendingFee;
  
  const previousBalance = Number(student.previousBalance || 0);
  const transportFee = Number(student.transportFee || 0);
  const currentlyDue = calculateCurrentlyDue(student);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    if (amount > 0 && amount <= pendingFee) {
      onRecordPayment(student.id, amount, pendingFee, student.name);
      setPaymentAmount('');
      onClose();
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEditStudent(student.id, editData, student.name);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h3 className="font-bold text-slate-800 text-xl">{isEditing ? `Editing ${student.name}` : student.name}</h3>
            {!isEditing && <p className="text-sm text-slate-500 font-mono font-semibold mt-1">ID: {student.roll} • {student.grade}-{student.section}</p>}
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="p-2 text-slate-600 hover:text-blue-600 bg-white rounded-full border border-slate-200 shadow-sm transition-colors" title="Edit Student">
                <Edit2 size={20} />
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 bg-white rounded-full border border-slate-200 shadow-sm transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {isEditing ? (
            <form id="editForm" onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input type="text" required value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Roll / ID</label>
                  <input type="text" required value={editData.roll} onChange={e => setEditData({...editData, roll: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Grade</label>
                  <select value={editData.grade} onChange={e => setEditData({...editData, grade: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Section</label>
                  <select value={editData.section} onChange={e => setEditData({...editData, section: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                    {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Parent's Name</label>
                  <input type="text" value={editData.parentName || ''} onChange={e => setEditData({...editData, parentName: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Address</label>
                  <input type="text" value={editData.address || ''} onChange={e => setEditData({...editData, address: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact 1</label>
                  <input type="text" value={editData.contact1 || ''} onChange={e => setEditData({...editData, contact1: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact 2</label>
                  <input type="text" value={editData.contact2 || ''} onChange={e => setEditData({...editData, contact2: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Distance (Bus)</label>
                  <input type="text" value={editData.distance || ''} onChange={e => setEditData({...editData, distance: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">UDISE Status</label>
                   <input type="text" value={editData.udiseStatus || ''} onChange={e => setEditData({...editData, udiseStatus: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">APAR ID</label>
                   <input type="text" value={editData.aparId || ''} onChange={e => setEditData({...editData, aparId: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Remarks</label>
                   <input type="text" value={editData.remarks || ''} onChange={e => setEditData({...editData, remarks: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Tuition (₹)</label>
                  <input type="number" required min="0" value={editData.totalFee} onChange={e => setEditData({...editData, totalFee: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Tuition (₹)</label>
                  <input type="number" required min="0" value={editData.pendingFee} onChange={e => setEditData({...editData, pendingFee: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Transport Fee (₹)</label>
                  <input type="number" required min="0" value={editData.transportFee || 0} onChange={e => setEditData({...editData, transportFee: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Prev Balance (₹)</label>
                  <input type="number" required min="0" value={editData.previousBalance || 0} onChange={e => setEditData({...editData, previousBalance: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                <div className="col-span-2">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Parent's Name</span>
                  <span className="font-semibold text-slate-700">{student.parentName || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact 1</span>
                  <span className="font-semibold text-slate-700">{student.contact1 || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact 2</span>
                  <span className="font-semibold text-slate-700">{student.contact2 || 'N/A'}</span>
                </div>
                <div className="col-span-2 md:col-span-4 border-t border-slate-200 pt-3 mt-1">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address & Distance</span>
                  <span className="font-semibold text-slate-700">{student.address || 'N/A'} ({student.distance || 'N/A'})</span>
                </div>
                <div className="col-span-2 md:col-span-4 border-t border-slate-200 pt-3 mt-1 grid grid-cols-3 gap-2">
                   <div>
                     <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">UDISE Status</span>
                     <span className="font-semibold text-slate-700">{student.udiseStatus || 'N/A'}</span>
                   </div>
                   <div>
                     <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">APAR ID</span>
                     <span className="font-semibold text-slate-700">{student.aparId || 'N/A'}</span>
                   </div>
                   <div>
                     <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Remarks</span>
                     <span className="font-semibold text-slate-700 truncate block">{student.remarks || 'None'}</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Prev Balance</p>
                  <p className="text-lg font-bold text-slate-700">₹{previousBalance.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Transport Fee</p>
                  <p className="text-lg font-bold text-slate-700">₹{transportFee.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Tuition</p>
                  <p className="text-lg font-bold text-slate-700">₹{totalFee.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Paid</p>
                  <p className="text-lg font-bold text-slate-700">₹{totalPaid.toLocaleString()}</p>
                </div>

                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 col-span-2 md:col-span-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Total Yearly Pending</p>
                    <p className="text-2xl font-bold text-rose-600">₹{pendingFee.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Currently Due</p>
                    <p className="text-2xl font-bold text-slate-800">₹{currentlyDue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm font-semibold text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {pendingFee > 0 ? <AlertCircle size={16} className="mr-2 text-amber-500" /> : <CheckCircle2 size={16} className="mr-2 text-emerald-500" />}
                Last payment received on: <span className="ml-1 text-slate-800 font-bold">{student.lastPaid || 'No records found'}</span>
              </div>

              {pendingFee > 0 && (
                <div className="border-t border-slate-100 pt-6">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Record New Payment</label>
                  <form onSubmit={handlePaymentSubmit} className="flex gap-3">
                    <input 
                      type="number" 
                      max={pendingFee}
                      min="1"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      placeholder={`Enter amount (Max: ₹${pendingFee})`}
                      required
                    />
                    <button type="submit" className="px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center whitespace-nowrap">
                      <CreditCard size={18} className="mr-2" /> Pay
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer for Edit Mode */}
        {isEditing && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
            <button onClick={() => { setIsEditing(false); setEditData({...student}); }} className="px-5 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button form="editForm" type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center">
              <Save size={18} className="mr-2" /> Save Changes
            </button>
          </div>
        )}
      </div>
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