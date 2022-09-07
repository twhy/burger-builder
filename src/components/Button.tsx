import { MouseEvent, PropsWithChildren } from "react";

export type ButtonProps = PropsWithChildren<{
  className?: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}>;

export default function Button({
  onClick,
  children,
  className = "",
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} flex justify-center items-center rounded-md border border-transparent bg-orange-600 px-6 py-3 text-2xl sm:text-3xl font-semibold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2`}
    >
      {children}
    </button>
  );
}
