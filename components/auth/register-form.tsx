"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthError } from "@/components/auth/auth-error";
import { registerBusiness } from "@/app/register/actions";

const INDUSTRIES = [
  "Hair salon",
  "Barber",
  "Beauty salon",
  "Mechanic",
  "Mobile car wash",
  "Tutor",
  "Plumber",
  "Electrician",
  "Cleaning business",
  "Fitness trainer",
  "Photographer",
  "Consultant",
  "Event services",
  "Other",
];

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setConfirmError(null);

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerBusiness({
      businessName: formData.get("business_name") as string,
      industry: formData.get("industry") as string,
      fullName: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password,
    });

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
        type="text"
        label="Business name"
        placeholder="Your business name"
        required
      />

      <div>
        <label
          htmlFor="industry"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Industry
        </label>
        <select
          id="industry"
          name="industry"
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Select your industry
          </option>
          {INDUSTRIES.map((ind) => (
            <option key={ind}>{ind}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="full_name"
          name="full_name"
          type="text"
          label="Full name"
          placeholder="Your name"
          required
        />
        <Input
          id="phone"
          name="phone"
          type="tel"
          label="Phone"
          placeholder="082 123 4567"
        />
      </div>

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Min. 8 characters"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        error={confirmError ?? undefined}
      />

      <Input
        id="confirm_password"
        name="confirm_password"
        type="password"
        label="Confirm password"
        placeholder="Re-enter your password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmError ?? undefined}
      />

      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={loading}
      >
        Start free trial
      </Button>
    </form>
  );
}
