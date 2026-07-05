"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { sendContactMessage } from "@/lib/portfolio-api";

type FormState = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");

    const formData = new FormData(event.currentTarget);

    try {
      await sendContactMessage({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? ""),
      });
      event.currentTarget.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="surface grid gap-4 rounded-lg p-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-white">
          Name
          <input
            className="focus-ring min-h-12 rounded-md border border-white/10 bg-navy-950 px-3 text-white placeholder:text-slate-500"
            name="name"
            placeholder="Your name"
            required
            type="text"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-white">
          Email
          <input
            className="focus-ring min-h-12 rounded-md border border-white/10 bg-navy-950 px-3 text-white placeholder:text-slate-500"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-white">
        Subject
        <input
          className="focus-ring min-h-12 rounded-md border border-white/10 bg-navy-950 px-3 text-white placeholder:text-slate-500"
          name="subject"
          placeholder="Scholarship interview or project discussion"
          required
          type="text"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-white">
        Message
        <textarea
          className="focus-ring min-h-36 resize-y rounded-md border border-white/10 bg-navy-950 px-3 py-3 text-white placeholder:text-slate-500"
          name="message"
          placeholder="Tell me what you would like to discuss."
          required
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-h-6 text-sm text-slate-300" role="status">
          {state === "sent" ? "Message sent successfully." : null}
          {state === "error" ? "The API is not available right now. Please email directly." : null}
        </p>
        <button
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-electric-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-electric-600 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={state === "sending"}
          type="submit"
        >
          <Send className="h-4 w-4" />
          <span>{state === "sending" ? "Sending" : "Send Message"}</span>
        </button>
      </div>
    </form>
  );
}
