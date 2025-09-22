import { useContext } from 'react';
import { AlertsContext } from '../components/Common/alertsContext';
import type { AlertsContextValue } from '../components/Common/AlertsProvider';

/** Returns the alerts context API. Must be used within <AlertsProvider>. */
export function useAlerts(): AlertsContextValue {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within <AlertsProvider>');
  }
  return context;
}
