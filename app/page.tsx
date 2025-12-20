"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import "./page.css";

export default function HomePage() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "user" || role === "admin") {
      setIsLogged(true);
    }
  }, []);

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <Link href="/" className="logo">
          <span className="logo-main">G.</span>
          <span className="logo-sub">Absence</span>
        </Link>
        <h1 className="home-title">Bienvenue sur la plateforme de gestion des absences</h1>
        <p className="home-subtitle">
          Suivez et gérez facilement les absences des étudiants avec des fonctionnalités simples et intuitives.
        </p>

        {isLogged ? (
          <Link href="/dashboard" className="home-btn">
            Dashboard
          </Link>
        ) : (
          <Link href="/login" className="home-btn">
            Log In
          </Link>
        )}
      </header>

      {/* Features */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <i className="bi bi-clipboard-data"></i>
          </div>
          <h3 className="feature-title">Suivi précis des absences</h3>
          <p className="feature-desc">
            Enregistrement rapide des absences avec justification et type.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="bi bi-chat-dots"></i>
          </div>
          <h3 className="feature-title">Communication simplifiée</h3>
          <p className="feature-desc">
            Partage instantané des informations entre enseignants et administration.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="bi bi-graph-up"></i>
          </div>
          <h3 className="feature-title">Analyse et statistiques</h3>
          <p className="feature-desc">
            Visualisation des taux d’absences et identification des étudiants à risque.
          </p>
        </div>
      </section>
    </div>
  );
}
