import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 select-none active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-gradient btn-shine text-white shadow-[0_10px_40px_-10px_rgb(34_211_238/0.55)] hover:shadow-[0_14px_50px_-8px_rgb(34_211_238/0.7)]',
  secondary: 'border border-white/10 bg-white/[0.04] text-white backdrop-blur hover:border-white/20 hover:bg-white/[0.08]',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  danger: 'border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-sm',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-[15px]',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />;
});

interface LinkButtonProps {
  to?: string;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
  download?: boolean;
  'aria-label'?: string;
}

export function LinkButton({ to, href, variant = 'primary', size = 'md', className, children, external, download, ...rest }: LinkButtonProps) {
  const cls = buttonClass(variant, size, className);
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={cls}
      download={download || undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
