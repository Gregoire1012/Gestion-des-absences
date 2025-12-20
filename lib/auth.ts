import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret_key";

export interface TokenPayload extends JwtPayload {
  id: number;
  role: string;
  email: string;
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload; // ✅ cast ici
    return decoded;
  } catch {
    return null;
  }
}
