import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "jr_admin_session";

function sessionToken() {
  return createHash("sha256").update(process.env.ADMIN_PASSWORD ?? "").digest("hex");
}

export function checkPassword(password: string) {
  return password.length > 0 && password === process.env.ADMIN_PASSWORD;
}

export async function isAdminAuthed() {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === sessionToken();
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
