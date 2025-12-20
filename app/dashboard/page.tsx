"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AbsencesParMatiere from "./AbsencesParMatiere";
import AbsencesParType from "./AbsencesParType";
import EtudiantParNiveau from "./EtudiantsParNiveau";
import EvolutionAbsences from "./EvolutionAbsences";

type Student = { matricule: string; nom: string; prenom: string; absences: number; niveau: string };
type Matiere = { id: number; nom: string; absences: number };
type Absence = { studentmatricule: string; matiere: string; date: string; justification: string; type: string };
type AbsencesType = { type: string; count: number };

export default function DashboardPage() {

    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [absencesType, setAbsencesType] = useState<AbsencesType[]>([]);
    const [absencesMonthly, setAbsencesMonthly] = useState<{ month: string; absences: number }[]>([]);
    const [niveauFilter, setNiveauFilter] = useState<string>("Tous");

    useEffect(() => {
        async function fetchData() {
            try {

                const role = localStorage.getItem("userRole");

                if (role !== "admin" && role !== "user") {
                    alert("⛔ Vous n'avez pas l'autorisation d'accéder à cette page.");
                    router.push("/");
                }

                const [studentsRes, matieresRes, absencesRes] = await Promise.all([
                    fetch("/api/students"),
                    fetch("/api/matieres"),
                    fetch("/api/absences")
                ]);

                const studentsData: Student[] = (await studentsRes.json()).students;
                const matieresData: Matiere[] = (await matieresRes.json()).matieres;
                const absencesData: Absence[] = await absencesRes.json();

                // Ajouter nombre d'absences par étudiant
                const studentsWithAbsences = studentsData.map(s => ({
                    ...s,
                    absences: absencesData.filter(a => a.studentmatricule === s.matricule).length,
                }));
                setStudents(studentsWithAbsences);

                // Nombre d'absences par matière
                const matieresWithAbsences = matieresData.map(m => ({
                    ...m,
                    absences: absencesData.filter(a => a.matiere === m.nom).length,
                }));
                setMatieres(matieresWithAbsences);

                // Absences par type
                const types = Array.from(new Set(absencesData.map(a => a.type)));
                const absencesByType: AbsencesType[] = types.map(type => ({
                    type,
                    count: absencesData.filter(a => a.type === type).length,
                }));
                setAbsencesType(absencesByType);

                // Absences par mois
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const absencesMonthlyData = Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    const count = absencesData.filter(a => new Date(a.date).getMonth() + 1 === month).length;
                    return { month: monthNames[i], absences: count };
                });
                setAbsencesMonthly(absencesMonthlyData);

            } catch (err) {
                console.error("Erreur fetch données :", err);
            }
        }
        fetchData();



    }, []);

    const [isLogged, setIsLogged] = useState(false);

    // useEffect(() => {
    //     const role = localStorage.getItem("userRole");
    //     if (role === "admin" || role === "user") {
    //         setIsLogged(false);
    //     }
    // }, []);


    const filteredStudents = niveauFilter === "Tous" ? students : students.filter(s => s.niveau === niveauFilter);
    const topStudents = [...filteredStudents].sort((a, b) => b.absences - a.absences).slice(0, 5);

    const niveaux = ["Tous", "L1", "L2", "L3", "M1", "M2"];

    return (
        <div className="p-6 space-y-6 text-white min-h-screen text-[150%]">

            {/* Filtre par niveau */}
            <div className="flex flex-wrap gap-2 mb-6">
                {niveaux.map(n => (
                    <button
                        key={n}
                        onClick={() => setNiveauFilter(n)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${niveauFilter === n ? "bg-blue-600 text-white shadow-md" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        {n}
                    </button>
                ))}
            </div>

            {/* KPI principaux */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700">
                    <h3 className="font-bold text-gray-300">Étudiants</h3>
                    <p className="text-3xl font-semibold">{filteredStudents.length}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700">
                    <h3 className="font-bold text-gray-300">Matières</h3>
                    <p className="text-3xl font-semibold">{matieres.length}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700">
                    <h3 className="font-bold text-gray-300">Absences</h3>
                    <p className="text-3xl font-semibold">{filteredStudents.reduce((acc, s) => acc + s.absences, 0)}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700">
                    <h3 className="font-bold text-gray-300">Top 3 étudiants absents</h3>
                    <ul className="flex flex-wrap gap-4 mt-2 text-sm">
                        {topStudents.map(s => (
                            <li key={s.matricule} className="bg-gray-700 px-2 py-1 rounded">
                                {s.nom} ({s.absences})
                            </li>
                        ))}
                    </ul>

                </div>
            </div>

            {/* Graphiques */}
            <div className="flex flex-wrap justify-center gap-4 mb-0">
                <div className="w-full md:w-[48%]">
                    <AbsencesParMatiere matieres={matieres} />
                </div>
                <div className="w-full md:w-[48%]">
                    <AbsencesParType absencesType={absencesType} />
                </div>
                <div className="w-full md:w-[48%]">
                    <EtudiantParNiveau students={filteredStudents} />
                </div>
                {!isLogged ? (
                    null

                ) : (

                    <div className="w-full md:w-[48%]">
                        <EvolutionAbsences absencesMonthly={absencesMonthly} />
                    </div>

                )}
            </div>

            {/* KPI / Tableaux */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 text-center">
                    <h3 className="font-bold text-gray-300">Étudiants</h3>
                    <p className="text-3xl font-semibold">{filteredStudents.length}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 text-center">
                    <h3 className="font-bold text-gray-300">Matières</h3>
                    <p className="text-3xl font-semibold">{matieres.length}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700 text-center">
                    <h3 className="font-bold text-gray-300">Total absences</h3>
                    <p className="text-3xl font-semibold">{filteredStudents.reduce((acc, s) => acc + s.absences, 0)}</p>
                </div>
            </div>
        </div>
    );
}
