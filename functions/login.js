const normalizePin = (s) => String(s || '').normalize('NFKC').trim();

export const onRequestPost = async (context) => {
  const formData = await context.request.formData();
  const pinInput = normalizePin(formData.get('pin'));
  const pinEnv   = normalizePin(context.env.SECRET_PIN);

  if (pinInput && pinEnv && pinInput === pinEnv) {
    const headers = new Headers({
      'Set-Cookie': `pin=${encodeURIComponent(pinEnv)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`,
      'Location': '/',
    });
    return new Response(null, { status: 302, headers });
  }

  return new Response('PINが違います。戻ってやり直してください。', {
    status: 401,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
