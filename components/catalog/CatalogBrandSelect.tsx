"use client";

import { getCatalogFilters } from "@/lib/api/brands";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import styles from "./CatalogFilter.module.css";

type CatalogBrandSelectProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const PLACEHOLDER = "Choose a brand";

type Row = { key: string; value: string; label: string };

function highlightIndexForValue(rows: Row[], current: string): number {
  if (!current) return 0;
  const idx = rows.findIndex((r) => r.value === current);
  return idx >= 0 ? idx : 0;
}

export function CatalogBrandSelect({
  value,
  onChange,
  disabled,
}: CatalogBrandSelectProps) {
  const brandsQuery = useQuery({
    queryKey: ["car-filters"],
    queryFn: getCatalogFilters,
    select: (data) => data.brands,
  });

  const busy = Boolean(disabled) || brandsQuery.isLoading;
  const blocked = busy || brandsQuery.isError;

  const rows: Row[] = useMemo(() => {
    const list = brandsQuery.data ?? [];
    return [
      { key: "__clear__", value: "", label: PLACEHOLDER },
      ...list.map((b) => ({ key: b, value: b, label: b })),
    ];
  }, [brandsQuery.data]);

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const labelId = useId();
  const listId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, close]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLLIElement>(
      `[data-index="${highlight}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const openWithHighlightSync = useCallback(() => {
    setHighlight(highlightIndexForValue(rows, value));
    setOpen(true);
  }, [rows, value]);

  const selectRow = useCallback(
    (row: Row) => {
      onChange(row.value);
      close();
    },
    [onChange, close],
  );

  const onTriggerClick = () => {
    if (blocked) return;
    if (open) {
      setOpen(false);
    } else {
      openWithHighlightSync();
    }
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (blocked) return;
    if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        close();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        openWithHighlightSync();
        return;
      }
      setHighlight((i) => Math.min(i + 1, rows.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (open) {
        setHighlight((i) => Math.max(i - 1, 0));
      }
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) {
        openWithHighlightSync();
        return;
      }
      const row = rows[highlight];
      if (row) selectRow(row);
    }
  };

  return (
    <div ref={rootRef} className={styles.filterCombo}>
      <span id={labelId} className={styles.label}>
        Car brand
      </span>
      <button
        type="button"
        className={styles.filterTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={blocked}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
      >
        <span
          className={
            value ? styles.filterTriggerValue : styles.filterTriggerPlaceholder
          }
        >
          {brandsQuery.isLoading ? "Loading…" : value || PLACEHOLDER}
        </span>
        {open ? (
          <LuChevronUp className={styles.filterChevron} aria-hidden />
        ) : (
          <LuChevronDown className={styles.filterChevron} aria-hidden />
        )}
      </button>

      {open && !brandsQuery.isLoading && rows.length >= 1 && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          aria-activedescendant={`${listId}-opt-${highlight}`}
          className={styles.filterList}
        >
          {rows.map((row, index) => {
            const isChosenBrand =
              row.value !== "" && row.value === value;
            const isKeyboard = index === highlight;
            const optionId = `${listId}-opt-${index}`;
            return (
              <li
                key={row.key}
                id={optionId}
                role="option"
                aria-selected={row.value === value}
                data-index={index}
                className={
                  isChosenBrand
                    ? styles.filterOptionSelected
                    : isKeyboard
                      ? styles.filterOptionActive
                      : styles.filterOption
                }
                onMouseEnter={() => setHighlight(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectRow(row)}
              >
                {row.label}
              </li>
            );
          })}
        </ul>
      )}

      {brandsQuery.isError && (
        <p className={styles.error}>Could not load brands. Try again.</p>
      )}
    </div>
  );
}
