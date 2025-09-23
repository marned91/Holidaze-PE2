import { createContext } from 'react';

export type ConfirmVariant = 'default' | 'danger';

export type ConfirmOptions = {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
};

export type ConfirmFunction = (options: ConfirmOptions) => Promise<boolean>;

/**
 * Context that exposes a function to open a confirm dialog and resolve with
 * true if the user confirms or false if the user cancels.
 */
export const ConfirmContext = createContext<ConfirmFunction | null>(null);
