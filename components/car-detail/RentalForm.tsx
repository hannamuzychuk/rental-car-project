"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "sonner";
import {
  BookingRequestError,
  createBookingRequest,
} from "@/lib/api/cars";
import {
  buildBookingComment,
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
          validateOnChange
          onSubmit={async (
            values,
            { resetForm, setSubmitting, setFieldError, setFieldTouched },
          ) => {
            const toastId = toast.loading("Sending booking…");

            try {
              const { message } = await createBookingRequest(carId, {
                name: values.name,
                email: values.email,
                comment: buildBookingComment(
                  values.bookingDate,
                  values.comment,
                ),
              });
              resetForm();
              toast.success(message, { id: toastId });
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Something went wrong";
              toast.error(message, { id: toastId });

              if (err instanceof BookingRequestError && err.field) {
                setFieldError(err.field, message);
                setFieldTouched(err.field, true, false);
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            isSubmitting,
            values,
            errors,
            touched,
            submitCount,
            setFieldValue,
            setFieldTouched,
          }) => {
            const showEmailError = Boolean(
              errors.email && (touched.email || submitCount > 0),
            );
            const showNameError = Boolean(
              errors.name && (touched.name || submitCount > 0),
            );

            return (
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
                      showNameError ? styles.inputInvalid : ""
                    }`}
                  />
                  {showNameError ? (
                    <p className={styles.fieldError}>{errors.name}</p>
                  ) : null}
                </div>

                <div className={styles.fieldBlock}>
                  <Field
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Email*"
                    disabled={isSubmitting}
                    aria-invalid={showEmailError}
                    aria-describedby={showEmailError ? "email-error" : undefined}
                    className={`${styles.input} ${
                      showEmailError ? styles.inputInvalid : ""
                    }`}
                  />
                  {showEmailError ? (
                    <p id="email-error" className={styles.fieldError}>
                      {errors.email}
                    </p>
                  ) : null}
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
                    placeholder="Booking date"
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
            );
          }}
        </Formik>
      </div>
    </section>
  );
}
