"use client";

import { useState, type SubmitEvent } from "react";
import styles from "./RentalForm.module.css";

type RentalFormProps = { carId: string };

export function RentalForm({ carId }: RentalFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setPending(true);
    try {
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
        throw new Error(text || `Request failed: ${res.status}`);
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setDate("");
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h2 className={styles.title}>Book your car</h2>
          <p className={styles.supporting}>
            Complete the form to submit your booking request. Fields marked with *
            are required.
          </p>
        </header>

        {success && (
          <p className={styles.success} role="status">
            Booking submitted successfully.
          </p>
        )}
        {error && <p className={styles.error}>{error}</p>}

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
