import { useHealth } from "../../../domain/hooks/health/useHealth";

export function SitePage() {
  const health = useHealth();

  let line = "Запрос статуса…";

  if (health.isSuccess) {
    line = health.data.status;
  } else if (health.isError) {
    line = health.error instanceof Error ? health.error.message : "UNKNOWN_ERROR";
  }

  return (
    <main>
      <h1>Finder</h1>
      <p>{line}</p>
    </main>
  );
}
