const DYNAMIC_ORIGIN = "https://gobe-immersive-3d.joe-378.workers.dev";
const dynamicDetailRoute = /^\/(?:tin-tuc|hoat-dong|tuyen-dung)\/[^/]+\/?$/;
const dynamicAppRoute = /^\/(?:admin|api|graphql|graphql-playground|preview)(?:\/.*)?$/;

export default {
  fetch(request, env) {
    const url = new URL(request.url);

    if (dynamicDetailRoute.test(url.pathname) || dynamicAppRoute.test(url.pathname)) {
      return Response.redirect(`${DYNAMIC_ORIGIN}${url.pathname}${url.search}`, 302);
    }

    return env.ASSETS.fetch(request);
  },
};
