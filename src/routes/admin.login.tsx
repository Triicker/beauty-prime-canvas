import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LockKeyhole } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as { ok: boolean; message: string };

      if (result.ok) {
        window.location.href = "/admin";
        return;
      }

      setMessage(result.message);
    } catch {
      setMessage("Não foi possível entrar. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-md px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 text-primary">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div className="eyebrow mb-3">Admin LOMA</div>
          <h1 className="font-display text-4xl text-foreground">Entrar</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Use o acesso administrativo para gerenciar conteúdo cadastrado no PostgreSQL.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-border bg-card p-6">
          <label className="block">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition focus:border-primary"
            />
          </label>
          <label className="mt-5 block">
            <span className="eyebrow">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition focus:border-primary"
            />
          </label>

          {message && <p className="mt-5 text-sm text-primary">{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-12 w-full bg-primary px-6 text-[12px] uppercase tracking-[0.24em] text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Voltar ao site
          </Link>
        </div>
      </div>
    </section>
  );
}
