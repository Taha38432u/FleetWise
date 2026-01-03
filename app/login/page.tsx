"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingOverlay, Button, Paper } from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import {
  IconMail,
  IconLock,
  IconTruck,
} from "@tabler/icons-react";
import { useLogin } from "@/api/authentication/hooks/useLogin";
import { toast } from "react-toastify";
import ForgetPasswordModel from "@/components/auth/ForgetPasswordModel";

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const [showPassword] = useState(false);
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const { mutate: loginUser, isPending } = useLogin();

  const handleLogin = (values: { email: string; password: string }) => {
    loginUser(values, {
      onSuccess: (response: any) => {
        // backend now returns { accessToken, refreshToken, user }
        if (response?.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
          if (response.refreshToken) {
            localStorage.setItem("refreshToken", response.refreshToken);
          }
          localStorage.setItem("user", JSON.stringify(response.user));
          
          toast.success("Logged in successfully!");
          router.replace("/dashboard");
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
      {/* Background */}
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-gray-50">
        <div className="container mx-auto">
          <div className="min-h-screen flex flex-col">
            {/* Left Side - Brand & Features */}
            <div className="w-full p-8 lg:p-12 flex flex-col justify-center items-center">
              {/* Logo */}
              <div className="mb-8 lg:mb-0">
                <Link href="/" className="inline-flex items-center gap-3 group">
                  <div className="bg-linear-to-br from-primary to-cyan-500 p-3 rounded-xl shadow-lg">
                    <IconTruck size={28} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-black text-gray-900 tracking-tight">
                      FLEETWISE
                    </div>
                    <div className="text-xs font-semibold text-cyan-600 tracking-widest">
                      FLEET MANAGEMENT
                    </div>
                  </div>
                </Link>
              </div>

              {/* Hero Content */}
              <div className="max-w-lg">
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                  Optimize Your{" "}
                  <span className="bg-linear-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                    Fleet Operations
                  </span>
                </h1>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="bg-white p-8 flex items-center justify-center">
              <div className="w-full max-w-md">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600">
                    Sign in to access your fleet dashboard
                  </p>
                </div>

                {/* Login Form */}
                <div className="relative">
                  <Paper
                    withBorder
                    shadow="md"
                    p={30}
                    radius="lg"
                    className="bg-white border border-gray-200"
                  >
                    <LoadingOverlay
                      visible={isPending}
                      overlayProps={{ radius: "lg" }}
                      loaderProps={{ type: "bars" }}
                    />

                    <Formik
                      initialValues={{ email: "", password: "" }}
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
                      }) => (
                        <Form className="space-y-5">
                          {/* Email Input */}
                          <div>
                            <Input
                              id="email"
                              name="email"
                              label="Email Address"
                              type="email"
                              placeholder="fleet.manager@company.com"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                (touched.email || submitCount > 0) &&
                                errors.email
                              }
                              icon={
                                <IconMail size={18} className="text-gray-400" />
                              }
                              size="md"
                              radius="lg"
                            />
                          </div>

                          {/* Password Input */}
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              label="Password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                (touched.password || submitCount > 0) &&
                                errors.password
                              }
                              icon={
                                <IconLock size={18} className="text-gray-400" />
                              }
                              size="md"
                              radius="lg"
                            />
                          </div>

                          {/* Forgot Password */}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setOpened(true)}
                              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                            >
                              Forgot password?
                            </button>
                          </div>

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            loading={isPending}
                            className="w-full h-12 bg-linear-to-r from-primary to-cyan-500 hover:from-primary-hover hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            size="lg"
                          >
                            {isPending
                              ? "Signing in..."
                              : "Sign In to Dashboard"}
                          </Button>

                          {/* Divider */}
                          <div className="relative flex items-center py-4">
                            <div className="grow border-t border-gray-200"></div>
                            <span className="shrink mx-4 text-sm text-gray-500">
                              New to FleetWise?
                            </span>
                            <div className="grow border-t border-gray-200"></div>
                          </div>

                          {/* Sign Up Button */}
                          <div className="flex flex-col gap-4 w-full">
                            <Button
                              component={Link}
                              href="/signup"
                              variant="outline"
                              className="w-full h-12 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold rounded-lg transition-colors duration-200"
                              size="lg"
                            >
                              Create Fleet Account
                            </Button>
                          </div>

                          {/* Terms */}
                          <p className="text-xs text-gray-500 text-center pt-4">
                            By signing in, you agree to our{" "}
                            <a
                              href="#"
                              className="text-primary hover:text-primary-hover font-medium"
                            >
                              Terms
                            </a>{" "}
                            and{" "}
                            <a
                              href="#"
                              className="text-primary hover:text-primary-hover font-medium"
                            >
                              Privacy Policy
                            </a>
                          </p>
                        </Form>
                      )}
                    </Formik>
                  </Paper>
                </div>

                {/* Mobile-only sign up link */}
                <div className="lg:hidden text-center mt-6">
                  <p className="text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-primary font-semibold hover:text-primary-hover"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {opened && (
        <ForgetPasswordModel opened={opened} onClose={() => setOpened(false)} />
      )}
    </>
  );
}
