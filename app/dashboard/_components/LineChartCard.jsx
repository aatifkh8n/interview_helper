"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", value: 90 },
  { day: "Tue", value: 120 },
  { day: "Wed", value: 550 },
  { day: "Thu", value: 100 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 200 },
  { day: "Sun", value: 500 },
];

export default function LineChartCard() {
  return (
    <div className="w-full h-full">
      <h3 className="text-sm font-semibold mb-2">Improvement Rate %</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7b2cbf"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
