import { requireRole } from "@/lib/auth/require-role";
import { BusinessOnboardingForm } from "@/components/onboarding/business-onboarding-form";

export default async function OnboardingPage() {
  const { profile, business } = await requireRole(["business_owner"]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome to BizChat CRM
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Let&apos;s set up your business profile. You can change these later.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <BusinessOnboardingForm
            defaults={{
              businessName: business?.name ?? "",
              industry: business?.industry ?? null,
              phone: business?.phone ?? null,
              email: business?.email ?? null,
              address: business?.address ?? null,
            }}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-900">Next steps</h2>
          <ol className="mt-3 space-y-3 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                1
              </span>
              Add your services (what you offer and at what price)
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                2
              </span>
              Add your first customers
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                3
              </span>
              Create your first booking and send a WhatsApp confirmation
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                4
              </span>
              Create invoices and track payments
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
