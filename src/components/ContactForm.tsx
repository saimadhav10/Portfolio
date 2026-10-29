"use client";
import { useState, useRef, type FormEvent } from "react";
export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const form = useRef<HTMLFormElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const data = new FormData(event.currentTarget);
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Something went wrong. Please try again.",
        );
      setState("sent");
      setMessage("Message sent. Thanks for reaching out — I’ll be in touch.");
      form.current?.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not send your message. Please try again.",
      );
    }
  }
  return (
    <form ref={form} onSubmit={submit} className="contact-form">
      <div className="form-pair">
        <label>
          Your name
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="What should I call you?"
          />
        </label>
        <label>
          Your email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="Where can I reach you?"
          />
        </label>
      </div>
      <label>
        A thought, a project, a hello
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={3}
          placeholder="Tell me what’s on your mind."
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-bottom">
        <p>Your message goes directly to me.</p>
        <button type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p className={`form-status ${state}`} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
