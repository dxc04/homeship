import { Context, Hono } from "hono";
import * as tmpl from "../../lib/template.ts";
import * as UserTable from "../../db/model/user.ts";
import profile from "./profile.ts";
import settings from "./settings.ts";
import { authorize } from "../../middlewares/authorize.ts";

const app = new Hono();

app.get("/", authorize, async (c: Context) => {
  const session = c.get("session");
  const userId = session.get("userId");
  const user = await UserTable.findByUserId(userId);
  const template = await tmpl.renderSessionApp(user);

  return c.html(template.content);
});

app.post("/logout", authorize, (c: Context) => {
  const session = c.get("session");
  session.set("userId", null);

  c.res.headers.append("HX-Redirect", "/");
  return c.res;
});

app.route("/profile", profile);
app.route("/settings", settings);

export default app;
