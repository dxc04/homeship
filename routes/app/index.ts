import { Context, Hono } from "hono";
import * as tmpl from "../../lib/template.ts";
import * as UserTable from "../../db/model/users.ts";
import profile from "./profile.ts";

const app = new Hono();

app.use("*", async (c: Context, next) => {
  const session = c.get("session");
  const userId = session.get("userId");

  if (!userId) {
    c.res.headers.append("HX-Location", "/login");
    c.status(401);
    return c.res;
  }

  await next();
});

app.get("/", async (c: Context) => {
  const session = c.get("session");
  const userId = session.get("userId");
  const user = await UserTable.findByUserId(userId);
  const template = await tmpl.renderSessionApp(user);

  return c.html(template.content);
});

app.post("/logout", (c: Context) => {
  const session = c.get("session");
  session.set("userId", null);

  c.res.headers.append("HX-Redirect", "/");
  return c.res;
});

app.route("/profile", profile);

export default app;
