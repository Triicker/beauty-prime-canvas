import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles, Heart, Award, Star, Sofa, CalendarDays } from "lucide-react";
import heroDarkImg from "@/assets/woman1.jpg";
import heroLightImg from "@/assets/woman2.png";
import aboutImg from "@/assets/IMG_6262.jpg";
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
import shampoo1 from "@/assets/lomaproducts/shampoo1.webp";
import mascara1 from "@/assets/lomaproducts/mascara1.webp";
import oleo1 from "@/assets/lomaproducts/oleo1.png";
import termico1 from "@/assets/lomaproducts/termico1.webp";
import { MarketingCarouselSection } from "@/components/MarketingCarouselSection";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import type { ProductRecord } from "@/lib/admin/products.server";

type HomeProduct = {
  id: string;
  name: string;
  img: string;
  price: number;
  isFeatured?: boolean;
};

const fallbackFeaturedProducts: HomeProduct[] = [
  {
    id: "fallback-shampoo1",
    name: "Shampoo Vitaminado Fortificante Indian Hair 250 ml",
    img: shampoo1,
    price: 21.89,
  },
  {
    id: "fallback-mascara1",
    name: "Máscara Vitaminada Indian Hair 500 ml",
    img: mascara1,
    price: 32.89,
  },
  {
    id: "fallback-oleo1",
    name: "Prana Oil | Óleo Fortificante 115 ml",
    img: oleo1,
    price: 32.89,
  },
  {
    id: "fallback-termico1",
    name: "Protetor térmico e UV Ganesh Thermic 240 ml",
    img: termico1,
    price: 29.9,
  },
];

function stableScore(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

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
  const { t, i18n } = useTranslation();
  const [dbProducts, setDbProducts] = useState<ProductRecord[]>([]);
  const lang = (i18n.language?.slice(0, 2) ?? "pt") as "pt" | "en" | "fr";
  const featuredNames = t("services.featured", { returnObjects: true }) as string[];
  const services = [
    { name: featuredNames[0], img: sCut },
    { name: featuredNames[1], img: sColor },
    { name: featuredNames[2], img: sTreat },
    { name: featuredNames[3], img: sSmooth },
    { name: featuredNames[4], img: sAesth },
    { name: featuredNames[5], img: sHydra },
  ];
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
    const mapped = dbProducts
      .filter((product) => product.imageUrl && product.price != null)
      .map<HomeProduct>((product) => ({
        id: product.id,
        name:
          lang === "en"
            ? product.nameEn || product.namePt
            : lang === "fr"
              ? product.nameFr || product.namePt
              : product.namePt,
        img: product.imageUrl ?? "",
        price: product.price ?? 0,
        isFeatured: product.isFeatured,
      }));

    if (mapped.length === 0) return fallbackFeaturedProducts;

    const featured = mapped.filter((product) => product.isFeatured).slice(0, 4);
    const source = mapped.filter((product) => !product.isFeatured);
    const seed = new Date().toISOString().slice(0, 10);
    const rotated = [...source].sort(
      (a, b) => stableScore(`${seed}-${a.id}`) - stableScore(`${seed}-${b.id}`),
    );

    return [...featured, ...rotated].slice(0, 4);
  }, [dbProducts, lang]);
  const testimonialsRaw = t("testimonials.items", { returnObjects: true });
  const testimonials = (Array.isArray(testimonialsRaw) ? testimonialsRaw : []) as {
    n: string;
    t: string;
  }[];
  const mobileHeroLines = {
    pt: ["O lugar", "onde a sua", t("home.heroLine2Accent"), t("home.heroLine2End")],
    en: ["The place", "where your", t("home.heroLine2Accent"), t("home.heroLine2End")],
    fr: ["Le lieu", "où votre", t("home.heroLine2Accent"), t("home.heroLine2End")],
  }[lang];

  return (
    <>
      {/* HERO */}
      <section className="home-hero relative -mt-24 min-h-[760px] h-[100svh] overflow-hidden">
        <img
          src={heroLightImg}
          alt=""
          className="home-hero-image home-hero-image-light absolute inset-0 w-full h-full object-cover object-[64%_center] md:object-[68%_center]"
        />
        <img
          src={heroDarkImg}
          alt=""
          className="home-hero-image home-hero-image-dark absolute inset-0 w-full h-full object-cover object-[64%_center] md:object-[68%_center]"
        />
        <div className="home-hero-overlay" />

        <div className="home-hero-content relative z-10 mx-auto max-w-[1480px] h-full px-6 sm:px-8 lg:px-12 pt-36 lg:pt-40 pb-10 flex flex-col justify-center">
          <div className="home-hero-copy max-w-[760px]">
            <Reveal>
              <div className="home-hero-eyebrow eyebrow mb-8 flex items-center gap-3 text-primary">
                <span className="h-px w-9 bg-primary/80" />
                {t("home.eyebrow")}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h1
                className="home-hero-title font-display tracking-normal text-5xl sm:text-6xl md:text-7xl xl:text-[78px] 2xl:text-[86px] leading-[0.98] text-foreground"
                aria-label={`${t("home.heroLine1")} ${t("home.heroLine2Start")} ${t("home.heroLine2Accent")} ${t("home.heroLine2End")}`}
              >
                <span className="home-hero-title-desktop">
                  {t("home.heroLine1")}
                  <br />
                  <span className="block sm:whitespace-nowrap">
                    {t("home.heroLine2Start")}{" "}
                    <span className="text-gradient-gold italic font-light">
                      {t("home.heroLine2Accent")}
                    </span>{" "}
                    {t("home.heroLine2End")}
                  </span>{" "}
                </span>
                <span className="home-hero-title-mobile" aria-hidden="true">
                  {mobileHeroLines[0]}
                  <br />
                  {mobileHeroLines[1]}
                  <br />
                  <span className="text-gradient-gold italic font-light">{mobileHeroLines[2]}</span>
                  <br />
                  {mobileHeroLines[3]}
                </span>
              </h1>
            </Reveal>
            <div className="home-hero-mobile-divider" aria-hidden="true">
              <span />
              <img src={seal} alt="" />
              <span />
            </div>
            <Reveal delay={240}>
              <p className="home-hero-subtitle mt-8 text-base sm:text-lg text-foreground/86 max-w-lg leading-[1.9]">
                {t("home.subtitle")}
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="home-hero-actions mt-10 flex flex-wrap items-center gap-6">
                <Link
                  to="/agendamento"
                  className="home-hero-primary-cta group inline-flex items-center gap-4 px-7 sm:px-9 h-16 rounded-md bg-gradient-gold text-cocoa-deep text-[12px] font-semibold uppercase tracking-[0.16em] hover:opacity-90 transition-all shadow-elegant"
                  style={{ color: "oklch(0.22 0.04 50)" }}
                >
                  <CalendarDays className="w-5 h-5" />
                  {t("common.scheduleNow")}
                </Link>
                <Link
                  to="/profissionais"
                  className="hero-experience-link group inline-flex items-center gap-4 text-foreground text-[12px] font-semibold uppercase tracking-[0.16em]"
                >
                  <span className="w-12 h-12 rounded-full border border-foreground/80 flex items-center justify-center group-hover:border-primary group-hover:text-primary transition">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  {t("shop.watchVideo")}
                </Link>
              </div>
            </Reveal>
            <Reveal delay={480}>
              <div className="home-hero-features mt-16 grid grid-cols-2 md:grid-cols-4 gap-y-6 max-w-[760px]">
                {[
                  { i: Heart, k: "f1" },
                  { i: Award, k: "f2" },
                  { i: Star, k: "f3" },
                  { i: Sofa, k: "f4" },
                ].map(({ i: Icon, k }, index) => (
                  <div
                    key={k}
                    className={`home-hero-feature flex items-center gap-3 md:pr-6 ${index > 0 ? "md:border-l md:border-primary/35 md:pl-6" : ""}`}
                  >
                    <Icon className="w-7 h-7 text-primary shrink-0" strokeWidth={1.35} />
                    <span className="home-hero-feature-label text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-foreground/90 leading-tight">
                      {t(`shop.heroFeatures.${k}`)}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
            <div className="home-hero-mobile-footer-mark" aria-hidden="true">
              <span />
              <img src={seal} alt="" />
              <span />
            </div>
          </div>
        </div>
      </section>

      <MarketingCarouselSection />

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
      <section className="services-showcase py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow={t("home.servicesEyebrow")} title={t("home.servicesTitle")} />
          </Reveal>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <Link
                  to="/servicos"
                  className="service-showcase-card group relative block aspect-[4/5] overflow-hidden hover-lift"
                >
                  <img
                    src={s.img}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="service-showcase-card-overlay absolute inset-0" />
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
              <Reveal key={p.id} delay={i * 70}>
                <Link to="/loja" className="group block">
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-6 transition-transform duration-1000 group-hover:scale-105"
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
