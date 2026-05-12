import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import sCut from "@/assets/service-cut.jpg";
import sColor from "@/assets/service-color.jpg";
import sSmooth from "@/assets/service-smoothing.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — Loma Clinic & Beauty Spa" },
      { name: "description", content: "Resultados premium, antes & depois e ambiente do salão Loma." },
      { property: "og:title", content: "Galeria — Loma" },
      { property: "og:description", content: "Resultados que falam por si." },
      { property: "og:image", content: g2 },
    ],
  }),
  component: Galeria,
});

const all = [
  { src: g1, cat: "before" },
  { src: g2, cat: "before" },
  { src: g3, cat: "before" },
  { src: g4, cat: "salon" },
  { src: g5, cat: "before" },
  { src: g6, cat: "salon" },
  { src: sCut, cat: "before" },
  { src: sColor, cat: "before" },
  { src: sSmooth, cat: "before" },
];

function Galeria() {
  const { t } = useTranslation();
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
            <button key={k} onClick={() => setTab(k)} className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] border transition ${tab === k ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}>{l}</button>
          ))}
        </div>
        <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
          {list.map((g, i) => (
            <Reveal key={i} delay={i * 40}>
              <button onClick={() => setLightbox(g.src)} className="block w-full overflow-hidden group">
                <img src={g.src} alt="" loading="lazy" className="w-full h-auto group-hover:scale-105 transition-transform duration-1000" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-[90vw] object-contain" />
        </div>
      )}
    </section>
  );
}
