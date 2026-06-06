import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "tabActive" | "tabInactive";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-sky-400 to-violet-400 font-black text-slate-950 shadow-glow hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50",
  secondary: "border border-slate-700 bg-slate-950/80 font-semibold text-slate-300 hover:border-sky-400/50 hover:text-sky-200",
  tabActive: "bg-sky-400 font-bold text-slate-950",
  tabInactive: "font-bold text-slate-400 hover:text-white",
};

interface ButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
}

export function Button({ children, className = "", disabled = false, onClick, type = "button", variant = "primary" }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-4 transition ${variantClasses[variant]} ${className}`}>
      {children}
    </button>
  );
}

export default Button;
