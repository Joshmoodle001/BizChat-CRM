import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { getCustomerById } from "@/lib/customers/queries";
import { deactivateCustomerAction } from "@/app/dashboard/customers/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { WhatsAppLink } from "@/components/whatsapp/whatsapp-link";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile } = await requireRole(["business_owner"]);
  const customer = await getCustomerById(id, profile.business_id);

  if (!customer) {
    return <ErrorState title="Customer not found" message="This customer does not exist or you do not have access." retryHref="/dashboard/customers" />;
  }

  const c = customer as Record<string, unknown>;
  const tags = (c.tags as string[]) ?? [];
  const phone = (c.phone as string) || "";
  const greetingMessage = `Hi ${c.full_name}, `;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/customers" className="mb-2 inline-block text-sm text-brand-600 hover:text-brand-500">
          &larr; Back to customers
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{c.full_name as string}</h1>
            <p className="mt-1 text-sm text-gray-500">{phone || "No phone number"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/dashboard/customers/${id}/edit`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
            <form action={deactivateCustomerAction.bind(null, id)}>
              <Button variant="danger" size="sm">Deactivate</Button>
            </form>
          </div>
        </div>
      </div>

      {/* WhatsApp */}
      <WhatsAppLink
        phone={phone}
        message={greetingMessage}
        label="Chat on WhatsApp"
        showCopy
      />

      {/* Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold text-gray-900">Customer details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Email", value: (c.email as string) || "—" },
            { label: "Address", value: (c.address as string) || "—" },
            { label: "Source", value: (c.source as string) || "—" },
            { label: "Communication opt-in", value: c.communication_opt_in ? "Yes" : "No" },
            { label: "Do not contact", value: c.do_not_contact ? "Yes" : "No" },
            { label: "Status", value: <StatusBadge status={c.status as string} /> },
            { label: "Created", value: new Date(c.created_at as string).toLocaleDateString("en-ZA") },
            { label: "Updated", value: new Date(c.updated_at as string).toLocaleDateString("en-ZA") },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-xs font-medium text-gray-500">{item.label}</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{item.value}</dd>
            </div>
          ))}
        </dl>

        {tags.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <dt className="text-xs font-medium text-gray-500">Tags</dt>
            <dd className="mt-1 flex flex-wrap gap-1">
              {tags.map((t: string) => (
                <span key={t} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                  {t}
                </span>
              ))}
            </dd>
          </div>
        )}

        <div className="mt-4 border-t border-gray-100 pt-4">
          <dt className="text-xs font-medium text-gray-500">Notes</dt>
          <dd className="mt-1 text-sm text-gray-700">{(c.notes as string) || "No notes"}</dd>
        </div>
      </div>

      {/* Upcoming features */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900">Bookings &amp; Quotes</h3>
          <p className="mt-1 text-xs text-gray-400">
            Booking history, quotes, and invoices will appear here as features are added.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900">Reminders</h3>
          <p className="mt-1 text-xs text-gray-400">
            Follow-up reminders and payment tracking will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
