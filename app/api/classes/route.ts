import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM classe ORDER BY id ASC");
  return NextResponse.json({ classes: rows });
}

export async function POST(req: Request) {
  const { nom_classe } = await req.json();

  const { rows } = await pool.query(
    `INSERT INTO classe (nom_classe) VALUES ($1) RETURNING *`,
    [nom_classe]
  );

  return NextResponse.json(rows[0]);
}
