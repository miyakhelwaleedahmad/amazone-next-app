// W:\Amazone-clone2\my-app\src\pages\admin\login.tsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // -------------------------------
  // Submit login form (send OTP)
  // -------------------------------
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      if (data.step === "otp-required") {
        setStep("otp");
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      // ✅ Safe error handling: convert objects to string
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object") {
        setError(JSON.stringify(err));
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Submit OTP
  // -------------------------------
  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP failed");
      router.push("/admin");
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object") {
        setError(JSON.stringify(err));
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded shadow">
      {step === "form" ? (
        <form onSubmit={submitForm}>
          <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
          <input
            className="w-full mb-3 p-2 border"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full mb-3 p-2 border"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <button
            className="w-full p-2 bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={submitOtp}>
          <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
          <p className="mb-3">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
          <input
            className="w-full mb-3 p-2 border"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div className="flex gap-2">
            <button
              className="flex-1 p-2 bg-green-600 text-white"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="flex-1 p-2 border"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
