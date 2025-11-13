const normalizePin = (s) => String(s ?? '').normalize('NFKC').trim();

export const onRequest = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const passThrough =
    path.startsWith('/login') ||
    path.startsWith('/logout') ||
    path.startsWith('/favicon') ||
    path.startsWith('/assets') ||
    /\.(css|js|png|jpg|jpeg|gif|svg|ico|txt|map)$/i.test(path);

  if (passThrough) return next();

  const cookie = request.headers.get('Cookie') || '';
  const pinCookie = cookie.split(';').map(v => v.trim()).find(v => v.startsWith('pin='));
  const stored = pinCookie ? decodeURIComponent(pinCookie.split('=')[1]) : '';

  if (normalizePin(stored) && normalizePin(stored) === normalizePin(env?.SECRET_PIN)) {
    return next();
  }

  // public/login/index.html を用意している場合はこちら
  return Response.redirect(new URL('/login', request.url), 302);

  // もし public/login.html を使うなら↓に変更
  // return Response.redirect(new URL('/login.html', request.url), 302);
};
