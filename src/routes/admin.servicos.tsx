import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Plus, Save, Trash2 } from "lucide-react";

import type { ServiceCategoryRecord, ServiceRecord } from "@/lib/admin/services.server";

type ServiceForm = {
  id?: string;
  categoryId: string;
  slug: string;
  namePt: string;
  nameEn: string;
  nameFr: string;
  descriptionPt: string;
  descriptionEn: string;
  descriptionFr: string;
  priceLabel: string;
  durationLabel: string;
  imageUrl: string;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: string;
};

const emptyForm: ServiceForm = {
  categoryId: "",
  slug: "",
  namePt: "",
  nameEn: "",
  nameFr: "",
  descriptionPt: "",
  descriptionEn: "",
  descriptionFr: "",
  priceLabel: "",
  durationLabel: "",
  imageUrl: "",
  isFeatured: false,
  isVisible: true,
  sortOrder: "0",
};

export const Route = createFileRoute("/admin/servicos")({
  component: AdminServicesPage,
});

function toForm(service: ServiceRecord): ServiceForm {
  return {
    id: service.id,
    categoryId: service.categoryId ?? "",
    slug: service.slug,
    namePt: service.namePt,
    nameEn: service.nameEn ?? "",
    nameFr: service.nameFr ?? "",
    descriptionPt: service.descriptionPt ?? "",
    descriptionEn: service.descriptionEn ?? "",
    descriptionFr: service.descriptionFr ?? "",
    priceLabel: service.priceLabel ?? "",
    durationLabel: service.durationLabel ?? "",
    imageUrl: service.imageUrl ?? "",
    isFeatured: service.isFeatured,
    isVisible: service.isVisible,
    sortOrder: String(service.sortOrder),
  };
}

function toPayload(form: ServiceForm) {
  return {
    categoryId: form.categoryId || null,
    slug: form.slug,
    namePt: form.namePt,
    nameEn: form.nameEn || null,
    nameFr: form.nameFr || null,
    descriptionPt: form.descriptionPt || null,
    descriptionEn: form.descriptionEn || null,
    descriptionFr: form.descriptionFr || null,
    priceLabel: form.priceLabel || null,
    durationLabel: form.durationLabel || null,
    imageUrl: form.imageUrl || null,
    isFeatured: form.isFeatured,
    isVisible: form.isVisible,
    sortOrder: Number(form.sortOrder || 0),
  };
}

function AdminServicesPage() {
  const [categories, setCategories] = useState<ServiceCategoryRecord[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.id),
    [form.id, services],
  );

  async function loadServices() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/services");

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) throw new Error("Falha ao carregar serviços");

      const data = (await response.json()) as {
        categories: ServiceCategoryRecord[];
        services: ServiceRecord[];
      };

      setCategories(data.categories);
      setServices(data.services);

      if (!form.id && data.services[0]) {
        setForm(toForm(data.services[0]));
      } else if (!form.id && data.categories[0]) {
        setForm((current) => ({ ...current, categoryId: data.categories[0].id }));
      }
    } catch {
      setMessage("Não foi possível carregar serviços.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateField<K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function createNew() {
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const url = form.id ? `/api/admin/services/${form.id}` : "/api/admin/services";
      const response = await fetch(url, {
        method: form.id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(toPayload(form)),
      });

      if (!response.ok) throw new Error("Falha ao salvar");

      const data = (await response.json()) as { service: ServiceRecord };
      setMessage("Serviço salvo.");
      setForm(toForm(data.service));
      await loadServices();
    } catch {
      setMessage("Não foi possível salvar o serviço.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id || !confirm("Excluir este serviço?")) return;

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/services/${form.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao excluir");

      setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
      setMessage("Serviço excluído.");
      await loadServices();
    } catch {
      setMessage("Não foi possível excluir o serviço.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="bg-background py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow mb-3">Admin LOMA</div>
            <h1 className="font-display text-4xl text-foreground md:text-5xl">Serviços</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Edite a carta de serviços oficial, preços, duração, categorias e visibilidade no site.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin"
              className="inline-flex h-10 items-center border border-border px-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              Painel
            </Link>
            <button
              type="button"
              onClick={createNew}
              className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-[11px] uppercase tracking-[0.2em] text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Novo
            </button>
          </div>
        </header>

        <div className="grid gap-6 pt-8 lg:grid-cols-[minmax(260px,380px)_1fr]">
          <aside className="border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-2xl">Lista</h2>
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {services.length}
              </span>
            </div>
            <div className="max-h-[760px] divide-y divide-border overflow-y-auto">
              {isLoading && <p className="p-5 text-sm text-muted-foreground">Carregando...</p>}
              {!isLoading && services.length === 0 && (
                <p className="p-5 text-sm text-muted-foreground">Nenhum serviço cadastrado.</p>
              )}
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setForm(toForm(service))}
                  className={`block w-full p-4 text-left transition ${
                    service.id === form.id ? "bg-primary/10" : "hover:bg-secondary/60"
                  }`}
                >
                  <div className="truncate text-sm font-medium">{service.namePt}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {service.categoryNamePt ?? "Sem categoria"} ·{" "}
                    {service.priceLabel ?? "sem preço"}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {service.isVisible ? "Visível" : "Oculto"} · ordem {service.sortOrder}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="border border-border bg-card p-5 md:p-7">
            <div className="grid gap-5 xl:grid-cols-[1fr_240px]">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="eyebrow">Categoria</span>
                  <select
                    value={form.categoryId}
                    onChange={(event) => updateField("categoryId", event.target.value)}
                    className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm outline-none transition focus:border-primary"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.namePt}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Slug"
                  value={form.slug}
                  onChange={(value) => updateField("slug", value)}
                />
                <Field
                  label="Nome PT"
                  value={form.namePt}
                  onChange={(value) => updateField("namePt", value)}
                  required
                />
                <Field
                  label="Nome EN"
                  value={form.nameEn}
                  onChange={(value) => updateField("nameEn", value)}
                />
                <Field
                  label="Nome FR"
                  value={form.nameFr}
                  onChange={(value) => updateField("nameFr", value)}
                />
                <Field
                  label="Preço"
                  value={form.priceLabel}
                  onChange={(value) => updateField("priceLabel", value)}
                />
                <Field
                  label="Duração"
                  value={form.durationLabel}
                  onChange={(value) => updateField("durationLabel", value)}
                />
                <Field
                  label="Ordem"
                  type="number"
                  value={form.sortOrder}
                  onChange={(value) => updateField("sortOrder", value)}
                />
                <Field
                  label="URL da imagem"
                  value={form.imageUrl}
                  onChange={(value) => updateField("imageUrl", value)}
                  className="sm:col-span-2"
                />
                <TextArea
                  label="Descrição PT"
                  value={form.descriptionPt}
                  onChange={(value) => updateField("descriptionPt", value)}
                />
                <TextArea
                  label="Descrição EN"
                  value={form.descriptionEn}
                  onChange={(value) => updateField("descriptionEn", value)}
                />
                <TextArea
                  label="Descrição FR"
                  value={form.descriptionFr}
                  onChange={(value) => updateField("descriptionFr", value)}
                />
                <div className="flex flex-wrap gap-5 sm:col-span-2">
                  <Checkbox
                    label="Visível no site"
                    checked={form.isVisible}
                    onChange={(checked) => updateField("isVisible", checked)}
                  />
                  <Checkbox
                    label="Destaque"
                    checked={form.isFeatured}
                    onChange={(checked) => updateField("isFeatured", checked)}
                  />
                </div>
              </div>

              <div>
                <div className="aspect-[4/5] border border-border bg-secondary">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Imagem opcional. Se preencher, use uma URL pública do Firebase/Hosting.
                </div>
              </div>
            </div>

            {message && <p className="mt-5 text-sm text-primary">{message}</p>}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving || !form.namePt}
                className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-[11px] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {selectedService ? "Salvar" : "Criar"}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="inline-flex h-11 items-center gap-2 border border-destructive/40 px-5 text-[11px] uppercase tracking-[0.2em] text-destructive disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm outline-none transition focus:border-primary"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block sm:col-span-2">
      <span className="eyebrow">{label}</span>
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
      />
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-primary"
      />
      {label}
    </label>
  );
}
