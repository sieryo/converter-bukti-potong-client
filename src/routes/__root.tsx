import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import EnvironmentView from "@/components/EnvironmentView";



export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster richColors theme="light" position="top-center" />
      <EnvironmentView />

      <Outlet />
    </>
  ),
});
