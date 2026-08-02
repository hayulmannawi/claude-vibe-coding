export function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return "belum pernah diubah";

  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "diubah baru saja";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `diubah ${diffMin} menit lalu`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `diubah ${diffHour} jam lalu`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `diubah ${diffDay} hari lalu`;

  const date = new Date(isoString);
  return `diubah ${date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`;
}
