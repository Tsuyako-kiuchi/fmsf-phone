// functions/hello.js
export const onRequest = () => new Response("Hello from Pages Functions", {
  headers: { "Content-Type": "text/plain; charset=utf-8" }
});
