import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useToast } from '../context/ToastContext';
import { Button } from './ui/Button';

export function CopyButton({
  text,
  label = 'Copy Prompt',
  size = 'sm',
  variant = 'primary',
  itemName,
}: {
  text: string;
  label?: string;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'secondary';
  itemName?: string;
}) {
  const { copied, copy } = useCopyToClipboard();
  const { notify } = useToast();

  async function onClick() {
    const ok = await copy(text);
    notify(ok ? 'Prompt copied to clipboard.' : 'Could not copy. Select the text and copy it manually.', ok ? 'success' : 'error');
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={onClick}
      aria-label={itemName ? `${label}: ${itemName}` : label}
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      {copied ? 'Copied' : label}
    </Button>
  );
}
