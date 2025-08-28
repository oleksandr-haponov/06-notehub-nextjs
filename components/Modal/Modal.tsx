"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const portalContainerRef = useRef<HTMLDivElement | null>(null);

  // создаём контейнер для портала один раз и монтируем его в body
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("data-modal-root", "true");
    portalContainerRef.current = el;
    document.body.appendChild(el);
    setMounted(true);

    return () => {
      if (portalContainerRef.current) {
        document.body.removeChild(portalContainerRef.current);
        portalContainerRef.current = null;
      }
    };
  }, []);

  // Esc для закрытия
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // блокировка скролла фона
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open || !mounted || !portalContainerRef.current) return null;

  // ЯВНАЯ проверка: закрываем ТОЛЬКО если клик был по самому бекдропу
  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  const node = (
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.close} onClick={onClose} aria-label="Close modal">
          ×
        </button>
        {children}
      </div>
    </div>
  );

  return createPortal(node, portalContainerRef.current);
}
