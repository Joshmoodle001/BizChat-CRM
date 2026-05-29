"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthError } from "@/components/auth/auth-error";
import { completeOnboarding } from "@/app/onboarding/actions";

const INDUSTRIES = [
  "Hair salon", "Barber", "Beauty salon", "Mechanic",
  "Mobile car wash", "Tutor", "Plumber", "Electrician",
  "Cleaning business", "Fitness trainer", "Photographer",
  "Consultant", "Event services", "Other",
];

interface BusinessOnboardingFormProps {
  defaults: {
    businessName: string;
    industry: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
  };
}

export function BusinessOnboardingForm({ defaults }: BusinessOnboardingFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await completeOnboarding(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthError message={error} />

      <Input
        id="business_name"
        name="business_name"
        label="Business name"
        defaultValue={defaults.businessName}
        required
      />

      <div>
        <label htmlFor="industry" className="mb-1.5 block text-sm font-medium text-gray-700">
          Industry
        </label>
        <select
          id="industry"
          name="industry"
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          defaultValue={defaults.industry ?? ""}
        >
          <option value="">Select your industry</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind}>{ind}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="phone"
          name="phone"
          label="Business phone"
          defaultValue={defaults.phone ?? ""}
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Business email"
          defaultValue={defaults.email ?? ""}
        />
      </div>

      <Input
        id="address"
        name="address"
        label="Business address"
        defaultValue={defaults.address ?? ""}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="timezone"
          name="timezone"
          label="Timezone"
          defaultValue="Africa/Johannesburg"
          disabled
        />
        <Input
          id="currency"
          name="currency"
          label="Currency"
          defaultValue="ZAR"
          disabled
        />
      </div>

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Complete setup
      </Button>
    </form>
  );
}
