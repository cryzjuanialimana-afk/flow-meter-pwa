import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="bento p-8 text-center max-w-sm">
        <h1 className="num-display text-6xl text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Esta pantalla no existe.</p>
        <Link to="/" className="mt-5 inline-flex bg-foreground text-background px-5 py-3 rounded-2xl text-sm font-semibold">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="bento p-8 text-center max-w-sm">
        <h1 className="text-lg font-bold">Algo falló</h1>
        <p className="mt-2 text-sm text-muted-foreground">Intenta de nuevo.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-5 bg-primary text-primary-foreground px-5 py-3 rounded-2xl text-sm font-semibold"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#F4F0EA" },
      { title: "GasVecino — Control de consumo comunal" },
      { name: "description", content: "App PWA para el control de consumo de gas comunal del edificio." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
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
      <Outlet />
    </QueryClientProvider>
  );
}
