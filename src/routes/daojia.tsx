import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LangProvider, SiteHeader, SiteFooter } from "./index";

export const Route = createFileRoute("/daojia")({
  component: () => (
    <LangProvider>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1">
          <Outlet />
        </div>
        <SiteFooter />
      </div>
    </LangProvider>
  ),
});
