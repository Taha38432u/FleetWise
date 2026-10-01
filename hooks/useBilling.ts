import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelSubscription,
  completeCheckoutSession,
  createCheckoutSession,
  getBillingPlans,
  getSubscription,
  reactivateSubscription,
  startFreeTrial,
} from "@/api/billing/billingApi";

export function useBillingPlans() {
  return useQuery({
    queryKey: ["billing", "plans"],
    queryFn: getBillingPlans,
  });
}

export function useSubscription(enabled = true) {
  return useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: getSubscription,
    enabled,
  });
}

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
  });
}

export function useCompleteCheckoutSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeCheckoutSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
  });
}

export function useReactivateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reactivateSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
  });
}

export function useStartFreeTrial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startFreeTrial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
  });
}
