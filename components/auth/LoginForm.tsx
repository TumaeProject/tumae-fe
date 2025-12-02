"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/signup/FormInput";

type LoginFormState = {
  email: string;
  password: string;
};

const INITIAL_FORM_STATE: LoginFormState = {
  email: "",
  password: "",
};

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage;
        try {
          errorMessage =
            typeof data?.message === "string"
              ? data.message
              : "로그인에 실패했어요. 다시 시도해주세요.";
        } catch (e) {
          // JSON 파싱 실패 시 (HTML 응답 등)
          setErrorMessage("로그인에 실패했어요. 다시 시도해주세요.");
          return;
        }
        setErrorMessage(errorMessage);
        return;
      }

      // 로그인 성공 시 응답 데이터 저장
      // 응답 형식: { message: "SUCCESS", data: { access_token, refresh_token, user: { user_id, ... }, redirect_url } }
      const responseData = data?.data;
      
      if (responseData) {
        // 토큰 저장
        if (responseData.access_token) {
          localStorage.setItem("access_token", responseData.access_token);
        }
        if (responseData.refresh_token) {
          localStorage.setItem("refresh_token", responseData.refresh_token);
        }
        
        // 사용자 정보 저장
        if (responseData.user?.user_id) {
          localStorage.setItem("user_id", String(responseData.user.user_id));
        }
        if (responseData.user?.role) {
          localStorage.setItem("user_role", responseData.user.role);
        }
        if (responseData.user?.name) {
          localStorage.setItem("user_name", responseData.user.name);
        }
        if (responseData.user?.email) {
          localStorage.setItem("user_email", responseData.user.email);
        }
      }

      // 커스텀 이벤트 발생 (Header 컴포넌트에 로그인 상태 변경 알림)
      window.dispatchEvent(new Event("authStateChanged"));

      // redirect_url이 있으면 사용, 없으면 홈으로
      const redirectUrl = responseData?.redirect_url || "/";
      router.push(redirectUrl);


    } catch (error) {
      console.error("로그인 요청 실패:", error);
      setErrorMessage("요청을 처리하지 못했어요. 네트워크 상태를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-900">로그인</h2>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <FormInput
        label="이메일"
        type="email"
        name="email"
        value={form.email}
        placeholder="이메일을 입력해주세요"
        onChange={handleChange}
      />

      <FormInput
        label="비밀번호"
        type="password"
        name="password"
        value={form.password}
        placeholder="비밀번호를 입력해주세요"
        onChange={handleChange}
      />

      <button
        type="submit"
        className="mt-2 w-full rounded-xl bg-[#8055e1] py-3 text-sm font-semibold text-white transition hover:bg-[#6f48d8] disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "로그인 중..." : "로그인 하기"}
      </button>
    </form>
  );
}

