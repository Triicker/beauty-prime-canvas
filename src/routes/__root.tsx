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

const CartDrawer = lazy(() => import("@/components/CartDrawer").then((m) => ({ default: m.CartDrawer })));

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow mb-4">404</div>
        <h1 className="font-display text-5xl text-foreground">Página não encontrada</h1>
        <p className="mt-3 text-sm text-muted-foreground">A página que procura não existe.</p>
        <Link to="/" className="mt-8 inline-flex items-center px-6 h-11 text-[12px] uppercase tracking-[0.25em] border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition">
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
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center px-6 h-11 text-[12px] uppercase tracking-[0.25em] bg-primary text-primary-foreground"
        >Tentar de novo</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Loma Clinic & Beauty Spa — Cabelo, estética & bem-estar" },
      { name: "description", content: "Salão premium de beleza e bem-estar capilar. Corte, coloração, tratamentos e boutique de produtos exclusivos." },
      { property: "og:title", content: "Loma Clinic & Beauty Spa — Cabelo, estética & bem-estar" },
      { property: "og:description", content: "Salão premium de beleza e bem-estar capilar. Corte, coloração, tratamentos e boutique de produtos exclusivos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Loma Clinic & Beauty Spa — Cabelo, estética & bem-estar" },
      { name: "twitter:description", content: "Salão premium de beleza e bem-estar capilar. Corte, coloração, tratamentos e boutique de produtos exclusivos." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9871d777-fe3c-4829-8525-c334b9b72196/id-preview-1fdcbf69--928dd961-6dc3-4f08-a62f-8edcff1707e6.lovable.app-1778599521676.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9871d777-fe3c-4829-8525-c334b9b72196/id-preview-1fdcbf69--928dd961-6dc3-4f08-a62f-8edcff1707e6.lovable.app-1778599521676.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap" },
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
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
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
      <Suspense fallback={null}><CartDrawer /></Suspense>
    </QueryClientProvider>
  );
}
