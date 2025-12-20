import { NextResponse } from "next/server";
import pool from "@/lib/db";

// 🔹 GET : récupérer une absence par id
export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  const { rows } = await pool.query(
    `SELECT * FROM "Absence" WHERE id = $1`,
    [id]
  );

  return NextResponse.json(rows[0] || null);
}

// 🔹 PUT : modifier une absence
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const body = await req.json();
  const { studentmatricule, matiere, date, date_debut, date_fin, justification, type, classe } = body;

  const { rows } = await pool.query(
    `
    UPDATE "Absence"
    SET studentmatricule = $1,
        matiere = $2,
        date = $3,
        date_debut = $4,
        date_fin = $5,
        justification = $6,
        type = $7,
        classe = $8
    WHERE id = $9
    RETURNING *
    `,
    [studentmatricule, matiere, date, date_debut, date_fin, justification, type, classe, id]
  );

  return NextResponse.json(rows[0] || { message: "Absence modifiée avec succès" });
}

// 🔹 DELETE : supprimer une absence
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  await pool.query(`DELETE FROM "Absence" WHERE id = $1`, [id]);

  return NextResponse.json({ message: "Absence supprimée" });
}
