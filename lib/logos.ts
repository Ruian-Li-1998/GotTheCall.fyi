import { BRAND_DOMAINS } from "@/lib/constants";

/**
 * Build a logo.dev image URL for a brand, or return null when there's no token
 * or no known domain — in which case the UI falls back to the watch icon.
 *
 * Uses the publishable token (NEXT_PUBLIC_LOGO_DEV_TOKEN); only the publishable
 * key works with img.logo.dev, and it is safe to expose client-side.
 */
export function brandLogoUrl(brand: string, size = 80): string | null {
  const token = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
  const domain = BRAND_DOMAINS[brand];
  if (!token || !domain) return null;
  const params = new URLSearchParams({
    token,
    format: "png",
    size: String(size),
    retina: "true",
  });
  return `https://img.logo.dev/${domain}?${params.toString()}`;
}
