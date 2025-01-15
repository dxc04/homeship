import { Hono } from "hono";
import { serveStatic } from "hono/deno";

import "jsr:@std/dotenv/load";

import appPage from "./routes/app/index.ts";
import registerPage from "./routes/register.ts";
import LoginPage from "./routes/login.ts";
import vento from "ventojs";
import { sessionMiddleware, Session } from "jsr:@jcs224/hono-sessions";
import SessionStore from "./lib/session_store.ts";

const vto = vento();

type SessionDataTypes = {
  'userId': number
}

const app = new Hono<{
  Variables: {
    session: Session<SessionDataTypes>,
  }
}>()

app.use(
  "*",
  sessionMiddleware({
    store: new SessionStore(),
    encryptionKey: "this-is-a-very-secure-and-long-encryption-key",
    expireAfterSeconds: 900,
    cookieOptions: {
      sameSite: 'Lax',
      path: '/',
      httpOnly: true,
    },
  }),
);

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", async (c) => {
  const template = await vto.run("./views/layouts/landing.vto", {
    title: Deno.env.get("APP_TITLE"),
    appName: Deno.env.get("APP_NAME")
  });

  vto.cache.clear();
  return c.html(template.content);
});

app.route("/app", appPage);
app.route("/register", registerPage);
app.route("/login", LoginPage);

Deno.serve(app.fetch);
