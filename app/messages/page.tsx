"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Message = {
  id?: number;
  message_id?: number;
  sender_id: number;
  sender_name?: string;
  receiver_id?: number;
  receiver_name?: string;
  subject?: string;
  body?: string;
  content?: string;
  preview?: string;
  created_at: string;
  is_read?: boolean;
  read?: boolean;
  is_starred?: boolean;
};

type TabType = "inbox" | "sent";

export default function MessagesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("inbox");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      const id = localStorage.getItem("user_id");
      
      if (!accessToken) {
        router.push("/login");
        return;
      }
      
      setUserId(id);
      if (id) {
        fetchMessages(id, activeTab);
      }
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      fetchMessages(userId, activeTab);
    }
  }, [activeTab, userId]);

  const fetchMessages = async (userId: string, tab: TabType) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = tab === "inbox" ? "/api/messages/inbox" : "/api/messages/sent";
      const response = await fetch(`${endpoint}?user_id=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "쪽지를 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      
      // API 응답이 배열인 경우 그대로 사용, 객체인 경우 처리
      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else {
        // 응답 형식이 예상과 다른 경우 빈 배열로 설정
        console.warn("예상하지 못한 응답 형식:", data);
        setMessages([]);
      }
    } catch (err) {
      console.error("쪽지 조회 실패:", err);
      setError(err instanceof Error ? err.message : "쪽지를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageDetail = async (messageId: number) => {
    if (!userId) return;

    try {
      setIsLoadingDetail(true);
      setDetailError(null);

      const response = await fetch(`/api/messages/${messageId}?user_id=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "쪽지 상세 정보를 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      setSelectedMessage(data);
    } catch (err) {
      console.error("쪽지 상세 조회 실패:", err);
      setDetailError(err instanceof Error ? err.message : "쪽지 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleMessageClick = (message: Message) => {
    const messageId = message.id || message.message_id;
    if (messageId) {
      fetchMessageDetail(messageId);
    } else {
      // ID가 없는 경우 목록의 데이터를 그대로 사용
      setSelectedMessage(message);
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

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/65 to-white" />
        <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col items-center justify-center gap-4 px-4 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8055e1] border-t-transparent"></div>
          <p className="text-sm text-gray-600">쪽지를 불러오는 중...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/65 to-white" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col gap-8 px-4 py-12">
        {/* 헤더 */}
        <header className="space-y-4">
          <div>
            <span className="inline-block rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8055e1] shadow-sm mb-4">
              Messages
            </span>
            <h1 className="text-3xl font-bold leading-snug text-gray-900 md:text-4xl">
              쪽지함
            </h1>
            <p className="mt-2 text-base text-gray-600 md:text-lg">
              받은 쪽지와 보낸 쪽지를 확인할 수 있어요.
            </p>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "inbox"
                  ? "border-[#8055e1] text-[#8055e1]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              받은 쪽지함
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "sent"
                  ? "border-[#8055e1] text-[#8055e1]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              보낸 쪽지함
            </button>
          </div>
        </header>

        {/* 쪽지 목록 */}
        <section className="space-y-4">
          {error ? (
            <div className="rounded-2xl bg-white/80 p-12 text-center shadow-[0_4px_20px_rgba(128,85,225,0.08)]">
              <p className="text-red-500 mb-4">{error}</p>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id || message.message_id}
                  onClick={() => handleMessageClick(message)}
                  className={`rounded-2xl bg-white/80 p-6 shadow-[0_4px_20px_rgba(128,85,225,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(128,85,225,0.15)] cursor-pointer ${
                    !(message.is_read ?? message.read ?? false) ? "border-2 border-[#8055e1]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {activeTab === "inbox" ? (
                          <>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6] text-sm font-semibold text-white">
                              {(message.sender_name || "?").charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {message.sender_name || "알 수 없음"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(message.created_at)}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6] text-sm font-semibold text-white">
                              {(message.receiver_name || message.sender_name || "받").charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {message.receiver_name || message.sender_name || "받는 사람"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(message.created_at)}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      {message.subject && (
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {message.subject}
                        </p>
                      )}
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {message.preview || message.body || message.content || ""}
                      </p>
                    </div>
                    {!(message.is_read ?? message.read ?? false) && (
                      <span className="rounded-full bg-[#8055e1] w-2 h-2"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white/80 p-12 text-center shadow-[0_4px_20px_rgba(128,85,225,0.08)]">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500">
                {activeTab === "inbox" ? "받은 쪽지가 없어요." : "보낸 쪽지가 없어요."}
              </p>
            </div>
          )}
        </section>

        {/* 쪽지 상세 모달 */}
        {selectedMessage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <div
              className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {isLoadingDetail ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8055e1] border-t-transparent"></div>
                </div>
              ) : detailError ? (
                <div className="py-12 text-center">
                  <p className="text-red-500">{detailError}</p>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="mt-4 rounded-xl bg-gray-200 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                  >
                    닫기
                  </button>
                </div>
              ) : (
                <>
                  {/* 헤더 */}
                  <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6] text-lg font-semibold text-white">
                          {(activeTab === "inbox"
                            ? (selectedMessage.sender_name || "?")
                            : (selectedMessage.receiver_name || (selectedMessage.receiver_id ? `받는사람${selectedMessage.receiver_id}` : "?"))
                          ).charAt(0)}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-gray-900">
                            {activeTab === "inbox"
                              ? (selectedMessage.sender_name || "알 수 없음")
                              : (selectedMessage.receiver_name || `받는 사람 (ID: ${selectedMessage.receiver_id || "?"})`)
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(selectedMessage.created_at)}
                          </p>
                        </div>
                      </div>
                      {selectedMessage.subject && (
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedMessage.subject}
                        </h2>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="ml-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* 본문 */}
                  <div className="mb-6">
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                      {selectedMessage.body || selectedMessage.content || selectedMessage.preview || ""}
                    </div>
                  </div>

                  {/* 하단 버튼 */}
                  <div className="flex gap-3 border-t border-gray-200 pt-4">
                    {activeTab === "inbox" && (
                      <button
                        onClick={() => {
                          if (selectedMessage.sender_id) {
                            router.push(`/messages/compose?receiver_id=${selectedMessage.sender_id}&receiver_name=${encodeURIComponent(selectedMessage.sender_name || "")}`);
                          }
                        }}
                        className="flex-1 rounded-xl bg-[#8055e1] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#6f48d8]"
                      >
                        답장하기
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className={`rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 ${
                        activeTab === "inbox" ? "flex-1" : "w-full"
                      }`}
                    >
                      닫기
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

