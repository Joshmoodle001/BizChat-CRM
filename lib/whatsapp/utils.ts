/**
 * WhatsApp utility for BizChat CRM
 * Free WhatsApp Web integration via wa.me deep links
 * No WhatsApp Business API required
 */

export function normalizePhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[\s\-\+\(\)\[\]]/g, "");

  // South African numbers: if starts with 0, convert to 27
  if (cleaned.startsWith("0")) {
    cleaned = "27" + cleaned.slice(1);
  }

  // If it starts with 27 already, keep it
  // Remove any non-digit characters (second pass for safety)
  cleaned = cleaned.replace(/\D/g, "");

  return cleaned;
}

export function isValidPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\+\(\)\[\]]/g, "").replace(/\D/g, "");
  return cleaned.length >= 7; // minimum 7 digits (landline area code + number)
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const normalized = normalizePhoneForWhatsApp(phone);
  let url = `https://wa.me/${normalized}`;

  if (message && message.trim()) {
    url += `?text=${encodeURIComponent(message.trim())}`;
  }

  return url;
}

const TEMPLATE_VARIABLES: Record<string, string> = {
  customer_name: "Customer Name",
  business_name: "Your Business",
  booking_date: "the booking date",
  booking_time: "the booking time",
  service_name: "the service",
  invoice_number: "INV-0001",
  invoice_total: "0.00",
  quote_total: "0.00",
  amount_due: "0.00",
  due_date: "the due date",
};

export function renderMessageTemplate(
  template: string,
  variables: Record<string, string>,
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || "");
  }
  // Remove any remaining unreplaced template variables
  result = result.replace(/\{\{\w+\}\}/g, "");
  return result.trim();
}

export function getTemplateVariables(): Record<string, string> {
  return { ...TEMPLATE_VARIABLES };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  } catch {
    return false;
  }
}
