export function validateService(input: {
  name: string;
  duration_minutes: number;
  price: number;
}) {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length === 0) {
    errors.name = "Service name is required.";
  }

  if (!input.duration_minutes || input.duration_minutes <= 0) {
    errors.duration_minutes = "Duration must be greater than 0 minutes.";
  }

  if (input.price === undefined || input.price < 0) {
    errors.price = "Price must be zero or greater.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
