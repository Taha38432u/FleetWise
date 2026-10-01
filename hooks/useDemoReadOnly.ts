"use client";

import { useAuthState } from "@/components/auth/AuthProvider";
import { isDemoEmail } from "@/lib/demoAccounts";
import { toast } from "react-toastify";

export function useDemoReadOnly() {
  const { user } = useAuthState();
  const isDemo = isDemoEmail(user?.email);

  const blockWrite = (action = "This action") => {
    if (!isDemo) return false;
    toast.info(`${action} is disabled on read-only demo accounts.`);
    return true;
  };

  return { isDemo, blockWrite };
}
