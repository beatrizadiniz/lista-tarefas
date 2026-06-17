"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already authenticated, redirect to home
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/");
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
if (isSignUp) {
  // Validate password confirmation
  if (password !== confirmPassword) {
    setError("Senhas não coincidem");
    setLoading(false);
    return;
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  setLoading(false);
  if (error) {
    setError(error.message);
  } else {
    // Auto-login after successful sign‑up
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
    } else {
      router.push("/");
    }
  }
} else {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  setLoading(false);
  if (error) {
    setError(error.message);
  } else {
    router.push("/");
  }
}
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md space-y-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-[var(--color-text-primary)]">
{isSignUp ? "Criar conta" : "Entrar"}
        </h1>
        {error && (
          <p className="text-center text-sm text-[var(--color-error)]">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
<div>
  <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)]">
    Senha
  </label>
  <input
    type="password"
    id="password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
  />
</div>
{isSignUp && (
  <div>
    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text-primary)]">
      Confirmar Senha
    </label>
    <input
      type="password"
      id="confirmPassword"
      required
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
    />
  </div>
)}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[var(--radius-md)] bg-[var(--color-accent)] py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-light)] disabled:opacity-50"
          >
            {loading ? (isSignUp ? "Criando..." : "Entrando...") : (isSignUp ? "Criar conta" : "Entrar")}
          </button>
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setPassword("");
                setConfirmPassword("");
              }}
              className="font-medium text-[var(--color-accent)] hover:underline"
            >
              {isSignUp ? "Entrar" : "Criar conta"}
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}
