import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import AlertDialog, { type AlertButton } from './AlertDialog';

interface AlertContextType {
  alert: (options: {
    title?: string;
    message?: string;
    buttons?: AlertButton[];
    cancelable?: boolean;
  }) => Promise<string>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertDialogProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<{
    title?: string;
    message?: string;
    buttons?: AlertButton[];
    cancelable?: boolean;
    resolve?: (value: string) => void;
  }>({});

  const alert = useCallback(({ title, message, buttons = [{ text: 'OK' }], cancelable = true }) => {
    return new Promise<string>((resolve) => {
      const buttonsWithHandler = buttons.map((button) => ({
        ...button,
        onPress: () => {
          if (button.onPress) button.onPress();
          resolve(button.text);
        },
      }));

      setConfig({
        title,
        message,
        buttons: buttonsWithHandler,
        cancelable,
        resolve,
      });
      setVisible(true);
    });
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    if (config.cancelable && config.resolve) {
      config.resolve('dismiss');
    }
  }, [config]);

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <AlertDialog
        visible={visible}
        title={config.title}
        message={config.message}
        buttons={config.buttons}
        onDismiss={handleDismiss}
        cancelable={config.cancelable}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertDialogProvider');
  }
  return context;
}
