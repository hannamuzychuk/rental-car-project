"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import styles from "./BookingDatePicker.module.css";

const WEEKDAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

function parseIsoLocal(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

function formatIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

type BookingDatePickerProps = {
  name: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
};

export function BookingDatePicker({
  name,
  value,
  onChange,
  disabled,
  placeholder = "Booking date",
  invalid = false,
}: BookingDatePickerProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date());

  const selected = parseIsoLocal(value);

  const formatters = useMemo(
    () => ({
      formatWeekdayName: (weekday: Date) =>
        WEEKDAY_NAMES[weekday.getDay()] ?? "",
    }),
    [],
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el || el.contains(e.target as Node)) return;
      close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const display =
    selected != null
      ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
          selected,
        )
      : null;

  return (
    <div className={styles.field} ref={rootRef}>
      <button
        type="button"
        id={id}
        className={`${styles.trigger} ${invalid ? styles.triggerInvalid : ""}`}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (!open) {
            const s = parseIsoLocal(value);
            setMonth(s ?? new Date());
          }
          setOpen(!open);
        }}
      >
        {display ? (
          display
        ) : (
          <span className={styles.triggerPlaceholder}>{placeholder}</span>
        )}
      </button>
      <input type="hidden" name={name} value={value} readOnly />

      {open && (
        <div className={styles.dropdown} role="presentation">
          <div className={styles.caret} aria-hidden />
          <div
            className={styles.panel}
            role="dialog"
            aria-modal="false"
            aria-label="Booking date calendar"
          >
            <div className={styles.picker}>
              <DayPicker
                mode="single"
                required={false}
                selected={selected ?? undefined}
                onSelect={(d) => {
                  if (d) {
                    onChange(formatIsoLocal(d));
                    close();
                  }
                }}
                month={month}
                onMonthChange={setMonth}
                weekStartsOn={1}
                showOutsideDays
                fixedWeeks
                navLayout="around"
                animate={false}
                formatters={formatters}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
