import * as yup from "yup";

const bookingDateField = yup
  .string()
  .trim()
  .required("Booking date is required")
  .matches(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date")
  .test("not-in-past", "Date cannot be in the past", (value) => {
    if (!value) return false;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!m) return false;
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    const chosen = new Date(y, mo, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    chosen.setHours(0, 0, 0, 0);
    return chosen >= today;
  });

const rentalFields = {
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  bookingDate: bookingDateField,
  comment: yup.string().strip(),
} as const;

export const rentalFormValuesSchema = yup.object({
  name: rentalFields.name,
  email: rentalFields.email,
  bookingDate: rentalFields.bookingDate,
  comment: rentalFields.comment,
});

export const rentalPostBodySchema = yup.object({
  carId: yup.string().trim().required("carId is required"),
  name: rentalFields.name,
  email: rentalFields.email,
  bookingDate: rentalFields.bookingDate,
  comment: rentalFields.comment,
});

export type RentalFormValues = {
  name: string;
  email: string;
  bookingDate: string;
  comment: string;
};

export type RentalPostBody = yup.InferType<typeof rentalPostBodySchema>;
