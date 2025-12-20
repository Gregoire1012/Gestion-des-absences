"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import "./student.css";

interface Student {
  matricule: string;
  nom: string;
  prenom: string;
  niveau: string;
  email: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(5);
  const router = useRouter();

  async function fetchStudents() {
    const res = await fetch(
      `/api/students?search=${search}&page=${page}&limit=${limit}`
    );
    const data = await res.json();
    setStudents(data.students);
    setTotal(data.total);
  }

  useEffect(() => {
    fetchStudents();
  }, [search, page]);

  async function deleteStudent(matricule: string) {
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
      await fetch(`/api/students/${matricule}`, { method: "DELETE" });
      fetchStudents();
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="student-dashboard p-6">
      {/* Header */}
      <div className="dashboard-header flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Étudiants</h1>
        <button
          onClick={() => router.push("/students/new")}
          className="btn-add flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} /> Ajouter
        </button>
      </div>

      {/* Recherche */}
      <div className="search-container mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-search"
        />
      </div>

      {/* Tableau */}
      <div className="table-wrapper overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3">Matricule</th>
              <th className="p-3">Nom</th>
              <th className="p-3">Prénom</th>
              <th className="p-3">Niveau</th>
              <th className="p-3">Email</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr
                key={s.matricule}
                className={`border-b hover:bg-gray-50 transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="p-3">{s.matricule}</td>
                <td className="p-3">{s.nom}</td>
                <td className="p-3">{s.prenom}</td>
                <td className="p-3">
                  <span className={`badge-niveau ${s.niveau.toLowerCase()}`}>
                    {s.niveau}
                  </span>
                </td>
                <td className="p-3">{s.email}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => router.push(`/students/edit/${s.matricule}`)}
                    className="btn-edit flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faPen} /> Modifier
                  </button>
                  <button
                    onClick={() => deleteStudent(s.matricule)}
                    className="btn-delete flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination flex justify-end items-center gap-2 p-3 bg-gray-50">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn-page"
            disabled={page === 1}
          >
            Précédent
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="btn-page"
            disabled={page === totalPages}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
