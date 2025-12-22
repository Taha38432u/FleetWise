"use client";

import { useState } from "react";
import { Button, Text } from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import CustomModal from "@/components/common/Input/CustomModal";
import { useRequestPasswordReset } from "@/api/authentication/hooks/useRequestPasswordReset";
import { IconMail, IconCircleCheck } from "@tabler/icons-react";

// Validation schema
const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

interface ForgetPasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function ForgetPasswordModal({
  opened,
  onClose,
}: ForgetPasswordModalProps) {
  const [resetSent, setResetSent] = useState(false);
  const { mutate: requestReset, isPending } = useRequestPasswordReset();

  const handleSubmit = (values: { email: string }) => {
    requestReset(values, {
      onSuccess: () => {
        setResetSent(true);
      },
    });
  };

  if (resetSent) {
    return (
      <CustomModal
        opened={opened}
        onClose={() => {
          onClose();
          setResetSent(false);
        }}
        title="Reset Link Sent"
        size="sm"
      >
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <div className="mb-6 rounded-full bg-green-50 p-4 ring-1 ring-green-100">
            <IconCircleCheck
              size={48}
              className="text-green-600"
              stroke={1.5}
            />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Link Sent!
          </h3>
          <Text size="sm" className="mb-8 max-w-xs text-gray-500">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-gray-900">your email</span>.
            Please check your inbox.
          </Text>
          <Button
            onClick={() => {
              onClose();
              setResetSent(false);
            }}
            fullWidth
            size="md"
            radius="xl"
            className="bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors"
          >
            Close
          </Button>
        </div>
      </CustomModal>
    );
  }

  return (
    <CustomModal
      opened={opened}
      onClose={onClose}
      title="Reset Password"
      size="sm"
    >
      <Text size="sm" className="text-gray-600 mb-4!">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </Text>

      <Formik
        initialValues={{ email: "" }}
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
            <div className="mb-6">
              <Input
                id="email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={(touched.email || submitCount > 0) && errors.email}
                icon={<IconMail size={18} className="text-gray-400" />}
                size="md"
                radius="md"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="subtle"
                onClick={onClose}
                color="gray"
                size="md"
                radius="xl"
                className="flex-1 font-medium hover:bg-gray-50 text-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isPending}
                size="md"
                radius="xl"
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-lg shadow-gray-900/10 transition-all hover:shadow-gray-900/20"
              >
                Send Link
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
}
