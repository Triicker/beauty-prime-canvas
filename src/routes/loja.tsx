import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/store/cart";
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from "@/data/product-categories";
import { products as fallbackProducts } from "@/data/products";
import type { ProductRecord } from "@/lib/admin/products.server";

export const Route = createFileRoute("/loja")({
  head: () => ({
    meta: [
      { title: "Boutique — LOMA Clinic & Beauty Hair" },
      {
        name: "description",
        content:
          "Produtos profissionais Avani: styling, cronograma capilar e cuidado. Revendedor oficial.",
      },
      { property: "og:title", content: "Boutique — Loma" },
      { property: "og:description", content: "Produtos profissionais Avani na LOMA." },
      { property: "og:url", content: "https://lomaexperience.com/loja" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/loja" }],
  }),
  component: Loja,
});

function Loja() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState<string>("all");
  const [dbProducts, setDbProducts] = useState<ProductRecord[]>([]);
  const add = useCart((s) => s.add);
  const lang = (i18n.language?.slice(0, 2) ?? "pt") as "pt" | "en" | "fr";

  useEffect(() => {
    let active = true;

    fetch("/api/products")
      .then(async (response) => {
        if (!response.ok) throw new Error("Falha ao carregar produtos");
        return (await response.json()) as { products: ProductRecord[] };
      })
      .then((data) => {
        if (active) setDbProducts(data.products);
      })
      .catch(() => {
        if (active) setDbProducts([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const products = useMemo(() => {
    if (dbProducts.length > 0) {
      return dbProducts.map((product) => ({
        id: product.id,
        name:
          lang === "en"
            ? product.nameEn || product.namePt
            : lang === "fr"
              ? product.nameFr || product.namePt
              : product.namePt,
        price: product.price ?? 0,
        image: product.imageUrl ?? "",
        category: product.category ?? product.categories?.[0] ?? "sem-categoria",
        categories:
          product.categories && product.categories.length > 0
            ? product.categories
            : product.category
              ? [product.category]
              : ["sem-categoria"],
        desc:
          lang === "en"
            ? product.descriptionEn || product.descriptionPt || ""
            : lang === "fr"
              ? product.descriptionFr || product.descriptionPt || ""
              : product.descriptionPt || "",
      }));
    }

    const descKey = lang === "en" ? "descEn" : lang === "fr" ? "descFr" : "descPt";

    return fallbackProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.cat,
      categories: [product.cat],
      desc: product[descKey],
    }));
  }, [dbProducts, lang]);

  const activeCategories = useMemo(() => {
    const used = new Set(products.flatMap((product) => product.categories));
    return PRODUCT_CATEGORIES.filter((category) => used.has(category.value));
  }, [products]);

  const list =
    filter === "all" ? products : products.filter((product) => product.categories.includes(filter));

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading eyebrow={t("shop.eyebrow")} title={t("shop.title")} />
        <p className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-primary/70">
          {t("shop.brand")}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {[{ value: "all", label: "Todos" }, ...activeCategories].map((category) => (
            <button
              key={category.value}
              onClick={() => setFilter(category.value)}
              className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] border transition ${filter === category.value ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={i * 30}>
              <article className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <button
                    type="button"
                    onClick={() => add({ id: p.id, name: p.name, price: p.price, image: p.image })}
                    className="absolute bottom-4 right-4 flex h-12 w-12 translate-y-0 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-100 shadow-[0_16px_34px_-20px_rgba(58,36,24,0.75)] transition-all hover:scale-110 hover:bg-primary/90"
                    aria-label={t("common.addToCart")}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-primary/70">
                  {PRODUCT_CATEGORY_LABELS[p.category] ?? p.category}
                </div>
                <div className="mt-5 flex justify-between items-baseline gap-3">
                  <h3 className="font-display text-base leading-tight">{p.name}</h3>
                  <span className="text-primary font-display text-lg whitespace-nowrap">
                    {p.price.toFixed(2)} €
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
