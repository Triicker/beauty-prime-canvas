import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/store/cart";
import { products } from "@/data/products";

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
  const filters = t("shop.filters", { returnObjects: true }) as Record<string, string>;
  const [filter, setFilter] = useState<string>("all");
  const add = useCart((s) => s.add);
  const lang = (i18n.language?.slice(0, 2) ?? "pt") as "pt" | "en" | "fr";
  const descKey = lang === "en" ? "descEn" : lang === "fr" ? "descFr" : "descPt";

  const list = filter === "all" ? products : products.filter((p) => p.cat === filter);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading eyebrow={t("shop.eyebrow")} title={t("shop.title")} />
        <p className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-primary/70">
          {t("shop.brand")}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {Object.entries(filters).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] border transition ${filter === k ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}
            >
              {label}
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
                    onClick={() => add({ id: p.id, name: p.name, price: p.price, image: p.image })}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:scale-110"
                    aria-label={t("common.addToCart")}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-5 flex justify-between items-baseline gap-3">
                  <h3 className="font-display text-base leading-tight">{p.name}</h3>
                  <span className="text-primary font-display text-lg whitespace-nowrap">
                    {p.price.toFixed(2)} €
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p[descKey]}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
