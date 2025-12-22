"use client";

import { Modal, Button, Group, Text, Box, LoadingOverlay } from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import { useRequestPasswordReset } from "@/api/authentication/hooks/useRequestPasswordReset";

// Validation schema
const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

interface ForgetPasswordModelProps {
  opened: boolean;
  onClose: () => void;
}

export default function ForgetPasswordModel({
  opened,
  onClose,
}: ForgetPasswordModelProps) {
  //   const theme = useMantineTheme();
  const { mutate: requestReset, isPending } = useRequestPasswordReset();

  const handleSubmit = (values: { email: string }) => {
    requestReset(values, {
      onSuccess: () => onClose(), // close modal after success
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Reset Password"
      centered
      radius="md"
    >
      <Box style={{ position: "relative" }}>
        <LoadingOverlay visible={isPending} overlayProps={{ blur: 2 }} />

        <Text size="sm" color="dimmed" mb="md">
          Enter your email address below and we will send you a link to reset
          your password.
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
              <Input
                id="email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={(touched.email || submitCount > 0) && errors.email}
              />

              <Group mt="md" style={{ justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  fullWidth
                  loading={isPending}
                  color="blue"
                >
                  Send Reset Link
                </Button>
              </Group>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
