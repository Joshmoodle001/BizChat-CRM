"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { AuthError } from "@/components/auth/auth-error";
import { updateBusinessSettingsAction } from "@/app/dashboard/settings/actions";

interface BusinessSettingsFormProps {
  defaults: {
    name: string;
    industry: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    timezone: string;
    currency: string;
    logo_url: string | null;
    subscription_plan: string;
    subscription_status: string;
    status: string;
    created_at: string;
  };
}

export function BusinessSettingsForm({ defaults }: BusinessSettingsFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const result = await updateBusinessSettingsAction(formData);

    if (result?.errors) {
      setFieldErrors(result.errors);
      setLoading(false);
    } else if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setSuccess(result.success);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AuthError message={error} />
      {success && (
        <div className="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700">
          {success}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Business name" error={fieldErrors.name} required>
          <Input id="name" name="name" defaultValue={defaults.name} />
        </FormField>

        <FormField label="Industry">
          <select
            id="industry"
            name="industry"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            defaultValue={defaults.industry ?? ""}
          >
            <option value="">Select industry</option>
            <option>Hair salon</option>
            <option>Barber</option>
            <option>Beauty salon</option>
            <option>Mechanic</option>
            <option>Mobile car wash</option>
            <option>Tutor</option>
            <option>Plumber</option>
            <option>Electrician</option>
            <option>Cleaning business</option>
            <option>Fitness trainer</option>
            <option>Photographer</option>
            <option>Consultant</option>
            <option>Event services</option>
            <option>Other</option>
          </select>
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Business phone">
          <Input id="phone" name="phone" type="tel" defaultValue={defaults.phone ?? ""} />
        </FormField>

        <FormField label="Business email" error={fieldErrors.email}>
          <Input id="email" name="email" type="email" defaultValue={defaults.email ?? ""} />
        </FormField>
      </div>

      <FormField label="Business address">
        <Input id="address" name="address" defaultValue={defaults.address ?? ""} />
      </FormField>

      <FormField label="Logo URL" hint="File upload coming soon">
        <Input id="logo_url" name="logo_url" defaultValue={defaults.logo_url ?? ""} placeholder="https://..." />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Timezone">
          <Input id="timezone" name="timezone" defaultValue={defaults.timezone} />
        </FormField>

        <FormField label="Currency">
          <Input id="currency" name="currency" defaultValue={defaults.currency} />
        </FormField>
      </div>

      <Button type="submit" loading={loading}>
        Save settings
      </Button>

      {/* Read-only info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-700">Account info</h3>
        <dl className="mt-2 grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-gray-500">Plan</dt>
            <dd className="text-sm font-medium text-gray-900 capitalize">{defaults.subscription_plan}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Subscription status</dt>
            <dd className="text-sm font-medium text-gray-900 capitalize">{defaults.subscription_status.replace(/_/g, " ")}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Business status</dt>
            <dd className="text-sm font-medium text-gray-900 capitalize">{defaults.status}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Member since</dt>
            <dd className="text-sm font-medium text-gray-900">
              {new Date(defaults.created_at).toLocaleDateString("en-ZA")}
            </dd>
          </div>
        </dl>
      </div>
    </form>
  );
}
