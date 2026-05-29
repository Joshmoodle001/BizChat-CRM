import { createClient } from "@/lib/supabase/server";

const DEFAULT_TEMPLATES = [
  {
    name: "Booking confirmation",
    template_type: "booking_confirmation",
    content:
      "Hi {{customer_name}}, your booking with {{business_name}} is confirmed for {{booking_date}} at {{booking_time}} for {{service_name}}. Please reply YES to confirm.",
  },
  {
    name: "Booking reminder",
    template_type: "booking_reminder",
    content:
      "Hi {{customer_name}}, reminder for your booking with {{business_name}} tomorrow at {{booking_time}} for {{service_name}}. See you soon.",
  },
  {
    name: "Quote message",
    template_type: "quote_message",
    content:
      "Hi {{customer_name}}, here is your quote from {{business_name}}. Quote total: R{{quote_total}}. Please reply if you would like to go ahead.",
  },
  {
    name: "Invoice message",
    template_type: "invoice_message",
    content:
      "Hi {{customer_name}}, here is your invoice from {{business_name}}. Invoice number: {{invoice_number}}. Amount due: R{{amount_due}}. Due date: {{due_date}}.",
  },
  {
    name: "Payment reminder",
    template_type: "payment_reminder",
    content:
      "Hi {{customer_name}}, friendly reminder that invoice {{invoice_number}} from {{business_name}} has an outstanding amount of R{{amount_due}} due on {{due_date}}.",
  },
  {
    name: "Thank-you message",
    template_type: "thank_you",
    content:
      "Hi {{customer_name}}, thank you for choosing {{business_name}}. We appreciate your support.",
  },
  {
    name: "Follow-up message",
    template_type: "follow_up",
    content:
      "Hi {{customer_name}}, just following up from {{business_name}}. Let us know if you would like to book again or need anything else.",
  },
  {
    name: "Reactivation message",
    template_type: "reactivation",
    content:
      "Hi {{customer_name}}, it has been a while since we last saw you at {{business_name}}. Would you like to book again?",
  },
];

export async function seedDefaultTemplates(businessId: string) {
  const supabase = await createClient();

  const templates = DEFAULT_TEMPLATES.map((t) => ({
    ...t,
    business_id: businessId,
  }));

  const { error } = await supabase.from("message_templates").insert(templates);

  if (error) {
    console.error("Failed to seed default message templates:", error.message);
  }
}
