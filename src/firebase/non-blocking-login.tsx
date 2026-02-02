'use client';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

/**
 * Initiates a non-blocking Google Sign-In with a popup.
 * Errors are caught and logged to the console, but do not block UI.
 * Auth state changes are handled by the global onAuthStateChanged listener.
 */
export function initiateGoogleSignIn(authInstance: Auth): void {
  const provider = new GoogleAuthProvider();
  signInWithPopup(authInstance, provider).catch(error => {
    // This can happen if the user closes the popup.
    // We log it for debugging but don't show a UI error.
    console.error("Google Sign-In Popup Error:", error);
  });
}
