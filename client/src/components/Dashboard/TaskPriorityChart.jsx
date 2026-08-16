import React from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from 'recharts'

const TaskPriorityChart = ({ data }) => {
  // Mock data - will be replaced with API data later
  const mockData = [
    { name: 'Low', value: 3 },
    { name: 'Medium', value: 1 },
    { name: 'High', value: 1 }
  ]

  // Colors to match reference: Green, Orange, Pink/Red
  const colors = ['#10B981', '#F59E0B', '#EF4444']

  const chartData = data || mockData

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-4 w-full hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Task Priority Levels</h2>
      
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 10, fontWeight: '500' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 10, fontWeight: '500' }}
            />
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
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TaskPriorityChart