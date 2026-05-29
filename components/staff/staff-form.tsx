"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { AuthError } from "@/components/auth/auth-error";
import { createStaffAction } from "@/app/dashboard/staff/actions";

interface StaffFormProps {
  defaults?: {
    full_name?: string;
    email?: string;
    phone?: string;
    status?: string;
  };
}

export function StaffForm({ defaults = {} }: StaffFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const action = await createStaffAction(formData);

    if (action?.errors) {
      setFieldErrors(action.errors);
      setLoading(false);
    } else if (action?.error) {
      setError(action.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthError message={error} />

      <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3">
        <p className="text-sm text-warning-700">
          Full email invite flow will be added later. For now, this creates a staff profile placeholder. Staff login will be connected in the auth invite phase.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full name" error={fieldErrors.full_name} required>
          <Input id="full_name" name="full_name" defaultValue={defaults.full_name} placeholder="Staff member's name" />
        </FormField>

        <FormField label="Email" error={fieldErrors.email} required>
          <Input id="email" name="email" type="email" defaultValue={defaults.email} placeholder="staff@yourbusiness.co.za" />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Phone">
          <Input id="phone" name="phone" type="tel" defaultValue={defaults.phone} placeholder="082 123 4567" />
        </FormField>

        <FormField label="Status">
          <select
            id="status"
            name="status"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            defaultValue={defaults.status ?? "active"}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </FormField>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          Add staff member
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
