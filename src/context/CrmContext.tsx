/**
 * Agamagizh CRM React Context
 * Exposes the active CrmDataProvider (Local or Real Http), account identity,
 * user credentials, and provider switching mechanism across the application.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CrmDataProvider, createCrmDataProvider } from '../services/crm';
import { CrmAccount, CrmUser, CrmInbox, CrmTeam } from '../types/crm';

export interface CrmContextValue {
  provider: CrmDataProvider;
  mode: 'local' | 'real';
  setMode: (mode: 'local' | 'real') => void;
  account: CrmAccount | null;
  currentUser: CrmUser | null;
  inboxes: CrmInbox[];
  teams: CrmTeam[];
  isLoading: boolean;
  error: string | null;
  refreshContext: () => Promise<void>;
  // Explicit Phase 1 Clinical Safety Lock (Untouched as commanded)
  clinicalWritesEnabled: boolean;
}

const CrmContext = createContext<CrmContextValue | null>(null);

export function CrmProvider({ children }: { children: React.ReactNode }) {
  // Strictly maintain 'local' provider mode for Phase 1 validation/build testing
  const [mode, setModeState] = useState<'local' | 'real'>(() => {
    const envMode = (import.meta as any).env?.VITE_DATA_MODE;
    if (envMode === 'real') {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('agamagizh_crm_data_mode');
        if (saved === 'real') return 'real';
      }
      return 'real';
    }
    // Default to 'local' strictly
    return 'local';
  });

  const [provider, setProvider] = useState<CrmDataProvider>(() =>
    createCrmDataProvider(mode)
  );

  const [account, setAccount] = useState<CrmAccount | null>(null);
  const [currentUser, setCurrentUser] = useState<CrmUser | null>(null);
  const [inboxes, setInboxes] = useState<CrmInbox[]>([]);
  const [teams, setTeams] = useState<CrmTeam[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const setMode = useCallback((newMode: 'local' | 'real') => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agamagizh_crm_data_mode', newMode);
    }
    const newProvider = createCrmDataProvider(newMode);
    setProvider(newProvider);
  }, []);

  const refreshContext = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [acc, usr, inb, tms] = await Promise.all([
        provider.getAccount().catch((e) => {
          console.warn('Account lookup error in provider:', e);
          return null;
        }),
        provider.getCurrentUser().catch((e) => {
          console.warn('User lookup error in provider:', e);
          return null;
        }),
        provider.getInboxes().catch((e) => {
          console.warn('Inboxes lookup error in provider:', e);
          return [];
        }),
        provider.getTeams().catch((e) => {
          console.warn('Teams lookup error in provider:', e);
          return [];
        }),
      ]);

      if (acc) setAccount(acc);
      if (usr) setCurrentUser(usr);
      setInboxes(inb);
      setTeams(tms);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize CRM context');
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    refreshContext();
  }, [refreshContext]);

  const value: CrmContextValue = {
    provider,
    mode,
    setMode,
    account,
    currentUser,
    inboxes,
    teams,
    isLoading,
    error,
    refreshContext,
    // Strictly locked in Phase 1 as mandated:
    clinicalWritesEnabled: false,
  };

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm(): CrmContextValue {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
}
