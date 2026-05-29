import Link from "next/link";

const features = [
  {
    title: "Customer database",
    description:
      "Store customer names, phone numbers, email, notes, and tags in one searchable place.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "Booking calendar",
    description:
      "Schedule customer bookings, assign staff, and manage your daily schedule with ease.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "Quotes & Invoices",
    description:
      "Create professional quotes, convert them to invoices, and track payments — no spreadsheets needed.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Payment tracking",
    description:
      "Record payments manually for now. See what is paid, unpaid, partially paid, or overdue at a glance.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    title: "WhatsApp message templates",
    description:
      "Copy-and-send booking confirmations, invoice messages, payment reminders, and follow-ups straight through WhatsApp.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    title: "Follow-up reminders",
    description:
      "Set reminders for payment follow-ups, booking confirmations, and customer reactivation. Never let a customer slip away.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    title: "Staff schedules",
    description:
      "Assign staff to bookings, let them view their daily schedule, and keep your team coordinated.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: "Sales reports",
    description:
      "See revenue, top services, top customers, and booking summaries. Know how your business is doing.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "CSV export",
    description:
      "Export your customers, bookings, invoices, and payments as Excel-compatible CSV files anytime.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    title: "Mobile-first design",
    description:
      "Full-featured on mobile. Manage your business from anywhere, right in the browser.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
];

const industries = [
  "Hair salons",
  "Barbers",
  "Beauty salons",
  "Mechanics",
  "Mobile car washes",
  "Tutors",
  "Plumbers",
  "Electricians",
  "Cleaning businesses",
  "Fitness trainers",
  "Consultants",
  "Photographers",
];

const faqs = [
  {
    q: "Does BizChat CRM connect directly to WhatsApp?",
    a: "For the MVP, BizChat CRM creates WhatsApp-ready messages that can be copied or opened in WhatsApp. Direct WhatsApp API integration is planned for a future version.",
  },
  {
    q: "Do I need WhatsApp Business API?",
    a: "No, the MVP does not require WhatsApp Business API. You can copy messages and open them in WhatsApp immediately.",
  },
  {
    q: "Can I manage bookings?",
    a: "Yes, you can create and manage customer bookings, assign staff, and track booking status.",
  },
  {
    q: "Can I create invoices?",
    a: "Yes, you can create quotes and invoices, calculate totals, and convert accepted quotes into invoices.",
  },
  {
    q: "Can I track payments?",
    a: "Yes, payments can be recorded manually against invoices. The app updates paid, unpaid, and overdue status automatically.",
  },
  {
    q: "Can I send reminders?",
    a: "Yes, you can create follow-up and payment reminders with WhatsApp-ready message templates.",
  },
  {
    q: "Can staff use the system?",
    a: "Yes, staff can view and update assigned bookings. They see only what is relevant to their work.",
  },
  {
    q: "Can I export my data?",
    a: "Yes, customers, bookings, invoices, and payments can be exported as Excel-compatible CSV files.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes, the app is mobile-first and works in the browser on any device. No app download needed.",
  },
  {
    q: "Which businesses is it best for?",
    a: "Salons, barbers, tutors, mechanics, car washes, cleaners, consultants, and home service businesses.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Simple bookings, invoices, and customer follow-ups for WhatsApp
              businesses.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              Manage your customers, bookings, quotes, invoices, and reminders
              in one place — then send everything through WhatsApp.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="w-full rounded-xl bg-brand-600 px-8 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-700 transition-colors sm:w-auto"
              >
                Start free trial
              </Link>
              <a
                href="#features"
                className="w-full rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-center text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors sm:w-auto"
              >
                View features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Stop losing customers in your chats
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Many small businesses run through WhatsApp, but bookings,
              invoices, payments, and follow-ups get lost in chats. BizChat CRM
              gives small businesses a simple system to manage customers,
              schedule bookings, send quotes, track invoices, and follow up
              faster.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything your business needs
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              One simple tool to manage customers, bookings, invoices, payments,
              and WhatsApp follow-ups.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple steps to run your business with BizChat CRM.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                step: "1",
                title: "Add your customers",
                desc: "Store customer names, phone numbers, and details in one searchable place.",
              },
              {
                step: "2",
                title: "Add your services",
                desc: "List your services with prices and durations. Keep everything organized.",
              },
              {
                step: "3",
                title: "Create a booking",
                desc: "Schedule a booking, assign staff, and send a confirmation through WhatsApp.",
              },
              {
                step: "4",
                title: "Send quotes & invoices",
                desc: "Create professional quotes. Convert accepted quotes into invoices in one click.",
              },
              {
                step: "5",
                title: "Track payments",
                desc: "Record payments as they come in. See what is paid, unpaid, or overdue at a glance.",
              },
              {
                step: "6",
                title: "Follow up",
                desc: "Set reminders for payment follow-ups and customer reactivation. Never miss a beat.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built for small businesses
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              BizChat CRM works best for businesses that communicate with
              customers through WhatsApp.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Start with a free trial. Upgrade when you are ready.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Starter",
                price: "R149",
                period: "/month",
                desc: "Perfect for solo businesses starting out.",
                features: [
                  "Up to 100 customers",
                  "Basic bookings",
                  "Quotes & invoices",
                  "WhatsApp templates",
                  "Payment tracking",
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
            ].map((plan) => (
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
                <h3 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </h3>
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
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
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
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to simplify your business?
            </h2>
            <p className="mt-4 text-lg text-brand-100">
              Start your free trial today. No credit card required.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-block rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-brand-700 shadow-lg hover:bg-brand-50 transition-colors"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-gray-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-left text-base font-medium text-gray-900">
                  {faq.q}
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </summary>
                <div className="border-t border-gray-100 px-6 py-4">
                  <p className="text-sm text-gray-600">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
