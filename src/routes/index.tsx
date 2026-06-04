import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";
import heroVideo from "@/assets/woman1.mp4";
import heroVideoMobile from "@/assets/woman1mobile.mp4";
import aboutImg from "@/assets/about-salon.jpg";
import seal from "@/assets/logo-loma-seal.jpg";
import sCut from "@/assets/service-cut.jpg";
import sColor from "@/assets/service-color.jpg";
import sTreat from "@/assets/service-treatment.jpg";
import sSmooth from "@/assets/service-smoothing.jpg";
import sAesth from "@/assets/service-aesthetic.jpg";
import sHydra from "@/assets/service-hydration.jpg";
import g1 from "@/assets/IMG_5364.jpg";
import g2 from "@/assets/IMG_5368.jpg";
import g3 from "@/assets/IMG_5722.jpg";
import g5 from "@/assets/IMG_5978.jpg";
import { products as allProducts } from "@/data/products";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LOMA Clinic & Beauty Hair — Santa Cruz, Torres Vedras" },
      {
        name: "description",
        content:
          "Salão premium de beleza capilar, loiros, extensões e Head Spa em Santa Cruz — Torres Vedras.",
      },
      { property: "og:title", content: "LOMA Clinic & Beauty Hair" },
      { property: "og:description", content: "Beleza que revela a sua melhor versão." },
      { property: "og:url", content: "https://lomaexperience.com/" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/" }],
  }),
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const featuredNames = t("services.featured", { returnObjects: true }) as string[];
  const services = [
    { name: featuredNames[0], img: sCut },
    { name: featuredNames[1], img: sColor },
    { name: featuredNames[2], img: sTreat },
    { name: featuredNames[3], img: sSmooth },
    { name: featuredNames[4], img: sAesth },
    { name: featuredNames[5], img: sHydra },
  ];
  const products = [
    { name: t("shop.products.0.name"), img: pShampoo, price: 28 },
    { name: t("shop.products.1.name"), img: pMask, price: 42 },
    { name: t("shop.products.2.name"), img: pOil, price: 38 },
    { name: t("shop.products.5.name"), img: pKit, price: 120 },
  ];
  const testimonials = t("testimonials.items", { returnObjects: true }) as {
    n: string;
    t: string;
  }[];

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-20 h-[100svh] min-h-[640px] overflow-hidden">
        {/* Mobile video */}
        <video
          src={heroVideoMobile}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover md:hidden"
        />
        {/* Desktop video */}
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl h-full px-6 sm:px-8 flex items-center">
          <div className="max-w-2xl">
            <Reveal>
              <div className="eyebrow mb-6 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                {t("home.eyebrow")}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] whitespace-pre-line text-foreground">
                {t("home.title").split("\n")[0]}
                <br />
                <span className="text-gradient-gold italic font-light">
                  {t("home.title").split("\n")[1]}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-7 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                {t("home.subtitle")}
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/agendamento"
                  className="group inline-flex items-center gap-3 px-7 h-13 py-4 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.28em] hover:bg-primary/90 transition-all"
                >
                  {t("common.bookNow")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  to="/servicos"
                  className="inline-flex items-center px-7 py-4 border border-primary/40 text-primary text-[12px] uppercase tracking-[0.28em] hover:bg-primary/10 transition-all"
                >
                  {t("home.seeServices")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={aboutImg}
                alt="Salão Loma"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <img
                src={seal}
                alt=""
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full ring-1 ring-primary/40 hidden md:block"
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div>
              <div className="eyebrow mb-5">{t("home.aboutEyebrow")}</div>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.1]">
                {t("home.aboutTitle")}
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
                {t("home.aboutBody")}
              </p>
              <Link
                to="/sobre"
                className="mt-8 inline-flex items-center gap-2 text-primary text-[12px] uppercase tracking-[0.28em] border-b border-primary/40 pb-1 hover:gap-3 transition-all"
              >
                {t("common.learnMore")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 md:py-32 bg-gradient-cocoa">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow={t("home.servicesEyebrow")} title={t("home.servicesTitle")} />
          </Reveal>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <Link
                  to="/servicos"
                  className="group relative block aspect-[4/5] overflow-hidden hover-lift"
                >
                  <img
                    src={s.img}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="eyebrow mb-2">0{i + 1}</div>
                    <div className="font-display text-2xl md:text-3xl text-foreground">
                      {s.name}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 text-primary text-[12px] uppercase tracking-[0.28em]"
            >
              {t("common.seeAll")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow={t("home.productsEyebrow")} title={t("home.productsTitle")} />
          </Reveal>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <Reveal key={p.name} delay={i * 70}>
                <Link to="/loja" className="group block">
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex justify-between items-baseline">
                    <span className="font-display text-lg">{p.name}</span>
                    <span className="text-sm text-primary">{p.price.toFixed(2)} €</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 md:py-32 bg-gradient-cocoa">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow={t("home.galleryEyebrow")} title={t("home.galleryTitle")} />
          </Reveal>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[g1, g2, g3, g5].map((src, i) => (
              <Reveal key={i} delay={i * 60}>
                <Link to="/galeria" className="block aspect-[3/4] overflow-hidden">
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow={t("home.testimonialsEyebrow")}
              title={t("home.testimonialsTitle")}
            />
          </Reveal>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((tm, i) => (
              <Reveal key={i} delay={i * 80}>
                <figure className="border border-border p-7 h-full bg-card hover-lift">
                  <div className="text-primary text-2xl font-display mb-4">“</div>
                  <blockquote className="text-sm text-muted-foreground leading-relaxed">
                    {tm.t}
                  </blockquote>
                  <figcaption className="mt-6 eyebrow">{tm.n}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-gradient-gold text-cocoa-deep">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2
              className="font-display text-4xl md:text-6xl leading-tight"
              style={{ color: "oklch(0.22 0.04 50)" }}
            >
              {t("home.ctaTitle")}
            </h2>
            <p className="mt-5 text-base md:text-lg" style={{ color: "oklch(0.32 0.04 50)" }}>
              {t("home.ctaBody")}
            </p>
            <Link
              to="/agendamento"
              className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-cocoa-deep text-cream text-[12px] uppercase tracking-[0.28em] hover:opacity-90 transition"
              style={{ background: "oklch(0.22 0.04 50)", color: "oklch(0.96 0.02 85)" }}
            >
              {t("common.bookNow")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
