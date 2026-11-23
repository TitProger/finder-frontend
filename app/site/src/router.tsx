import { useSyncExternalStore, type ReactNode } from "react";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function navigate(to: string) {
  if (window.location.pathname === to) {
    return;
  }

  window.history.pushState({}, "", to);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

export function usePath(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => "/",
  );
}

export function Link({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  return (
    <a
      className={className}
      href={to}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
          return;
        }

        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
