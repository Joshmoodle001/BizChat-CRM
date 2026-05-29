import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { getCustomerById } from "@/lib/customers/queries";
import { deactivateCustomerAction } from "@/app/dashboard/customers/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

function formatWhatsAppPhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\+\(\)\[\]]/g, "");
  if (cleaned.startsWith("0")) cleaned = "27" + cleaned.slice(1);
  return cleaned;
}

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
  const whatsappPhone = phone ? formatWhatsAppPhone(phone) : "";

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/customers" className="mb-2 inline-block text-sm text-brand-600 hover:text-brand-500">
          &larr; Back to customers
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{c.full_name as string}</h1>
            <p className="mt-1 text-sm text-gray-500">{c.phone as string}</p>
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

      {/* Phone WhatsApp */}
      {phone && (
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/${whatsappPhone}?text=Hi ${encodeURIComponent(c.full_name as string)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Open WhatsApp
          </a>
        </div>
      )}

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

      {/* Placeholders */}
      {[
        { title: "Bookings", msg: "Bookings will be available in Phase 5." },
        { title: "Quotes", msg: "Quotes will be available in Phase 6." },
        { title: "Invoices", msg: "Invoices will be available in Phase 6." },
        { title: "Reminders", msg: "Reminders will be available in Phase 7." },
      ].map((section) => (
        <div key={section.title} className="rounded-xl border border-dashed border-gray-300 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
          <p className="mt-1 text-sm text-gray-400">{section.msg}</p>
        </div>
      ))}
    </div>
  );
}
