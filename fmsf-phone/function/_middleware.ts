// functions/_middleware.ts
export const onRequest: PagesFunction = async ({ request, env, next }) => {
  const user = env.BASIC_USER;
  const pass = env.BASIC_PASSWORD;

  if (!user || !pass) {
    return new Response("Auth not configured", { status: 500 });
  }

  const auth = request.headers.get("Authorization") || "";
  const expected = "Basic " + btoa(`${user}:${pass}`);

  if (auth !== expected) {
    return new Response("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Restricted"' },
    });
  }

  const res = await next();
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  headers.set("Pragma", "no-cache");
  return new Response(res.body, { status: res.status, headers });
};