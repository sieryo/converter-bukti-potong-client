import { useEffect } from "react";
import { useBlocker } from "@tanstack/react-router";

/**
 * Hook untuk mencegah navigasi (refresh, back, forward, link TanStack Router)
 * ketika ada data yang belum disimpan.
 *
 * @param shouldBlock boolean → true jika perlu blokir
 * @param message pesan konfirmasi (optional)
 */
export function usePreventNavigation(shouldBlock: boolean, message?: string) {
  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldBlock]);

  useBlocker(() => {
    if (shouldBlock) {
      return !window.confirm(message ?? "Perubahan belum disimpan. Yakin mau keluar?");
    }
    return false;
  }, [shouldBlock, message]);
}
