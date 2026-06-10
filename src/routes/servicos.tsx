import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import sColor from "@/assets/service-color.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import type { PublicServiceCategory } from "@/lib/admin/services.server";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — LOMA Clinic & Beauty Hair" },
      {
        name: "description",
        content:
          "Loiros, extensões, terapia capilar, Head Spa e coloração premium na LOMA em Torres Vedras.",
      },
      { property: "og:title", content: "Serviços — LOMA" },
      { property: "og:description", content: "Cada serviço, uma assinatura Loma." },
      { property: "og:image", content: sColor },
      { property: "og:url", content: "https://lomaexperience.com/servicos" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/servicos" }],
  }),
  component: Servicos,
});

type ServiceItem = { id: string; name: string; desc: string; price: string; time: string };
type Category = { name: string; slug: string; items: ServiceItem[] };

function Servicos() {
  const { t, i18n } = useTranslation();
  const fallbackCategories = t("services.categories", { returnObjects: true }) as {
    name: string;
    slug: string;
    items: Omit<ServiceItem, "id">[];
  }[];
  const [dbCategories, setDbCategories] = useState<PublicServiceCategory[]>([]);
  const [active, setActive] = useState("all");
  const lang = (i18n.language?.slice(0, 2) ?? "pt") as "pt" | "en" | "fr";

  useEffect(() => {
    let activeRequest = true;

    fetch("/api/services")
      .then(async (response) => {
        if (!response.ok) throw new Error("Falha ao carregar serviços");
        return (await response.json()) as { categories: PublicServiceCategory[] };
      })
      .then((data) => {
        if (activeRequest) setDbCategories(data.categories);
      })
      .catch(() => {
        if (activeRequest) setDbCategories([]);
      });

    return () => {
      activeRequest = false;
    };
  }, []);

  const categories = useMemo<Category[]>(() => {
    if (dbCategories.length > 0) {
      return dbCategories.map((category) => ({
        name:
          lang === "en"
            ? category.nameEn || category.namePt
            : lang === "fr"
              ? category.nameFr || category.namePt
              : category.namePt,
        slug: category.slug,
        items: category.services.map((service) => ({
          id: service.id,
          name:
            lang === "en"
              ? service.nameEn || service.namePt
              : lang === "fr"
                ? service.nameFr || service.namePt
                : service.namePt,
          desc:
            lang === "en"
              ? service.descriptionEn || service.descriptionPt || ""
              : lang === "fr"
                ? service.descriptionFr || service.descriptionPt || ""
                : service.descriptionPt || "",
          price: service.priceLabel ?? "",
          time: service.durationLabel ?? "",
        })),
      }));
    }

    return fallbackCategories.map((category) => ({
      ...category,
      items: category.items.map((service) => ({
        ...service,
        id: `${category.slug}-${service.name}`,
      })),
    }));
  }, [dbCategories, fallbackCategories, lang]);

  const visible = active === "all" ? categories : categories.filter((c) => c.slug === active);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow={t("services.eyebrow")} title={t("services.title")} />
        </Reveal>

        {/* Category filter tabs */}
        <Reveal delay={80}>
          <div className="mt-12 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActive("all")}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-colors ${
                active === "all"
                  ? "bg-primary text-background font-semibold"
                  : "border border-primary/30 text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              {t("services.all")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActive(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-colors ${
                  active === cat.slug
                    ? "bg-primary text-background font-semibold"
                    : "border border-primary/30 text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Category sections */}
        <div className="mt-16 space-y-16">
          {visible.map((cat, ci) => (
            <div key={cat.slug}>
              {active === "all" && (
                <Reveal delay={ci * 40}>
                  <h2 className="font-display text-2xl md:text-3xl mb-8 pb-4 border-b border-border">
                    {cat.name}
                  </h2>
                </Reveal>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.items.map((s, i) => (
                  <Reveal key={s.id} delay={i * 40}>
                    <article className="group border border-border rounded-sm p-6 flex flex-col gap-4 hover:border-primary/60 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-xl leading-tight">{s.name}</h3>
                        {s.time && (
                          <span className="flex-shrink-0 flex items-center gap-1 text-[11px] text-muted-foreground border border-border rounded-full px-2 py-0.5 whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            {s.time}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                        {s.desc}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                        <span className="text-primary font-display text-xl">{s.price}</span>
                        <Link
                          to="/agendamento"
                          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                        >
                          {t("common.bookNow")}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
