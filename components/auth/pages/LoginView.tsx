"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LoadingOverlay, Button, Paper } from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import { IconMail, IconLock, IconTruck } from "@tabler/icons-react";
import { useLogin } from "@/api/authentication/hooks/useLogin";
import { toast } from "react-toastify";
import ForgetPasswordModel from "@/components/auth/ForgetPasswordModel";
import { useAuthState } from "@/components/auth/AuthProvider";
import { getDefaultRouteForRole } from "@/lib/access";
import { DEMO_ACCOUNTS } from "@/lib/demoAccounts";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: loginUser, isPending } = useLogin();
  const { setSession } = useAuthState();

  const prefillEmail = searchParams.get("email") || "";
  const matchedDemo = useMemo(
    () => DEMO_ACCOUNTS.find((account) => account.email === prefillEmail),
    [prefillEmail],
  );

  const initialValues = {
    email: prefillEmail,
    password: matchedDemo?.password || "",
  };

  const handleLogin = (values: { email: string; password: string }) => {
    loginUser(values, {
      onSuccess: (response: any) => {
        if (response?.accessToken) {
          setSession(response);
          toast.success("Logged in successfully!");
          router.replace(getDefaultRouteForRole(response?.user?.role));
        } else {
          toast.error("Login succeeded but accessToken is missing!");
        }
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to login");
      },
    });
  };

  return (
    <>
      <div className="min-h-screen bg-surface">
        <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="rounded-xl bg-primary p-3">
                <IconTruck size={28} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-black tracking-tight text-ink">FLEETWISE</div>
                <div className="text-xs font-semibold tracking-widest text-primary">
                  FLEET MANAGEMENT
                </div>
              </div>
            </Link>

            <h1 className="mt-10 text-3xl font-black leading-tight text-ink lg:text-4xl">
              Sign in to your{" "}
              <span className="text-primary">role workspace</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              Use your fleet account, or open a read-only demo to browse sample data.
            </p>

            <div className="mt-8 hidden space-y-3 lg:block">
              {DEMO_ACCOUNTS.map((account) => (
                <div
                  key={account.email}
                  className="rounded-xl border border-line bg-white px-4 py-3"
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                    {account.role} · read-only
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">{account.email}</p>
                  <p className="font-mono text-xs text-muted">{account.password}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center border-t border-line bg-white px-6 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-12">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-ink">Welcome back</h2>
                <p className="mt-1 text-muted">Access your fleet dashboard</p>
              </div>

              <div className="relative">
                <Paper withBorder p={30} radius="lg" className="border border-line bg-white">
                  <LoadingOverlay
                    visible={isPending}
                    overlayProps={{ radius: "lg" }}
                    loaderProps={{ type: "bars" }}
                  />

                  <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={LoginSchema}
                    onSubmit={handleLogin}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      values,
                      errors,
                      touched,
                      submitCount,
                      setFieldValue,
                    }) => (
                      <Form className="space-y-5">
                        <div className="grid grid-cols-3 gap-2">
                          {DEMO_ACCOUNTS.map((account) => (
                            <button
                              key={account.role}
                              type="button"
                              onClick={() => {
                                setFieldValue("email", account.email);
                                setFieldValue("password", account.password);
                              }}
                              className="rounded-lg border border-green-200 bg-green-50 px-2 py-2.5 text-xs font-extrabold text-primary transition hover:bg-green-100"
                            >
                              {account.role}
                            </button>
                          ))}
                        </div>
                        <p className="text-center text-[11px] font-semibold text-muted">
                          Demo accounts are read-only
                        </p>

                        <Input
                          id="email"
                          name="email"
                          label="Email Address"
                          type="email"
                          placeholder="fleet.manager@company.com"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={(touched.email || submitCount > 0) && errors.email}
                          icon={<IconMail size={18} className="text-muted" />}
                          size="md"
                          radius="lg"
                        />

                        <Input
                          id="password"
                          name="password"
                          label="Password"
                          type="password"
                          placeholder="At least 8 characters"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={(touched.password || submitCount > 0) && errors.password}
                          icon={<IconLock size={18} className="text-muted" />}
                          size="md"
                          radius="lg"
                        />

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setOpened(true)}
                            className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                          >
                            Forgot password?
                          </button>
                        </div>

                        <Button
                          type="submit"
                          loading={isPending}
                          className="h-12 w-full rounded-lg bg-primary font-semibold text-white transition-all duration-200 hover:bg-primary-hover"
                          size="lg"
                        >
                          {isPending ? "Signing in..." : "Sign In to Dashboard"}
                        </Button>

                        <div className="relative flex items-center py-2">
                          <div className="grow border-t border-line" />
                          <span className="mx-4 shrink text-sm text-muted">New to FleetWise?</span>
                          <div className="grow border-t border-line" />
                        </div>

                        <Button
                          component={Link}
                          href="/signup"
                          variant="outline"
                          className="h-12 w-full rounded-lg border-2 border-green-200 font-semibold text-green-600 transition-colors duration-200 hover:border-green-300 hover:bg-green-50"
                          size="lg"
                        >
                          Create Fleet Account
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>

      {opened && (
        <ForgetPasswordModel opened={opened} onClose={() => setOpened(false)} />
      )}
    </>
  );
}
