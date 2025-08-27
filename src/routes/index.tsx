"use client";

import ProfileSwitcher from "@/components/ProfileSwitcher";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return <ProfileSwitcher />;
}
