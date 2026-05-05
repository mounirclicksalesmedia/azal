'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from 'recharts';

type Stage = { stage: string; count: number; rate: number };

export default function FunnelChart({ data }: { data: Stage[] }) {
  return (
    <div className="dash-chart" style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 12, right: 48, left: 16, bottom: 0 }}
        >
          <CartesianGrid stroke="rgba(52,39,29,0.06)" horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'rgba(27,19,13,0.55)', fontSize: 11 }}
          />
          <YAxis
            dataKey="stage"
            type="category"
            tickLine={false}
            axisLine={false}
            width={110}
            tick={{ fill: 'rgba(27,19,13,0.7)', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(184,145,94,0.06)' }}
            contentStyle={{
              background: '#FFFCF6',
              border: '1px solid rgba(52,39,29,0.12)',
              borderRadius: 10,
              fontSize: 12,
            }}
            formatter={(value, _name, item) => {
              const r = (item?.payload as Stage)?.rate;
              return [`${value} leads (${r}%)`, 'Stage'];
            }}
          />
          <Bar dataKey="count" fill="#8A603E" radius={[0, 6, 6, 0]}>
            <LabelList
              dataKey="rate"
              position="right"
              formatter={(v) => (v == null ? '' : `${v}%`)}
              style={{ fill: 'rgba(27,19,13,0.55)', fontSize: 11 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
