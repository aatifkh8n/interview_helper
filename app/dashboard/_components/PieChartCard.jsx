"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Trophy } from "lucide-react";

const data = [
  { name: "9 Score", value: 50 },
  { name: "7 Score", value: 30 },
  { name: "5 Score", value: 18 },
  { name: "Others", value: 2 },
];

const COLORS = ["#3f0071", "#7b2cbf", "#c77dff", "#ff922b"];

export default function PieChartCard() {
  return (
    <div className="w-full h-full">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-1 inline-block">
        <img src="/images/statsCards/award.svg" alt="award" width="15" />
        Average Score Overview
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="left" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
