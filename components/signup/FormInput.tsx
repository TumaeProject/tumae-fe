import { type ChangeEvent, type InputHTMLAttributes } from "react";

type FormInputProps = {
  label: string;
  wrapperClassName?: string;
  inputClassName?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "className">;

export function FormInput({
  label,
  wrapperClassName,
  inputClassName,
  onChange,
  ...inputProps
}: FormInputProps) {
  return (
    <div className={`flex flex-col ${wrapperClassName ?? ""}`}>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...inputProps}
        onChange={onChange}
        className={`w-full border rounded-lg px-4 py-2 mt-1 ${
          inputClassName ?? ""
        }`}
      />
    </div>
  );
}

