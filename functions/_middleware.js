export const onRequest = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  const passThrough =
    path.startsWith('/login') ||
    path.startsWith('/logout') ||
    path.startsWith('/favicon') ||
    path.startsWith('/assets') ||
    /\.(css|js|png|jpg|jpeg|gif|svg|ico|txt|map)$/i.test(path);

  if (passThrough) return context.next();

  const cookie = context.request.headers.get('Cookie') || '';
  const pinCookie = cookie.split(';').map(v => v.trim()).find(v => v.startsWith('pin='));
  const stored = pinCookie ? decodeURIComponent(pinCookie.split('=')[1]) : null;

  if (stored && stored === context.env.SECRET_PIN) {
    return context.next();
  }

  return Response.redirect(new URL('/login', url), 302);
};
