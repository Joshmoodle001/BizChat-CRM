import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-brand-600">BizChat CRM</h3>
            <p className="mt-2 text-sm text-gray-500">
              Simple bookings, invoices, and customer follow-ups for WhatsApp
              businesses.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Product</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Company</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@bizchatcrm.co.za"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Industries</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-gray-500">
                  Salons, Barbers, Mechanics
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-500">
                  Cleaners, Tutors, Plumbers
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-500">
                  Home services, Consultants
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} BizChat CRM. Built for South
            African small businesses.
          </p>
        </div>
      </div>
    </footer>
  );
}
