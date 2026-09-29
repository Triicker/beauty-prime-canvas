import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Plus, Save, Trash2 } from "lucide-react";

import type { MarketingSlideRecord } from "@/lib/admin/marketing.server";

type MarketingSlideForm = {
  id?: string;
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  imageUrl: string;
  altText: string;
  isVisible: boolean;
  sortOrder: string;
};

const defaultImageUrl = "https://midiasave-5c064.web.app/marketing1.png";

const emptyForm: MarketingSlideForm = {
  slug: "",
  eyebrow: "Novidade",
  title: "",
  description: "",
  buttonLabel: "Ver produtos",
  buttonHref: "/loja",
  imageUrl: defaultImageUrl,
  altText: "",
  isVisible: true,
  sortOrder: "0",
};

export const Route = createFileRoute("/admin/marketing")({
  component: AdminMarketingPage,
});

function toForm(slide: MarketingSlideRecord): MarketingSlideForm {
  return {
    id: slide.id,
    slug: slide.slug,
    eyebrow: slide.eyebrow ?? "",
    title: slide.title,
    description: slide.description ?? "",
    buttonLabel: slide.buttonLabel ?? "",
    buttonHref: slide.buttonHref ?? "",
    imageUrl: slide.imageUrl,
    altText: slide.altText ?? "",
    isVisible: slide.isVisible,
    sortOrder: String(slide.sortOrder),
  };
}

function toPayload(form: MarketingSlideForm) {
  return {
    slug: form.slug,
    eyebrow: form.eyebrow || null,
    title: form.title,
    description: form.description || null,
    buttonLabel: form.buttonLabel || null,
    buttonHref: form.buttonHref || null,
    imageUrl: form.imageUrl,
    altText: form.altText || null,
    isVisible: form.isVisible,
    sortOrder: Number(form.sortOrder || 0),
  };
}

function AdminMarketingPage() {
  const [slides, setSlides] = useState<MarketingSlideRecord[]>([]);
  const [form, setForm] = useState<MarketingSlideForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectedSlide = useMemo(
    () => slides.find((slide) => slide.id === form.id),
    [form.id, slides],
  );

  async function loadSlides() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/marketing-slides");

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) throw new Error("Falha ao carregar slides");

      const data = (await response.json()) as { slides: MarketingSlideRecord[] };
      setSlides(data.slides);

      if (!form.id && data.slides[0]) {
        setForm(toForm(data.slides[0]));
      }
    } catch {
      setMessage("Não foi possível carregar os banners.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateField<K extends keyof MarketingSlideForm>(key: K, value: MarketingSlideForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const url = form.id
        ? `/api/admin/marketing-slides/${form.id}`
        : "/api/admin/marketing-slides";
      const response = await fetch(url, {
        method: form.id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(toPayload(form)),
      });

      if (!response.ok) throw new Error("Falha ao salvar");

      const data = (await response.json()) as { slide: MarketingSlideRecord };
      setMessage("Banner salvo.");
      setForm(toForm(data.slide));
      await loadSlides();
    } catch {
      setMessage("Não foi possível salvar o banner.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id || !confirm("Excluir este banner?")) return;

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/marketing-slides/${form.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao excluir");

      setForm(emptyForm);
      setMessage("Banner excluído.");
      await loadSlides();
    } catch {
      setMessage("Não foi possível excluir o banner.");
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
            <h1 className="font-display text-4xl text-foreground md:text-5xl">Marketing</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Gerencie os banners do carrossel de Novidades & Promoções. Use URLs de imagens
              hospedadas no Firebase.
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
              onClick={() => setForm(emptyForm)}
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
                {slides.length}
              </span>
            </div>
            <div className="max-h-[760px] divide-y divide-border overflow-y-auto">
              {isLoading && <p className="p-5 text-sm text-muted-foreground">Carregando...</p>}
              {!isLoading && slides.length === 0 && (
                <p className="p-5 text-sm text-muted-foreground">Nenhum banner cadastrado.</p>
              )}
              {slides.map((slide) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setForm(toForm(slide))}
                  className={`flex w-full gap-4 p-4 text-left transition ${
                    slide.id === form.id ? "bg-primary/10" : "hover:bg-secondary/60"
                  }`}
                >
                  <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden bg-secondary">
                    {slide.imageUrl ? (
                      <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{slide.title}</div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">
                      {slide.buttonLabel || "Sem botão"}
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {slide.isVisible ? "Visível" : "Oculto"} · ordem {slide.sortOrder}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="border border-border bg-card p-5 md:p-7">
            <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Título"
                  value={form.title}
                  onChange={(value) => updateField("title", value)}
                  required
                />
                <Field
                  label="Slug"
                  value={form.slug}
                  onChange={(value) => updateField("slug", value)}
                />
                <Field
                  label="Texto pequeno"
                  value={form.eyebrow}
                  onChange={(value) => updateField("eyebrow", value)}
                />
                <Field
                  label="Ordem"
                  type="number"
                  value={form.sortOrder}
                  onChange={(value) => updateField("sortOrder", value)}
                />
                <Field
                  label="Texto do botão"
                  value={form.buttonLabel}
                  onChange={(value) => updateField("buttonLabel", value)}
                />
                <Field
                  label="Link do botão"
                  value={form.buttonHref}
                  onChange={(value) => updateField("buttonHref", value)}
                />
                <Field
                  label="URL da imagem"
                  value={form.imageUrl}
                  onChange={(value) => updateField("imageUrl", value)}
                  required
                  className="sm:col-span-2"
                />
                <Field
                  label="Texto alternativo da imagem"
                  value={form.altText}
                  onChange={(value) => updateField("altText", value)}
                  className="sm:col-span-2"
                />
                <TextArea
                  label="Descrição"
                  value={form.description}
                  onChange={(value) => updateField("description", value)}
                />
                <div className="flex flex-wrap gap-5 sm:col-span-2">
                  <Checkbox
                    label="Visível no site"
                    checked={form.isVisible}
                    onChange={(checked) => updateField("isVisible", checked)}
                  />
                </div>
              </div>

              <div>
                <div className="aspect-[16/9] overflow-hidden border border-border bg-secondary">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Imagem atual: {defaultImageUrl}
                </div>
              </div>
            </div>

            {message && <p className="mt-5 text-sm text-primary">{message}</p>}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving || !form.title || !form.imageUrl}
                className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-[11px] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {selectedSlide ? "Salvar" : "Criar"}
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
