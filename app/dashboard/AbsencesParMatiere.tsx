"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

type Matiere = { id: number; nom: string; absences: number };

export default function AbsencesParMatiere({ matieres }: { matieres: Matiere[] }) {
  return (
<div className="flex flex-col p-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-lg border border-gray-700 w-full" style={{ height: 400 }}>
      <h3 className="text-center font-semibold mb-3 text-gray-100 text-base">
        Absences par matière
      </h3>

      <ResponsiveContainer width="80%" height="100%" >
        <BarChart data={matieres} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#4338ca" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <XAxis dataKey="nom" tick={{ fill: "#ddd", fontSize: 11 }} angle={-25} textAnchor="end" />
          <YAxis tick={{ fill: "#ddd", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderRadius: "6px",
              border: "1px solid #444",
              color: "#fff",
              padding: "6px 8px",
            }}
          />
          <Bar dataKey="absences" fill="url(#barGradient)" barSize={25} radius={[6, 6, 0, 0]}>
            <LabelList dataKey="absences" position="top" fill="#fff" fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
