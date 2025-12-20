"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function EvolutionAbsences({
  absencesMonthly,
}: {
  absencesMonthly: { month: string; absences: number }[];
}) {
  return (
    <div className="flex flex-col p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 w-full h-[400px]">
      <h3 className="text-center font-semibold mb-3 text-gray-200 text-base">Évolution des absences</h3>

      <ResponsiveContainer width="90%" height="100%">
        <LineChart data={absencesMonthly}>
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#ccc" }} />
          <YAxis tick={{ fontSize: 11, fill: "#ccc" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderRadius: "6px",
              border: "1px solid #444",
              color: "#fff",
              padding: "6px 8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="absences"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
