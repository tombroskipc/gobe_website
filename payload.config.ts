import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "./collections/Media.ts";
import { News } from "./collections/News.ts";
import { Users } from "./collections/Users.ts";

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, News],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./payload.db",
    },
  }),
  secret: process.env.PAYLOAD_SECRET || "gobe-local-payload-secret-change-before-production",
  sharp,
  typescript: {
    outputFile: "payload-types.ts",
  },
});
