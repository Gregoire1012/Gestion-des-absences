"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./matiere.css";

type Matiere = { id: number; nom: string; code: string };

export default function MatieresPage() {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [form, setForm] = useState({ nom: "", code: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const fetchMatieres = async () => {
    const res = await fetch("/api/matieres");
    const data = await res.json();
    setMatieres(data.matieres || []);
  };

  useEffect(() => {
    fetchMatieres();
    const role = localStorage.getItem("userRole");
    if (!role || role !== "admin") {
      alert("⛔ Vous n'avez pas l'autorisation d'accéder à cette page.");
      router.push("/");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/matieres/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
      setEditingId(null);
    } else {
      await fetch("/api/matieres", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
    }
    setForm({ nom: "", code: "" });
    fetchMatieres();
  };

  const handleEdit = (matiere: Matiere) => {
    setForm({ nom: matiere.nom, code: matiere.code });
    setEditingId(matiere.id);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/matieres/${id}`, { method: "DELETE" });
    fetchMatieres();
  };
  

  const filteredMatieres = matieres.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase()) ||
    m.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="matiere-dashboard">
      {/* Header */}
      <div className="header-section">
        <h1>Gestion des matières</h1>
      </div>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Form */}
      <form className="form-section" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        <button type="submit" className={`btn-submit ${editingId ? "edit" : "add"}`}>
        <FontAwesomeIcon icon={faPlus} /> {editingId ? "Modifier" : "Ajouter"}
        </button>
      </form>

      {/* Table */}
      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatieres.length > 0 ? (
              filteredMatieres.map((m) => (
                <tr key={m.id}>
                  <td>{m.nom}</td>
                  <td>{m.code}</td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(m)}>
                      <FontAwesomeIcon icon={faPen} /> Modifier
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(m.id)}>
                      <FontAwesomeIcon icon={faTrash} /> Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="no-data">
                  Aucune matière trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
