"use client";

import TimePicker from 'react-time-picker';
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./ajoutabs.css";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Student {
  matricule: string;
}

interface Matiere {
  code: string;
  nom: string;
}

interface Classe {
  id: number;
  nom_classe: string;
}

export default function AddAbsenceForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    studentmatricule: "",
    matiere: "",
    date: "",
    date_debut: "",
    date_fin: "",
    classe: "",
    justification: "",
    type: "",
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Charger étudiants, matières et classes
  useEffect(() => {
    async function fetchData() {
      try {
        const [matieresRes, studentsRes, classesRes] = await Promise.all([
          fetch("/api/matieres"),
          fetch("/api/students"),
          fetch("/api/classes"),
        ]);

        const matieresData = await matieresRes.json();
        const studentsData = await studentsRes.json();
        const classesData = await classesRes.json();

        setMatieres(matieresData.matieres || []);
        setStudents(studentsData.students || []);
        setClasses(classesData.classes || []);
      } catch (err: any) {
        console.error("Erreur fetch:", err.message);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/absences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'ajout de l'absence");

      alert("Absence ajoutée avec succès !");
      router.push("/absences");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="abs-form-container">
      <div className="abs-form-card">
        <h1 className="abs-form-title"><FontAwesomeIcon icon={faPlus} /> Ajouter une absence</h1>

        {error && <div className="abs-form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="abs-form">
          {/* Étudiant */}
          <div className="abs-form-group">
            <label>Matricule étudiant</label>
            <select name="studentmatricule" value={form.studentmatricule} onChange={handleChange} required>
              <option value="">Sélectionner un étudiant</option>
              {students.map(s => (
                <option key={s.matricule} value={s.matricule}>{s.matricule}</option>
              ))}
            </select>
          </div>

          {/* Matière */}
          <div className="abs-form-group">
            <label>Matière</label>
            <select name="matiere" value={form.matiere} onChange={handleChange} required>
              <option value="">Sélectionner une matière</option>
              {matieres.map(m => (
                <option key={m.code} value={m.nom}>{m.nom}</option>
              ))}
            </select>
          </div>

          {/* Classe */}
          <div className="abs-form-group">
            <label>Classe</label>
            <select name="classe" value={form.classe} onChange={handleChange} required>
              <option value="">Sélectionner une classe</option>
              {classes.map(c => (
                <option key={c.id} value={c.nom_classe}>{c.nom_classe}</option>
              ))}
            </select>
          </div>

          {/* Date et heures */}
          <div className="abs-form-group">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </div>

          <div className="abs-form-group">
            <label>Heure de début</label>
            <input type="time" name="date_debut" value={form.date_debut} onChange={handleChange} />
          </div>

          <div className="abs-form-group">
            <label>Heure de fin</label>
            <input type="time" name="date_fin" value={form.date_fin} onChange={handleChange} />
          </div>

          {/* Justification */}
          <div className="abs-form-group">
            <label>Justification</label>
            <input type="text" name="justification" value={form.justification} onChange={handleChange} placeholder="Facultatif" />
          </div>

          {/* Type */}
          <div className="abs-form-group">
            <label>Type d'absence</label>
            <select name="type" value={form.type} onChange={handleChange} required>
              <option value="">Sélectionner le type</option>
              <option value="Retard">Retard</option>
              <option value="Absence">Absence</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="abs-form-actions">
            <button type="button" className="btn-cancel" onClick={() => router.push("/absences")}>
              Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Enregistrement..." : <><FontAwesomeIcon icon={faPlus} /> Ajouter</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
