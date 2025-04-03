import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'muted' | 'destructive' | 'ghost';

interface ButtonProps {
  variant?: ButtonVariant;
  icon?: ReactNode;
  isLoading?: boolean;
  children?: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({
  variant = 'primary',
  icon,
  isLoading = false,
  children,
  title,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200  hover:scale-[1.01]';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    muted: 'bg-muted text-muted-foreground hover:bg-muted/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    ghost: 'bg-transparent text-primary hover:bg-primary/10 focus:bg-primary/10'
  };

  return (
    <button
      title={title}
      className={twMerge(
        baseStyles,
        variants[variant],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <div className="animate-spin w-4 h-4 border-t border-primary rounded-full" />
      )}
      {!isLoading && icon && <span>{icon}</span>}
      {children}
    </button>
  );
}