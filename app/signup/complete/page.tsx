import Image from "next/image";
import Link from "next/link";

export default function SignUpCompletePage() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#f1ebff] via-white to-white" />
      <div className="flex min-h-[calc(100vh-5rem)] w-full flex-col items-center justify-center px-4 py-16 pt-4">
        <div className="flex w-full max-w-lg flex-col items-center gap-8 rounded-3xl bg-white px-10 py-12 shadow-xl">
          <Image
            src="/signup/signup_complete.svg"
            alt="회원가입 완료"
            width={320}
            height={240}
            priority
          />
          <div className="text-center text-gray-900">
            <p className="text-xl font-semibold">튜매의 새로운 가족이 되신 걸 환영합니다.</p>
            <p className="mt-2 text-base text-gray-600">당신의 성장, 튜매가 함께할게요.</p>
          </div>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#8055e1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6f48d8]"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </>
  );
}

