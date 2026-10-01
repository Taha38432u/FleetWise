"use client";

import { useEffect, useMemo, useRef } from "react";
import { Button, Loader } from "@mantine/core";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconCreditCard,
  IconRefresh,
  IconShieldCheck,
  IconX,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  useBillingPlans,
  useCancelSubscription,
  useCompleteCheckoutSession,
  useCreateCheckoutSession,
  useReactivateSubscription,
  useStartFreeTrial,
  useSubscription,
} from "@/hooks/useBilling";
import { formatLabel } from "@/utils/formatLabel";
import { PageHeader, Surface } from "@/components/shared";

const stateTone: Record<string, string> = {
  free: "border-slate-200 bg-white text-slate-700",
  trialing: "border-emerald-200 bg-emerald-50 text-emerald-800",
  active_paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled_active_until_period_end: "border-amber-200 bg-amber-50 text-amber-800",
  expired: "border-rose-200 bg-rose-50 text-rose-800",
  past_due: "border-rose-200 bg-rose-50 text-rose-800",
  payment_pending: "border-amber-200 bg-amber-50 text-amber-800",
};

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function limitRows(entitlement: any) {
  if (!entitlement) return [];
  return [
    ["Vehicles", entitlement.vehicles],
    ["Drivers", entitlement.drivers],
    ["Active routes", entitlement.activeRoutes],
    ["Staff", entitlement.staff],
    ["Dispatchers", entitlement.dispatchers],
  ];
}

export default function BillingPage() {
  const searchParams = useSearchParams();
  const completedSessionRef = useRef<string | null>(null);
  const plansQuery = useBillingPlans();
  const subscriptionQuery = useSubscription();
  const checkoutMutation = useCreateCheckoutSession();
  const completeCheckoutMutation = useCompleteCheckoutSession();
  const cancelMutation = useCancelSubscription();
  const reactivateMutation = useReactivateSubscription();
  const trialMutation = useStartFreeTrial();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const isSuccess = searchParams.get("stripe") === "success";
    if (!isSuccess || !sessionId || completedSessionRef.current === sessionId) {
      return;
    }

    completedSessionRef.current = sessionId;
    completeCheckoutMutation.mutate(sessionId, {
      onSuccess: () => toast.success("Stripe test payment verified"),
      onError: (error: any) =>
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Stripe payment verification failed",
        ),
    });
  }, [completeCheckoutMutation, searchParams]);

  const isLoading = plansQuery.isLoading || subscriptionQuery.isLoading;
  const plans = useMemo(() => plansQuery.data?.data || [], [plansQuery.data?.data]);
  const subscription = subscriptionQuery.data?.data;
  const accessState = subscription?.accessState || "free";
  const currentPlan = subscription?.effectivePlan || subscription?.plan || "FREE";
  const isMutating =
    checkoutMutation.isPending ||
    completeCheckoutMutation.isPending ||
    cancelMutation.isPending ||
    reactivateMutation.isPending ||
    trialMutation.isPending;

  const planOrder = useMemo(
    () => Object.fromEntries(plans.map((plan: any, index: number) => [plan.key, index])),
    [plans],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const canCancel =
    accessState === "active_paid" && Boolean(subscription?.currentPeriodEnd);
  const canReactivate = accessState === "cancelled_active_until_period_end";

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Billing"
        title="Subscription control"
        description="Plans control fleet limits, paid access, trial state, payment health, and cancellation windows."
      />

      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Surface className="border-emerald-100">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] ${
                  stateTone[accessState] || stateTone.free
                }`}
              >
                {subscription?.statusLabel || "Free plan"}
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                {currentPlan} access
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {subscription?.cancellationMessage ||
                  (accessState === "trialing"
                    ? `Trial active. ${subscription?.daysRemaining ?? 0} days remaining.`
                    : accessState === "past_due"
                      ? "Payment failed. Paid features now follow free-plan limits until payment is fixed."
                      : accessState === "payment_pending"
                        ? "Stripe checkout is pending. Verify after completing test-card payment."
                        : "Backend enforces these entitlements on protected fleet features.")}
              </p>
            </div>

            <div className="grid min-w-[280px] gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Payment</span>
                <span className="font-extrabold text-slate-900">
                  {formatLabel(subscription?.paymentStatus || "NONE")}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Provider</span>
                <span className="font-extrabold text-slate-900">
                  {formatLabel(subscription?.provider || "STRIPE_TEST")}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Period end</span>
                <span className="font-extrabold text-slate-900">
                  {formatDate(subscription?.currentPeriodEnd)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Trial used</span>
                <span className="font-extrabold text-slate-900">
                  {subscription?.trialUsed ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {limitRows(subscription?.entitlement || subscription?.limits).map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {Number(value) >= 9999 ? "Unlimited" : value}
                </p>
              </div>
            ))}
          </div>
        </Surface>

        <Surface>
          <h3 className="text-lg font-black text-slate-950">Actions</h3>
          <div className="mt-4 grid gap-3">
            {subscription?.providerPaymentId && accessState === "payment_pending" && (
              <Button
                leftSection={<IconRefresh size={18} />}
                loading={completeCheckoutMutation.isPending}
                disabled={isMutating}
                onClick={() =>
                  completeCheckoutMutation.mutate(subscription.providerPaymentId as string, {
                    onSuccess: () => toast.success("Stripe payment verified"),
                    onError: (error: any) =>
                      toast.error(
                        error?.response?.data?.message ||
                          error?.message ||
                          "Stripe payment verification failed",
                      ),
                  })
                }
              >
                Verify payment
              </Button>
            )}
            <Button
              color="red"
              variant="light"
              leftSection={<IconX size={18} />}
              loading={cancelMutation.isPending}
              disabled={!canCancel || isMutating}
              onClick={() =>
                cancelMutation.mutate(undefined, {
                  onSuccess: (response: any) =>
                    toast.success(
                      response?.data?.cancellationMessage ||
                        "Your subscription has been cancelled. You can continue using paid features until period end.",
                    ),
                  onError: (error: any) =>
                    toast.error(
                      error?.response?.data?.message ||
                        error?.message ||
                        "Cancel failed",
                    ),
                })
              }
            >
              Cancel subscription
            </Button>
            <Button
              variant="default"
              leftSection={<IconShieldCheck size={18} />}
              loading={reactivateMutation.isPending}
              disabled={!canReactivate || isMutating}
              onClick={() =>
                reactivateMutation.mutate(undefined, {
                  onSuccess: () => toast.success("Subscription reactivated"),
                  onError: (error: any) =>
                    toast.error(
                      error?.response?.data?.message ||
                        error?.message ||
                        "Reactivate failed",
                    ),
                })
              }
            >
              Reactivate paid access
            </Button>
          </div>
        </Surface>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {plans.map((plan: any) => {
          const isTrial = plan.key === "TRIAL";
          const isCurrent = currentPlan === plan.key;
          const isFree = plan.key === "FREE";
          const canUseTrial = Boolean(subscription?.canUseTrial);
          const isDowngrade =
            !isTrial &&
            !isFree &&
            planOrder[plan.key] < planOrder[subscription?.plan || "FREE"];
          const actionLabel = isTrial
            ? canUseTrial
              ? "Start free trial"
              : "Trial already used"
            : isCurrent
              ? "Current plan"
              : isFree
                ? "Free included"
                : isDowngrade
                  ? `Downgrade to ${plan.name}`
                  : `Upgrade to ${plan.name}`;
          const actionDisabled =
            isMutating ||
            isCurrent ||
            isFree ||
            (isTrial && !canUseTrial) ||
            accessState === "payment_pending";

          return (
            <article
              key={plan.key}
              className={`rounded-3xl border bg-white p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition ${
                isCurrent
                  ? "border-emerald-300 ring-2 ring-emerald-100"
                  : "border-slate-200 hover:border-emerald-200"
              }`}
            >
              <div className="flex min-h-[56px] items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    {plan.key}
                  </p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">
                    {plan.name}
                  </h2>
                </div>
                {isCurrent && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800">
                    Current
                  </span>
                )}
              </div>

              <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                {plan.currency || "USD"} {Number(plan.priceMonthly || 0).toLocaleString()}
                <span className="text-sm font-semibold text-slate-500">/mo</span>
              </p>
              <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-600">
                {plan.description}
              </p>

              <div className="mt-5 space-y-2">
                {(plan.features || []).map((feature: string) => (
                  <div key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                    <IconCheck className="mt-0.5 shrink-0 text-emerald-700" size={16} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">
                  Usage limits
                </p>
                <div className="mt-3 space-y-2">
                  {(plan.limits || []).map((limit: string) => (
                    <p key={limit} className="text-sm font-semibold text-slate-700">
                      {limit}
                    </p>
                  ))}
                </div>
              </div>

              {isTrial && !canUseTrial && (
                <div className="mt-4 flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
                  <IconAlertTriangle className="shrink-0" size={18} />
                  <span>You have already used your free trial.</span>
                </div>
              )}

              <Button
                fullWidth
                className="mt-6"
                color={isDowngrade ? "gray" : "green"}
                variant={isCurrent || isFree ? "default" : "filled"}
                leftSection={
                  isTrial ? (
                    <IconClock size={18} />
                  ) : plan.key === "FREE" ? (
                    <IconShieldCheck size={18} />
                  ) : (
                    <IconCreditCard size={18} />
                  )
                }
                rightSection={!actionDisabled && !isTrial ? <IconArrowRight size={18} /> : null}
                loading={
                  (isTrial && trialMutation.isPending) ||
                  (!isTrial && checkoutMutation.isPending)
                }
                disabled={actionDisabled}
                onClick={() => {
                  if (isTrial) {
                    trialMutation.mutate(undefined, {
                      onSuccess: () => toast.success("Free trial started"),
                      onError: (error: any) =>
                        toast.error(
                          error?.response?.data?.message ||
                            error?.message ||
                            "Unable to start trial",
                        ),
                    });
                    return;
                  }

                  checkoutMutation.mutate(plan.key, {
                    onSuccess: (response: any) => {
                      const checkoutUrl = response?.data?.checkoutUrl;
                      if (checkoutUrl) {
                        window.location.href = checkoutUrl;
                        return;
                      }
                      toast.success(`${plan.name} selected`);
                    },
                    onError: (error: any) =>
                      toast.error(
                        error?.response?.data?.message ||
                          error?.message ||
                          "Plan update failed",
                      ),
                  });
                }}
              >
                {actionLabel}
              </Button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
