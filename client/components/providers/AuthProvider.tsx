"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth, logout as logoutFromFirebase } from "@/lib/firebase";
import { createQueryClient } from "@/lib/queryClient";
import {
  authQueryKeys,
  syncAuthenticatedUser,
  type SyncedAuthUser,
} from "@/services/auth.service";

export type AuthContextValue = {
  user: User | null;
  profile: SyncedAuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<SyncedAuthUser | null>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SyncedAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [queryClient] = useState(() => createQueryClient());

  const refreshProfile = useCallback(async () => {
    const currentUser = getFirebaseAuth().currentUser;

    if (!currentUser) {
      setProfile(null);
      queryClient.removeQueries({ queryKey: authQueryKeys.currentUser });
      return null;
    }

    const syncedUser = await queryClient.fetchQuery({
      queryKey: authQueryKeys.currentUser,
      queryFn: syncAuthenticatedUser,
      staleTime: 0,
    });

    setProfile(syncedUser);
    return syncedUser;
  }, [queryClient]);

  const logout = useCallback(async () => {
    setUser(null);
    setProfile(null);
    queryClient.clear();
    await logoutFromFirebase();
  }, [queryClient]);

  useEffect(() => {
    const auth = getFirebaseAuth();
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        queryClient.clear();
        setLoading(false);
        return;
      }

      try {
        const syncedUser = await queryClient.fetchQuery({
          queryKey: authQueryKeys.currentUser,
          queryFn: syncAuthenticatedUser,
          staleTime: 0,
        });

        if (isMounted) {
          setProfile(syncedUser);
        }
      } catch {
        if (isMounted) {
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: Boolean(user),
      logout,
      refreshProfile,
    }),
    [user, profile, loading, logout, refreshProfile]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </QueryClientProvider>
  );
}
