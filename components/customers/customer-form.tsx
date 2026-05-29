"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { AuthError } from "@/components/auth/auth-error";
import { createCustomerAction, updateCustomerAction } from "@/app/dashboard/customers/actions";

interface CustomerFormProps {
  mode: "create" | "edit";
  customerId?: string;
  defaults?: {
    full_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    source?: string;
    tags?: string;
    notes?: string;
    communication_opt_in?: boolean;
    do_not_contact?: boolean;
    status?: string;
  };
}

export function CustomerForm({ mode, customerId, defaults = {} }: CustomerFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const action = mode === "create"
      ? await createCustomerAction(formData)
      : await updateCustomerAction(customerId!, formData);

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

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full name" error={fieldErrors.full_name} required>
          <Input id="full_name" name="full_name" defaultValue={defaults.full_name} placeholder="Customer's full name" />
        </FormField>

        <FormField label="Phone" error={fieldErrors.phone} required>
          <Input id="phone" name="phone" type="tel" defaultValue={defaults.phone} placeholder="082 123 4567" />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Email" error={fieldErrors.email}>
          <Input id="email" name="email" type="email" defaultValue={defaults.email} placeholder="customer@example.com" />
        </FormField>

        <FormField label="Address">
          <Input id="address" name="address" defaultValue={defaults.address} placeholder="Physical address" />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Source" hint="How did this customer find you?">
          <select
            id="source"
            name="source"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            defaultValue={defaults.source ?? ""}
          >
            <option value="">Select source</option>
            <option>Walk-in</option>
            <option>WhatsApp</option>
            <option>Facebook</option>
            <option>Referral</option>
            <option>Website</option>
            <option>Other</option>
          </select>
        </FormField>

        <FormField label="Tags" hint="Comma-separated (e.g. VIP, Repeat)">
          <Input id="tags" name="tags" defaultValue={defaults.tags} placeholder="VIP, Repeat customer" />
        </FormField>
      </div>

      <FormField label="Notes">
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          defaultValue={defaults.notes}
          placeholder="Internal notes about this customer"
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Communication opt-in">
          <select
            id="communication_opt_in"
            name="communication_opt_in"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            defaultValue={defaults.communication_opt_in !== false ? "true" : "false"}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </FormField>

        <FormField label="Do not contact">
          <select
            id="do_not_contact"
            name="do_not_contact"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            defaultValue={defaults.do_not_contact ? "true" : "false"}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
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
            <option value="archived">Archived</option>
          </select>
        </FormField>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Create customer" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
