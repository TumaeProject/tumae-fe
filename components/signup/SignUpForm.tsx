"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { RoleSelector } from "@/components/signup/RoleSelector";
import { FormInput } from "@/components/signup/FormInput";

export default function SignUpForm() {
  const router = useRouter();
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

    if (!form.agreeTerms || !form.agreePrivacy) {
      setErrorMessage("약관 및 개인정보 처리방침에 동의해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          gender: form.gender,
          terms_agreed: form.agreeTerms,
          privacy_policy_agreed: form.agreePrivacy,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 에러 응답 로깅
        console.error("회원가입 실패 응답:", {
          status: response.status,
          data,
        });

        // 다양한 에러 메시지 형식 지원 (FastAPI Pydantic validation 에러 포함)
        let message = "회원가입에 실패했어요. 다시 시도해주세요.";
        
        if (Array.isArray(data?.detail)) {
          // FastAPI Pydantic validation 에러 형식
          message = data.detail
            .map((err: any) => {
              if (typeof err === "string") return err;
              if (err.msg) return `${err.loc?.join(".") || ""}: ${err.msg}`;
              return JSON.stringify(err);
            })
            .join(", ");
        } else if (typeof data?.detail === "string") {
          message = data.detail;
        } else if (typeof data?.message === "string") {
          message = data.message;
        } else if (Array.isArray(data?.errors)) {
          message = data.errors.map((err: any) => err.message || err).join(", ");
        } else if (typeof data?.error === "string") {
          message = data.error;
        }

        setErrorMessage(message);
        return;
      }

      setSuccessMessage("회원가입이 완료되었어요!");
      
      // 회원가입 응답에서 user_id 추출
      // 응답 형식: { message: "SUCCESS", data: { user_id: 3, ... } }
      const userId = data?.data?.user_id;
      
      if (!userId) {
        console.warn("회원가입 응답에 user_id가 없습니다:", data);
        setErrorMessage("회원가입은 완료되었지만 사용자 ID를 받지 못했습니다. 다시 시도해주세요.");
        return;
      }
      
      // role에 따라 온보딩 페이지로 리다이렉트 (user_id를 쿼리 파라미터로 전달)
      if (form.role === "tutor") {
        router.push(`/signup/tutor?user_id=${userId}`);
      } else if (form.role === "student") {
        router.push(`/signup/student?user_id=${userId}`);
      }
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

      {/* 성별 선택 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">성별</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={handleChange}
              className="w-4 h-4 text-[#8055e1]"
            />
            <span>남성</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={handleChange}
              className="w-4 h-4 text-[#8055e1]"
            />
            <span>여성</span>
          </label>
        </div>
      </div>

      {/* 약관 동의 */}
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={form.agreeTerms}
            onChange={handleChange}
            className="w-4 h-4 text-[#8055e1] rounded"
          />
          <span className="text-sm">이용약관에 동의합니다</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="agreePrivacy"
            checked={form.agreePrivacy}
            onChange={handleChange}
            className="w-4 h-4 text-[#8055e1] rounded"
          />
          <span className="text-sm">개인정보 처리방침에 동의합니다</span>
        </label>
      </div>

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
