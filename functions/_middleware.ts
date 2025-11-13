export const onRequest: PagesFunction = async ({ request, env, next }) => {
  const unauthorized = () =>
    new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Restricted"' },
    });

  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Basic ")) return unauthorized();

  const encoded = auth.slice(6); // "Basic "を除去
  let u = "", p = "";
  try {
    [u, p] = atob(encoded).split(":");
  } catch {
    return unauthorized(); // 壊れたBase64の場合
  }

  if (u === env.BASIC_USER && p === env.BASIC_PASSWORD) {
    return next();
  }
  return unauthorized();
};
