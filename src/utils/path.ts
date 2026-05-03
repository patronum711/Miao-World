const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function href(path: string): string {
  return `${base}${path}`;
}
