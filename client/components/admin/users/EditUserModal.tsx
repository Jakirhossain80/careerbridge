"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  adminUserUpdateSchema,
  type AdminUserUpdateFormValues,
} from "@/lib/validations/admin-user.schema";
import type { AdminUser } from "@/types/admin-user.types";

type EditUserModalProps = {
  user: AdminUser | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: AdminUserUpdateFormValues) => void;
};

export default function EditUserModal({
  user,
  isLoading = false,
  onClose,
  onSubmit,
}: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AdminUserUpdateFormValues>({
    resolver: zodResolver(adminUserUpdateSchema),
    defaultValues: {
      name: user?.name ?? "",
      photoURL: user?.photoURL ?? user?.avatar ?? "",
      profileCompleted: user?.profileCompleted ?? false,
    },
  });

  useEffect(() => {
    reset({
      name: user?.name ?? "",
      photoURL: user?.photoURL ?? user?.avatar ?? "",
      profileCompleted: user?.profileCompleted ?? false,
    });
  }, [reset, user]);

  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      title="Edit user information"
      description="Update account fields supported by the admin user endpoint."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="admin-edit-user-form"
            isLoading={isLoading}
            disabled={!isDirty || !user}
          >
            Save changes
          </Button>
        </>
      }
    >
      <form
        id="admin-edit-user-form"
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Full name"
          required
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Photo URL"
          error={errors.photoURL?.message}
          helperText="Email and Firebase UID are read-only in the current API."
          {...register("photoURL")}
        />
        <label className="flex items-center gap-3 rounded-md border border-slate-200 p-3 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
            {...register("profileCompleted")}
          />
          Mark profile as completed
        </label>
      </form>
    </Modal>
  );
}
