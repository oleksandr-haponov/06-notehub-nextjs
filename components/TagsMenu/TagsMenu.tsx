"use client";

import { useEffect, useRef, useState } from "react";
import css from "./TagsMenu.module.css";

export interface TagsMenuProps {
  /** Список доступных тегов (например: ["Todo","Work","Personal","Idea","Other"]) */
  tags: string[];
  /** Текущий выбранный тег; null/undefined означает "все" */
  value?: string | null;
  /** Колбек выбора тега */
  onChange: (tag: string | null) => void;
  /** Текст на кнопке; если не указан — показываем выбранный тег или "All tags" */
  buttonLabel?: string;
  /** Показать пункт "All tags" первым пунктом меню */
  showAllItem?: boolean;
  /** Подпись для "All tags" */
  allLabel?: string;
}

export default function TagsMenu({
  tags,
  value = null,
  onChange,
  buttonLabel,
  showAllItem = true,
  allLabel = "All tags",
}: TagsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentLabel = buttonLabel ?? value ?? allLabel;

  const select = (tag: string | null) => {
    onChange(tag);
    setOpen(false);
  };

  return (
    <div className={css.menuContainer} ref={ref}>
      <button
        type="button"
        className={css.menuButton}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {currentLabel}
      </button>

      {open && (
        <ul className={css.menuList} role="menu" aria-label="Filter by tag">
          {showAllItem && (
            <li className={css.menuItem} role="none">
              <a
                className={css.menuLink}
                role="menuitem"
                tabIndex={0}
                onClick={() => select(null)}
                onKeyDown={(e) => e.key === "Enter" && select(null)}
              >
                {allLabel}
              </a>
            </li>
          )}

          {tags.map((tag) => (
            <li key={tag} className={css.menuItem} role="none">
              <a
                className={css.menuLink}
                role="menuitem"
                tabIndex={0}
                aria-current={value === tag ? "true" : undefined}
                onClick={() => select(tag)}
                onKeyDown={(e) => e.key === "Enter" && select(tag)}
              >
                {tag}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
