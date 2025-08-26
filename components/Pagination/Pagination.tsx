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
    <div className={css.wrapper}>
      {isFetchingPage && <span className={css.spinner}>Loading...</span>}
      <ReactPaginate
        pageCount={pageCount}
        forcePage={Math.max(0, currentPage - 1)}
        onPageChange={(sel) => onPageChange(sel.selected + 1)}
        containerClassName={css.pagination}
        pageLinkClassName={css.page}
        previousLabel="<"
        nextLabel=">"
        previousClassName={css.nav}
        nextClassName={css.nav}
        activeLinkClassName={css.active}
        disabledClassName={css.disabled}
      />
    </div>
  );
}
