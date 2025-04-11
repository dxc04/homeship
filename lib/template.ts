import vento from "ventojs";
import { User } from "../db/schema/users.ts";

const vto = vento();
const navLinks = [
  {
    group: "",
    links: [
      { name: "Dashboard", icon: "dashboard" },
    ],
  },
  {
    group: "Community",
    links: [
      { name: "Topics", icon: "message-board" },
      { name: "Petitions", icon: "requests" },
    ],
  },
  {
    group: "Manage",
    links: [
      { name: "Members", icon: "members" },
      { name: "Violations", icon: "violations" },
      { name: "Documents", icon: "documents" },
      { name: "Events", icon: "events" },
      { name: "Work Permits", icon: "work-permits" },
    ],
  },
  {
    group: "Financials",
    links: [
      { name: "Billing", icon: "billing" },
      { name: "Reports", icon: "reports" },
    ],
  },
];

const appTitle = Deno.env.get("APP_TITLE");
const appName = Deno.env.get("APP_NAME");

export const renderSessionApp = async (
  user: User,
  page: string = "index",
  params: { [key: string]: unknown } = {},
) => {
  page = "./views/pages/app/" + page + ".vto";

  vto.cache.clear();
  return await vto.run(page, {
    title: appTitle,
    navLinks,
    appName,
    user,
    ...params,
  });
};

export const renderFormPartial = async (
  page: string,
  params: { [key: string]: unknown } = {},
) => {
  page = "./views/partials/" + page + ".vto";

  vto.cache.clear();
  return await vto.run(page, {
    ...params,
  });
};

const renderAlert = async (
  message: string,
  type: string,
  iconDraw: string,
  headers: Headers,
) => {
  await headers.append(
    "HX-Trigger",
    '{"show-alert":{"type" : "' + type + '", "message" : "' + message +
      '", "iconDraw": "' + iconDraw + '"}}',
  );
};

export const renderAlertSuccess = async (message: string, headers: Headers) => {
  await renderAlert(
    message,
    "success",
    "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    headers,
  );
};

export const renderAlertWarning = async (message: string, headers: Headers) => {
  await renderAlert(
    message,
    "warning",
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    headers,
  );
};

export const renderAlertError = async (message: string, headers: Headers) => {
  await renderAlert(
    message,
    "error",
    "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    headers,
  );
};

export const renderAlertInfo = async (message: string, headers: Headers) => {
  await renderAlert(
    message,
    "info",
    "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    headers,
  );
};
