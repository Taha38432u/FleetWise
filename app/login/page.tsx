import { Suspense } from "react";
import LoginView from "@/components/auth/pages/LoginView";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface text-sm font-semibold text-muted">
          Loading sign-in...
        </div>
      }
    >
      <LoginView />
    </Suspense>
  );
}
