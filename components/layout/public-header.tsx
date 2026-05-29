import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-brand-600">BizChat</span>
          <span className="hidden text-lg font-semibold text-gray-900 sm:inline">
            CRM
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#features"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            How it works
          </Link>
          <Link
            href="/#industries"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Industries
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            Start free trial
          </Link>
        </div>
      </div>
    </header>
  );
}
