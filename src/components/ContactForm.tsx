import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { hasErrors, validateContact, type ContactForm as Form, type FieldErrors } from '../lib/validation';
import { Button } from './ui/Button';
import { TextAreaField, TextField } from './ui/form';

const empty: Form = { name: '', email: '', subject: '', message: '' };

/**
 * There is no mail backend yet, so a valid submission opens the visitor's email client
 * with the message pre-filled. Swap `deliver` for an API call once a backend exists.
 */
export function ContactForm({ to }: { to: string }) {
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [opened, setOpened] = useState(false);

  const set = (key: keyof Form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(({ [key]: _removed, ...rest }) => rest);
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateContact(form);
    setErrors(found);
    if (hasErrors(found)) {
      const first = Object.keys(found)[0];
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    const href = `mailto:${to}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setOpened(true);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Your name" name="name" autoComplete="name" required value={form.name} onChange={set('name')} error={errors.name} />
        <TextField
          label="Your email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={set('email')}
          error={errors.email}
        />
      </div>
      <TextField label="Subject" name="subject" required value={form.subject} onChange={set('subject')} error={errors.subject} />
      <TextAreaField
        label="Message"
        name="message"
        required
        rows={6}
        value={form.message}
        onChange={set('message')}
        error={errors.message}
        hint="At least 20 characters."
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg">
          <Send className="size-4" aria-hidden /> Send message
        </Button>
        <p className="text-xs text-subtle">Opens your email app with the message ready to send.</p>
      </div>
      {opened && (
        <p role="status" className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm text-slate-200">
          Your email app should now be open with your message. If nothing happened, email{' '}
          <a href={`mailto:${to}`} className="text-accent-soft underline">
            {to}
          </a>{' '}
          directly.
        </p>
      )}
    </form>
  );
}
