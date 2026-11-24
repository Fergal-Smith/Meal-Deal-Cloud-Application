import React, { useState } from "react";
import { Sprout } from "lucide-react";

export default function LoginPage({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    // Demo only: accepts any credentials.
    onLogin(email.trim());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 font-['DM_Sans'] text-foreground">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-2 text-[27px] font-bold tracking-[-1.2px] text-primary">
          <Sprout size={32} strokeWidth={2.6} />MealDeal
        </div>
        <h1 className="font-['Manrope'] text-2xl font-bold">Welcome back</h1>
        <p className="mt-2 text-xs text-muted-foreground">Log in to find good food nearby.</p>

        <label className="mt-6 block text-xs font-semibold">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-ring" />
        </label>
        <label className="mt-4 block text-xs font-semibold">
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-ring" />
        </label>

        {error && <p role="alert" className="mt-3 text-xs text-muted-foreground">{error}</p>}

        <button type="submit" className="mt-6 w-full rounded-xl bg-primary p-3 text-xs font-bold text-primary-foreground hover:bg-primary/90">
          Log in
        </button>
        <p className="mt-4 text-[10px] text-muted-foreground">Demo only: any email and password will work.</p>
      </form>
    </div>
  );
}