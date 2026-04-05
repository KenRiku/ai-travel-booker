"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Plane, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    if (result?.ok) {
      router.push("/dashboard");
    } else {
      setServerError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#d4a843] rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-[#0a0e1a]" />
            </div>
            <span className="font-display text-2xl font-bold text-[#f5f0e8]">Trippr</span>
          </Link>
        </div>

        <div className="glass rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-[#f5f0e8] mb-2">Welcome back</h1>
          <p className="text-[#b8b0a0] text-sm mb-6">Sign in to access your travel concierge</p>

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#b8b0a0] mb-1.5">Email address</label>
              <input
                type="text"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#141927] border border-[#2a3048] rounded-lg px-4 py-3 text-[#f5f0e8] placeholder-[#b8b0a0]/50 focus:outline-none focus:border-[#d4a843] transition-colors"
                placeholder="alex@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#b8b0a0] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-[#141927] border border-[#2a3048] rounded-lg px-4 py-3 text-[#f5f0e8] placeholder-[#b8b0a0]/50 focus:outline-none focus:border-[#d4a843] transition-colors pr-10"
                  placeholder="Your password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8b0a0] hover:text-[#f5f0e8]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4a843] text-[#0a0e1a] py-3 rounded-lg font-bold hover:bg-[#e8c06a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-[#b8b0a0] mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#d4a843] hover:text-[#e8c06a] transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
