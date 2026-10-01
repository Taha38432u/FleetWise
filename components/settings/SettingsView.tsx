"use client";

import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, Button, LoadingOverlay, Group, ThemeIcon, Text } from "@mantine/core";
import CustomModal from "@/components/common/Input/CustomModal";
import { useGetMe, useUpdateMe } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { IconUser } from "@tabler/icons-react";
import { useAuthState } from "@/components/auth/AuthProvider";
import { PageHeader, Surface } from "@/components/shared";

export default function SettingsPage() {
  const { data: me, isLoading, refetch } = useGetMe();
  const updateMutation = useUpdateMe();
  const [opened, setOpened] = useState(false);
  const { updateUser } = useAuthState();

  useEffect(() => {
    if (!me) refetch();
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
  });

  if (isLoading) {
    return <div className="ui-card-compact p-6 text-sm font-semibold text-muted">Loading settings...</div>;
  }

  return (
    <div className="ui-page max-w-3xl">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your FleetWise profile and account preferences."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Surface
          compact
          className="cursor-pointer p-4 transition-colors hover:border-green-200 hover:bg-green-50/40"
          role="button"
          tabIndex={0}
          onClick={() => setOpened(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              setOpened(true);
            }
          }}
        >
          <Group align="center">
            <ThemeIcon radius="md" size="lg" color="green">
              <IconUser size={18} />
            </ThemeIcon>
            <div>
              <Text fw={700}>Profile</Text>
              <Text size="sm" c="dimmed">View and edit your profile details</Text>
            </div>
          </Group>
        </Surface>
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
                    updateUser({
                      ...(me as any),
                      firstName: values.firstName,
                      lastName: values.lastName,
                    });
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
