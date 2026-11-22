export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function required(errors: FieldErrors, field: string, value: string, label: string, min = 1) {
  if (!value || value.trim().length < min) {
    errors[field] = min > 1 ? `${label} must be at least ${min} characters.` : `${label} is required.`;
  }
}

export function validateContact(f: ContactForm): FieldErrors {
  const errors: FieldErrors = {};
  required(errors, 'name', f.name, 'Name', 2);
  if (!EMAIL_RE.test(f.email)) errors.email = 'Enter a valid email address.';
  required(errors, 'subject', f.subject, 'Subject', 3);
  required(errors, 'message', f.message, 'Message', 20);
  if (f.message.length > 4000) errors.message = 'Message is too long (max 4000 characters).';
  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
