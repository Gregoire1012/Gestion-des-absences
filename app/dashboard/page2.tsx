"use client";

import { useEffect, useState } from "react";
import AbsencesParMatiere from "./AbsencesParMatiere";
import EtudiantsParniveau from "./EtudiantsParNiveau";
import AbsencesParType from "./AbsencesParType";
import EvolutionAbsences from "./EvolutionAbsences";

type Student = { matricule: string; nom: string; prenom: string; absences: number; niveau: string };
type Matiere = { id: number; nom: string; absences: number };
type Absence = { type: string; count: number };

export default function DashboardPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [absencesType, setAbsencesType] = useState<Absence[]>([]);
    const [absencesMonthly, setAbsencesMonthly] = useState<{ month: string; absences: number }[]>([]);

    

    useEffect(() => {
        setStudents([
            { matricule: "S001", nom: "Alice", prenom: "L", absences: 4, niveau: "Informatique" },
            { matricule: "S002", nom: "Bob", prenom: "M", absences: 2, niveau: "Maths" },
            { matricule: "S003", nom: "Charlie", prenom: "N", absences: 5, niveau: "Informatique" },
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

    return (
        <div className="p-6 space-y-6 text-white min-h-screen text-[150%]">
            {/* KPI ici... */}

            <div className="flex flex-wrap justify-center gap-4 mb-0">
                <div className="w-full md:w-[48%]">
                    <AbsencesParMatiere matieres={matieres} />
                </div>
                <div className="w-full md:w-[48%]">
                    <EtudiantsParniveau students={students} />
                </div>
                <div className="w-full md:w-[48%]">
                    <AbsencesParType absencesType={absencesType} />
                </div>
                <div className="w-full md:w-[48%]">
                    <EvolutionAbsences absencesMonthly={absencesMonthly} />
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
