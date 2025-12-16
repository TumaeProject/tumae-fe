"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ComposeMessageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiverId = searchParams.get("receiver_id");
  const receiverName = searchParams.get("receiver_name");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      const id = localStorage.getItem("user_id");
      
      if (!accessToken) {
        router.push("/login");
        return;
      }
      
      setUserId(id);
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!subject.trim()) {
      setErrorMessage("제목을 입력해주세요.");
      return;
    }

    if (!body.trim()) {
      setErrorMessage("쪽지 내용을 입력해주세요.");
      return;
    }

    if (!receiverId) {
      setErrorMessage("받는 사람 정보가 없습니다.");
      return;
    }

    if (!userId) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const senderId = parseInt(userId, 10);
      const receiverIdNum = parseInt(receiverId, 10);

      // Query parameter에 sender_id 포함
      const queryParams = new URLSearchParams({
        sender_id: String(senderId),
      });

      const response = await fetch(`/api/messages/send?${queryParams.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: receiverIdNum,
          subject: subject.trim(),
          body: body.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "쪽지 전송에 실패했습니다.");
      }

      // 성공 응답 확인
      // 응답 형식: { message: "쪽지 전송 완료", message_id: 16, created_at: "..." }
      console.log("쪽지 전송 성공:", data);

      // 성공 시 쪽지함으로 이동
      router.push("/messages");
    } catch (error) {
      console.error("쪽지 전송 실패:", error);
      setErrorMessage(error instanceof Error ? error.message : "쪽지 전송에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/65 to-white" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col gap-8 px-4 py-12">
        {/* 헤더 */}
        <header>
          <Link
            href="/messages"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#8055e1] mb-4"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            쪽지함으로
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            쪽지 보내기
          </h1>
          <p className="mt-2 text-base text-gray-600 md:text-lg">
            {receiverName ? `${receiverName}님에게 쪽지를 보내세요.` : "쪽지를 작성해주세요."}
          </p>
        </header>

        {/* 쪽지 작성 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white/80 p-8 shadow-[0_30px_50px_rgba(128,85,225,0.08)] backdrop-blur">
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {/* 받는 사람 */}
          {receiverName && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                받는 사람
              </label>
              <div className="rounded-xl border border-gray-300 px-4 py-3 text-sm bg-gray-50">
                {receiverName}
              </div>
            </div>
          )}

          {/* 제목 */}
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-semibold text-gray-900">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="쪽지 제목을 입력해주세요..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
              maxLength={200}
            />
          </div>

          {/* 쪽지 내용 */}
          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-semibold text-gray-900">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="쪽지 내용을 입력해주세요..."
              rows={12}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20 resize-none"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Link
              href="/messages"
              className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 text-center"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-[#8055e1] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#6f48d8] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "전송 중..." : "전송하기"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default function ComposeMessagePage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
    }>
      <ComposeMessageContent />
    </Suspense>
  );
}

