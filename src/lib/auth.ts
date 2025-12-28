import bcrypt from "bcryptjs";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "super-secret-key";

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
export function generateToken(
  payload: string | object | Buffer,
  expiresIn: string | number = "7d"
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions); // ✅ FIXED
}

export function verifyToken(token: string): string | JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
