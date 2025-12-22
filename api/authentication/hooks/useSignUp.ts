import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "../authenticationApi";
import { signUpTypes } from "@/types/auth.types";

export function useSignUp() {

    return useMutation({
        mutationFn: (data: signUpTypes) => signUp(data),
    });
}
