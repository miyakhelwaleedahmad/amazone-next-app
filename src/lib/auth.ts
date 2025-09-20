// File: src/lib/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Secret key for JWT (⚠️ better to keep it in .env file)
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// ========================
// PASSWORD HELPERS
// ========================
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ========================
// JWT HELPERS
// ========================
export function generateToken(payload: object, expiresIn: string | number = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; // invalid or expired token
  }
}
