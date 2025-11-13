export const onRequestGet = async () => {
  const headers = new Headers({
    'Set-Cookie': 'pin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    'Location': '/login',
  });
  return new Response(null, { status: 302, headers });
};
