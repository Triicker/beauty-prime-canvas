import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import g1 from "@/assets/IMG_5364.jpg";
import g2 from "@/assets/IMG_5368.jpg";
import g3 from "@/assets/IMG_5722.jpg";
import g4 from "@/assets/IMG_5822.jpg";
import g5 from "@/assets/IMG_5978.jpg";
import g6 from "@/assets/IMG_6092.jpg";
import sCut from "@/assets/service-cut.jpg";
import sColor from "@/assets/service-color.jpg";
import sSmooth from "@/assets/service-smoothing.jpg";
import p1 from "@/assets/DSC07249.jpeg";
import p2 from "@/assets/DSC07354.jpeg";
import p3 from "@/assets/IMG_5523_Original.jpg";
import p4 from "@/assets/IMG_5454.jpg";
import p5 from "@/assets/IMG_5455.jpg";
import p6 from "@/assets/IMG_5456.jpg";
import p7 from "@/assets/IMG_5457.jpg";
import p8 from "@/assets/IMG_5468.jpg";
import p9 from "@/assets/IMG_5595.jpg";
import p10 from "@/assets/IMG_4006.jpg";
import p11 from "@/assets/pros-lounge.png";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

const BEFORE_AFTER = [
  { a: g1, b: g4 },
  { a: g2, b: g5 },
  { a: g3, b: g6 },
];

function BeforeAfter({ a, b, labels }: { a: string; b: string; labels: { a: string; b: string } }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div
      ref={ref}
      onMouseDown={(e) => {
        dragging.current = true;
        move(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && move(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => move(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      className="relative aspect-[4/5] overflow-hidden border border-border select-none group cursor-ew-resize ring-gold-glow"
    >
      <img src={b} alt="depois" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={a}
          alt="antes"
          className="absolute inset-0 h-full object-cover"
          style={{ width: `${(100 / pos) * 100}%`, maxWidth: "none" }}
        />
      </div>
      <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] bg-background/70 backdrop-blur text-primary border border-primary/30">
        {labels.a}
      </div>
      <div className="absolute top-3 right-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] bg-background/70 backdrop-blur text-primary border border-primary/30">
        {labels.b}
      </div>
      <div
        className="absolute inset-y-0 w-px bg-primary/90 shadow-[0_0_20px_rgba(212,175,90,0.7)]"
        style={{ left: `${pos}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl transition group-hover:scale-110"
        style={{ left: `${pos}%` }}
      >
        <ArrowRight className="w-4 h-4 -rotate-180" />
        <ArrowRight className="w-4 h-4 absolute" />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — LOMA Clinic & Beauty Hair" },
      {
        name: "description",
        content: "Resultados premium, antes & depois e ambiente do salão Loma.",
      },
      { property: "og:title", content: "Galeria — Loma" },
      { property: "og:description", content: "Resultados que falam por si." },
      { property: "og:image", content: g2 },
      { property: "og:url", content: "https://lomaexperience.com/galeria" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/galeria" }],
  }),
  component: Galeria,
});

const all = [
  { src: p2, cat: "team" },
  { src: p1, cat: "team" },
  { src: g1, cat: "before" },
  { src: g2, cat: "before" },
  { src: g3, cat: "before" },
  { src: p3, cat: "before" },
  { src: p4, cat: "before" },
  { src: p5, cat: "before" },
  { src: p6, cat: "before" },
  { src: p7, cat: "before" },
  { src: p8, cat: "before" },
  { src: p9, cat: "before" },
  { src: g4, cat: "salon" },
  { src: g5, cat: "salon" },
  { src: g6, cat: "salon" },
  { src: p10, cat: "salon" },
  { src: p11, cat: "salon" },
  { src: sCut, cat: "before" },
  { src: sColor, cat: "before" },
  { src: sSmooth, cat: "before" },
];

function Galeria() {
  const { t, i18n } = useTranslation();
  const isPT = !i18n.language?.startsWith("en");
  const tabs = t("gallery.tabs", { returnObjects: true }) as Record<string, string>;
  const [tab, setTab] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const list = tab === "all" ? all : all.filter((a) => a.cat === tab);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading eyebrow={t("gallery.eyebrow")} title={t("gallery.title")} />
        <div className="mt-12 flex justify-center gap-2 flex-wrap">
          {Object.entries(tabs).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] border transition ${tab === k ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}
            >
              {l}
            </button>
          ))}
        </div>

        {tab === "before" ? (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {BEFORE_AFTER.map((ba, i) => (
              <Reveal key={i} delay={i * 100}>
                <BeforeAfter
                  a={ba.a}
                  b={ba.b}
                  labels={{ a: isPT ? "Antes" : "Before", b: isPT ? "Depois" : "After" }}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
            {list.map((g, i) => (
              <Reveal key={i} delay={i * 40}>
                <button
                  onClick={() => setLightbox(g.src)}
                  className="block w-full overflow-hidden group"
                >
                  <img
                    src={g.src}
                    alt=""
                    loading="lazy"
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-1000"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-[90vw] object-contain" />
        </div>
      )}
    </section>
  );
}
