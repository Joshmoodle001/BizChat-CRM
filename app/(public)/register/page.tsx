import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Create your BizChat account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Start your free trial. No credit card required.
          </p>
        </div>

        <div className="mt-8">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
