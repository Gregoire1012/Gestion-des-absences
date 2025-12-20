"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

type Student = { matricule: string; nom: string; prenom: string; absences: number; niveau: string };

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function EtudiantsParniveau({ students }: { students: Student[] }) {
  const data = students.reduce((acc: any, s) => {
    const found = acc.find((a: any) => a.name === s.niveau);
    if (found) found.value++;
    else acc.push({ name: s.niveau, value: 1 });
    return acc;
  }, []);

  return (
    <div className="flex flex-col p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 w-full h-[400px]">
      <h3 className="text-center font-semibold mb-3 text-gray-200 text-base">
        Étudiants absents par Niveau
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label={{ fontSize: 15, fill: "#ccc" }}
          >
            {data.map((_: any, index: number) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{
              color: "#ccc",
              fontSize: "13px",
              lineHeight: "22px",
              paddingLeft: "10%",
              paddingRight: "15%",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderRadius: "6px",
              border: "1px solid #444",
              color: "#fff",
              padding: "6px 8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
