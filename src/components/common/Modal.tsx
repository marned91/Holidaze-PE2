import { type ReactNode, useEffect } from 'react';

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
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? title ?? 'Dialog'}
      className="fixed inset-0 z-[1000] flex items-start sm:items-center justify-center p-4 overscroll-contain"
    >
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[980px] rounded-2xl bg-white shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white/95 px-6 py-4">
          {title ? (
            <h3 className="text-3xl font-medium font-small-nav-footer">
              {title}
            </h3>
          ) : (
            <span className="sr-only">Modal</span>
          )}
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-2xl leading-none hover:bg-gray-100"
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
