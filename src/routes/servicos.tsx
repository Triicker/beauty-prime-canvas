import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Clock, ArrowRight } from "lucide-react";
import sCut from "@/assets/service-cut.jpg";
import sColor from "@/assets/service-color.jpg";
import sTreat from "@/assets/service-treatment.jpg";
import sSmooth from "@/assets/service-smoothing.jpg";
import sAesth from "@/assets/service-aesthetic.jpg";
import sHydra from "@/assets/service-hydration.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Loma Clinic & Beauty Spa" },
      { name: "description", content: "Cortes, coloração, tratamentos e estética capilar premium na Loma." },
      { property: "og:title", content: "Serviços — Loma" },
      { property: "og:description", content: "Cada serviço, uma assinatura Loma." },
      { property: "og:image", content: sColor },
    ],
  }),
  component: Servicos,
});

function Servicos() {
  const { t } = useTranslation();
  const list = t("services.list", { returnObjects: true }) as { name: string; desc: string; price: string; time: string }[];
  const imgs = [sCut, sColor, sTreat, sSmooth, sAesth, sHydra];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal><SectionHeading eyebrow={t("services.eyebrow")} title={t("services.title")} /></Reveal>
        <div className="mt-20 space-y-6">
          {list.map((s, i) => (
            <Reveal key={s.name} delay={i * 60}>
              <article className={`grid md:grid-cols-2 gap-8 items-center group ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={imgs[i]} alt={s.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="px-2">
                  <div className="eyebrow mb-3">0{i + 1} · {s.time}</div>
                  <h3 className="font-display text-3xl md:text-4xl mb-4">{s.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                  <div className="mt-6 flex items-center gap-6">
                    <span className="text-primary font-display text-2xl">{s.price}</span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{s.time}</span>
                  </div>
                  <Link to="/agendamento" className="mt-8 inline-flex items-center gap-2 text-primary text-[12px] uppercase tracking-[0.28em] border-b border-primary/40 pb-1 hover:gap-3 transition-all">
                    {t("common.bookNow")}<ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
