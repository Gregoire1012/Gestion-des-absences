import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
        }

        // Vérifier si email déjà pris
        const checkUser = await pool.query(
            `SELECT * FROM "Users" WHERE email = $1`,
            [email]
        );

        if (checkUser.rows.length > 0) {
            return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer dans la BDD
        const result = await pool.query(
            `INSERT INTO "Users"(username, email, password, role)
             VALUES($1, $2, $3, $4)
             RETURNING id, username, email, role`,
            [username, email, hashedPassword, "user"]
        );

        return NextResponse.json(
            { user: result.rows[0], message: "Utilisateur créé avec succès" },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
