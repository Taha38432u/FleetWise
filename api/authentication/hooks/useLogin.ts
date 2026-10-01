import { useMutation } from "@tanstack/react-query";
import { login } from "../authenticationApi";
import { loginTypes } from "@/types/auth.types";

export function useLogin() {

    return useMutation({
        mutationFn: (data: loginTypes) => login(data),
    });
}
