import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "./index";

export const Route = createFileRoute("/shanhaijing")({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  ),
});
