import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { rows } = await pool.query("SELECT * FROM Matiere WHERE id = $1", [
    params.id,
  ]);
  return NextResponse.json(rows[0] || null);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { nom, code } = await req.json();
  const { rows } = await pool.query(
    "UPDATE Matiere SET nom=$1, code=$2 WHERE id=$3 RETURNING *",
    [nom, code, params.id]
  );
  return NextResponse.json(rows[0]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await pool.query("DELETE FROM Matiere WHERE id=$1", [params.id]);
  return NextResponse.json({ message: "Matière supprimée" });
}
