import { Alert, Platform } from 'react-native';

export interface ConfirmActionOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function confirmAction({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmActionOptions) {
  if (Platform.OS === 'web') {
    const text = message ? `${title}\n\n${message}` : title;
    const ok = typeof window !== 'undefined' ? window.confirm(text) : true;
    if (ok) {
      onConfirm();
    } else {
      onCancel?.();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel', onPress: onCancel },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}

export function showAlert(title: string, message?: string, onOk?: () => void) {
  if (Platform.OS === 'web') {
    const text = message ? `${title}\n\n${message}` : title;
    if (typeof window !== 'undefined') {
      window.alert(text);
    }
    onOk?.();
    return;
  }

  Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
}
