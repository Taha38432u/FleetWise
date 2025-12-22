"use client";

import Link from "next/link";
import {
  Paper,
  Title,
  Text,
  Container,
  Group,
  Box,
  useMantineTheme,
  LoadingOverlay,
} from "@mantine/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/Input/CustomInput";
import CustomButton from "@/components/common/Button/CustomButton";
import { IconWallet, IconMail, IconUser } from "@tabler/icons-react";
import { useSignUp } from "@/api/authentication/hooks/useSignUp";
import { toast } from "react-toastify";

// Validation schema
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignupPage() {
  const theme = useMantineTheme();
  const { mutate: signUpUser, isPending } = useSignUp();

  const handleSignup = (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    signUpUser(values, {
      onSuccess: () => {
        toast.success("Account created successfully!, Plese Verify Your Email");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to create account");
      },
    });
  };

  return (
    <Container size={500} my={20}>
      {/* Logo Section */}
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Box
          style={{
            background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.cyan[6]} 100%)`,
            borderRadius: "50%",
            padding: 16,
            boxShadow: "0 8px 32px rgba(0, 98, 255, 0.2)",
          }}
        >
          <IconWallet size={48} stroke={1.5} color="white" />
        </Box>
      </Box>

      {/* Header Section */}
      <Box ta="center" mb={40}>
        <Title
          order={1}
          fw={800}
          style={{
            background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.cyan[6]} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Expense Flow
        </Title>
        <Title order={2} mt="xs" fw={700} c="dark.4">
          Create Your Account
        </Title>
        <Text
          c="dimmed"
          size="sm"
          mt={8}
          style={{ maxWidth: 300, margin: "0 auto" }}
        >
          Fill in the form below to create a new account and start managing your
          expenses
        </Text>
      </Box>

      {/* Signup Form */}
      <Paper
        withBorder
        shadow="xl"
        p={40}
        mt={20}
        radius="lg"
        style={{
          background: "white",
          border: `1px solid ${theme.colors.gray[2]}`,
          position: "relative",
        }}
      >
        <LoadingOverlay
          visible={isPending}
          overlayProps={{ radius: "lg", blur: 2 }}
          loaderProps={{ type: "bars" }}
        />

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
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
            <Form>
              <Box mb="lg">
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.name || submitCount > 0) && errors.name}
                  icon={<IconUser size={18} color={theme.colors.gray[5]} />}
                />
              </Box>

              <Box mb="lg">
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
                  icon={<IconMail size={18} color={theme.colors.gray[5]} />}
                />
              </Box>

              <Box mb="lg">
                <Input
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    (touched.password || submitCount > 0) && errors.password
                  }
                  icon={<IconWallet size={18} color={theme.colors.gray[5]} />}
                />
              </Box>

              <Group justify="space-between" mt="lg" mb="xl">
                <Link href="/login" style={{ textDecoration: "none" }}>
                  <Text size="sm" c="blue.6" style={{ fontWeight: 500 }}>
                    Already have an account? Sign in
                  </Text>
                </Link>
              </Group>

              <CustomButton type="submit" isLoading={isPending} variant="login">
                {isPending ? "Creating Account..." : "Sign Up"}
              </CustomButton>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}
