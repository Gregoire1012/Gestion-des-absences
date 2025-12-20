// lib/users.ts
import bcrypt from "bcryptjs";

export type User = {
  id: string;
  email: string;
  password: string; // hashé
  role: "admin" | "user";
};

const users: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  {
    id: "2",
    email: "user@example.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
  },
];

export default users;
