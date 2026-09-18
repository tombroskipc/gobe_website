const DEFAULT_PUBLIC_SITE_URL = "https://gobe.asia";
const DEFAULT_LOCAL_SITE_URL = "http://localhost:3000";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const normalizeUrl = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimTrailingSlash(trimmed) : "";
};

const isLocalUrl = (value: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(value);

export function getPublicSiteUrl() {
  const siteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);

  if (siteUrl) {
    return siteUrl;
  }

  if (process.env.NODE_ENV === "production") {
    return DEFAULT_PUBLIC_SITE_URL;
  }

  const serverUrl = normalizeUrl(process.env.NEXT_PUBLIC_SERVER_URL);

  if (serverUrl && !isLocalUrl(serverUrl)) {
    return serverUrl;
  }

  return serverUrl || DEFAULT_LOCAL_SITE_URL;
}
