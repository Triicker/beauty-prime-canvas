import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — LOMA Clinic & Beauty Hair" },
      {
        name: "description",
        content:
          "Perguntas frequentes sobre serviços, agendamentos, loiros, extensões, Head Spa e muito mais na LOMA em Torres Vedras.",
      },
      { property: "og:title", content: "FAQ — LOMA Clinic & Beauty Hair" },
      {
        property: "og:description",
        content: "Tudo o que precisa de saber sobre a LOMA Clinic & Beauty Hair.",
      },
      { property: "og:url", content: "https://lomaexperience.com/faq" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/faq" }],
  }),
  component: FAQ,
});

function FAQ() {
  const { t } = useTranslation();
  const sections = t("faq.sections", { returnObjects: true }) as {
    title: string;
    items: { q: string; a: string }[];
  }[];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
        </Reveal>

        <div className="mt-16 space-y-14">
          {sections.map((section, si) => (
            <Reveal key={section.title} delay={si * 60}>
              <div>
                <h2 className="font-display text-2xl md:text-3xl mb-6 text-gradient-gold">
                  {section.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.items.map((item, ii) => (
                    <AccordionItem
                      key={ii}
                      value={`${si}-${ii}`}
                      className="border border-border px-6 data-[state=open]:border-primary/40 transition-colors"
                    >
                      <AccordionTrigger className="text-left text-sm font-medium tracking-wide py-5 hover:text-primary hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
