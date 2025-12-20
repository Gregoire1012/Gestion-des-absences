import { NextResponse } from "next/server";
import pool from "@/lib/db";

// 🔹 GET : récupérer toutes les absences
export async function GET() {
  const { rows } = await pool.query(`
    SELECT *
    FROM "Absence"
    ORDER BY date DESC
  `);
  return NextResponse.json(rows);
}

// 🔹 POST : ajouter une absence
export async function POST(req: Request) {
  const body = await req.json();
  const { studentmatricule, matiere, date, date_debut, date_fin, justification, type, classe } = body;

  await pool.query(
    `
    INSERT INTO "Absence" (studentmatricule, matiere, date, date_debut, date_fin, justification, type, classe)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [studentmatricule, matiere, date, date_debut, date_fin, justification, type, classe]
  );

  return NextResponse.json({ message: "Absence ajoutée avec succès" });
}
