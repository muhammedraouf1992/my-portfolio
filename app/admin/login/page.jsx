"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid password.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-1 text-black dark:text-white" style={{ fontFamily: "var(--font-poppins)" }}>
          Admin login
        </h1>
        <p className="text-sm text-black/50 dark:text-white/50 mb-8" style={{ fontFamily: "var(--font-poppins)" }}>
          Enter your password to continue.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors"
            style={{ fontFamily: "var(--font-poppins)" }}
            required
          />

          {error && (
            <p className="text-sm text-red-500" style={{ fontFamily: "var(--font-poppins)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm transition-opacity disabled:opacity-50"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
