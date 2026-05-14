"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "sonner";
import {
  rentalFormValuesSchema,
  type RentalFormValues,
} from "@/lib/rental-validation";
import { BookingDatePicker } from "./BookingDatePicker";
import styles from "./RentalForm.module.css";

type RentalFormProps = {
  carId: string;
  embedded?: boolean;
};

const initialValues: RentalFormValues = {
  name: "",
  email: "",
  bookingDate: "",
  comment: "",
};

export function RentalForm({ carId, embedded = false }: RentalFormProps) {
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

        <Formik<RentalFormValues>
          initialValues={initialValues}
          validationSchema={rentalFormValuesSchema}
          validateOnBlur
          validateOnChange={false}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            const submit = async () => {
              const res = await fetch("/api/rental", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  carId,
                  name: values.name,
                  email: values.email,
                  bookingDate: values.bookingDate,
                  comment: values.comment ?? "",
                }),
              });

              if (!res.ok) {
                const text = await res.text();
                let message = text || `Request failed: ${res.status}`;
                try {
                  const data = JSON.parse(text) as { message?: string };
                  if (typeof data.message === "string") message = data.message;
                } catch {
                }
                throw new Error(message);
              }

              resetForm();
            };

            try {
              await toast.promise(submit(), {
                loading: "Sending booking…",
                success: "Booking submitted successfully.",
                error: (err) =>
                  err instanceof Error ? err.message : "Something went wrong",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, values, errors, touched, setFieldValue, setFieldTouched }) => (
            <Form className={styles.form} noValidate>
              <div className={styles.fields}>
                <div className={styles.fieldBlock}>
                  <Field
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Name*"
                    disabled={isSubmitting}
                    className={`${styles.input} ${
                      touched.name && errors.name ? styles.inputInvalid : ""
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className={styles.fieldError}
                  />
                </div>

                <div className={styles.fieldBlock}>
                  <Field
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email*"
                    disabled={isSubmitting}
                    className={`${styles.input} ${
                      touched.email && errors.email ? styles.inputInvalid : ""
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className={styles.fieldError}
                  />
                </div>

                <div className={styles.fieldBlock}>
                  <BookingDatePicker
                    name="bookingDate"
                    value={values.bookingDate}
                    onChange={(next) => {
                      setFieldValue("bookingDate", next);
                      void setFieldTouched("bookingDate", true);
                    }}
                    disabled={isSubmitting}
                    placeholder="Booking date*"
                    invalid={Boolean(
                      touched.bookingDate && errors.bookingDate,
                    )}
                  />
                  <ErrorMessage
                    name="bookingDate"
                    component="p"
                    className={styles.fieldError}
                  />
                </div>

                <div className={styles.fieldBlock}>
                  <Field
                    as="textarea"
                    name="comment"
                    placeholder="Comment"
                    rows={4}
                    disabled={isSubmitting}
                    className={`${styles.textarea} ${
                      touched.comment && errors.comment
                        ? styles.inputInvalid
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="comment"
                    component="p"
                    className={styles.fieldError}
                  />
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending…" : "Send"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
