// /functions/logout.js
export const onRequestGet = async (context) => {
  const headers = new Headers({
    // 期限切れでCookie削除
    'Set-Cookie': 'pin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    'Location': '/login',
  });
  return new Response(null, { status: 302, headers });
};
