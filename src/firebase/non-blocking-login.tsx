'use client';
import {
  Auth,
  GoogleAuthProvider,
  signInWithRedirect,
} from 'firebase/auth';

/**
 * Initiates a non-blocking Google Sign-In with a redirect.
 * Errors are caught and logged to the console, but do not block UI.
 * Auth state changes are handled by the global onAuthStateChanged listener.
 */
export function initiateGoogleSignIn(authInstance: Auth): void {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(authInstance, provider).catch(error => {
    // This can happen if there are configuration errors.
    console.error("Google Sign-In Redirect Error:", error);
  });
}
