import { type ReactNode, useEffect, useId, useRef } from 'react';

type ModalProps = {
  open: boolean;
  title?: string;
  ariaLabel?: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({
  open,
  title,
  ariaLabel,
  onClose,
  children,
}: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusable = getFocusableElements(dialogRef.current);
    const first = focusable[0];
    const target =
      first ?? (closeButtonRef.current as HTMLElement | null) ?? null;

    const focusTimer = window.setTimeout(() => {
      target?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        const container = dialogRef.current;
        if (!container) return;

        const focusable = getFocusableElements(container);
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (active === first || !container.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (active === last || !container.contains(active)) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      {...(title
        ? { 'aria-labelledby': titleId }
        : { 'aria-label': ariaLabel ?? 'Dialog' })}
      className="fixed inset-0 z-[1000] flex items-start sm:items-center justify-center p-4 overscroll-contain"
    >
      <div
        role="presentation"
        aria-hidden="true"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="document"
        className="relative w-[50%] max-w-[980px] rounded-2xl bg-white shadow-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white/95 px-6 py-4">
          {title ? (
            <h3
              id={titleId}
              className="text-3xl font-medium font-small-nav-footer"
            >
              {title}
            </h3>
          ) : (
            <span className="sr-only">Modal</span>
          )}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-2xl leading-none hover:bg-gray-100 cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-10">{children}</div>
      </div>
    </div>
  );
}

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const selector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(selector)
  );
  return elements.filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}
