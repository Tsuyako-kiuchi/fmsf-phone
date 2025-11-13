export const onRequest: PagesFunction = async ({ request, env, next }) => {
  const auth = request.headers.get("Authorization") || "";
  const [, encoded] = auth.split(" ");
  const [u, p] = atob(encoded || ":").split(":");
  if (u === env.BASIC_USER && p === env.BASIC_PASSWORD) return next();
  return new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Restricted"' },
  });
};
