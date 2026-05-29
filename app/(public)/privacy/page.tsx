import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Privacy notice
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Last updated: May 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            What we collect
          </h2>
          <p className="mt-2">
            BizChat CRM collects only the information needed to provide our
            service: business name, business contact details, business owner
            name and email, staff names and emails, and customer names, phone
            numbers, and email addresses that you enter into the platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            How we use it
          </h2>
          <p className="mt-2">
            We use this information solely to provide the BizChat CRM service to
            you — managing your customers, bookings, quotes, invoices, and
            messages. We do not sell, rent, or share your data with third
            parties for their own marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Where data is stored
          </h2>
          <p className="mt-2">
            Data is stored on Supabase infrastructure with encryption at rest
            and in transit. Files uploaded by a business are stored in
            private, business-specific storage paths and not made publicly
            accessible.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Data separation
          </h2>
          <p className="mt-2">
            Each business&apos;s data is strictly separated using row-level
            security. No business can view another business&apos;s customers,
            bookings, invoices, or any other data. Staff members can only see
            data within their own business.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Your control
          </h2>
          <p className="mt-2">
            You can export your data at any time. You can delete customer
            records, bookings, and other data from within the app. If you
            close your account, your business data will be deleted.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Customer communications
          </h2>
          <p className="mt-2">
            BizChat CRM stores customer phone numbers for the purpose of
            generating WhatsApp message templates. Messages are sent through
            your own WhatsApp application. Customer records include a
            communication opt-in flag and a &quot;do not contact&quot; flag to
            help you manage customer preferences.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
          <p className="mt-2">
            If you have questions about this privacy notice, contact us at{" "}
            <a
              href="mailto:privacy@bizchatcrm.co.za"
              className="text-brand-600 hover:text-brand-500"
            >
              privacy@bizchatcrm.co.za
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-6">
        <p className="text-xs text-gray-400">
          This privacy notice is provided for informational purposes and does
          not constitute legal advice.
        </p>
      </div>
    </div>
  );
}
