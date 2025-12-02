"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type PostDetail = {
  id: number;
  title: string;
  body: string;
  author_id: number;
  author_name: string;
  subject_id?: number;
  subject_name?: string;
  region_id?: number;
  region_name?: string;
  created_at: string;
  answers: Answer[];
};

type Answer = {
  id: number;
  author_id: number;
  author_name: string;
  body: string;
  is_accepted: boolean;
  created_at: string;
};

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answerBody, setAnswerBody] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [acceptingAnswerId, setAcceptingAnswerId] = useState<number | null>(null);

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
    }
  }, [postId]);

  const fetchPostDetail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/community/posts/${postId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "게시글을 불러오는데 실패했습니다.");
      }

      // answers 배열이 없으면 빈 배열로 초기화
      const postData: PostDetail = {
        ...data,
        answers: data.answers || [],
      };

      setPost(postData);
    } catch (err) {
      console.error("게시글 상세 조회 실패:", err);
      setError(err instanceof Error ? err.message : "게시글을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmitAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!answerBody.trim()) {
      setAnswerError("답변 내용을 입력해주세요.");
      return;
    }

    // localStorage에서 user_id 가져오기
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setAnswerError("로그인이 필요합니다. 먼저 로그인해주세요.");
      return;
    }

    setIsSubmittingAnswer(true);
    setAnswerError(null);

    try {
      const response = await fetch(`/api/community/posts/${postId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author_id: parseInt(userId, 10),
          body: answerBody.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "답변 등록에 실패했습니다.");
      }

      // 등록된 답변을 바로 화면에 추가
      if (post) {
        const userName = localStorage.getItem("user_name") || "익명";
        const newAnswer: Answer = {
          id: data.answer_id || data.id,
          author_id: data.author_id || parseInt(userId, 10),
          author_name: data.author_name || userName,
          body: data.body || answerBody.trim(),
          is_accepted: data.is_accepted || false,
          created_at: data.created_at || new Date().toISOString(),
        };

        // 답변 목록에 추가 (최신 답변이 맨 아래에 표시됨)
        setPost({
          ...post,
          answers: [...post.answers, newAnswer],
        });
      }

      // 입력 폼 초기화
      setAnswerBody("");
      setAnswerError(null);
    } catch (err) {
      console.error("답변 등록 실패:", err);
      setAnswerError(err instanceof Error ? err.message : "답변 등록에 실패했습니다.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleAcceptAnswer = async (answerId: number) => {
    // localStorage에서 user_id 가져오기
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setAnswerError("로그인이 필요합니다. 먼저 로그인해주세요.");
      return;
    }

    // 게시글 작성자인지 확인
    if (!post || parseInt(userId, 10) !== post.author_id) {
      setAnswerError("게시글 작성자만 답변을 채택할 수 있습니다.");
      return;
    }

    setAcceptingAnswerId(answerId);
    setAnswerError(null);

    try {
      const response = await fetch(`/api/community/answers/${answerId}/accept`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: parseInt(userId, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "답변 채택에 실패했습니다.");
      }

      // 채택 성공 시 화면 업데이트
      if (post) {
        setPost({
          ...post,
          answers: post.answers.map((answer) =>
            answer.id === answerId
              ? { ...answer, is_accepted: true }
              : answer
          ),
        });
      }
    } catch (err) {
      console.error("답변 채택 실패:", err);
      setAnswerError(err instanceof Error ? err.message : "답변 채택에 실패했습니다.");
    } finally {
      setAcceptingAnswerId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return "방금 전";
      if (minutes < 60) return `${minutes}분 전`;
      if (hours < 24) return `${hours}시간 전`;
      if (days < 7) return `${days}일 전`;
      
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/65 to-white" />
        <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col items-center justify-center gap-4 px-4 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8055e1] border-t-transparent"></div>
          <p className="text-sm text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/65 to-white" />
        <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col items-center justify-center gap-4 px-4 py-12">
          <div className="rounded-full bg-red-100 p-4">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">게시글을 불러올 수 없어요</h2>
          <p className="text-sm text-gray-600">{error || "알 수 없는 오류가 발생했습니다."}</p>
          <Link
            href="/community"
            className="mt-4 rounded-xl bg-[#8055e1] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#6f48d8]"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/65 to-white" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col gap-8 px-4 py-12">
        {/* 뒤로가기 버튼 */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#8055e1]"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로
        </Link>

        {/* 게시글 본문 */}
        <article className="rounded-3xl bg-white/80 p-8 shadow-[0_30px_50px_rgba(128,85,225,0.08)] backdrop-blur">
          {/* 헤더 */}
          <header className="mb-6 space-y-4 border-b border-gray-200 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              {post.subject_name && (
                <span className="rounded-full bg-[#f1ebff] px-4 py-1.5 text-xs font-semibold text-[#8055e1]">
                  {post.subject_name}
                </span>
              )}
              {post.region_name && (
                <span className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-700">
                  📍 {post.region_name}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6] text-sm font-semibold text-white">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{post.author_name}</p>
                  <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                </div>
              </div>

            </div>
          </header>

          {/* 본문 내용 */}
          <div className="mb-8">
            <div className="prose prose-sm max-w-none text-gray-700 md:prose-base">
              <div className="whitespace-pre-wrap leading-relaxed">{post.body}</div>
            </div>
          </div>

        </article>

        {/* 답변(댓글) 섹션 */}
        <section className="rounded-3xl bg-white/80 p-8 shadow-[0_30px_50px_rgba(128,85,225,0.08)] backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              답변 <span className="text-[#8055e1]">{post.answers.length}</span>
            </h2>
          </div>

          {/* 답변 입력 폼 */}
          <form onSubmit={handleSubmitAnswer} className="mb-6 space-y-3">
            {answerError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {answerError}
              </div>
            )}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <textarea
                value={answerBody}
                onChange={(e) => {
                  setAnswerBody(e.target.value);
                  setAnswerError(null);
                }}
                placeholder="답변을 입력해주세요..."
                rows={4}
                className="w-full resize-none border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                disabled={isSubmittingAnswer}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingAnswer || !answerBody.trim()}
                className="rounded-lg bg-[#8055e1] px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#6f48d8] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingAnswer ? "등록 중..." : "답변 등록"}
              </button>
            </div>
          </form>

          {/* 답변 목록 */}
          {post.answers && post.answers.length > 0 ? (
            <div className="space-y-6">
              {post.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={`rounded-xl border p-5 ${
                    answer.is_accepted
                      ? "border-[#8055e1] bg-[#f1ebff]/50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6] text-xs font-semibold text-white">
                        {answer.author_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{answer.author_name}</p>
                        <p className="text-xs text-gray-500">{formatDate(answer.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {answer.is_accepted && (
                        <span className="rounded-full bg-[#8055e1] px-3 py-1 text-xs font-semibold text-white">
                          채택됨
                        </span>
                      )}
                      {/* 게시글 작성자이고 아직 채택되지 않은 답변인 경우에만 채택 버튼 표시 */}
                      {post &&
                        !answer.is_accepted &&
                        parseInt(localStorage.getItem("user_id") || "0", 10) === post.author_id && (
                          <button
                            onClick={() => handleAcceptAnswer(answer.id)}
                            disabled={acceptingAnswerId === answer.id}
                            className="rounded-lg bg-[#8055e1] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#6f48d8] disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {acceptingAnswerId === answer.id ? "채택 중..." : "채택하기"}
                          </button>
                        )}
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <p className="whitespace-pre-wrap leading-relaxed">{answer.body}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">아직 답변이 없어요. 첫 답변을 작성해보세요!</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

