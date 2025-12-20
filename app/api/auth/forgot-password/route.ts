import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  // TODO: Envoi email réel avec token
  return NextResponse.json({ message: `Lien envoyé à ${email}` });
}
