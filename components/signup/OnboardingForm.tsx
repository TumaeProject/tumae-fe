"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { FormTextarea } from "@/components/signup/FormTextarea";

type KeysMatching<FormValues, Value> = {
  [Key in keyof FormValues]-?: FormValues[Key] extends Value ? Key : never;
}[keyof FormValues];

type MultiSelectField<FormValues extends Record<string, unknown>> = {
  type: "multiSelect";
  key: KeysMatching<FormValues, string[]>;
  label: string;
  options: string[];
  optionsWrapperClassName?: string;
};

type RangeField<FormValues extends Record<string, unknown>> = {
  type: "range";
  key: KeysMatching<FormValues, string>;
  label: string;
  min: number;
  max: number;
  step: number;
  formatValue?: (value: number) => string;
  minLabel?: string;
  maxLabel?: string;
};

type TextareaField<FormValues extends Record<string, unknown>> = {
  type: "textarea";
  key: KeysMatching<FormValues, string>;
  label: string;
  placeholder?: string;
  rows?: number;
};

type SelectField<FormValues extends Record<string, unknown>> = {
  type: "select";
  key: KeysMatching<FormValues, string>;
  label: string;
  options: Array<{ id: number; name: string }>;
  placeholder?: string;
};

export type OnboardingField<FormValues extends Record<string, unknown>> =
  | MultiSelectField<FormValues>
  | RangeField<FormValues>
  | TextareaField<FormValues>
  | SelectField<FormValues>;

type BaseFormValues = Record<string, string | string[]>;

type OnboardingFormProps<FormValues extends BaseFormValues> = {
  title: string;
  description: string;
  fields: OnboardingField<FormValues>[];
  initialValues: FormValues;
  submitLabel?: string;
  loadingLabel?: string;
  successMessage?: string;
  validate?: (values: FormValues) => string | null;
  onSubmit?: (values: FormValues) => Promise<void> | void;
  children?: ReactNode;
  renderCustomField?: (formValues: FormValues, setFormValues: (values: FormValues) => void) => ReactNode;
};

export function OnboardingForm<FormValues extends BaseFormValues>({
  title,
  description,
  fields,
  initialValues,
  submitLabel = "정보 저장하기",
  loadingLabel = "저장 중...",
  successMessage: successMessageProp = "정보가 성공적으로 저장되었어요!",
  validate,
  onSubmit,
  children,
  renderCustomField,
}: OnboardingFormProps<FormValues>) {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleMultiSelect = (key: KeysMatching<FormValues, string[]>, option: string) => {
    setFormValues((prev) => {
      const current = (prev[key] as string[]) ?? [];
      const exists = current.includes(option);
      const next = exists ? current.filter((item) => item !== option) : [...current, option];
      return { ...prev, [key]: next } as FormValues;
    });
  };

  const handleRangeChange =
    (key: KeysMatching<FormValues, string>) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormValues((prev) => ({ ...prev, [key]: value }) as FormValues);
    };

  const handleTextareaChange =
    (key: KeysMatching<FormValues, string>) => (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      setFormValues((prev) => ({ ...prev, [key]: value }) as FormValues);
    };

  const handleSelectChange =
    (key: KeysMatching<FormValues, string>) => (event: ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      setFormValues((prev) => ({ ...prev, [key]: value }) as FormValues);
    };

  const renderField = (field: OnboardingField<FormValues>) => {
    if (field.type === "multiSelect") {
      const { key, label, options, optionsWrapperClassName } = field;
      const selectedValues = (formValues[key] as string[]) ?? [];

      return (
        <section key={String(key)} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
          <div
            className={
              optionsWrapperClassName ?? "grid grid-cols-2 gap-3 md:grid-cols-3"
            }
          >
            {options.map((option) => {
              const isActive = selectedValues.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMultiSelect(key, option)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[#8055e1] bg-[#f1ebff] text-[#8055e1]"
                      : "border-gray-300 text-gray-700 hover:border-[#8055e1] hover:text-[#8055e1]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </section>
      );
    }

    if (field.type === "range") {
      const { key, label, min, max, step, formatValue, minLabel, maxLabel } = field;
      const value = formValues[key] as string;
      const numericValue = Number(value || min);
      const format = formatValue ?? ((candidate: number) => candidate.toLocaleString("ko-KR"));

      return (
        <section key={String(key)} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-gray-900">{label}</label>
            <span className="text-sm font-semibold text-[#8055e1]">
              {format(numericValue)}원
            </span>
          </div>
          <input
            type="range"
            name={String(key)}
            min={min}
            max={max}
            step={step}
            value={value || String(min)}
            onChange={handleRangeChange(key)}
            className="w-full accent-[#8055e1]"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{minLabel ?? `${min.toLocaleString("ko-KR")}원`}</span>
            <span>{maxLabel ?? `${max.toLocaleString("ko-KR")}원`}</span>
          </div>
        </section>
      );
    }

    if (field.type === "textarea") {
      const { key, label, placeholder, rows } = field;
      const value = (formValues[key] as string) ?? "";

      return (
        <FormTextarea
          key={String(key)}
          label={label}
          name={String(key)}
          value={value}
          placeholder={placeholder}
          rows={rows ?? 4}
          onChange={handleTextareaChange(key)}
        />
      );
    }

    if (field.type === "select") {
      const { key, label, options, placeholder } = field;
      const value = (formValues[key] as string) ?? "";

      return (
        <section key={String(key)} className="space-y-2">
          <label className="block text-lg font-semibold text-gray-900">{label}</label>
          <select
            name={String(key)}
            value={value}
            onChange={handleSelectChange(key)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 transition focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.id} value={String(option.id)}>
                {option.name}
              </option>
            ))}
          </select>
        </section>
      );
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validate) {
      const validationError = validate(formValues);
      if (validationError) {
        setErrorMessage(validationError);
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await onSubmit?.(formValues);
      setSuccessMessage(successMessageProp);
    } catch (error) {
      console.error("온보딩 폼 제출 실패:", error);
      setErrorMessage("정보 제출에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {successMessage}
        </div>
      ) : null}

      {fields.map((field, index) => {
        const fieldElement = renderField(field);
        // timeSlots 필드 다음에 커스텀 필드 삽입
        if (field.key === "timeSlots" && renderCustomField) {
          return (
            <div key={String(field.key)} className="space-y-8">
              {fieldElement}
              {renderCustomField(formValues, setFormValues)}
            </div>
          );
        }
        return fieldElement;
      })}

      {children}

      <button
        type="submit"
        className="w-full rounded-xl bg-[#8055e1] py-3 text-white font-semibold shadow-sm transition hover:bg-[#6f48d8] disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? loadingLabel : submitLabel}
      </button>
    </form>
  );
}

