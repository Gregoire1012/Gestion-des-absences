"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import "./edit.css";

export default function EditStudentPage() {
  const { matricule } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    niveau: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      const res = await fetch(`/api/students/${matricule}`);
      const data = await res.json();
      setFormData({
        matricule: data.matricule,
        nom: data.nom,
        prenom: data.prenom,
        niveau: data.niveau,
        email: data.email,
      });
    }
    fetchStudent();
  }, [matricule]);

  async function updateStudent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch(`/api/students/${matricule}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);
  
    router.push("/students");
  }

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h1 className="edit-title">🔧 Modifier un étudiant</h1>

        <form onSubmit={updateStudent} className="edit-form">
          {/* Matricule */}
          <div className="form-group">
            <label>Matricule</label>
            <input
              type="text"
              value={formData.matricule}
              disabled
              className="input disabled"
            />
          </div>

          {/* Nom */}
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              required
              className="input"
            />
          </div>

          {/* Prénom */}
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) =>
                setFormData({ ...formData, prenom: e.target.value })
              }
              required
              className="input"
            />
          </div>

          {/* Niveau */}
          <div className="form-group">
            <label>Niveau</label>
            <select
              value={formData.niveau}
              onChange={(e) =>
                setFormData({ ...formData, niveau: e.target.value })
              }
              required
              className="input"
            >
              <option value="">-- Sélectionner un niveau --</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
              <option value="M1">M1</option>
              <option value="M2">M2</option>
            </select>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="input"
            />
          </div>

          {/* Boutons */}
          <div className="edit-actions">
            <button
              type="button"
              className="btn cancel"
              onClick={() => router.push("/students")}
            >
              Annuler
            </button>

            <button type="submit" disabled={loading} className="btn save">
              <FontAwesomeIcon icon={faPen} />
              {loading ? " Mise à jour..." : " Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
