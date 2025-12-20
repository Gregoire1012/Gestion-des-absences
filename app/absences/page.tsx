"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./absences.css";

interface Absence {
  id: number;
  studentmatricule: string;
  matiere: string;
  date: string;
  date_debut?: string;
  date_fin?: string;
  type: string;
  justification: string;
  classe: string;
}

export default function AbsencesPage() {
  const [search, setSearch] = useState("");
  const [absences, setAbsences] = useState<Absence[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchAbsences() {
      const res = await fetch("/api/absences");
      const data = await res.json();
      setAbsences(data);
    }
    fetchAbsences();
  }, []);

  const filtered = absences.filter(
    (a) =>
      a.studentmatricule?.toLowerCase().includes(search.toLowerCase()) ||
      a.matiere?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    await fetch(`/api/absences/${id}`, { method: "DELETE" });
    setAbsences(absences.filter((a) => a.id !== id));
  };

  const generatePDF = () => {
    Promise.all([
      import("jspdf"),
      import("jspdf-autotable")
    ]).then(([jsPDFModule, autoTableModule]) => {
      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF();
  
      const autoTable = autoTableModule.default; // <— IMPORTANT
  
      doc.text("Liste des absences", 14, 10);
  
      const rows = filtered.map(a => [
        a.studentmatricule,
        a.matiere,
        new Date(a.date).toLocaleDateString(),
        a.date_debut || "-",
        a.date_fin || "-",
        a.classe,
        a.type,
        a.justification
      ]);
  
      autoTable(doc, {
        head: [[
          "Matricule",
          "Matière",
          "Date",
          "Début",
          "Fin",
          "Classe",
          "Type",
          "Justification"
        ]],
        body: rows,
        startY: 20,
      });
  
      doc.save("absences.pdf");
    });
  };
  

  return (
    <div className="abs-container">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-semibold">Liste des absences</h1>

  <div className="flex items-center gap-3">
    {/* BOUTON PDF */}
    <button
      onClick={generatePDF}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center gap-1"
    >
      <i className="bi bi-filetype-pdf"></i> PDF
    </button>

    {/* BOUTON AJOUTER */}
    <button
      onClick={() => router.push("/absences/new")}
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-1"
    >
      <i className="bi bi-plus-lg"></i> Nouvelle absence
    </button>
  </div>
</div>





      {/* SEARCH BAR */}
      <div className="abs-search-bar">
        <input
          type="text"
          placeholder="🔍 Rechercher une absence..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="abs-input"
        />
      </div>

      {/* TABLE */}
      <div className="abs-table-container">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Matière</th>
              <th>Date</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Classe</th>
              <th>Type</th>
              <th>Justification</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>{a.studentmatricule}</td>
                <td>{a.matiere}</td>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.date_debut || "-"}</td>
                <td>{a.date_fin || "-"}</td>
                <td>{a.classe}</td>
                <td>{a.type}</td>
                <td>{a.justification}</td>

                <td className="actions-cell">
                  <button
                    className="btn-table edit"
                    onClick={() => router.push(`/absences/${a.id}/edit`)}
                  >
                    <FontAwesomeIcon icon={faPen} /> Modifier
                  </button>

                  <button
                    className="btn-table delete"
                    onClick={() => handleDelete(a.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}
