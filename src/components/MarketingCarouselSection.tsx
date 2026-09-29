import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Leaf,
  ShoppingBag,
  Sparkles,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

type MarketingSlide = {
  id: string;
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
  imageUrl: string;
  altText?: string | null;
};

const fallbackSlides: MarketingSlide[] = [
  {
    id: "ritual-caracois-1",
    eyebrow: "Novidade",
    title: "Ritual de Caracóis e Ondas",
    description: "Definição, brilho e hidratação profunda para caracóis e ondas perfeitas.",
    buttonLabel: "Ver produtos",
    buttonHref: "/loja",
    imageUrl: "https://midiasave-5c064.web.app/marketing1.png",
    altText: "Ritual de Caracóis e Ondas com produtos LOMA",
  },
  {
    id: "ritual-caracois-2",
    eyebrow: "Promoção",
    title: "Cuidados profissionais em casa",
    description: "Produtos selecionados para manter o resultado do salão todos os dias.",
    buttonLabel: "Conhecer loja",
    buttonHref: "/loja",
    imageUrl: "https://midiasave-5c064.web.app/marketing1.png",
    altText: "Novidade LOMA para definição, brilho e hidratação",
  },
  {
    id: "ritual-caracois-3",
    eyebrow: "LOMA",
    title: "Beleza com ritual",
    description: "Descubra tratamentos e finalizadores pensados para o seu cabelo.",
    buttonLabel: "Ver serviços",
    buttonHref: "/servicos",
    imageUrl: "https://midiasave-5c064.web.app/marketing1.png",
    altText: "Promoção LOMA com linha de cuidados para caracóis e ondas",
  },
];

const categories = [
  {
    title: "Caracóis",
    description: "Definição e movimento",
    icon: Waves,
    to: "/loja",
  },
  {
    title: "Tratamentos",
    description: "Cuidados profissionais",
    icon: Sparkles,
    to: "/servicos",
  },
  {
    title: "Hidratação",
    description: "Nutrição e brilho",
    icon: Droplets,
    to: "/loja",
  },
  {
    title: "Styling",
    description: "Acabamentos perfeitos",
    icon: Leaf,
    to: "/loja",
  },
  {
    title: "Loja",
    description: "Descubra todos os produtos",
    icon: ShoppingBag,
    to: "/loja",
  },
];

export function MarketingCarouselSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<MarketingSlide[]>(fallbackSlides);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateCurrent = () => setCurrent(api.selectedScrollSnap());
    updateCurrent();
    api.on("select", updateCurrent);
    api.on("reInit", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
      api.off("reInit", updateCurrent);
    };
  }, [api]);

  useEffect(() => {
    let active = true;

    fetch("/api/marketing-slides")
      .then(async (response) => {
        if (!response.ok) throw new Error("Falha ao carregar banners");
        return (await response.json()) as { slides: MarketingSlide[] };
      })
      .then((data) => {
        if (active && data.slides.length > 0) {
          setSlides(data.slides);
          setCurrent(0);
        }
      })
      .catch(() => {
        if (active) setSlides(fallbackSlides);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="marketing-carousel-section py-10 sm:py-12 md:py-14">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-center gap-4 text-center">
          <span className="hidden h-px w-12 bg-primary/60 sm:block" />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-none text-foreground">
            Novidades &amp; Promoções
          </h2>
          <span className="hidden h-px w-12 bg-primary/60 sm:block" />
        </div>
        <div className="mt-2 flex justify-center text-primary">
          <span className="h-2 w-2 rotate-45 bg-primary" />
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="marketing-carousel-frame mt-5 sm:mt-7"
        >
          <CarouselContent className="-ml-0">
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0">
                <a
                  href={slide.buttonHref || "/loja"}
                  className="marketing-carousel-slide"
                  aria-label={slide.buttonLabel || slide.title}
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.altText || slide.title}
                    loading="lazy"
                    className="block h-auto w-full object-contain"
                  />
                  <span className="marketing-carousel-copy">
                    {slide.eyebrow && (
                      <span className="marketing-carousel-eyebrow">{slide.eyebrow}</span>
                    )}
                    <strong>{slide.title}</strong>
                    {slide.description && <span>{slide.description}</span>}
                    {slide.buttonLabel && (
                      <span className="marketing-carousel-cta">{slide.buttonLabel}</span>
                    )}
                  </span>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>

          <button
            type="button"
            className="marketing-carousel-arrow left-3 sm:left-5"
            aria-label="Slide anterior"
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="marketing-carousel-arrow right-3 sm:right-5"
            aria-label="Próximo slide"
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </Carousel>

        <div className="mt-4 flex justify-center gap-2" aria-label="Indicadores do carrossel">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === index ? "w-7 bg-primary" : "w-2.5 bg-primary/35 hover:bg-primary/60"
              }`}
              aria-label={`Ir para o slide ${index + 1}`}
              aria-current={current === index}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(({ title, description, icon: Icon, to }) => (
            <Link key={title} to={to} className="marketing-category-card group">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15 transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                  {title}
                </span>
                <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                  {description}
                </span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-foreground/70 transition group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
