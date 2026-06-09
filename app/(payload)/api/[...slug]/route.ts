import config from "@payload-config";
import { handleEndpoints } from "payload";
import { formatAdminURL } from "payload/shared";

type RouteArgs = {
  params: Promise<{
    slug?: string[];
  }>;
};

const REST = async (request: Request, args: RouteArgs) => {
  const awaitedConfig = await config;
  const awaitedParams = await args.params;

  return handleEndpoints({
    config,
    path: formatAdminURL({
      apiRoute: awaitedConfig.routes.api,
      path: awaitedParams?.slug
        ? `/${awaitedParams.slug.map((segment) => encodeURIComponent(segment)).join("/")}`
        : undefined,
    }),
    request,
  });
};

export const GET = REST;
export const POST = REST;
export const DELETE = REST;
export const PATCH = REST;
export const PUT = REST;
export const OPTIONS = REST;
