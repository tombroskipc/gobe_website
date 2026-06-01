import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";
import type { GenerateTitle, GenerateDescription } from "@payloadcms/plugin-seo/types";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "./collections/Media.ts";
import { News } from "./collections/News.ts";
import { ReusableCtas } from "./collections/ReusableCtas.ts";
import { Users } from "./collections/Users.ts";

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const generateTitle: GenerateTitle = ({ doc }) =>
  doc?.title ? `${doc.title} | GoBeyond` : "GoBeyond";

const generateDescription: GenerateDescription = ({ doc }) =>
  (typeof doc?.excerpt === "string" && doc.excerpt) || "";

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "GoBeyond",
    },
  },
  editor: lexicalEditor(),
  collections: [Users, Media, News, ReusableCtas],
  globals: [],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./payload.db",
    },
  }),
  secret: process.env.PAYLOAD_SECRET || "gobe-local-payload-secret-change-before-production",
  sharp,
  localization: {
    locales: ["en"],
    defaultLocale: "en",
  },
  plugins: [
    seoPlugin({
      collections: ["news"],
      uploadsCollection: "media",
      tabbedUI: true,
      generateTitle,
      generateDescription,
    }),
  ],
  typescript: {
    outputFile: "payload-types.ts",
  },
});
