import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

// Pathless layout: wraps every page with the bottom nav shell.
export const Route = createFileRoute("/_layout" as never)({
  component: AppShell,
});
