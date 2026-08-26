import React, { useState } from 'react';
import { Search, Users, AlertCircle, CheckCircle2, CreditCard, X, ArrowDownWideNarrow, ArrowUpNarrowWide, FileText, Edit2, Save } from 'lucide-react';
import { GRADES, SECTIONS, calculateCurrentlyDue } from '../utils';

const StudentDetailModal = ({ student, onClose, onRecordPayment, onEditStudent }) => {
  const pendingFee = Number(student.pendingFee || 0);
  const pendingExamFee = Number(student.pendingExamFee || 0);
  const totalFee = Number(student.totalFee || 0);
  const totalPaid = totalFee - pendingFee;
  
  const previousBalance = Number(student.previousBalance || 0);
  const transportFee = Number(student.transportFee || 0);
  const monthlyFee = Number(student.monthlyFee || 0);
  const examinationFee = Number(student.examinationFee || 0);
  
  const currentlyDue = calculateCurrentlyDue(student);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState(pendingFee > 0 ? 'general' : 'exam'); 
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...student });
  
  const activePending = paymentType === 'general' ? pendingFee : pendingExamFee;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    if (amount > 0 && amount <= activePending) {
      onRecordPayment(student.id, amount, activePending, student.name, paymentType);
      setPaymentAmount('');
      onClose();
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    // 1. Grab the newly edited base values
    const mFee = Number(editData.monthlyFee || 0);
    const tFee = Number(editData.transportFee || 0);
    const pBal = Number(editData.previousBalance || 0);
    const eFee = Number(editData.examinationFee || 0);

    // 2. Calculate how much the student has ALREADY paid prior to this edit
    const oldTotalPaid = Number(student.totalFee || 0) - Number(student.pendingFee || 0);
    const oldExamPaid = Number(student.examinationFee || 0) - Number(student.pendingExamFee || 0);

    // 3. Automatically calculate the NEW totals and pending amounts mathematically
    const newTotalFee = pBal + (mFee * 12) + tFee;
    const newPendingFee = newTotalFee - oldTotalPaid;
    const newPendingExamFee = eFee - oldExamPaid;

    const finalEditData = {
      ...editData,
      monthlyFee: mFee,
      transportFee: tFee,
      previousBalance: pBal,
      examinationFee: eFee,
      totalFee: newTotalFee,
      pendingFee: newPendingFee,
      pendingExamFee: newPendingExamFee
    };

    onEditStudent(student.id, finalEditData, student.name);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
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
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Tuition (₹)</label>
                  <input type="number" required min="0" value={editData.monthlyFee || 0} onChange={e => setEditData({...editData, monthlyFee: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Transport Fee (₹)</label>
                  <input type="number" required min="0" value={editData.transportFee || 0} onChange={e => setEditData({...editData, transportFee: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Prev Balance (₹)</label>
                  <input type="number" required min="0" value={editData.previousBalance || 0} onChange={e => setEditData({...editData, previousBalance: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Base Exam Fee (₹)</label>
                  <input type="number" required min="0" value={editData.examinationFee || 0} onChange={e => setEditData({...editData, examinationFee: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Tuition</p>
                  <p className="text-lg font-bold text-slate-700">₹{monthlyFee.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Yearly Transport</p>
                  <p className="text-lg font-bold text-slate-700">₹{transportFee.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Base Exam Fee</p>
                  <p className="text-lg font-bold text-slate-700">₹{examinationFee.toLocaleString()}</p>
                </div>

                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 col-span-2 md:col-span-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Total General Pending (Exc. Exam)</p>
                    <p className="text-2xl font-bold text-rose-600">₹{pendingFee.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Currently Due (To Date)</p>
                    <p className="text-2xl font-bold text-slate-800">₹{currentlyDue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm font-semibold text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 gap-2">
                <div className="flex items-center">
                  {pendingFee > 0 || pendingExamFee > 0 ? <AlertCircle size={16} className="mr-2 text-amber-500" /> : <CheckCircle2 size={16} className="mr-2 text-emerald-500" />}
                  Last payment received on: <span className="ml-1 text-slate-800 font-bold">{student.lastPaid || 'No records found'}</span>
                </div>
                
                {examinationFee > 0 && (
                  <div className={`text-xs font-bold px-3 py-1 rounded-md border ${pendingExamFee > 0 ? 'text-rose-600 bg-rose-100 border-rose-200' : 'text-emerald-600 bg-emerald-100 border-emerald-200'}`}>
                    {pendingExamFee > 0 ? `Pending Exam Fee: ₹${pendingExamFee.toLocaleString()}` : 'Exam Fee: Cleared'}
                  </div>
                )}
              </div>

              {(pendingFee > 0 || pendingExamFee > 0) && (
                <div className="border-t border-slate-100 pt-6">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Record New Payment</label>
                  <form onSubmit={handlePaymentSubmit} className="flex flex-col md:flex-row gap-3">
                    <select 
                      value={paymentType} 
                      onChange={(e) => {
                        setPaymentType(e.target.value);
                        setPaymentAmount('');
                      }}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium md:w-1/3"
                    >
                      {pendingFee > 0 && <option value="general">Tuition / Transport / Prev Dues</option>}
                      {pendingExamFee > 0 && <option value="exam">Examination Fee</option>}
                    </select>
                    <input 
                      type="number" 
                      max={activePending}
                      min="1"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      placeholder={`Enter amount (Max: ₹${activePending})`}
                      required
                    />
                    <button type="submit" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center whitespace-nowrap">
                      <CreditCard size={18} className="mr-2" /> Pay
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
        
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

  // Calculate the total currently due dynamically based on the filtered results
  const totalCurrentDues = filteredStudents.reduce((sum, student) => sum + calculateCurrentlyDue(student), 0);

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500 relative">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
        <FileText className="mr-3 text-blue-600" size={32} />
        Database & Fee Collection
      </h2>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4 flex flex-col lg:flex-row gap-4 items-center">
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

      {/* NEW SUMMATION BAR */}
      <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-xl shadow-sm mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students:</span>
           <span className="text-sm font-bold text-slate-800">{filteredStudents.length}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Current Dues:</span>
           <span className="text-sm font-bold text-rose-600">₹{totalCurrentDues.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="hidden md:grid grid-cols-4 gap-4 px-5 py-4 border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                className="grid grid-cols-1 md:grid-cols-4 gap-4 px-5 py-3 items-center hover:bg-blue-50/40 cursor-pointer transition-colors group relative"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${hasCurrentDue ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                
                <div className="pl-4 md:pl-6">
                  <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors">{student.name}</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-500 font-mono font-bold">{student.roll}</p>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-600">
                    {student.grade} - {student.section}
                  </span>
                </div>
                
                <div>
                  <span className="md:hidden text-xs font-bold text-slate-400 mr-2 uppercase tracking-wide">Total Pending:</span>
                  <span className="font-bold text-slate-600 text-sm">₹{Number(student.pendingFee).toLocaleString()}</span>
                </div>
                
                <div>
                  <span className="md:hidden text-xs font-bold text-slate-400 mr-2 uppercase tracking-wide">Currently Due:</span>
                  <span className={`font-bold inline-block px-2 py-1 rounded-lg border text-sm ${hasCurrentDue ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
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

export default StudentsTab;