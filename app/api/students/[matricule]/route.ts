import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ GET: récupérer un étudiant par matricule
export async function GET(req: Request, { params }: { params: { matricule: string } }) {
  const { matricule } = params;
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT * FROM "Student" WHERE matricule = $1`, [matricule]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}

// ✅ PUT: modifier un étudiant
export async function PUT(req: Request, { params }: { params: { matricule: string } }) {
  const matricule = params.matricule;
  const body = await req.json();
  const { nom, prenom, niveau, email } = body;

  const client = await pool.connect();
  try {
    const res = await client.query(
      `UPDATE "Student" 
       SET nom = $1, prenom = $2, niveau = $3, email = $4 
       WHERE matricule = $5 
       RETURNING *`,
      [nom, prenom, niveau, email, matricule]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    client.release();
  }
}

// ✅ DELETE: supprimer un étudiant
export async function DELETE(req: Request, { params }: { params: { matricule: string } }) {
  const { matricule } = params;
  const client = await pool.connect();
  try {
    const res = await client.query(`DELETE FROM "Student" WHERE matricule = $1 RETURNING *`, [matricule]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }
    return NextResponse.json({ message: "Étudiant supprimé avec succès" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    client.release();
  }
}
