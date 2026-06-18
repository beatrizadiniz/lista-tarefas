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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("As senhas não coincidem");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) setError(signInError.message);
        else router.push("/");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) setError(error.message);
      else router.push("/");
    }
  };

  const inputClass =
    "w-full h-11 px-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] " +
    "bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] " +
    "placeholder:text-[var(--color-text-muted)] " +
    "focus:outline-none focus:border-[var(--color-border-focus)] focus:shadow-[var(--glow-accent-sm)] " +
    "transition-all duration-200";

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo card */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-[var(--radius-xl)] flex items-center justify-center text-white mb-4 shadow-[var(--glow-accent)]"
            style={{ background: "var(--gradient-accent)" }}
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold">
            <span className="gradient-text">
              {isSignUp ? "Criar conta" : "Bem-vindo de volta"}
            </span>
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {isSignUp
              ? "Preencha os dados para começar"
              : "Entre para acessar suas tarefas"}
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-dropdown)]"
        >
          {error && (
            <div className="mb-4 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 text-sm text-[var(--color-danger)] font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-text-primary)]">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-[var(--color-text-primary)]">
                Senha
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {isSignUp && (
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[var(--color-text-primary)]">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-[var(--radius-lg)] text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:shadow-[var(--glow-accent-sm)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              style={{ background: "var(--gradient-accent)" }}
            >
              {loading
                ? isSignUp ? "Criando conta..." : "Entrando..."
                : isSignUp ? "Criar conta" : "Entrar"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-[var(--color-text-muted)]">
            {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setPassword("");
                setConfirmPassword("");
              }}
              className="font-semibold text-[var(--color-accent)] hover:underline transition-all"
            >
              {isSignUp ? "Entrar" : "Criar conta"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
