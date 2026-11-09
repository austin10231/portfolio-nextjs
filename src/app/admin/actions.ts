"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, adminSecrets, createLoginGuard, createSessionToken, verifyAdminPassword } from "@/lib/admin-auth";

const guard = createLoginGuard();

export type LoginState = { error?: string };

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const secrets = adminSecrets();
  if (!secrets) return { error: "admin_unavailable" };
  if (guard.isLocked()) return { error: "admin_locked" };
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminPassword(password, secrets)) {
    guard.registerFailure();
    return { error: "admin_wrong_password" };
  }
  guard.reset();
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, createSessionToken(secrets), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  // Cookie mutation re-renders /admin, which now renders the submissions table.
  redirect("/admin");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin");
}
