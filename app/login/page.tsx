"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LoadingOverlay,
  Button,
  Paper,
} from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import {
  IconMail,
  IconLock,
  IconTruck,
  IconDashboard,
  IconShieldCheck,
  IconGasStation,
  // IconSpeed,
  IconChecklist,
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

const features = [
  {
    icon: <IconTruck className="w-6 h-6" />,
    title: "Real-time Fleet Tracking",
    description: "Monitor all vehicles in real-time with live GPS tracking",
  },
  {
    icon: <IconDashboard className="w-6 h-6" />,
    title: "Smart Dashboards",
    description: "Customizable dashboards with key metrics and analytics",
  },
  {
    icon: <IconGasStation className="w-6 h-6" />,
    title: "Fuel Management",
    description: "Track fuel consumption and optimize fuel costs",
  },
  {
    icon: <IconChecklist className="w-6 h-6" />,
    title: "Maintenance Scheduling",
    description: "Automated maintenance alerts and scheduling",
  },
  {
    icon: <IconGasStation className="w-6 h-6" />,
    title: "Performance Analytics",
    description: "Detailed reports on vehicle and driver performance",
  },
  {
    icon: <IconShieldCheck className="w-6 h-6" />,
    title: "Safety Compliance",
    description: "Ensure compliance with safety regulations",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [opened, setOpened] = useState(false);
  const { mutate: loginUser, isPending } = useLogin();

  const handleLogin = (values: { email: string; password: string }) => {
    loginUser(values, {
      onSuccess: (response: any) => {
        if (response?.ok && response.data?.token) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          toast.success("Logged in successfully!");
        } else {
          toast.error("Login succeeded but token is missing!");
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <div className="container mx-auto">
          <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Brand & Features */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
              {/* Logo */}
              <div className="mb-8 lg:mb-0">
                <Link href="/" className="inline-flex items-center gap-3 group">
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 rounded-xl shadow-lg">
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
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  Optimize Your{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Fleet Operations
                  </span>
                </h1>
                {/* <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                  Enterprise-grade fleet management platform trusted by 500+ companies 
                  to streamline operations, reduce costs, and improve efficiency.
                </p> */}

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <div className="text-blue-600">{feature.icon}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm mb-1">
                            {feature.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-gray-600">Companies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-600">10K+</div>
                    <div className="text-sm text-gray-600">Vehicles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sky-600">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>

                {/* Trust Badges */}
                {/* <div className="border-t border-gray-200 pt-6">
                  <div className="text-sm text-gray-500 mb-3">Trusted by industry leaders</div>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      ISO 27001
                    </div>
                    <div className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      SOC 2 Type II
                    </div>
                    <div className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      GDPR Compliant
                    </div>
                    <div className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      HIPAA Ready
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} FleetWise. All rights reserved.
                </p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:w-1/2 bg-white p-8 lg:p-12 flex items-center justify-center">
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
                              error={(touched.email || submitCount > 0) && errors.email}
                              icon={<IconMail size={18} className="text-gray-400" />}
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
                                (touched.password || submitCount > 0) && errors.password
                              }
                              icon={<IconLock size={18} className="text-gray-400" />}
                              size="md"
                              radius="lg"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
                            >
                              {showPassword ? "Hide" : "Show"}
                            </button>
                          </div>

                          {/* Forgot Password */}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setOpened(true)}
                              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              Forgot password?
                            </button>
                          </div>

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            loading={isPending}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            size="lg"
                          >
                            {isPending ? "Signing in..." : "Sign In to Dashboard"}
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
                          <Link href="/signup">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full h-12 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold rounded-lg transition-colors duration-200"
                              size="lg"
                            >
                              Create Fleet Account
                            </Button>
                          </Link>

                          {/* SSO Button */}
                          <button
                            type="button"
                            className="w-full py-3 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 mt-2"
                          >
                            <IconShieldCheck size={20} className="text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Sign in with SSO
                            </span>
                          </button>

                          {/* Terms */}
                          <p className="text-xs text-gray-500 text-center pt-4">
                            By signing in, you agree to our{" "}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                              Terms
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
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
                    <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
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