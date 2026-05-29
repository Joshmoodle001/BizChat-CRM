import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "R149",
    period: "/month",
    desc: "Perfect for solo businesses starting out.",
    features: [
      "Up to 100 customers",
      "Basic bookings",
      "Quotes and invoices",
      "WhatsApp message templates",
      "Payment status tracking",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Business",
    price: "R299",
    period: "/month",
    desc: "For growing businesses with a team.",
    features: [
      "Up to 500 customers",
      "Staff access",
      "Booking calendar",
      "Follow-up reminders",
      "Sales reports",
      "CSV exports",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Pro",
    price: "R599",
    period: "/month",
    desc: "For established service businesses.",
    features: [
      "Unlimited customers",
      "Multiple staff",
      "Advanced reports",
      "Custom templates",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For multi-branch and franchise groups.",
    features: [
      "Everything in Pro",
      "Multi-branch support",
      "Dedicated onboarding",
      "Custom integrations",
      "SLA support",
    ],
    cta: "Contact us",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Simple pricing for small businesses
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Start with a 14-day free trial. Upgrade when you are ready. No credit
          card required.
        </p>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-6 ${
              plan.highlight
                ? "border-brand-600 bg-white shadow-xl shadow-brand-500/10 ring-1 ring-brand-600"
                : "border-gray-200 bg-white shadow-sm"
            }`}
          >
            {plan.highlight && (
              <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                Most popular
              </span>
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {plan.name}
            </h2>
            <div className="mt-3 flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">
                {plan.price}
              </span>
              {plan.period && (
                <span className="ml-1 text-sm text-gray-500">
                  {plan.period}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">{plan.desc}</p>
            <ul className="mt-6 space-y-3 border-t border-gray-100 pt-6">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className={`mt-6 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                plan.highlight
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "bg-white text-brand-600 border border-brand-600 hover:bg-brand-50"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
