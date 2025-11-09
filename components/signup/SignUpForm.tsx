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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("폼 제출:", form);
    // TODO: API 연결해서 form 데이터 전달
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">회원 가입</h2>

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
        className="w-full bg-[#8055e1] text-white py-3 rounded-xl font-bold"
      >
        가입하기
      </button>
    </form>
  );
}
