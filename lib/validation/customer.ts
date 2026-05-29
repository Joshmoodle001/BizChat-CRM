export function validateCustomer(input: {
  full_name: string;
  phone: string;
  email?: string;
}) {
  const errors: Record<string, string> = {};

  if (!input.full_name || input.full_name.trim().length === 0) {
    errors.full_name = "Full name is required.";
  }

  if (!input.phone || input.phone.trim().length === 0) {
    errors.phone = "Phone number is required.";
  }

  if (input.email && input.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      errors.email = "Please enter a valid email address.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
