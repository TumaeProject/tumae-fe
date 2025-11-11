"use client";

import { TutorOnboardingForm } from "@/components/signup/TutorOnboardingForm";

export default function TutorOnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f1ebff] via-white to-white py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-3xl bg-white px-10 py-12 shadow-xl">
        <div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            튜터님의 수업 정보를 알려주세요
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            학생과의 최적 매칭을 위해 수업 가능 정보와 기본 정보를 입력해주세요.
          </p>
        </div>

        <TutorOnboardingForm />
      </div>
    </div>
  );
}

