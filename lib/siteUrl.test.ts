import assert from "node:assert/strict";
import test from "node:test";
import { getPublicSiteUrl } from "./siteUrl.ts";

const env = process.env as Record<string, string | undefined>;

const ORIGINAL_ENV = {
  NEXT_PUBLIC_SERVER_URL: env.NEXT_PUBLIC_SERVER_URL,
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
  NODE_ENV: env.NODE_ENV,
};

const restoreEnv = () => {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete env[key];
    } else {
      env[key] = value;
    }
  }
};

test.afterEach(restoreEnv);

test("uses the public production domain when server URL is localhost in production", () => {
  delete env.NEXT_PUBLIC_SITE_URL;
  env.NEXT_PUBLIC_SERVER_URL = "http://localhost:3000";
  env.NODE_ENV = "production";

  assert.equal(getPublicSiteUrl(), "https://gobe.asia");
});

test("keeps localhost preview URLs available in local development", () => {
  delete env.NEXT_PUBLIC_SITE_URL;
  env.NEXT_PUBLIC_SERVER_URL = "http://localhost:3000";
  env.NODE_ENV = "development";

  assert.equal(getPublicSiteUrl(), "http://localhost:3000");
});

test("prefers the explicit public site URL when it is configured", () => {
  env.NEXT_PUBLIC_SITE_URL = "https://gobe.asia/";
  env.NEXT_PUBLIC_SERVER_URL = "http://localhost:3000";
  env.NODE_ENV = "production";

  assert.equal(getPublicSiteUrl(), "https://gobe.asia");
});
