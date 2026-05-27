"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push(from);
      router.refresh();
    } else {
      setError("Username หรือ Password ไม่ถูกต้อง");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/30 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold">Hua Hin Vibes</h1>
          <p className="text-muted-foreground text-sm mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background"
              placeholder="admin username"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full border border-border rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-primary bg-background"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
