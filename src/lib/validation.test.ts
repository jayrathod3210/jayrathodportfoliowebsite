import { describe, expect, it } from 'vitest';
import { validateContact } from './validation';

describe('validateContact', () => {
  const valid = { name: 'Ada', email: 'ada@example.com', subject: 'Hello', message: 'A message that is long enough.' };

  it('accepts a valid message', () => expect(validateContact(valid)).toEqual({}));

  it('flags each invalid field', () => {
    const errors = validateContact({ name: '', email: 'nope', subject: '', message: 'short' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'subject']);
  });

  it('rejects overly long messages', () => {
    expect(validateContact({ ...valid, message: 'x'.repeat(4001) }).message).toMatch(/too long/);
  });
});
