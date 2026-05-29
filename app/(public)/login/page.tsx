import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

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
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
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
