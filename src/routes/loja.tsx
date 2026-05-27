import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Plus } from "lucide-react";
import pShampoo from "@/assets/product-shampoo.jpg";
import pMask from "@/assets/product-mask.jpg";
import pOil from "@/assets/product-oil.jpg";
import pSpray from "@/assets/product-spray.jpg";
import pCream from "@/assets/product-cream.jpg";
import pKit from "@/assets/product-kit.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/loja")({
  head: () => ({
    meta: [
      { title: "Boutique — LOMA Clinic & Beauty Hair" },
      {
        name: "description",
        content: "Produtos profissionais selecionados para resultados de salão em casa.",
      },
      { property: "og:title", content: "Boutique — Loma" },
      { property: "og:description", content: "Produtos profissionais selecionados." },
      { property: "og:image", content: pKit },
      { property: "og:url", content: "https://lomaexperience.com/loja" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/loja" }],
  }),
  component: Loja,
});

const imgs = [pShampoo, pMask, pOil, pSpray, pCream, pKit];

function Loja() {
  const { t } = useTranslation();
  const products = (
    t("shop.products", { returnObjects: true }) as {
      name: string;
      cat: string;
      price: number;
      desc: string;
    }[]
  ).map((p, i) => ({ ...p, image: imgs[i], id: `p-${i}` }));
  const filters = t("shop.filters", { returnObjects: true }) as Record<string, string>;
  const [filter, setFilter] = useState("all");
  const add = useCart((s) => s.add);

  const list = filter === "all" ? products : products.filter((p) => p.cat === filter);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading eyebrow={t("shop.eyebrow")} title={t("shop.title")} />

        <div className="mt-14 flex flex-wrap justify-center gap-2">
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
            <Reveal key={p.id} delay={i * 50}>
              <article className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <button
                    onClick={() => add({ id: p.id, name: p.name, price: p.price, image: p.image })}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:scale-110"
                    aria-label={t("common.addToCart")}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-5 flex justify-between items-baseline">
                  <h3 className="font-display text-xl">{p.name}</h3>
                  <span className="text-primary font-display text-lg">{p.price.toFixed(2)} €</span>
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
