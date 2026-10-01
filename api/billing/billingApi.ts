import { makeApiCall } from "@/api/api";

export type BillingPlan = {
  key: string;
  name: string;
  priceMonthly: number;
  currency?: string;
  limits: string[];
  provider?: string;
  entitlement?: any;
};

export type Subscription = {
  id?: string;
  plan: string;
  status: string;
  accessState?: string;
  effectivePlan?: string;
  statusLabel?: string;
  canUseTrial?: boolean;
  daysRemaining?: number | null;
  trialUsed?: boolean;
  currentPeriodEnd?: string | null;
  trialStartAt?: string | null;
  trialEndAt?: string | null;
  paymentStatus?: string;
  provider?: string;
  providerPaymentId?: string;
  paymentUrl?: string;
  pendingPlan?: string | null;
  limits?: any;
  entitlement?: any;
  cancellationMessage?: string | null;
};

type ApiResponse<T> = {
  ok: boolean;
  data: T;
};

export async function getBillingPlans() {
  return makeApiCall<ApiResponse<BillingPlan[]>>({
    method: "GET",
    url: "billing/plans",
  });
}

export async function getSubscription() {
  return makeApiCall<ApiResponse<Subscription>>({
    method: "GET",
    url: "billing/subscription",
  });
}

export async function createCheckoutSession(plan: string) {
  return makeApiCall<ApiResponse<any>>({
    method: "POST",
    url: "billing/create-checkout-session",
    data: { plan },
  });
}

export async function completeCheckoutSession(sessionId: string) {
  return makeApiCall<ApiResponse<Subscription>>({
    method: "POST",
    url: "billing/complete-checkout-session",
    data: { sessionId },
  });
}

export async function startFreeTrial() {
  return makeApiCall<ApiResponse<Subscription>>({
    method: "POST",
    url: "billing/start-trial",
  });
}

export async function cancelSubscription() {
  return makeApiCall<ApiResponse<Subscription>>({
    method: "POST",
    url: "billing/cancel",
  });
}

export async function reactivateSubscription() {
  return makeApiCall<ApiResponse<Subscription>>({
    method: "POST",
    url: "billing/reactivate",
  });
}
