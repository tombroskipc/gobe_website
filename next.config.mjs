import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["wage-one-tall-clinton.trycloudflare.com"],
  serverExternalPackages: ["@libsql/client", "@libsql/isomorphic-ws"],
};

export default withPayload(nextConfig);

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
