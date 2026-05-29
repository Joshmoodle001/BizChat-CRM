import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { getBusinessSettings } from "@/lib/settings/queries";
import { BusinessSettingsForm } from "@/components/settings/business-settings-form";
import { ErrorState } from "@/components/ui/error-state";

export default async function SettingsPage() {
  const { profile } = await requireRole(["business_owner"]);
  const business = await getBusinessSettings(profile.business_id);

  if (!business) {
    return <ErrorState title="Business not found" message="Unable to load your business settings." retryHref="/dashboard" />;
  }

  const b = business as Record<string, unknown>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your business profile and account details.</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <BusinessSettingsForm
          defaults={{
            name: b.name as string,
            industry: (b.industry as string) || null,
            phone: (b.phone as string) || null,
            email: (b.email as string) || null,
            address: (b.address as string) || null,
            timezone: (b.timezone as string) || "Africa/Johannesburg",
            currency: (b.currency as string) || "ZAR",
            logo_url: (b.logo_url as string) || null,
            subscription_plan: (b.subscription_plan as string) || "trial",
            subscription_status: (b.subscription_status as string) || "active",
            status: (b.status as string) || "active",
            created_at: (b.created_at as string) || new Date().toISOString(),
          }}
        />
      </div>
    </div>
  );
}
