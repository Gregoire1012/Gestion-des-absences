"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from "react";
import { Sun, Moon } from "react-bootstrap-icons";
import { usePathname } from "next/navigation";
import "./navbar.css";

interface MenuItem {
  name: string;
  href: string;
  key: string;
}

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setRole(localStorage.getItem("userRole"));
    setEmail(localStorage.getItem("userEmail"));
  }, []);

  if (!mounted) return null;

  const firstLetter = email ? email.charAt(0).toUpperCase() : "";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Menus selon rôle
  const menuDefault: MenuItem[] = [{ name: "Login", href: "/login", key: "login" }];
  const menuAdmin: MenuItem[] = [
    { name: "Students", href: "/students", key: "students" },
    { name: "Absences", href: "/absences", key: "absences" },
    { name: "Matiere", href: "/matieres", key: "matieres" },
    { name: "Classe", href: "/classes", key: "classes" },
    { name: "Dashboard", href: "/dashboard", key: "dashboard" },
  ];
  const menuUser: MenuItem[] = [
    { name: "Students", href: "/students", key: "students" },
    { name: "Absences", href: "/absences", key: "absences" },
    { name: "Dashboard", href: "/dashboard", key: "dashboard" },
  ];

  let menu = menuDefault;
  if (role === "admin") menu = menuAdmin;
  if (role === "user") menu = menuUser;

  const breadcrumbMap: Record<string, string> = {
    "/": "Home",
    "/login": "Login",
    "/students": "Students",
    "/absences": "Absences",
    "/matieres": "Matiere",
    "/classes": "Classe",
    "/dashboard": "Dashboard",
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link href="/" className="navbar-logo">
            G.<span>Absence</span>
          </Link>
          <div className="navbar-menu">
            {menu.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`navbar-link ${active ? "active" : ""}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="navbar-right">
          <button className="theme-toggle" onClick={toggle}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>

          {email && (
            <div className="user-info">
              <div className="avatar">{firstLetter}</div>
              <span className="email">{email}</span>
            </div>
          )}

          {role && (
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>

{/* Breadcrumb Professionnelle */}
<nav className="breadcrumb">
  <Link href="/" className="breadcrumb-link">
    Home
  </Link>
  {pathname !== "/" && (
    <>
      <span className="breadcrumb-separator">/</span>
      <span className="breadcrumb-current">
        {breadcrumbMap[pathname]}
      </span>
    </>
  )}
</nav>

    </>
  );
}
