import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ConfirmContext,
  type ConfirmFunction,
  type ConfirmOptions,
} from './confirmContext';

type PendingRequest = {
  options: ConfirmOptions;
  resolve: (result: boolean) => void;
} | null;

/**
 * Provider that renders a single accessible confirm dialog. Use together with
 * the useConfirm hook to show custom confirm modals without window.confirm.
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pendingRequest, setPendingRequest] = useState<PendingRequest>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  const openConfirm: ConfirmFunction = useCallback((options) => {
    return new Promise<boolean>((resolve) => {
      lastFocusedElementRef.current =
        (document.activeElement as HTMLElement) ?? null;
      setPendingRequest({ options, resolve });
    });
  }, []);

  function resolveAndClose(userAccepted: boolean) {
    setPendingRequest((current) => {
      if (current) {
        current.resolve(userAccepted);
      }
      return null;
    });
    setTimeout(() => {
      lastFocusedElementRef.current?.focus?.();
    }, 0);
  }

  function handleBackdropMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      resolveAndClose(false);
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!pendingRequest) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        resolveAndClose(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener('keydown', handleKeyDown, {
        capture: true,
      } as any);
  }, [pendingRequest]);

  useEffect(() => {
    if (!pendingRequest) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => cancelButtonRef.current?.focus?.(), 0);
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [pendingRequest]);

  const providerValue = useMemo<ConfirmFunction>(
    () => openConfirm,
    [openConfirm]
  );

  return (
    <ConfirmContext.Provider value={providerValue}>
      {children}

      {pendingRequest && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={handleBackdropMouseDown}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            className="w-full max-w-md rounded-2xl bg-white shadow-xl outline-none"
          >
            <div className="p-6">
              {pendingRequest.options.title ? (
                <h2
                  id="confirm-dialog-title"
                  className="mb-2 text-lg font-semibold"
                >
                  {pendingRequest.options.title}
                </h2>
              ) : (
                <h2 id="confirm-dialog-title" className="sr-only">
                  Confirm action
                </h2>
              )}
              {pendingRequest.options.message && (
                <p
                  id="confirm-dialog-message"
                  className="text-sm text-neutral-700"
                >
                  {pendingRequest.options.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t p-4">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={() => resolveAndClose(false)}
                className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
              >
                {pendingRequest.options.cancelLabel ?? 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => resolveAndClose(true)}
                className={[
                  'rounded-xl px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight',
                  pendingRequest.options.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-neutral-900 hover:bg-neutral-800',
                ].join(' ')}
              >
                {pendingRequest.options.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
