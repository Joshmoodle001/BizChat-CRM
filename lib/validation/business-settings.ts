export function validateBusinessSettings(input: {
  name: string;
  email?: string;
  timezone: string;
  currency: string;
}) {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length === 0) {
    errors.name = "Business name is required.";
  }

  if (input.email && input.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      errors.email = "Please enter a valid email address.";
    }
  }

  if (!input.timezone) {
    errors.timezone = "Timezone is required.";
  }

  if (!input.currency) {
    errors.currency = "Currency is required.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
