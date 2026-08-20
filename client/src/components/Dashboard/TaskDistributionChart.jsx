import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const TaskDistributionChart = ({ data }) => {
  // Modern SaaS colors
  const colors = ['#6366F1', '#8B5CF6', '#EC4899']

  const chartData = data

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 w-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Task Distribution</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
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
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Pie>
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
                />
              </PieChart>
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

export default TaskDistributionChart