import { Outlet, createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  MailCheck,
  Megaphone,
  Package,
  PackageCheck,
  Scissors,
  Sparkles,
  UserRound,
} from "lucide-react";

import type { AdminDashboard } from "@/lib/admin/content.server";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (pathname !== "/admin") return;

    let active = true;

    fetch("/api/admin/dashboard")
      .then(async (response) => {
        if (!response.ok) throw new Error("Falha ao carregar admin");
        return (await response.json()) as AdminDashboard;
      })
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch(() => {
        if (active) setLoadError("Não foi possível carregar o painel administrativo.");
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  if (pathname !== "/admin") {
    return <Outlet />;
  }

  if (loadError) {
    return (
      <AdminShell>
        <EmptyState
          title="Erro ao carregar"
          description={loadError}
          actionHref="/"
          actionLabel="Voltar"
        />
      </AdminShell>
    );
  }

  if (!dashboard) {
    return (
      <AdminShell>
        <div className="border border-border bg-card p-8 text-sm text-muted-foreground">
          Carregando painel...
        </div>
      </AdminShell>
    );
  }

  if (!dashboard.databaseConfigured) {
    return (
      <AdminShell>
        <EmptyState
          title="Banco ainda não configurado"
          description="Configure DATABASE_URL no ambiente, rode db/schema.sql e crie o primeiro admin."
          actionHref="/admin/login"
          actionLabel="Ir para login"
        />
      </AdminShell>
    );
  }

  if (!dashboard.authenticated) {
    return (
      <AdminShell>
        <EmptyState
          title="Acesso administrativo"
          description="Entre com um usuário admin para visualizar serviços, produtos, profissionais e galeria cadastrados."
          actionHref="/admin/login"
          actionLabel="Entrar"
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell user={dashboard.user?.name}>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        <Metric label="Serviços" value={dashboard.counts.services} icon={Scissors} />
        <Metric label="Produtos" value={dashboard.counts.products} icon={Package} />
        <Metric label="Profissionais" value={dashboard.counts.professionals} icon={UserRound} />
        <Metric label="Espaços" value={dashboard.counts.spaces} icon={Sparkles} />
        <Metric label="Galeria" value={dashboard.counts.gallery} icon={ImageIcon} />
        <Metric label="Marketing" value={dashboard.counts.marketing} icon={Megaphone} />
        <Metric label="Agenda" value={dashboard.counts.appointments} icon={CalendarCheck} />
        <Metric label="Submissões" value={dashboard.counts.submissions} icon={LayoutDashboard} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Hoje" value={dashboard.operations.todayAppointments} icon={CalendarClock} />
        <Metric
          label="Pendentes"
          value={dashboard.operations.pendingAppointments}
          icon={CalendarCheck}
        />
        <Metric label="Mensagens" value={dashboard.operations.newMessages} icon={Inbox} />
        <Metric
          label="Newsletter"
          value={dashboard.operations.newsletterSubscribers}
          icon={MailCheck}
        />
        <Metric
          label="Produtos pedidos"
          value={dashboard.operations.mostRequestedProducts.length}
          icon={PackageCheck}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <OperationsList
          title="Próximos agendamentos"
          empty="Nenhum agendamento futuro pendente."
          items={dashboard.operations.upcomingAppointments.map((appointment) => ({
            id: appointment.id,
            title: appointment.service || "Serviço não informado",
            subtitle: [
              appointment.professional,
              appointment.customerName,
              formatAdminDate(appointment.startsAt),
            ]
              .filter(Boolean)
              .join(" · "),
            badge: appointment.status,
          }))}
          actionHref="/admin/agendamentos"
          actionLabel="Abrir agenda"
        />
        <OperationsList
          title="Mensagens recentes"
          empty="Nenhuma submissão recente."
          items={dashboard.operations.recentSubmissions.map((submission) => ({
            id: submission.id,
            title: submission.name || submission.email || submission.type,
            subtitle: [submission.type, submission.email, formatAdminDate(submission.createdAt)]
              .filter(Boolean)
              .join(" · "),
            badge: submission.status || "novo",
          }))}
        />
        <OperationsList
          title="Produtos mais solicitados"
          empty="Nenhum pedido de carrinho ainda."
          items={dashboard.operations.mostRequestedProducts.map((product) => ({
            id: product.name,
            title: product.name,
            subtitle: `${product.quantity} unidade(s) em ${product.requests} pedido(s)`,
            badge: "carrinho",
          }))}
          actionHref="/admin/produtos"
          actionLabel="Ver produtos"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <AdminList
          title="Serviços"
          items={dashboard.rows.services}
          empty="Nenhum serviço no banco."
          actionHref="/admin/servicos"
          actionLabel="Gerenciar"
        />
        <AdminList
          title="Produtos"
          items={dashboard.rows.products}
          empty="Nenhum produto no banco."
          actionHref="/admin/produtos"
          actionLabel="Gerenciar"
        />
        <AdminList
          title="Profissionais"
          items={dashboard.rows.professionals}
          empty="Nenhum profissional no banco."
          actionHref="/admin/profissionais"
          actionLabel="Gerenciar"
        />
        <AdminList
          title="Espaços"
          items={dashboard.rows.spaces}
          empty="Nenhum espaço profissional no banco."
          actionHref="/admin/profissionais"
          actionLabel="Gerenciar"
        />
        <AdminList
          title="Galeria"
          items={dashboard.rows.gallery}
          empty="Nenhuma imagem de galeria no banco."
        />
        <AdminList
          title="Marketing"
          items={dashboard.rows.marketing}
          empty="Nenhum banner cadastrado."
          actionHref="/admin/marketing"
          actionLabel="Gerenciar"
        />
        <section className="border border-border bg-card p-7">
          <div className="flex items-center gap-3 text-primary">
            <CalendarCheck className="h-5 w-5" />
            <span className="text-[11px] uppercase tracking-[0.22em]">Agenda própria</span>
          </div>
          <h2 className="mt-5 font-display text-3xl text-foreground">Agendamentos</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Acompanhe pedidos feitos pelo site, bloqueie horários por profissional e ajuste o status
            interno de atendimento.
          </p>
          <Link
            to="/admin/agendamentos"
            className="mt-7 inline-flex h-11 items-center justify-center bg-primary px-6 text-[12px] uppercase tracking-[0.22em] text-primary-foreground"
          >
            Ver agenda
          </Link>
        </section>
      </div>
    </AdminShell>
  );
}

function formatAdminDate(value: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Lisbon",
  }).format(new Date(value));
}

function AdminShell({ children, user }: { children: React.ReactNode; user?: string }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <section className="bg-background py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <header className="flex flex-col gap-5 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow mb-3">Admin LOMA</div>
            <h1 className="font-display text-4xl text-foreground md:text-5xl">Conteúdo do site</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Primeira base administrativa para consultar serviços, produtos, profissionais, espaços
              e galeria vindos do PostgreSQL.
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user}</span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex h-10 items-center gap-2 border border-border px-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          )}
        </header>
        <div className="pt-8">{children}</div>
      </div>
    </section>
  );
}

function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="border border-border bg-card p-8 md:p-10">
      <h2 className="font-display text-3xl text-foreground">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      <Link
        to={actionHref}
        className="mt-7 inline-flex h-11 items-center justify-center bg-primary px-6 text-[12px] uppercase tracking-[0.22em] text-primary-foreground"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <article className="border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-5 font-display text-4xl text-foreground">{value}</div>
    </article>
  );
}

function AdminList({
  title,
  items,
  empty,
  actionHref,
  actionLabel,
}: {
  title: string;
  items: AdminDashboard["rows"]["services"];
  empty: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <section className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-display text-2xl text-foreground">{title}</h2>
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {items.length} itens
          </span>
          {actionHref && actionLabel && (
            <Link to={actionHref} className="text-[11px] uppercase tracking-[0.2em] text-primary">
              {actionLabel}
            </Link>
          )}
        </div>
      </div>
      <div className="divide-y divide-border">
        {items.length === 0 && <p className="p-5 text-sm text-muted-foreground">{empty}</p>}
        {items.map((item) => (
          <article key={item.id} className="flex gap-4 p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-secondary">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="truncate text-sm font-medium text-foreground">{item.title}</h3>
                  {item.subtitle && (
                    <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
                  )}
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 text-[10px] uppercase tracking-[0.16em] ${
                    item.isVisible ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {item.isVisible ? "Visível" : "Oculto"}
                </span>
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Ordem {item.sortOrder}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OperationsList({
  title,
  items,
  empty,
  actionHref,
  actionLabel,
}: {
  title: string;
  items: Array<{ id: string; title: string; subtitle: string; badge: string }>;
  empty: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <section className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-display text-2xl text-foreground">{title}</h2>
        {actionHref && actionLabel && (
          <Link to={actionHref} className="text-[11px] uppercase tracking-[0.2em] text-primary">
            {actionLabel}
          </Link>
        )}
      </div>
      <div className="divide-y divide-border">
        {items.length === 0 && <p className="p-5 text-sm text-muted-foreground">{empty}</p>}
        {items.map((item) => (
          <article key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-primary">
                {item.badge}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
