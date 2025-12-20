import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ GET: liste avec recherche + pagination
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  let query = `SELECT * FROM "Student"`;
  let values: any[] = [];

  if (search) {
    query += ` WHERE nom ILIKE $1 OR prenom ILIKE $2 OR matricule ILIKE $3`;
    values = [`%${search}%`, `%${search}%`, `%${search}%`];
  }

  query += ` ORDER BY "createdAt" DESC OFFSET $${values.length + 1} LIMIT $${values.length + 2}`;
  values.push((page - 1) * limit, limit);

  const client = await pool.connect();
  try {
    const studentsRes = await client.query(query, values);
    const countRes = await client.query(
      search
        ? `SELECT COUNT(*) FROM "Student" WHERE nom ILIKE $1 OR prenom ILIKE $2 OR matricule ILIKE $3`
        : `SELECT COUNT(*) FROM "Student"`,
      search ? [`%${search}%`, `%${search}%`, `%${search}%`] : []
    );

    const students = studentsRes.rows;
    const total = parseInt(countRes.rows[0].count);

    if (students.length === 0) {
      return NextResponse.json({ message: "Aucun étudiant trouvé", students: [], total: 0 });
    }

    return NextResponse.json({ students, total });
  } finally {
    client.release();
  }
}

// ✅ POST: ajouter un étudiant
export async function POST(req: Request) {
  const body = await req.json();
  const { matricule, nom, prenom, niveau, email } = body;

  const client = await pool.connect();
  try {
    const res = await client.query(
      `INSERT INTO "Student" (matricule, nom, prenom, niveau, email)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [matricule, nom, prenom, niveau, email]
    );

    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    client.release();
  }
}
