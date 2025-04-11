import { Context, Hono } from "hono";
import {
  editPasswordFormSchema,
  editProfileFormSchema,
  extractFormErrors,
} from "../../lib/validators.ts";
import { zValidator } from "@hono/zod-validator";
import * as tmpl from "../../lib/template.ts";
import * as UserTable from "../../db/model/users.ts";

const app = new Hono();

app.get("/", async (c: Context) => {
  const session = c.get("session");
  const userId = session.get("userId");
  const user = await UserTable.findByUserId(userId);
  const template = await tmpl.renderSessionApp(user, "profile", {
    data: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
  });

  c.res.headers.append("HX-Redirect", "/app/profile");

  return c.html(template.content);
});

app.post(
  "/edit-profile",
  zValidator(
    "form",
    editProfileFormSchema,
    async (result, c: Context) => {
      const formData = await c.req.formData();
      const errors = !result.success ? extractFormErrors(result.error) : {};

      if (result.success) {
        const user = await UserTable.findUserByEmail(
          formData.get("email") as string,
        );
        user.first_name = result.data.first_name;
        user.last_name = result.data.last_name;
        await UserTable.update(user);

        await tmpl.renderAlertSuccess(
          "Profile updated successfully!",
          c.res.headers,
        );
      }

      const template = await tmpl.renderFormPartial("edit_profile_form", {
        data: { ...result.data, email: formData.get("email") },
        errors,
      });

      return c.html(template.content);
    },
  ),
);

app.post(
  "/edit-password",
  zValidator(
    "form",
    editPasswordFormSchema,
    async (result, c: Context) => {
      const formData = await c.req.formData();
      const errors = !result.success ? extractFormErrors(result.error) : {};

      if (result.success) {
        const user = await UserTable.findUserByEmail(
          formData.get("email") as string,
        );
        user.password = await UserTable.hashPassword(result.data.new_password);
        await UserTable.update(user);

        await tmpl.renderAlertSuccess(
          "User password updated successfully!",
          c.res.headers,
        );
      }

      const template = await tmpl.renderFormPartial("edit_password_form", {
        data: { ...result.data, email: formData.get("email") },
        errors,
      });

      return c.html(template.content);
    },
  ),
);

export default app;
