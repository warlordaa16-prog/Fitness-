import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Flame, Footprints, Award } from 'lucide-react';
import { WEEKLY_TRENDS, WEIGHT_HISTORY, ACTIVITY_DISTRIBUTION } from '../data/mockData';

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center space-x-3">
          <BarChart3 className="h-7 w-7 text-orange-400" />
          <span>Real-Time Fitness Analytics</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Detailed metrics, caloric expenditure trends, and body transformation insights.
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Calorie Burn Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-400" />
                <span>Weekly Calorie Burn</span>
              </h3>
              <p className="text-xs text-slate-400">Total calories burned per day (kcal)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              Avg: 501 kcal/day
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_TRENDS}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff' }}
                />
                <Bar dataKey="calories" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Loss / Gain Trend Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span>Weight Progress Trend</span>
              </h3>
              <p className="text-xs text-slate-400">Body weight trajectory over 6 weeks (kg)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              -2.1 kg total
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEIGHT_HISTORY}>
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Distribution Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Footprints className="h-5 w-5 text-indigo-400" />
                <span>Activity Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400">Distribution of workout categories</p>
            </div>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ACTIVITY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ACTIVITY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Personal Records & Achievements */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-4">
              <Award className="h-5 w-5 text-amber-400" />
              <span>Personal Records (PRs)</span>
            </h3>

            <div className="space-y-3">
              {[
                { title: 'Longest Run', value: '10.4 km', date: 'Yesterday' },
                { title: 'Max Bench Press', value: '102.5 kg', date: '3 days ago' },
                { title: 'Longest Daily Streak', value: '21 Days', date: 'Last Month' },
                { title: 'Peak Active Minutes in a Day', value: '115 Mins', date: 'Saturday' }
              ].map((pr, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">{pr.title}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{pr.value}</div>
                  </div>
                  <span className="text-[11px] font-medium text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                    {pr.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
