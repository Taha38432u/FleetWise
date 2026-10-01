"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Paper, Button, LoadingOverlay } from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import { IconUser, IconMail, IconLock, IconTruck } from "@tabler/icons-react";
import { useSignUp } from "@/api/authentication/hooks/useSignUp";
import { toast } from "react-toastify";
import { useAuthState } from "@/components/auth/AuthProvider";
import { getDefaultRouteForRole } from "@/lib/access";

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .test(
      "not-demo-domain",
      "Emails on @demo.com are reserved for read-only demos",
      (value) => !value?.toLowerCase().endsWith("@demo.com"),
    ),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignupPage() {
  const router = useRouter();
  const { mutate: signUpUser, isPending } = useSignUp();
  const { setSession } = useAuthState();

  const handleSignup = (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    signUpUser(
      { ...values, role: "ADMIN" },
      {
        onSuccess: (response: any) => {
          if (response?.accessToken) {
            setSession(response);
            toast.success("Account created successfully!");
            router.replace(getDefaultRouteForRole(response?.user?.role));
            return;
          }

          toast.success("Account created successfully! Please sign in.");
          router.replace("/login");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to create account");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12 pt-12">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="bg-primary p-3 rounded-xl">
              <IconTruck size={28} className="text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-ink">FLEETWISE</h1>
              <p className="text-sm font-semibold text-green-600 tracking-wide">
                FLEET MANAGEMENT
              </p>
            </div>
          </div>
          <p className="text-muted mt-2">Create your FleetWise account</p>
        </div>

        <Paper radius="lg" p={30} className="relative bg-white">
          <LoadingOverlay
            visible={isPending}
            overlayProps={{ radius: "lg" }}
            loaderProps={{ type: "bars" }}
          />

          <Formik
            initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              submitCount,
            }) => (
              <Form className="space-y-4">
                <Input
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.firstName || submitCount > 0) && errors.firstName}
                  icon={<IconUser size={18} className="text-muted" />}
                  size="md"
                  radius="lg"
                />

                <Input
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.lastName || submitCount > 0) && errors.lastName}
                  icon={<IconUser size={18} className="text-muted" />}
                  size="md"
                  radius="lg"
                />

                <Input
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="john@example.com"
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
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.password || submitCount > 0) && errors.password}
                  icon={<IconLock size={18} className="text-muted" />}
                  size="md"
                  radius="lg"
                />

                <Button
                  type="submit"
                  loading={isPending}
                  className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg"
                  size="lg"
                >
                  Sign Up
                </Button>

                <p className="text-center text-sm text-muted mt-6">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-green-600 font-medium hover:text-green-700"
                  >
                    Sign in
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </Paper>
      </div>
    </div>
  );
}
