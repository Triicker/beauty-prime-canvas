import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import about from "@/assets/about-salon.jpg";
import seal from "@/assets/logo-loma-seal.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Sparkles, Leaf, Crown, Heart } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — LOMA Clinic & Beauty Hair" },
      {
        name: "description",
        content:
          "Conheça a história, missão e diferenciais da LOMA Clinic & Beauty Hair, fundada por Marina Loreti.",
      },
      { property: "og:title", content: "Sobre — LOMA" },
      {
        property: "og:description",
        content: "Um espaço premium de transformação capilar e autocuidado.",
      },
      { property: "og:image", content: about },
      { property: "og:url", content: "https://lomaexperience.com/sobre" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/sobre" }],
  }),
  component: Sobre,
});

function Sobre() {
  const { t } = useTranslation();
  const values = t("about.values", { returnObjects: true }) as { t: string; b: string }[];
  const icons = [Crown, Sparkles, Leaf, Heart];
  return (
    <>
      <section className="pt-16 pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <div className="eyebrow mb-5">{t("about.eyebrow")}</div>
              <h1 className="font-display text-5xl md:text-6xl leading-[1.05]">
                {t("about.title")}
              </h1>
              <p className="mt-7 text-lg text-muted-foreground leading-relaxed">
                {t("about.body")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="aspect-[4/5] overflow-hidden relative">
              <img src={about} alt="" className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 bg-gradient-cocoa">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <img
            src={seal}
            alt=""
            className="mx-auto w-24 h-24 rounded-full ring-1 ring-primary/40 mb-8"
          />
          <Reveal>
            <div className="eyebrow mb-4">{t("about.missionTitle")}</div>
            <p className="font-display text-3xl md:text-4xl leading-relaxed italic text-gradient-gold">
              {t("about.missionBody")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow={t("about.valuesTitle")} title={t("home.servicesTitle")} />
          </Reveal>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = icons[i];
              return (
                <Reveal key={v.t} delay={i * 80}>
                  <div className="border border-border p-8 h-full bg-card hover-lift">
                    <Icon className="w-7 h-7 text-primary mb-5" />
                    <h3 className="font-display text-xl mb-3">{v.t}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.b}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
