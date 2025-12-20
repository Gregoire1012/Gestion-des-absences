"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import "./ajout.css";

export default function AddStudentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    niveau: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l’ajout");
      }

      
      router.push("/students");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-container">
      <h1 className="add-student-title">
        <FontAwesomeIcon icon={faPlus} /> Ajouter un étudiant
      </h1>

      {error && <div className="add-student-error">{error}</div>}

      <form onSubmit={handleSubmit} className="add-student-form">
        <div className="form-group">
          <label>Matricule</label>
          <input
            type="text"
            name="matricule"
            value={form.matricule}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Prénom</label>
          <input
            type="text"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Niveau</label>
          <select
            name="niveau"
            value={form.niveau}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">-- Sélectionner un niveau --</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
          </select>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.push("/students")}
            className="btn-cancel"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            <FontAwesomeIcon icon={faPlus} />{loading ? "Enregistrement..." : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}
