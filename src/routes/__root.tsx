import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

import appCss from "../styles.css?url";
import "../i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const CartDrawer = lazy(() =>
  import("@/components/CartDrawer").then((m) => ({ default: m.CartDrawer })),
);

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow mb-4">404</div>
        <h1 className="font-display text-5xl text-foreground">Página não encontrada</h1>
        <p className="mt-3 text-sm text-muted-foreground">A página que procura não existe.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center px-6 h-11 text-[12px] uppercase tracking-[0.25em] border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-foreground">Algo correu mal</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente em instantes.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-flex items-center px-6 h-11 text-[12px] uppercase tracking-[0.25em] bg-primary text-primary-foreground"
        >
          Tentar de novo
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LOMA Clinic & Beauty Hair — Cabelo, estética & bem-estar" },
      {
        name: "description",
        content:
          "Salão premium de beleza e bem-estar capilar em Santa Cruz, Torres Vedras. Corte, coloração, tratamentos e boutique de produtos exclusivos.",
      },
      { property: "og:title", content: "LOMA Clinic & Beauty Hair — Cabelo, estética & bem-estar" },
      {
        property: "og:description",
        content:
          "Salão premium de beleza e bem-estar capilar em Santa Cruz, Torres Vedras. Corte, coloração, tratamentos e boutique de produtos exclusivos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "LOMA Clinic & Beauty Hair — Cabelo, estética & bem-estar",
      },
      {
        name: "twitter:description",
        content:
          "Salão premium de beleza e bem-estar capilar em Santa Cruz, Torres Vedras. Corte, coloração, tratamentos e boutique de produtos exclusivos.",
      },
      { property: "og:image", content: "https://lomaexperience.com/og-loma.png" },
      { name: "twitter:image", content: "https://lomaexperience.com/og-loma.png" },
    ],
    links: [
      { rel: "icon", href: "/favicon.jpg", type: "image/jpeg" },
      { rel: "apple-touch-icon", href: "/favicon.jpg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Quicksand:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "BeautySalon"],
          name: "LOMA Clinic & Beauty Hair",
          url: "https://lomaexperience.com",
          logo: "https://lomaexperience.com/og-loma.png",
          image: "https://lomaexperience.com/og-loma.png",
          description:
            "Salão premium de beleza e bem-estar capilar em Santa Cruz, Torres Vedras. Corte, coloração, tratamentos e boutique de produtos exclusivos.",
          telephone: "+351913016182",
          email: "Lomahairspa@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "R. da Azenha, 6",
            addressLocality: "Silveira",
            postalCode: "2560-474",
            addressRegion: "Torres Vedras",
            addressCountry: "PT",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 39.1267,
            longitude: -9.3892,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              opens: "10:00",
              closes: "20:00",
            },
          ],
          sameAs: [
            "https://www.instagram.com/lomahairspa/",
            "https://web.facebook.com/p/Loma-Clinic-Beauty-Spa-61573543078184/",
          ],
          priceRange: "€€",
          currenciesAccepted: "EUR",
          paymentAccepted: "Cash, Credit Card",
          areaServed: "Torres Vedras",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <HeadContent />
        {/* Restore theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){document.documentElement.classList.remove('theme-dark');})();`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="min-h-screen pt-20">
        <Outlet />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
      <FloatingWhatsApp />
      <CookieBanner />
    </QueryClientProvider>
  );
}
