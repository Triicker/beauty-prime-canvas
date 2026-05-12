export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
      {eyebrow && <div className="eyebrow mb-4">{eyebrow}</div>}
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-foreground whitespace-pre-line">
        {title}
      </h2>
    </div>
  );
}
