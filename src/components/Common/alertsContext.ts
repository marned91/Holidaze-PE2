import { createContext } from 'react';
import type { AlertsContextValue } from './AlertsProvider';

export const AlertsContext = createContext<AlertsContextValue | null>(null);
