"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList, // ✅ ajoute ceci
} from "recharts";

type Student = { matricule: string; nom: string; prenom: string; absences: number; filiere: string };
type Matiere = { id: number; nom: string; absences: number };
type Absence = { type: string; count: number };

export default function DashboardPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [absencesType, setAbsencesType] = useState<Absence[]>([]);
    const [absencesMonthly, setAbsencesMonthly] = useState<{ month: string, absences: number }[]>([]);

    useEffect(() => {
        // TODO: remplacer par fetch API pour récupérer tes données depuis la DB
        setStudents([
            { matricule: "S001", nom: "Alice", prenom: "L", absences: 4, filiere: "Informatique" },
            { matricule: "S002", nom: "Bob", prenom: "M", absences: 2, filiere: "Maths" },
            { matricule: "S003", nom: "Charlie", prenom: "N", absences: 5, filiere: "Informatique" },
        ]);
        setMatieres([
            { id: 1, nom: "Maths", absences: 6 },
            { id: 2, nom: "Physique", absences: 3 },
            { id: 3, nom: "Informatique", absences: 5 },
        ]);
        setAbsencesType([
            { type: "Justifiée", count: 8 },
            { type: "Non justifiée", count: 6 },
        ]);
        setAbsencesMonthly([
            { month: "Jan", absences: 3 },
            { month: "Feb", absences: 5 },
            { month: "Mar", absences: 6 },
        ]);
    }, []);

    const topStudents = [...students].sort((a, b) => b.absences - a.absences).slice(0, 5);
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div className="p-6 space-y-6 text-white min-h-screen text-[150%]">
            {/* KPI */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700">
                    <h3 className="font-bold text-gray-300">Étudiants</h3>
                    <p className="text-3xl font-semibold">{students.length}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700">
                    <h3 className="font-bold text-gray-300">Matières</h3>
                    <p className="text-3xl font-semibold">{matieres.length}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700">
                    <h3 className="font-bold text-gray-300">Absences</h3>
                    <p className="text-3xl font-semibold">{students.reduce((acc, s) => acc + s.absences, 0)}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700">
                    <h3 className="font-bold text-gray-300">Top 5 étudiants</h3>
                    <ul className="text-sm mt-2 space-y-1">
                        {topStudents.map(s => (
                            <li key={s.matricule}>{s.nom} ({s.absences})</li>
                        ))}
                    </ul>
                </div>
            </div>


            {/* Graphiques */}
            <div className="flex flex-wrap justify-center gap-4 mb-0">

                {/* Absences par matière */}
                <div className="flex flex-col p-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-lg border border-gray-700 w-full md:w-[48%] h-[400px]">
                    <h3 className="text-center font-semibold mb-3 text-gray-100 text-base">
                        Absences par matière
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={matieres}
                                margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
                            >
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#4338ca" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>

                                <XAxis
                                    dataKey="nom"
                                    tick={{ fill: "#ddd", fontSize: 11 }}
                                    angle={-25}
                                    textAnchor="end"
                                />
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
                                    <LabelList
                                        dataKey="absences"
                                        position="top"
                                        fill="#fff"
                                        fontSize={11}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Étudiants absents par filière */}
                <div className="flex flex-col p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition-shadow w-full md:w-[48%] h-[400px]">
                    <h3 className="text-center font-semibold mb-3 text-gray-200 text-base">
                        Étudiants absents par filière
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={students.reduce((acc: any, s) => {
                                        const found = acc.find((a: any) => a.name === s.filiere);
                                        if (found) found.value++;
                                        else acc.push({ name: s.filiere, value: 1 });
                                        return acc;
                                    }, [])}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={110}
                                    label={{ fontSize: 15, fill: "#ccc" }}
                                >
                                    {students.map((_, index) => (
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
                </div>

                {/* Absences par type */}
                <div className="flex flex-col p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition-shadow w-full md:w-[48%] h-[400px]">
                    <h3 className="text-center font-semibold mb-3 text-gray-200 text-base">
                        Absences par type
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
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
                </div>

                {/* Évolution des absences */}
                <div className="flex flex-col p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition-shadow w-full md:w-[48%] h-[400px]">
                    <h3 className="text-center font-semibold mb-3 text-gray-200 text-base">
                        Évolution des absences
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
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
                </div>

            </div>


            {/* Table et actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div className="p-4 bg-white rounded shadow overflow-x-auto">
                    <h3 className="font-bold mb-3 text-lg text-center sm:text-left">Absences récentes</h3>

                    <table className="min-w-full table-auto border-collapse text-sm sm:text-base text-black">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="border px-2 py-2 sm:px-4 sm:py-2 text-left">Étudiant</th>
                                <th className="border px-2 py-2 sm:px-4 sm:py-2 text-left">Matière</th>
                                <th className="border px-2 py-2 sm:px-4 sm:py-2 text-left">Date</th>
                                <th className="border px-2 py-2 sm:px-4 sm:py-2 text-left">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr
                                    key={s.matricule}
                                    className="hover:bg-gray-100 transition-colors duration-150"
                                >
                                    <td className="border px-2 py-2 sm:px-4 sm:py-2">{s.nom}</td>
                                    <td className="border px-2 py-2 sm:px-4 sm:py-2">
                                        {matieres[0]?.nom}
                                    </td>
                                    <td className="border px-2 py-2 sm:px-4 sm:py-2">2025-11-09</td>
                                    <td className="border px-2 py-2 sm:px-4 sm:py-2">Justifiée</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-white rounded shadow">
                    <h3 className="font-bold mb-2">Actions rapides</h3>
                    <div className="flex flex-col gap-2">
                        <button className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600">Ajouter un étudiant</button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Ajouter une matière</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Ajouter une absence</button>
                        <input type="text" placeholder="Rechercher..." className="border px-2 py-1 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}
