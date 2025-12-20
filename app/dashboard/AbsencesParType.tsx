"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Absence = { type: string; count: number };

export default function AbsencesParType({ absencesType }: { absencesType: Absence[] }) {
  return (
    <div className="flex  justify-center flex-col p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 w-full h-[400px]">
      <h3 className="text-center font-semibold mb-3 text-gray-200 text-base">Absences par type</h3>

      <ResponsiveContainer className="justify-center" width="80%" height="100%">
        <BarChart data={absencesType}>
          <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#ccc" }} />
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
          <Bar dataKey="count" fill="#f97316" barSize={14} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
