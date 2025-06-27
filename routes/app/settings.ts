import { Context, Hono } from "hono";

import * as tmpl from "../../lib/template.ts";
import * as UserTable from "../../db/model/user.ts";
import { authorize } from "../../middlewares/authorize.ts";

const app = new Hono();

app.get("/", authorize, async (c: Context) => {
  const session = c.get("session");
  const userId = session.get("userId");
  const user = await UserTable.findByUserId(userId);
  const template = await tmpl.renderSessionApp(user, "settings", {
  });

  c.res.headers.append("HX-Redirect", "/app/settings");

  return c.html(template.content);
});

export default app;
