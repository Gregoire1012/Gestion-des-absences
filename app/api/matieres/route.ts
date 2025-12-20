import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM matiere ORDER BY id ASC");
  return NextResponse.json({ matieres: rows });
}

export async function POST(req: Request) {
  const { nom, code } = await req.json();
  const { rows } = await pool.query(
    'INSERT INTO matiere (nom, code) VALUES ($1, $2) RETURNING *',
    [nom, code]
  );
  return NextResponse.json(rows[0]);
}
