'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { STATUS_META, type LeadStatus } from '@/lib/supabase/types';

type Slice = { status: LeadStatus; count: number };

export default function StatusPieChart({ data }: { data: Slice[] }) {
  const chartData = data.map((d) => ({
    name: STATUS_META[d.status].label,
    value: d.count,
    fill: STATUS_META[d.status].tone,
  }));

  return (
    <div className="dash-chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={56}
            outerRadius={96}
            paddingAngle={1}
            stroke="none"
          >
            {chartData.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#FFFCF6',
              border: '1px solid rgba(52,39,29,0.12)',
              borderRadius: 10,
              fontSize: 12,
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
