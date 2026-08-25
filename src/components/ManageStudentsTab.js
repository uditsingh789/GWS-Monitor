import React, { useState } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import { GRADES, SECTIONS } from '../utils';

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

export default ManageStudentsTab;