import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { extractFormErrors, registerFormSchema } from "../lib/validators.ts";
import vento from "ventojs";
import * as User from "../db/model/users.ts";

const app = new Hono();
const vto = vento();
const appName = Deno.env.get("APP_NAME");

app.get("/", async (c) => {
  const template = await vto.run("./views/pages/register.vto", {
    title: `We love ${appName}`,
    appName: appName,
  });

  vto.cache.clear();

  return c.html(template.content);
});

app.post(
  "/",
  zValidator(
    "form",
    registerFormSchema,
    async (result, c: Hono.Context) => {
      vto.cache.clear();
      if (!result.success) {
        const template = await vto.run(
          "./views/partials/register_form.vto",
          { errors: extractFormErrors(result.error), data: result.data },
        );
        return c.html(template.content);
      }
      const data = result.data;
      data.password = await User.hashPassword(data.password);

      User.insert(data);
      c.res.headers.append("HX-Redirect", "/app");
    }
  ),
);

export default app;
