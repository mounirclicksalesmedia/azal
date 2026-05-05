'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type Point = { day: string; count: number };

export default function LeadsOverTimeChart({ data }: { data: Point[] }) {
  return (
    <div className="dash-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="rgba(52,39,29,0.08)" vertical={false} />
          <XAxis
            dataKey="day"
            tickFormatter={(v) =>
              new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
            tickLine={false}
            axisLine={{ stroke: 'rgba(52,39,29,0.12)' }}
            tick={{ fill: 'rgba(27,19,13,0.55)', fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'rgba(27,19,13,0.55)', fontSize: 11 }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: '#FFFCF6',
              border: '1px solid rgba(52,39,29,0.12)',
              borderRadius: 10,
              fontSize: 12,
            }}
            labelFormatter={(v) =>
              new Date(v).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            }
            formatter={(v) => [`${v}`, 'Leads']}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8A603E"
            strokeWidth={2}
            dot={{ fill: '#8A603E', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
