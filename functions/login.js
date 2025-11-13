// /functions/login.js
export const onRequestPost = async (context) => {
  const formData = await context.request.formData();
  const pin = String(formData.get('pin') || '');

  if (pin === context.env.SECRET_PIN) {
    // 1日有効なCookieをセット
    const headers = new Headers({
      'Set-Cookie': `pin=${encodeURIComponent(pin)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`,
      'Location': '/',
    });
    return new Response(null, { status: 302, headers });
  }

  return new Response('PINが違います。戻ってやり直してください。', { status: 401, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

// GETで直接 /login に来た場合は login.html を返す（念のため）
export const onRequestGet = async (context) => {
  return context.next();
};
