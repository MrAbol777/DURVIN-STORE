export function getSafeNext(value: unknown, fallback = "/account") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/admin")) return fallback;
  try {
    const url = new URL(value, "https://durvin-store.local");
    return url.origin === "https://durvin-store.local" ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch {
    return fallback;
  }
}
