import { useSyncExternalStore } from "react";

function query() {
  return window.matchMedia("(max-width: 768px)");
}

export function useIsMobile() {
  return useSyncExternalStore(
    (callback) => {
      const q = query();

      q.addEventListener("change", callback);

      return () => q.removeEventListener("change", callback);
    },
    () => query().matches,
    () => false,
  );
}
