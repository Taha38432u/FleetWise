"use client";

import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Group,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { IconTruck } from "@tabler/icons-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import { useResetPassword } from "@/api/authentication/hooks/useResetPassword";
import { toast } from "react-toastify";

// Validation schema
const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ResetPasswordPage() {
  const params = useParams(); // get token from URL
  const token = params.token as string;

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = (values: {
    password: string;
    confirmPassword: string;
  }) => {
    resetPassword(
      { token, password: values.password },
      {
        onSuccess: () => {
          toast.success("Password reset successfully!");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to reset password");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
        </div>

        <Box className="ui-card p-8 relative">
          <LoadingOverlay visible={isPending} overlayProps={{ radius: "lg" }} />

          <Text size="xl" fw={700} mb="sm">
            Reset Password
          </Text>
          <Text size="sm" color="dimmed" mb="md">
            Enter your new password below to reset your account password.
          </Text>

          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              submitCount,
            }) => (
              <Form>
                <Box mb="md">
                  <Input
                    id="password"
                    name="password"
                    label="New Password"
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.password || submitCount > 0) && errors.password
                    }
                  />
                </Box>

                <Box mb="md">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="Password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.confirmPassword || submitCount > 0) &&
                      errors.confirmPassword
                    }
                  />
                </Box>

                <Group mt="md" style={{ justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    fullWidth
                    loading={isPending}
                    color="green"
                  >
                    Reset Password
                  </Button>
                </Group>
              </Form>
            )}
          </Formik>
        </Box>
      </div>
    </div>
  );
}
