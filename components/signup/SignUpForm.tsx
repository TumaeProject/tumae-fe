"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { RoleSelector } from "@/components/signup/RoleSelector";
import { FormInput } from "@/components/signup/FormInput";

export default function SignUpForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // "student" | "tutor"
    gender: "",
    agreeTerms: false,
    agreePrivacy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.role) {
      setErrorMessage("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("비밀번호가 서로 일치해야 합니다.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password_hash: form.password,
          role: form.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "회원가입에 실패했어요. 다시 시도해주세요.";
        setErrorMessage(message);
        return;
      }

      setSuccessMessage("회원가입이 완료되었어요!");
      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      setErrorMessage("요청을 처리하지 못했어요. 네트워크 상태를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">회원 가입</h2>

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

      {/* 이름 */}
      <FormInput
        label="이름"
        name="name"
        value={form.name}
        placeholder="이름을 입력해주세요"
        onChange={handleChange}
      />

      {/* 이메일 */}
      <FormInput
        label="이메일"
        type="email"
        name="email"
        value={form.email}
        placeholder="이메일을 입력해주세요"
        onChange={handleChange}
      />

      {/* 비밀번호 */}
      <div className="flex flex-col gap-4">
        <FormInput
          label="비밀번호"
          type="password"
          name="password"
          value={form.password}
          placeholder="비밀번호 입력"
          onChange={handleChange}
        />
        <FormInput
          label="비밀번호 확인"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          placeholder="비밀번호 확인"
          onChange={handleChange}
          errorMessage={
            form.confirmPassword.length > 0 && form.password !== form.confirmPassword
              ? "비밀번호가 일치하지 않습니다."
              : undefined
          }
        />
      </div>

      {/* 역할 선택 */}
      <RoleSelector
        selected={form.role}
        onSelect={(role) => setForm({ ...form, role })}
      />

      {/* 제출 버튼 */}
      <button
        type="submit"
        className="w-full bg-[#8055e1] text-white py-3 rounded-xl font-bold disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "가입 중..." : "가입하기"}
      </button>
    </form>
  );
}
