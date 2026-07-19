import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  'auth/email-already-in-use':
    'Ya existe una cuenta registrada con este correo.',
  'auth/invalid-email':
    'El correo electrónico no tiene un formato válido.',
  'auth/invalid-credential':
    'El correo o la contraseña son incorrectos.',
  'auth/user-disabled':
    'Esta cuenta ha sido deshabilitada.',
  'auth/user-not-found':
    'No existe una cuenta asociada con este correo.',
  'auth/wrong-password':
    'El correo o la contraseña son incorrectos.',
  'auth/weak-password':
    'La contraseña no cumple con los requisitos de seguridad.',
  'auth/popup-closed-by-user':
    'La ventana de Google se cerró antes de completar el acceso.',
  'auth/popup-blocked':
    'El navegador bloqueó la ventana de autenticación.',
  'auth/network-request-failed':
    'No fue posible conectar con Firebase. Revisa tu conexión.',
  'auth/too-many-requests':
    'Se realizaron demasiados intentos. Intenta nuevamente más tarde.',
  'auth/operation-not-allowed':
    'Este método de autenticación no está habilitado.',
  'auth/unauthorized-domain':
    'Este dominio no está autorizado para usar Firebase Authentication.',
};

export function getFirebaseAuthErrorMessage(
  error: unknown,
): string {
  if (!(error instanceof FirebaseError)) {
    return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }

  return (
    AUTH_ERROR_MESSAGES[error.code] ??
    'No fue posible completar la operación de autenticación.'
  );
}