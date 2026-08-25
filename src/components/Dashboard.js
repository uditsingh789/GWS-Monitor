import React from 'react';
import { Activity, Users, DollarSign, TrendingUp } from 'lucide-react';

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

export default Dashboard;