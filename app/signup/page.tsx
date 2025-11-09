"use client";

import SignUpForm from "@/components/signup/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex w-[1200px] bg-white rounded-2xl shadow-xl border border-gray-300 overflow-hidden">
        {/* 왼쪽 영역 */}
        <div className="w-1/2 p-16 text-white bg-[#8055e1]">
          <h1 className="text-3xl font-bold leading-relaxed">
            반가워요<br />튜터와 학생이 만나는 곳, 튜매예요.
          </h1>
          <p className="mt-6 text-lg opacity-90">
            오늘도 성장하는 하루,<br />
            당신의 공부 파트너를 튜매에서 만나보세요.
          </p>
          <div className="mt-10 flex justify-center">
            <img
              src="/signup/signup_illustration.svg"
              alt="illustration"
              className="w-72"
            />
          </div>
        </div>

        {/* 오른쪽 회원가입 폼 */}
        <div className="w-1/2 p-10">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
