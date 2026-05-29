"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthError } from "@/components/auth/auth-error";
import { login } from "@/app/login/actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("redirect", redirectTo);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthError message={error} />

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
        placeholder="Enter your password"
        required
        autoComplete="current-password"
      />

      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={loading}
      >
        Log in
      </Button>
    </form>
  );
}
