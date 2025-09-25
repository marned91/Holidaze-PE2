import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertsContext } from './alertsContext';

export type AlertCategory = 'info' | 'success' | 'error';

export interface ShowAlertOptions {
  category?: AlertCategory;
  headline?: string;
  timeoutInMilliseconds?: number;
  onClose?: () => void;
}

export interface AlertItem {
  identifier: string;
  message: string;
  category: AlertCategory;
  headline?: string;
  timeoutInMilliseconds: number;
  onClose?: () => void;
}

/** Public API exposed by the alerts context. */
export interface AlertsContextValue {
  showAlert: (message: string, options?: ShowAlertOptions) => string;
  showInformationAlert: (message: string, options?: Omit<ShowAlertOptions, 'category'>) => string;
  showSuccessAlert: (message: string, options?: Omit<ShowAlertOptions, 'category'>) => string;
  showErrorAlert: (message: string, options?: Omit<ShowAlertOptions, 'category'>) => string;
}

const DEFAULT_TIMEOUT_INFO = 2500;
const DEFAULT_TIMEOUT_SUCCESS = 2500;
const DEFAULT_TIMEOUT_ERROR = 5000;

/**
 * Generates a collision-resistant identifier for an alert.
 *
 * @returns Unique identifier string (timestamp + random suffix).
 */
function createUniqueIdentifier(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Resolves the default auto-dismiss timeout for a given alert category.
 *
 * @param category - Alert category ("info" | "success" | "error").
 * @returns Timeout in milliseconds used if no explicit timeout is provided.
 */
function defaultTimeoutFor(category: AlertCategory): number {
  if (category === 'error') return DEFAULT_TIMEOUT_ERROR;
  if (category === 'success') return DEFAULT_TIMEOUT_SUCCESS;
  return DEFAULT_TIMEOUT_INFO;
}

function classesFor(category: AlertCategory): string {
  if (category === 'success') return 'border-green-300 bg-green-50 text-green-900';
  if (category === 'error') return 'border-red-300 bg-red-50 text-red-900';
  return 'border-blue-300 bg-blue-50 text-blue-900';
}

/**
 * Computes the headline text for an alert.
 *
 * Behavior:
 * - Uses an explicit override if provided.
 * - Falls back to sensible defaults for "success" and "error".
 * - Returns undefined for "info" to omit a headline by default.
 *
 * @param category - Alert category.
 * @param override - Optional explicit headline text.
 * @returns Headline text or undefined when none should be shown.
 */
function defaultHeadlineFor(category: AlertCategory, override?: string): string | undefined {
  if (override) return override;
  if (category === 'success') return 'Success';
  if (category === 'error') return 'Something went wrong';
  return undefined;
}

/**
 * Top-level provider that exposes the alerts API via context and
 * renders a viewport for visible alerts.
 *
 * Behavior:
 * - Manages a queue of alerts with optional auto-dismiss timeouts.
 * - Ensures timeouts are cleared on unmount to avoid leaks.
 * - Re-schedules missing timeouts after fast refresh or remounts.
 *
 * @param children - React tree that will consume the alerts context.
 */
export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const timeoutHandles = useRef<Record<string, number>>({});

  const closeAlert = useCallback((identifier: string) => {
    setAlerts((previous) => {
      const next = previous.filter((item) => item.identifier !== identifier);
      const handle = timeoutHandles.current[identifier];
      if (handle) {
        window.clearTimeout(handle);
        delete timeoutHandles.current[identifier];
      }
      previous.find((i) => i.identifier === identifier)?.onClose?.();
      return next;
    });
  }, []);

  const showAlert = useCallback(
    (message: string, options?: ShowAlertOptions) => {
      const category: AlertCategory = options?.category ?? 'info';
      const identifier = createUniqueIdentifier();
      const timeoutInMilliseconds =
        typeof options?.timeoutInMilliseconds === 'number'
          ? options.timeoutInMilliseconds
          : defaultTimeoutFor(category);

      setAlerts((previous) => [
        ...previous,
        {
          identifier,
          message,
          category,
          headline: options?.headline,
          timeoutInMilliseconds,
          onClose: options?.onClose,
        },
      ]);

      if (timeoutInMilliseconds > 0) {
        timeoutHandles.current[identifier] = window.setTimeout(
          () => closeAlert(identifier),
          timeoutInMilliseconds
        );
      }

      return identifier;
    },
    [closeAlert]
  );

  useEffect(() => {
    return () => {
      Object.values(timeoutHandles.current).forEach((h) => window.clearTimeout(h));
      timeoutHandles.current = {};
    };
  }, []);

  // Ensure every alert with a timeout has a scheduled close,
  // even after fast refresh or remounts.
  useEffect(() => {
    for (const item of alerts) {
      const alreadyScheduled = timeoutHandles.current[item.identifier];
      if (!alreadyScheduled && item.timeoutInMilliseconds > 0) {
        timeoutHandles.current[item.identifier] = window.setTimeout(
          () => closeAlert(item.identifier),
          item.timeoutInMilliseconds
        );
      }
    }
  }, [alerts, closeAlert]);

  const showInformationAlert = useCallback(
    (message: string, options?: Omit<ShowAlertOptions, 'category'>) =>
      showAlert(message, { ...options, category: 'info' }),
    [showAlert]
  );

  const showSuccessAlert = useCallback(
    (message: string, options?: Omit<ShowAlertOptions, 'category'>) =>
      showAlert(message, { ...options, category: 'success' }),
    [showAlert]
  );

  const showErrorAlert = useCallback(
    (message: string, options?: Omit<ShowAlertOptions, 'category'>) =>
      showAlert(message, { ...options, category: 'error' }),
    [showAlert]
  );

  const value = useMemo<AlertsContextValue>(
    () => ({
      showAlert,
      showInformationAlert,
      showSuccessAlert,
      showErrorAlert,
    }),
    [showAlert, showInformationAlert, showSuccessAlert, showErrorAlert]
  );

  return (
    <AlertsContext.Provider value={value}>
      {children}
      <AlertsViewportInternal alerts={alerts} onRequestClose={closeAlert} />
    </AlertsContext.Provider>
  );
}

/** Renders visible alerts. Already included by the provider. */
function AlertsViewportInternal({
  alerts,
  onRequestClose,
}: {
  alerts: AlertItem[];
  onRequestClose: (identifier: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[1000] flex flex-col items-center gap-3 px-4">
      {alerts.map((item) => {
        const headlineText = defaultHeadlineFor(item.category, item.headline);
        return (
          <div
            key={item.identifier}
            className={`pointer-events-auto w-full max-w-md rounded-lg text-center border px-4 py-3 shadow-xl ${classesFor(
              item.category
            )}`}
            role={item.category === 'error' ? 'alert' : 'status'}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {headlineText && (
                  <p className="font-small-nav-footer text-lg font-medium">{headlineText}</p>
                )}
                <p className="font-text text-sm font-medium">{item.message}</p>
              </div>
              <button
                type="button"
                aria-label="Dismiss alert"
                onClick={() => onRequestClose(item.identifier)}
                className="rounded p-1 text-current/80 hover:text-current focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
