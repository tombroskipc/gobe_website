export const cmsOrigin =
  process.env.NEXT_PUBLIC_CMS_API_ORIGIN ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://gobe-immersive-3d.joe-378.workers.dev";

type PayloadListResponse<T> = {
  docs?: T[];
};

export function cmsPath(path: string) {
  return `${cmsOrigin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getPayloadCollectionUrl(collection: string, params: Record<string, string | number>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, String(value));
  }

  return `${cmsOrigin}/api/${collection}?${searchParams.toString()}`;
}

export async function fetchPayloadDocs<T>(collection: string, params: Record<string, string | number>) {
  const response = await fetch(getPayloadCollectionUrl(collection, params), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Payload ${collection} request failed: ${response.status}`);
  }

  const data = (await response.json()) as PayloadListResponse<T>;
  return Array.isArray(data.docs) ? data.docs : [];
}

export function normalizeCmsAssetUrl(url: string | null) {
  if (!url) {
    return null;
  }

  return url.startsWith("/") ? cmsPath(url) : url;
}
