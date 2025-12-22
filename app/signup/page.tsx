"use client";

import { useState } from "react";
import Link from "next/link";
import { Paper, Button, LoadingOverlay } from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import { IconUser, IconMail, IconLock, IconTruck, IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react";
import { useSignUp } from "@/api/authentication/hooks/useSignUp";
import { toast } from "react-toastify";

// Validation schema
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password too short").required("Password is required"),
});

export default function SignupPage() {
  const [opened, setOpened] = useState(false);
  const { mutate: signUpUser, isPending } = useSignUp();

  const handleSignup = (values: { name: string; email: string; password: string }) => {
    signUpUser(values, {
      onSuccess: () => {
        toast.success("Account created successfully! Please verify your email");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to create account");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12 pt-12">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 rounded-xl shadow-lg">
              <IconTruck size={28} className="text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-gray-900">FLEETWISE</h1>
              <p className="text-sm font-semibold text-cyan-600 tracking-wide">FLEET MANAGEMENT</p>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Create your FleetWise account</p>
        </div>

        {/* Signup Form */}
        <Paper shadow="xl" radius="lg" p={30} className="relative bg-white">
          <LoadingOverlay visible={isPending} overlayProps={{ radius: "lg" }} loaderProps={{ type: "bars" }} />

          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ handleChange, handleBlur, values, errors, touched, submitCount }) => (
              <Form className="space-y-4">
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.name || submitCount > 0) && errors.name}
                  icon={<IconUser size={18} className="text-gray-400" />}
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
                  icon={<IconMail size={18} className="text-gray-400" />}
                  size="md"
                  radius="lg"
                />

                <Input
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.password || submitCount > 0) && errors.password}
                  icon={<IconLock size={18} className="text-gray-400" />}
                  size="md"
                  radius="lg"
                />

                {/* Normal Signup Button */}
                <Button
                  type="submit"
                  loading={isPending}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-lg"
                  size="lg"
                >
                  Sign Up
                </Button>

                {/* Divider */}
                <div className="relative flex items-center py-4">
                  <div className="grow border-t border-gray-200"></div>
                  <span className="shrink mx-4 text-sm text-gray-500">or sign up with</span>
                  <div className="grow border-t border-gray-200"></div>
                </div>

                {/* OAuth Buttons - Using Mantine Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  size="lg"
                  leftSection={<IconBrandGoogle size={20} />}
                >
                  Sign up with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300  hover:bg-gray-50 hover:border-gray-400 mt-3"
                  size="lg"
                  leftSection={<IconBrandGithub size={20} />}
                >
                  Sign up with GitHub
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700">
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