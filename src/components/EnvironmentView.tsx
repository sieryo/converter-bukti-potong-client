import { ENVIRONMENT, VERSION } from "@/lib/constants";

export default function EnvironmentView() {
  return (
    <div className="fixed bottom-3 right-3 z-40 motion-rise">
      <div className="rounded-full border border-zinc-300/80 bg-zinc-50/90 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500 shadow-sm backdrop-blur-sm">
        {ENVIRONMENT} <span className="mx-1 text-zinc-400">|</span>
        <span className="font-semibold text-zinc-600">{VERSION}</span>
      </div>
    </div>
  );
}
