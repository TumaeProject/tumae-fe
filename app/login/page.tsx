"use client";

import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-start justify-center pt-4">
      <div className="flex w-[1200px] bg-white rounded-2xl shadow-xl border border-gray-300 overflow-hidden">
        <div className="w-1/2 p-16 text-white bg-[#8055e1] flex flex-col">
          <div>
            <h1 className="text-3xl font-bold leading-relaxed">
              반가워요<br />튜터와 학생이 만나는 곳, 튜매예요.
            </h1>
            <p className="mt-6 text-lg opacity-90">
              오늘도 성장하는 하루,<br />
              당신의 공부 파트너를 튜매에서 만나보세요.
            </p>
          </div>
          <div className="mt-auto flex justify-center pt-12">
            <Image
              src="/signup/signup_illustration.svg"
              alt="로그인 일러스트"
              width={320}
              height={240}
              priority
              className="w-72 drop-shadow-lg"
            />
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-sm space-y-6">
            <LoginForm />
            <div className="flex justify-between text-sm text-gray-500">
              <Link href="/forgot-password" className="hover:text-[#8055e1]">
                비밀번호를 잊으셨나요?
              </Link>
              <Link href="/signup" className="hover:text-[#8055e1]">
                회원가입하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

