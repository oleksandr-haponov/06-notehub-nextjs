"use client";

import css from "./SearchBox.module.css";

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBox({ value, onChange, placeholder }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Search..."}
      aria-label="Search notes"
    />
  );
}
