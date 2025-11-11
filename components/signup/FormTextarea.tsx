"use client";

import { type ChangeEvent, type TextareaHTMLAttributes } from "react";

type FormTextareaProps = {
  label: string;
  wrapperClassName?: string;
  textareaClassName?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "className">;

export function FormTextarea({
  label,
  wrapperClassName,
  textareaClassName,
  onChange,
  ...textareaProps
}: FormTextareaProps) {
  return (
    <div className={`flex flex-col ${wrapperClassName ?? ""}`}>
      <label className="text-lg font-semibold text-gray-900">{label}</label>
      <textarea
        {...textareaProps}
        onChange={onChange}
        className={`w-full rounded-lg px-4 py-3 mt-1 border ${
          textareaProps["aria-invalid"]
            ? "border-red-500"
            : "border-gray-300"
        } focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#dacbff] ${textareaClassName ?? ""}`}
      />
    </div>
  );
}


