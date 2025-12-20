"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./classe.css";

type Classe = { id: number; nom_classe: string };

export default function ClassesPage() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [form, setForm] = useState({ nom_classe: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const fetchClasses = async () => {
    const res = await fetch("/api/classes");
    const data = await res.json();
    setClasses(data.classes || []);
  };

  useEffect(() => {
    fetchClasses();
    const role = localStorage.getItem("userRole");
    if (!role || role !== "admin") {
      router.push("/");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/classes/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
      setEditingId(null);
    } else {
      await fetch("/api/classes", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
    }
    setForm({ nom_classe: "" });
    fetchClasses();
  };

  const handleEdit = (classe: Classe) => {
    setForm({ nom_classe: classe.nom_classe });
    setEditingId(classe.id);
  };

  // 🔹 Supprimer directement sans alert
  const handleDelete = async (id: number) => {
    await fetch(`/api/classes/${id}`, { method: "DELETE" });
    fetchClasses();
  };

  const filteredClasses = classes.filter((c) =>
    c.nom_classe.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="classe-dashboard">
      {/* Header */}
      <div className="header-section">
        <h1>Gestion des Classes</h1>
      </div>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Rechercher une classe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Form */}
      <form className="form-sectionn" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom de la classe"
          value={form.nom_classe}
          onChange={(e) => setForm({ nom_classe: e.target.value })}
          required
        />
        <button type="submit" className={`btn-submit ${editingId ? "edit" : "add"}`}>
        <FontAwesomeIcon icon={faPlus} />{editingId ? "Modifier" : "Ajouter"}
        </button>
      </form>

      {/* Table */}
      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>Nom de la classe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((c) => (
                <tr key={c.id}>
                  <td>{c.nom_classe}</td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(c)}>
                      <FontAwesomeIcon icon={faPen} /> Modifier
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(c.id)}>
                      <FontAwesomeIcon icon={faTrash} /> Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="no-data">
                  Aucune classe trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
