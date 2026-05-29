import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["wage-one-tall-clinton.trycloudflare.com"],
};

export default withPayload(nextConfig);
