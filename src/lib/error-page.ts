export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 "DM Sans", sans-serif; background: #f7f3ec; color: #23484a; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-family: "Sora", sans-serif; font-size: 1.25rem; color: #0b2b2e; margin: 0 0 0.5rem; }
      p { color: #5c7575; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 999px; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid rgb(11 43 46 / 0.14); }
      .primary { background: #e8622c; color: #fffdf8; border-color: #e8622c; }
      .secondary { background: #fffdf8; color: #0b2b2e; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
