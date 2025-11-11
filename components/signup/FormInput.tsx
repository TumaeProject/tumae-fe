import { type ChangeEvent, type InputHTMLAttributes } from "react";

type FormInputProps = {
  label: string;
  wrapperClassName?: string;
  inputClassName?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "className">;

export function FormInput({
  label,
  wrapperClassName,
  inputClassName,
  onChange,
  errorMessage,
  ...inputProps
}: FormInputProps) {
  return (
    <div className={`flex flex-col ${wrapperClassName ?? ""}`}>
      <label className="text-sm font-medium text-gray-800">{label}</label>
      <input
        {...inputProps}
        onChange={onChange}
        className={`w-full rounded-lg px-4 py-2 mt-1 border ${
          errorMessage ? "border-red-500" : "border-gray-300"
        } ${inputClassName ?? ""}`}
      />
      {errorMessage ? (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}

