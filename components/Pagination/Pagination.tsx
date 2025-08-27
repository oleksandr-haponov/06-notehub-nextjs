"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

export interface PaginationProps {
  pageCount: number;
  currentPage: number; // 1-based
  onPageChange: (page: number) => void;
  isFetchingPage?: boolean;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
  isFetchingPage,
}: PaginationProps) {
  return (
    <nav aria-label="Pagination">
      {isFetchingPage && (
        <span style={{ display: "block", textAlign: "center", marginBottom: 8 }}>Loading...</span>
      )}
      <ReactPaginate
        pageCount={pageCount}
        forcePage={Math.max(0, currentPage - 1)}
        onPageChange={(sel) => onPageChange(sel.selected + 1)}
        previousLabel="<"
        nextLabel=">"
        containerClassName={css.pagination}
        activeClassName={css.active}
        disabledClassName={css.disabled}
        // li/a стилизуются через descendant селекторы в CSS-модуле
      />
    </nav>
  );
}
