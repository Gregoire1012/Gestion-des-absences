import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { rows } = await pool.query("SELECT * FROM classe WHERE id = $1", [
    params.id,
  ]);
  return NextResponse.json(rows[0] || null);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { nom_classe } = await req.json();

  const { rows } = await pool.query(
    "UPDATE classe SET nom_classe=$1 WHERE id=$2 RETURNING *",
    [nom_classe, params.id]
  );

  return NextResponse.json(rows[0]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await pool.query("DELETE FROM classe WHERE id=$1", [params.id]);
  return NextResponse.json({ message: "Classe supprimée" });
}
