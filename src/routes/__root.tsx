import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useLiff } from "../hooks/use-liff";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "謝天地的修道丹心 · 國學典籍講演筆記" },
      {
        name: "description",
        content:
          "謝天地的修道丹心：以講演筆記形式重構《山海經》等國學典籍，從地理、動物、植物、醫藥到神話，逐篇解構華夏先民的世界觀。",
      },
      { name: "author", content: "謝天地的修道丹心" },
      { property: "og:title", content: "謝天地的修道丹心 · 國學典籍講演筆記" },
      {
        property: "og:description",
        content: "謝天地的修道丹心：以講演筆記形式重構《山海經》等國學典籍，從地理、動物、植物、醫藥到神話，逐篇解構華夏先民的世界觀。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "謝天地的修道丹心 · 國學典籍講演筆記" },
      { name: "twitter:description", content: "謝天地的修道丹心：以講演筆記形式重構《山海經》等國學典籍，從地理、動物、植物、醫藥到神話，逐篇解構華夏先民的世界觀。" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2004a04b-aee4-44f7-ae5f-4339c51e4bd5/id-preview-b1bb4a14--5edc047b-0ed7-47aa-91e1-3eec59f68693.lovable.app-1783745293250.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2004a04b-aee4-44f7-ae5f-4339c51e4bd5/id-preview-b1bb4a14--5edc047b-0ed7-47aa-91e1-3eec59f68693.lovable.app-1783745293250.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700&family=Ma+Shan+Zheng&display=swap",
      },
    ],
    scripts: [
      {
        src: "https://d.line-scdn.net/liff/edge/2/sdk.js",
        async: true,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
  const { isInitialized, isInLineApp, profile, error } = useLiff();

  useEffect(() => {
    if (isInitialized) {
      console.log('[ROOT] LIFF Status:', {
        isInLineApp,
        hasProfile: !!profile,
        error: error?.message,
      });
    }
  }, [isInitialized, isInLineApp, profile, error]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* LIFF Status Debug Banner (remove in production) */}
      {process.env.NODE_ENV === 'development' && isInitialized && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-2 rounded text-xs max-w-xs">
          <div>LIFF: {isInLineApp ? '✓ In LINE' : '✗ Not in LINE'}</div>
          {profile && <div>User: {profile.displayName}</div>}
          {error && <div className="text-red-400">Error: {error.message}</div>}
        </div>
      )}
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
