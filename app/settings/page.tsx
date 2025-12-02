"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      const name = localStorage.getItem("user_name");
      setIsLoggedIn(!!accessToken);
      setUserName(name);

      if (!accessToken) {
        router.push("/login");
      }
    }
  }, [router]);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    setErrorMessage(null);
    
    try {
      const userId = localStorage.getItem("user_id");
      
      if (!userId) {
        setErrorMessage("사용자 정보를 찾을 수 없습니다.");
        setIsWithdrawing(false);
        return;
      }

      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        setErrorMessage("인증이 필요합니다. 다시 로그인해주세요.");
        setIsWithdrawing(false);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      const response = await fetch(`/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("예상치 못한 응답 형식:", text);
        setErrorMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
        setIsWithdrawing(false);
        return;
      }

      if (!response.ok) {
        setErrorMessage(data.message || "회원탈퇴에 실패했습니다.");
        setIsWithdrawing(false);
        return;
      }

      // 성공 응답 데이터 확인 (선택적)
      // data: { deleted_user_id, deleted_posts, deleted_answers }
      console.log("회원탈퇴 성공:", data);

      // localStorage 정리
      localStorage.clear();
      
      // 커스텀 이벤트 발생 (Header 컴포넌트에 로그아웃 상태 변경 알림)
      window.dispatchEvent(new Event("authStateChanged"));
      
      // 성공 시 모달 닫고 홈으로 이동
      setShowWithdrawModal(false);
      router.push("/");
    } catch (error) {
      console.error("회원탈퇴 오류:", error);
      setErrorMessage("회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsWithdrawing(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">설정</h1>

        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">계정 정보</h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">이름</span>
                <p className="text-base text-gray-900">{userName || "-"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">이메일</span>
                <p className="text-base text-gray-900">
                  {typeof window !== "undefined" ? localStorage.getItem("user_email") || "-" : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">계정 관리</h2>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              회원탈퇴
            </button>
          </div>
        </div>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-gray-900">회원탈퇴</h3>
            <p className="mb-6 text-sm text-gray-600">
              정말 회원탈퇴를 하시겠습니까?<br />
              탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            
            {errorMessage && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setErrorMessage(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                disabled={isWithdrawing}
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {isWithdrawing ? "처리 중..." : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

