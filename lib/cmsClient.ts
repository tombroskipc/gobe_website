export const cmsOrigin = process.env.NEXT_PUBLIC_CMS_API_ORIGIN || "";
const cmsAssetOrigin = process.env.NEXT_PUBLIC_CMS_ASSET_ORIGIN;

type PayloadListResponse<T> = {
  docs?: T[];
};

export function cmsPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return cmsOrigin ? `${cmsOrigin}${normalizedPath}` : normalizedPath;
}

export function getPayloadCollectionUrl(collection: string, params: Record<string, string | number>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, String(value));
  }

  return cmsPath(`/api/${collection}?${searchParams.toString()}`);
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

  const payloadMediaPrefix = "/api/media/file/";

  if (!cmsAssetOrigin && url.startsWith(payloadMediaPrefix)) {
    return `/media/${url.slice(payloadMediaPrefix.length)}`;
  }

  if (!url.startsWith("/")) {
    return url;
  }

  return cmsAssetOrigin ? `${cmsAssetOrigin}${url}` : url;
}
