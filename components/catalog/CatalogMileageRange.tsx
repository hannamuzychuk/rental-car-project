"use client";

import { useCallback, useId, useRef, useState } from "react";
import styles from "./CatalogFilter.module.css";

type CatalogMileageRangeProps = {
  minMileage: string;
  maxMileage: string;
  disabled?: boolean;
  onChange: (next: { minMileage: string; maxMileage: string }) => void;
};

function onlyDigits(s: string): string {
  return s.replace(/\D/g, "").slice(0, 9);
}

function formatWithCommas(digits: string): string {
  if (!digits) return "";
  const n = Number(digits);
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("en-US");
}

export function CatalogMileageRange({
  minMileage,
  maxMileage,
  disabled,
  onChange,
}: CatalogMileageRangeProps) {
  const minInputId = useId();
  const maxInputId = useId();
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);

  const [minFocused, setMinFocused] = useState(false);
  const [maxFocused, setMaxFocused] = useState(false);
  const [minEdit, setMinEdit] = useState("");
  const [maxEdit, setMaxEdit] = useState("");
  const minTypingRef = useRef(false);
  const maxTypingRef = useRef(false);

  const minDigits = onlyDigits(minMileage);
  const maxDigits = onlyDigits(maxMileage);

  const minDigitsForDisplay = minFocused ? minEdit : minDigits;
  const maxDigitsForDisplay = maxFocused ? maxEdit : maxDigits;
  const minShown = formatWithCommas(minDigitsForDisplay);
  const maxShown = formatWithCommas(maxDigitsForDisplay);

  const commit = useCallback(
    (next: { minMileage?: string; maxMileage?: string }) => {
      onChange({
        minMileage: next.minMileage ?? minMileage,
        maxMileage: next.maxMileage ?? maxMileage,
      });
    },
    [onChange, minMileage, maxMileage],
  );

  const minPrefixDim = !minDigits && !minFocused;
  const maxPrefixDim = !maxDigits && !maxFocused;

  return (
    <div className={styles.mileageBlock}>
      <span className={styles.label}>Car mileage / km</span>
      <div className={styles.mileageShell}>
        <div className={styles.mileagePair}>
          <label
            className={`${styles.mileageCell} ${styles.mileageCellFrom}`}
            htmlFor={minInputId}
          >
            <span
              className={
                minPrefixDim ? styles.mileagePrefixDim : styles.mileagePrefix
              }
            >
              From
            </span>
            <input
              id={minInputId}
              ref={minInputRef}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              className={styles.mileageInputPart}
              value={minShown}
              onChange={(e) => {
                if (!minTypingRef.current) return;
                setMinEdit(onlyDigits(e.target.value));
              }}
              onFocus={() => {
                minTypingRef.current = true;
                setMinEdit(minDigits);
                setMinFocused(true);
              }}
              onBlur={(e) => {
                minTypingRef.current = false;
                const next = onlyDigits(e.currentTarget.value);
                setMinFocused(false);
                commit({ minMileage: next });
              }}
              disabled={disabled}
              aria-label="Minimum mileage in kilometers"
            />
          </label>
          <label
            className={`${styles.mileageCell} ${styles.mileageCellTo}`}
            htmlFor={maxInputId}
          >
            <span
              className={
                maxPrefixDim ? styles.mileagePrefixDim : styles.mileagePrefix
              }
            >
              To
            </span>
            <input
              id={maxInputId}
              ref={maxInputRef}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              className={styles.mileageInputPart}
              value={maxShown}
              onChange={(e) => {
                if (!maxTypingRef.current) return;
                setMaxEdit(onlyDigits(e.target.value));
              }}
              onFocus={() => {
                maxTypingRef.current = true;
                setMaxEdit(maxDigits);
                setMaxFocused(true);
              }}
              onBlur={(e) => {
                maxTypingRef.current = false;
                const next = onlyDigits(e.currentTarget.value);
                setMaxFocused(false);
                commit({ maxMileage: next });
              }}
              disabled={disabled}
              aria-label="Maximum mileage in kilometers"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
