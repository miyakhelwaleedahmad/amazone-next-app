import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key"; // ⚠️ Put in .env

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

// Generate JWT
export function generateToken(
  payload: string | Buffer | object, // ✅ Fix: allow object/string/Buffer
  expiresIn: string | number = "7d"
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Verify JWT
export function verifyToken(token: string): string | JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
