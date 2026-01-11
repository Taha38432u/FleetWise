"use client";

import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, Button, LoadingOverlay, Paper, Group, ThemeIcon, Text } from "@mantine/core";
import CustomModal from "@/components/common/Input/CustomModal";
import { useGetMe, useUpdateMe } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { IconUser } from "@tabler/icons-react";

export default function SettingsPage() {
  const { data: me, isLoading, refetch } = useGetMe();
  const updateMutation = useUpdateMe();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!me) refetch();
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Paper
          withBorder
          radius="md"
          p="md"
          className="cursor-pointer hover:shadow-lg"
          onClick={() => setOpened(true)}
        >
          <Group align="center">
            <ThemeIcon radius="md" size="lg" color="blue">
              <IconUser size={18} />
            </ThemeIcon>
            <div>
              <Text fw={700}>Profile</Text>
              <Text size="sm" c="dimmed">View and edit your profile details</Text>
            </div>
          </Group>
        </Paper>
      </div>

      <CustomModal opened={opened} onClose={() => setOpened(false)} title="Edit Profile">
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={Boolean((updateMutation as any).isLoading)} />
          <Formik
            enableReinitialize
            initialValues={{
              firstName: (me as any)?.firstName || "",
              lastName: (me as any)?.lastName || "",
              email: (me as any)?.email || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              updateMutation.mutate(
                { firstName: values.firstName, lastName: values.lastName },
                {
                  onSuccess: () => {
                    toast.success("Profile updated");
                    setSubmitting(false);
                    setOpened(false);
                  },
                  onError: (err: any) => {
                    toast.error(err?.message || "Update failed");
                    setSubmitting(false);
                  },
                }
              );
            }}
          >
            {({ values, errors, touched, handleChange, isSubmitting }) => (
              <Form>
                <div className="space-y-4">
                  <TextInput
                    name="email"
                    label="Email"
                    value={values.email}
                    onChange={() => {}}
                    disabled
                  />
                  <TextInput
                    name="firstName"
                    label="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    error={touched.firstName && (errors.firstName as string)}
                  />
                  <TextInput
                    name="lastName"
                    label="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    error={touched.lastName && (errors.lastName as string)}
                  />

                  <div className="flex gap-3">
                    <Button variant="default" onClick={() => setOpened(false)} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button type="submit" loading={isSubmitting}>
                      Save
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </CustomModal>
    </div>
  );
}
