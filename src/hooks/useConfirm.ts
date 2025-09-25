import { useContext } from 'react';
import { ConfirmContext, type ConfirmFunction } from '../components/Common/alerts/confirmContext';

/**
 * Returns a function that opens a confirm dialog and resolves to true when the
 * user accepts and false when the user cancels. Must be used inside ConfirmProvider.
 */
export function useConfirm(): ConfirmFunction {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}
