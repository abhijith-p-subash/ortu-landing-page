import type { ReactNode } from "react";

interface KbdProps {
  children: ReactNode;
  className?: string;
}

/** A single keycap, used across the keyboard-first UI. */
const Kbd = ({ children, className = "" }: KbdProps) => (
  <kbd
    className={`keycap min-w-[1.75rem] h-7 px-2 text-[11px] font-semibold leading-none ${className}`}
  >
    {children}
  </kbd>
);

export default Kbd;
