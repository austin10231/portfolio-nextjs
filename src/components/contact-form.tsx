"use client";

import { useRef, useState, type FormEvent } from "react";
import { Text, usePreferences, useTranslation } from "./preferences";

const feedback = {
  en: {
    name_length: "Please enter a name between 2 and 80 characters.",
    email_invalid: "Please enter a valid email address (up to 254 characters).",
    message_length: "Please enter a message between 10 and 5,000 characters.",
    service_unavailable: "The contact service is currently unavailable. Please email me directly using the address below.",
    delivery_failed: "Your message could not be sent. Please try again or email me directly.",
    sending: "Sending…", sent: "Thank you! Your message has been sent.",
  },
  zh: {
    name_length: "请输入 2–80 个字符的姓名。",
    email_invalid: "请输入有效的邮箱地址（不超过 254 个字符）。",
    message_length: "请输入 10–5,000 个字符的留言。",
    service_unavailable: "联系服务暂时不可用，请通过下方邮箱直接联系我。",
    delivery_failed: "留言发送失败，请重试或通过邮箱直接联系我。",
    sending: "发送中…", sent: "谢谢！你的留言已发送。",
  },
};
export function ContactForm() {
  const { language } = usePreferences();
  const t = useTranslation();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const copy = feedback[language];
  const message = (key: string) => copy[key as keyof typeof copy] ?? copy.delivery_failed;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    setPending(true); setErrors({}); setStatus("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data)) });
      const result = await response.json();
      if (response.ok && result.ok === true) { setStatus("sent"); form.current?.reset(); }
      else { setErrors(result.errors ?? {}); setStatus(result.error === "validation_failed" ? "" : result.error ?? "delivery_failed"); }
    } catch { setStatus("delivery_failed"); }
    finally { setPending(false); }
  };

  return <form ref={form} method="POST" className="contact-form" onSubmit={submit} aria-busy={pending}>
    {(["name", "email", "message"] as const).map(field => <div className="form-row" key={field}>
      <label htmlFor={field}><Text id={`contact_label_${field}`} /></label>
      {field === "message" ? <textarea id={field} name={field} rows={5} minLength={10} maxLength={5000} placeholder={t("contact_ph_message")} required aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `${field}-error` : undefined} />
        : <input id={field} name={field} type={field === "email" ? "email" : "text"} minLength={field === "name" ? 2 : undefined} maxLength={field === "name" ? 80 : 254} autoComplete={field} placeholder={t(`contact_ph_${field}`)} required aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `${field}-error` : undefined} />}
      {errors[field] && <p className="field-error" id={`${field}-error`}>{message(errors[field])}</p>}
    </div>)}
    <div className="form-trap" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" /></div>
    <button type="submit" className="btn btn--outline" disabled={pending}>{pending ? copy.sending : <Text id="contact_button_send" />}</button>
    <div aria-live="polite" aria-atomic="true">{status && <p className={`form-status form-status--${status === "sent" ? "success" : "error"}`} role={status === "sent" ? "status" : "alert"}>{message(status)}</p>}</div>
  </form>;
}
