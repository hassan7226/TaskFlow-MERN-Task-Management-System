import React from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from 'recharts'

const TaskPriorityChart = ({ data }) => {
  // Modern SaaS colors
  const colors = ['#10B981', '#F59E0B', '#EF4444']

  const chartData = data

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 w-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Task Priority Levels</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-slate-500">Live</span>
        </div>
      </div>

      {!chartData ? (
        <div className="h-36 w-full flex items-center justify-center">
          <div className="text-slate-400 text-sm">Loading data...</div>
        </div>
      ) : (
        <>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 10, fontWeight: '500' }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 10, fontWeight: '500' }}
                  dx={-5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #E2E8F0',
                    borderRadius: '8px',
                    color: '#1E293B',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '8px 12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  cursor={{ stroke: '#6366F1', strokeWidth: 2 }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`bar-${index}`} 
                      fill={colors[index % colors.length]}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Professional Legend */}
          <div className="flex justify-center gap-4 mt-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 group hover:scale-105 transition-transform duration-200">
                <div
                  className="w-2 h-2 rounded-full shadow-sm ring-2 ring-offset-2 ring-transparent group-hover:ring-slate-200 transition-all duration-200"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-700">{item.name}</span>
                  <span className="text-xs text-slate-500">{item.value} tasks</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TaskPriorityChart