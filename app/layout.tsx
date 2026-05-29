import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "BizChat CRM — Simple bookings, invoices & customer follow-ups for WhatsApp",
  description:
    "Manage your customers, bookings, quotes, invoices, and reminders in one place — then send everything through WhatsApp. Built for South African small businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
