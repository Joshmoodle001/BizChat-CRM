import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

function LoginFormFallback() {
  return (
    <div className="space-y-5">
      <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
      <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
      <div className="h-11 w-full animate-pulse rounded-lg bg-brand-200" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Log in to BizChat
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email and password to continue.
          </p>
        </div>

        <div className="mt-8">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/register"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Forgot your password? Contact support to reset.
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            Start free trial
          </Link>
        </p>
      </div>
    </div>
  );
}
