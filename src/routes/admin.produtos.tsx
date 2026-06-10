import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Plus, Save, Trash2 } from "lucide-react";

import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from "@/data/product-categories";
import type { ProductRecord } from "@/lib/admin/products.server";

type ProductForm = {
  id?: string;
  slug: string;
  namePt: string;
  nameEn: string;
  nameFr: string;
  descriptionPt: string;
  descriptionEn: string;
  descriptionFr: string;
  price: string;
  categories: string[];
  imageUrl: string;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: string;
};

const emptyForm: ProductForm = {
  slug: "",
  namePt: "",
  nameEn: "",
  nameFr: "",
  descriptionPt: "",
  descriptionEn: "",
  descriptionFr: "",
  price: "",
  categories: ["shampoos"],
  imageUrl: "",
  isFeatured: false,
  isVisible: true,
  sortOrder: "0",
};

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProductsPage,
});

function toForm(product: ProductRecord): ProductForm {
  const categories =
    product.categories && product.categories.length > 0
      ? product.categories
      : product.category
        ? [product.category]
        : ["shampoos"];

  return {
    id: product.id,
    slug: product.slug,
    namePt: product.namePt,
    nameEn: product.nameEn ?? "",
    nameFr: product.nameFr ?? "",
    descriptionPt: product.descriptionPt ?? "",
    descriptionEn: product.descriptionEn ?? "",
    descriptionFr: product.descriptionFr ?? "",
    price: product.price == null ? "" : String(product.price),
    categories,
    imageUrl: product.imageUrl ?? "",
    isFeatured: product.isFeatured,
    isVisible: product.isVisible,
    sortOrder: String(product.sortOrder),
  };
}

function toPayload(form: ProductForm) {
  return {
    slug: form.slug,
    namePt: form.namePt,
    nameEn: form.nameEn || null,
    nameFr: form.nameFr || null,
    descriptionPt: form.descriptionPt || null,
    descriptionEn: form.descriptionEn || null,
    descriptionFr: form.descriptionFr || null,
    price: form.price === "" ? null : Number(form.price),
    category: form.categories[0] || null,
    categories: form.categories,
    imageUrl: form.imageUrl || null,
    isFeatured: form.isFeatured,
    isVisible: form.isVisible,
    sortOrder: Number(form.sortOrder || 0),
  };
}

function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === form.id),
    [form.id, products],
  );

  async function loadProducts() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/products");

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) throw new Error("Falha ao carregar produtos");

      const data = (await response.json()) as { products: ProductRecord[] };
      setProducts(data.products);

      if (!form.id && data.products[0]) {
        setForm(toForm(data.products[0]));
      }
    } catch {
      setMessage("Não foi possível carregar produtos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleCategory(category: string, checked: boolean) {
    setForm((current) => {
      const currentCategories = new Set(current.categories);

      if (checked) {
        currentCategories.add(category);
      } else {
        currentCategories.delete(category);
      }

      return {
        ...current,
        categories: Array.from(currentCategories),
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const url = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
      const response = await fetch(url, {
        method: form.id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(toPayload(form)),
      });

      if (!response.ok) throw new Error("Falha ao salvar");

      const data = (await response.json()) as { product: ProductRecord };
      setMessage("Produto salvo.");
      setForm(toForm(data.product));
      await loadProducts();
    } catch {
      setMessage("Não foi possível salvar o produto.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id || !confirm("Excluir este produto?")) return;

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/products/${form.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao excluir");

      setForm(emptyForm);
      setMessage("Produto excluído.");
      await loadProducts();
    } catch {
      setMessage("Não foi possível excluir o produto.");
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
            <h1 className="font-display text-4xl text-foreground md:text-5xl">Produtos</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Gerencie os produtos da loja. As imagens devem ser URLs do Firebase Hosting/Storage.
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
                {products.length}
              </span>
            </div>
            <div className="max-h-[760px] divide-y divide-border overflow-y-auto">
              {isLoading && <p className="p-5 text-sm text-muted-foreground">Carregando...</p>}
              {!isLoading && products.length === 0 && (
                <p className="p-5 text-sm text-muted-foreground">Nenhum produto cadastrado.</p>
              )}
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setForm(toForm(product))}
                  className={`flex w-full gap-4 p-4 text-left transition ${
                    product.id === form.id ? "bg-primary/10" : "hover:bg-secondary/60"
                  }`}
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-secondary">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{product.namePt}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {(product.categories && product.categories.length > 0
                        ? product.categories
                        : product.category
                          ? [product.category]
                          : []
                      )
                        .map((category) => PRODUCT_CATEGORY_LABELS[category] ?? category)
                        .join(", ") || "Sem categoria"}
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {product.isVisible ? "Visível" : "Oculto"} · ordem {product.sortOrder}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="border border-border bg-card p-5 md:p-7">
            <div className="grid gap-5 xl:grid-cols-[1fr_240px]">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Nome PT"
                  value={form.namePt}
                  onChange={(value) => updateField("namePt", value)}
                  required
                />
                <Field
                  label="Slug"
                  value={form.slug}
                  onChange={(value) => updateField("slug", value)}
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

                <fieldset className="sm:col-span-2">
                  <legend className="eyebrow">Seções</legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {PRODUCT_CATEGORIES.map((category) => (
                      <label
                        key={category.value}
                        className="flex min-h-10 items-center gap-3 border border-border px-3 py-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={form.categories.includes(category.value)}
                          onChange={(event) => toggleCategory(category.value, event.target.checked)}
                          className="h-4 w-4 accent-primary"
                        />
                        {category.label}
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Um produto pode aparecer em mais de uma seção.
                  </p>
                </fieldset>

                <Field
                  label="Preço"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(value) => updateField("price", value)}
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
                    <img src={form.imageUrl} alt="" className="h-full w-full object-contain p-5" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Exemplo: https://midiasave-5c064.web.app/shampoo1.webp
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
                {selectedProduct ? "Salvar" : "Criar"}
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
  step,
  required,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  step?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        step={step}
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
