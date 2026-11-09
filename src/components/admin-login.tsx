"use client";

import { useActionState } from "react";
import { Text, useTranslation } from "./preferences";
import { login, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};
export function AdminLogin() {
  const t = useTranslation();
  const [state, formAction, pending] = useActionState(login, initialState);
  return <form className="contact-form admin-login" action={formAction} aria-busy={pending}>
    <div className="form-row">
      <label htmlFor="admin-password"><Text id="admin_password_label" /></label>
      <input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={200} />
    </div>
    <div aria-live="polite" aria-atomic="true">{state.error && <p className="field-error" role="alert">{t(state.error)}</p>}</div>
    <button type="submit" className="btn btn--outline" disabled={pending}>{pending ? t("admin_signing_in") : t("admin_login_button")}</button>
  </form>;
}
