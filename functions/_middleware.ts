// functions/_middleware.ts
export const onRequest: PagesFunction = async ({ request, env, next }) => {
  const url = new URL(request.url);

  // 既に認証済みか（クッキー）
  const cookie = request.headers.get("Cookie") || "";
  const authed = /pin_ok=1/.test(cookie);

  // PIN送信（/pin に POST）
  if (url.pathname === "/pin" && request.method === "POST") {
    const form = await request.formData();
    const pin = String(form.get("pin") || "");
    if (pin && env.PIN_CODE && pin === env.PIN_CODE) {
      const res = new Response(null, { status: 302, headers: { Location: "/" } });
      res.headers.append("Set-Cookie", "pin_ok=1; Path=/; HttpOnly; Max-Age=2592000; SameSite=Lax");
      return res;
    }
    return new Response(renderForm("PINが違います"), { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  // 未認証ならフォームを表示
  if (!authed) {
    return new Response(renderForm(), { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  // 認証済みは通常処理へ
  return next();
};

function renderForm(message = ""): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PIN ロック</title></head>
<body style="font-family:sans-serif;max-width:520px;margin:40px auto">
  <h1>PIN入力</h1>
  ${message ? `<p style="color:#c00">${message}</p>` : ""}
  <form method="POST" action="/pin">
    <input type="password" name="pin" placeholder="PIN" autofocus style="padding:.6em;font-size:16px">
    <button type="submit" style="padding:.6em 1em;font-size:16px">送信</button>
  </form>
</body></html>`;
}
