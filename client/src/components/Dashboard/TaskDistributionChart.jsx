import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const TaskDistributionChart = ({ data }) => {
  // Mock data - will be replaced with API data later
  const mockData = [
    { name: 'Pending', value: 2 },
    { name: 'In Progress', value: 2 },
    { name: 'Completed', value: 1 }
  ]

  // Colors to match reference: Purple, Cyan/Blue, Green
  const colors = ['#8B5CF6', '#06B6D4', '#10B981']

  const chartData = data || mockData

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-4 w-full hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Task Distribution</h2>
      
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1E293B', 
                border: 'none', 
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '500'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend below the chart */}
      <div className="flex justify-center gap-4 mt-3">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-200">
            <div 
              className="w-2 h-2 rounded-full shadow-sm"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-xs text-slate-600 font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskDistributionChart