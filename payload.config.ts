import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { r2Storage } from "@payloadcms/storage-r2";
import { buildConfig, type Config } from "payload";
import { Careers } from "./collections/Careers.ts";
import { Media } from "./collections/Media.ts";
import { News } from "./collections/News.ts";
import { ReusableCtas } from "./collections/ReusableCtas.ts";
import { Users } from "./collections/Users.ts";

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
const STATIC_SITE_URL = process.env.NEXT_PUBLIC_STATIC_SITE_URL || "https://gobe-immersive-3d-static.joe-378.workers.dev";
const R2_CLIENT_HANDLER = "@payloadcms/storage-r2/client#R2ClientUploadHandler";
const LOCAL_R2_NOOP_HANDLER = "@/app/(payload)/admin/R2ClientUploadHandler.tsx#R2ClientUploadHandler";

type PayloadR2Binding = Parameters<typeof r2Storage>[0]["bucket"];
type OpenNextCloudflareEnv = ReturnType<typeof getCloudflareContext>["env"];
type PayloadCloudflareEnv = OpenNextCloudflareEnv & {
  PAYLOAD_DB?: D1Database;
  PAYLOAD_MEDIA?: PayloadR2Binding;
};

const getCloudflareEnv = (): PayloadCloudflareEnv | undefined => {
  try {
    return getCloudflareContext().env as PayloadCloudflareEnv;
  } catch {
    return undefined;
  }
};

const getDatabaseAdapter = () => {
  const env = getCloudflareEnv();

  if (env?.PAYLOAD_DB) {
    return sqliteD1Adapter({
      binding: env.PAYLOAD_DB,
    });
  }

  return sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./payload.db",
    },
  });
};

const getStoragePlugins = () => {
  const env = getCloudflareEnv();

  if (!env?.PAYLOAD_MEDIA) {
    return [];
  }

  return [
    r2Storage({
      bucket: env.PAYLOAD_MEDIA,
      collections: {
        media: true,
      },
    }),
    (incomingConfig: Config): Config => {
      if (incomingConfig.admin?.dependencies?.[R2_CLIENT_HANDLER]) {
        delete incomingConfig.admin.dependencies[R2_CLIENT_HANDLER];
        incomingConfig.admin.dependencies[LOCAL_R2_NOOP_HANDLER] = {
          type: "function",
          path: LOCAL_R2_NOOP_HANDLER,
        };
      }

      const providers = incomingConfig.admin?.components?.providers;

      if (Array.isArray(providers)) {
        for (const provider of providers) {
          if (typeof provider === "object" && provider?.path === R2_CLIENT_HANDLER) {
            provider.path = LOCAL_R2_NOOP_HANDLER;
          }
        }
      }

      return incomingConfig;
    },
  ];
};

export default buildConfig({
  admin: {
    user: Users.slug,
    suppressHydrationWarning: true,
    dependencies: {
      [LOCAL_R2_NOOP_HANDLER]: {
        type: "function",
        path: LOCAL_R2_NOOP_HANDLER,
      },
    },
    meta: {
      defaultOGImageType: "off",
      titleSuffix: "GoBeyond",
    },
  },
  collections: [Users, Media, News, Careers, ReusableCtas],
  cors: [SITE_URL, STATIC_SITE_URL, "http://localhost:3000"],
  globals: [],
  db: getDatabaseAdapter(),
  editor: lexicalEditor({}),
  graphQL: {
    disable: true,
  },
  secret: process.env.PAYLOAD_SECRET || "gobe-local-payload-secret-change-before-production",
  localization: {
    locales: ["en"],
    defaultLocale: "en",
  },
  plugins: [
    ...getStoragePlugins(),
  ],
  typescript: {
    outputFile: "payload-types.ts",
  },
});
