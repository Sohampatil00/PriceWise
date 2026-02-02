'use client';
import { useFirebase } from '@/firebase/provider';

// This file was originaly src/firebase/use-user.tsx
// It has been moved to src/firebase/auth/use-user.tsx
// It is now a barrel file that re-exports the useUser hook from src/firebase/provider.tsx

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = () => {
    const { user, isUserLoading, userError } = useFirebase();
    return { user, isUserLoading, userError };
};
