"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMe, logout as apiLogout } from "@/api/auth/authApi";
import { AuthResponse, MeUser } from "@/types/auth.types";
import { UserRole } from "@/lib/access";

interface AuthContextValue {
  user: MeUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isBootstrapped: boolean;
  setSession: (auth: AuthResponse) => void;
  updateUser: (user: MeUser | null) => void;
  clearSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function clearStoredSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  const updateUser = useCallback((nextUser: MeUser | null) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  const setSession = useCallback(
    (auth: AuthResponse) => {
      if (auth.accessToken) {
        localStorage.setItem("accessToken", auth.accessToken);
      }
      if (auth.refreshToken) {
        localStorage.setItem("refreshToken", auth.refreshToken);
      }
      if (auth.user) {
        updateUser(auth.user);
      }
      setIsBootstrapped(true);
    },
    [updateUser],
  );

  const clearSession = useCallback(async () => {
    clearStoredSession();
    setUser(null);
    setIsBootstrapped(true);

    try {
      await apiLogout();
    } catch {
      // Ignore logout transport failures during local cleanup.
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const bootstrap = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (!accessToken) {
        if (!isCancelled) {
          setUser(null);
          setIsBootstrapped(true);
        }
        return;
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          if (!isCancelled) {
            setIsBootstrapped(true);
          }
        } catch {
          localStorage.removeItem("user");
        }
      }

      try {
        const me = await getMe();
        if (!isCancelled) {
          updateUser(me?.data ? me.data : me);
        }
      } catch {
        if (!storedUser) {
          clearStoredSession();
          if (!isCancelled) {
            setUser(null);
          }
        }
      } finally {
        if (!isCancelled) {
          setIsBootstrapped(true);
        }
      }
    };

    bootstrap();

    return () => {
      isCancelled = true;
    };
  }, [updateUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: (user?.role as UserRole | undefined) || null,
      isAuthenticated: Boolean(user),
      isBootstrapped,
      setSession,
      updateUser,
      clearSession,
    }),
    [clearSession, isBootstrapped, setSession, updateUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthState() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthState must be used inside AuthProvider");
  }
  return context;
}
