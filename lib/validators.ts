import { z } from "zod";
import * as User from "../db/model/users.ts";

const invalid_type_error = "Invalid type provided for this field";
const required_error = "This field cannot be blank";

export const extractFormErrors = (error: z.ZodError) => {
  return error.issues.reduce((acc, issue: z.ZodIssue) => {
    acc[issue.path[0]] = issue.message;
    return acc;
  }, {} as { [key: string]: string });
};

export const registerFormSchema = z.object({
  first_name: z.string({ invalid_type_error, required_error }).nonempty(
    "First name is required",
  ),
  last_name: z.string({ invalid_type_error, required_error }).nonempty(
    "Last name is required",
  ),
  email: z
    .string({ invalid_type_error, required_error })
    .email("Please provide a valid email")
    .min(1, "Value is too short")
    .refine(
      async (email: string) => {
        const user = await User.findUserByEmail(email);
        return !user;
      },
      {
        message: "Email already in use!",
      },
    ),
  password: z.string({ invalid_type_error, required_error }).nonempty().min(
    6,
    "Password is too short",
  ),
  confirm_password: z.string({ invalid_type_error, required_error }).nonempty(),
}).refine(
  (data: { password: string; confirm_password: string }) =>
    data.password === data.confirm_password,
  {
    message: "Passwords do not match",
    path: ["confirm_password"],
  },
);

export const loginFormSchema = z.object({
  email: z
    .string({ invalid_type_error, required_error })
    .email("Please provide a valid email")
    .nonempty("Email is required"),
  password: z.string({ invalid_type_error, required_error }).nonempty("Password is required"),
});
