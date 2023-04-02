import { type ReactNode } from "react";

interface ButtonProps {
  content: ReactNode | string;
  clickHandler?: () => void;
  type: "button" | "submit";
}

export default function Button({ content, clickHandler, type }: ButtonProps) {
  return (
    <button
      onClick={clickHandler}
      className="text-md rounded-lg bg-gray-800 px-5 py-2.5 font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
      type={type}
    >
      {content}
    </button>
  );
}
