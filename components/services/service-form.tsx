"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { AuthError } from "@/components/auth/auth-error";
import { createServiceAction, updateServiceAction } from "@/app/dashboard/services/actions";

interface ServiceFormProps {
  mode: "create" | "edit";
  serviceId?: string;
  defaults?: {
    name?: string;
    description?: string;
    category?: string;
    duration_minutes?: number;
    price?: number;
    status?: string;
  };
}

export function ServiceForm({ mode, serviceId, defaults = {} }: ServiceFormProps) {
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
      ? await createServiceAction(formData)
      : await updateServiceAction(serviceId!, formData);

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
        <FormField label="Service name" error={fieldErrors.name} required>
          <Input id="name" name="name" defaultValue={defaults.name} placeholder="e.g. Haircut" />
        </FormField>

        <FormField label="Category" hint="e.g. Hair, Beauty, Repair">
          <select
            id="category"
            name="category"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            defaultValue={defaults.category ?? ""}
          >
            <option value="">Select category</option>
            <option>Hair</option>
            <option>Beauty</option>
            <option>Cleaning</option>
            <option>Repair</option>
            <option>Tutoring</option>
            <option>Consulting</option>
            <option>Other</option>
          </select>
        </FormField>
      </div>

      <FormField label="Description">
        <textarea
          id="description"
          name="description"
          rows={2}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          defaultValue={defaults.description}
          placeholder="Describe this service"
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Duration (minutes)" error={fieldErrors.duration_minutes} required>
          <Input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min="1"
            defaultValue={defaults.duration_minutes ?? 60}
          />
        </FormField>

        <FormField label="Price (ZAR)" error={fieldErrors.price} required>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaults.price ?? 0}
          />
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
          {mode === "create" ? "Create service" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
