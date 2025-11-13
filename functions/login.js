export const onRequestPost = async (context) => {
  const formData = await context.request.formData();
  const pin = String(formData.get('pin') || '');

  if (pin === context.env.SECRET_PIN) {
    const headers = new Headers({
      'Set-Cookie': `pin=${encodeURIComponent(pin)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`,
      'Location': '/',
    });
    return new Response(null, { status: 302, headers });
  }

  return new Response('PINが違います。戻ってやり直してください。', {
    status: 401,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

// 予防策: login.html が無い場合でもこの簡易フォームを返す
export const onRequestGet = async () => {
  const html = `<!doctype html><meta charset="utf-8"><title>ログイン</title>
  <body style="font-family:sans-serif;padding:2rem;max-width:560px;margin:auto">
    <h1>FMSF 電話帳 ログイン</h1>
    <form method="POST" action="/login">
      <label>PIN: <input type="password" name="pin" required></label>
      <button type="submit">ログイン</button>
    </form>
  </body>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
