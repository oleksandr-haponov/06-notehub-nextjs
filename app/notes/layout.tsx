import Link from "next/link";
import type { ReactNode } from "react";
import css from "./layout.module.css";

export default function NotesLayout({ children }: { children: ReactNode }) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>
        <h2 className={css.brand}>NoteHub</h2>
        <nav aria-label="Notes navigation">
          <ul className={css.menuList}>
            <li className={css.menuItem}>
              <Link className={css.menuLink} href="/">
                Home
              </Link>
            </li>
            <li className={css.menuItem}>
              <Link className={css.menuLink} href="/notes">
                Notes
              </Link>
            </li>
            <li className={css.menuItem}>
              <Link className={css.menuLink} href="/notes/New">
                Create note
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className={css.notesWrapper}>{children}</div>
    </div>
  );
}
