"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import styles from "./RentalForm.module.css";

type RentalFormProps = {
  carId: string;
  embedded?: boolean;
};

export function RentalForm({ carId, embedded = false }: RentalFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const submit = async () => {
      const res = await fetch("/api/rental", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId,
          name,
          email,
          bookingDate: date,
          comment,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        let message = text || `Request failed: ${res.status}`;
        try {
          const data = JSON.parse(text) as { message?: string };
          if (typeof data.message === "string") message = data.message;
        } catch {
          /* use raw text */
        }
        throw new Error(message);
      }

      setName("");
      setEmail("");
      setDate("");
      setComment("");
    };

    try {
      await toast.promise(submit(), {
        loading: "Sending booking…",
        success: "Booking submitted successfully.",
        error: (err) =>
          err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      className={embedded ? `${styles.wrap} ${styles.embedded}` : styles.wrap}
    >
      <div className={styles.card}>
        <header className={styles.header}>
          <h2 className={styles.title}>Book your car now</h2>
          <p className={styles.supporting}>
            Stay connected! We are always ready to help you.
          </p>
        </header>

        <form onSubmit={onSubmit} className={styles.form} noValidate>
          <div className={styles.fields}>
            <input
              className={styles.input}
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={pending}
            />
            <input
              className={styles.input}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={pending}
            />
            <input
              className={styles.input}
              type="text"
              name="bookingDate"
              placeholder="Booking date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={pending}
            />
            <textarea
              className={styles.textarea}
              name="comment"
              placeholder="Comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={pending}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submit}
              disabled={pending}
            >
              {pending ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
