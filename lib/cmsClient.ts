const cmsAssetOrigin = process.env.NEXT_PUBLIC_CMS_ASSET_ORIGIN;

export function normalizeCmsAssetUrl(url: string | null) {
  if (!url) {
    return null;
  }

  if (!url.startsWith("/")) {
    return url;
  }

  return cmsAssetOrigin ? `${cmsAssetOrigin}${url}` : url;
}
