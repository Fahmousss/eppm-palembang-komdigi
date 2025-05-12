import { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface AppDataContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const triggerRefresh = useCallback(() => {
    setRefreshKey(Date.now());
  }, []);

  const value = useMemo(() => ({ refreshKey, triggerRefresh }), [refreshKey, triggerRefresh]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within an AppDataProvider');
  return context;
};
