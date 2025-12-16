"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "학생 찾기", href: "/students" },
  { label: "선생님 찾기", href: "/tutors" },
  { label: "커뮤니티", href: "/community" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkAuthStatus = useCallback(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      const name = localStorage.getItem("user_name");
      const role = localStorage.getItem("user_role");
      setIsLoggedIn(!!accessToken);
      setUserName(name);
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    // 초기 로그인 상태 체크
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    // pathname이 변경될 때마다 로그인 상태 다시 체크 (로그인 후 리다이렉트 시)
    checkAuthStatus();
  }, [pathname, checkAuthStatus]);

  useEffect(() => {
    // storage 이벤트 리스너 (다른 탭에서 변경된 경우도 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "user_name" || e.key === "user_role") {
        checkAuthStatus();
      }
    };

    // 커스텀 이벤트 리스너 (같은 탭에서 로그인/로그아웃 시)
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, [checkAuthStatus]);

  useEffect(() => {
    // 드롭다운 외부 클릭 시 닫기
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출 (서버 측 토큰 무효화)
      const userId = localStorage.getItem("user_id");
      const accessToken = localStorage.getItem("access_token");
      
      if (userId) {
        try {
          const headers: HeadersInit = {
            "Content-Type": "application/json",
          };

          // Authorization 헤더 추가 (토큰이 있는 경우)
          if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
          }

          // 타임아웃 설정 (5초)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers,
            body: JSON.stringify({ user_id: parseInt(userId, 10) }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          // API 응답 확인 (성공/실패 로깅만)
          if (response.ok) {
            console.log("로그아웃 API 성공: 서버 측 토큰이 무효화되었습니다.");
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.warn("로그아웃 API 실패 (클라이언트 측에서만 처리):", {
              status: response.status,
              message: errorData.message || "로그아웃 요청이 실패했습니다.",
            });
          }
        } catch (apiError) {
          // 네트워크 오류, 타임아웃 등
          if (apiError instanceof Error && apiError.name === "AbortError") {
            console.warn("로그아웃 API 타임아웃 (클라이언트 측에서만 처리)");
          } else {
            console.warn("로그아웃 API 호출 중 오류 (클라이언트 측에서만 처리):", apiError);
          }
        }
      }

      // localStorage 정리 (API 성공/실패와 관계없이 항상 실행)
      // 클라이언트 측 토큰 삭제로 기본적인 보안은 확보됨
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");

      setIsLoggedIn(false);
      setUserName(null);
      setShowDropdown(false);
      
      // 커스텀 이벤트 발생 (다른 컴포넌트에 알림)
      window.dispatchEvent(new Event("authStateChanged"));
      
      router.push("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      // 예상치 못한 오류 발생 시에도 로컬 스토리지 정리
      localStorage.clear();
      setIsLoggedIn(false);
      setUserName(null);
      setUserRole(null);
      setShowDropdown(false);
      
      // 커스텀 이벤트 발생
      window.dispatchEvent(new Event("authStateChanged"));
      
      router.push("/");
    }
  };

  return (
    <header className="border-b border-gray-400 bg-white">
      <div className="flex h-20 w-full items-center justify-between px-10">
        <div className="flex items-center gap-12">
          <Link href="/" className="relative h-10 w-[137px]">
            <Image
              src="/header/header_logo.svg"
              alt="Tumae 로고"
              fill
              priority
              sizes="137px"
              className="object-contain"
            />
          </Link>

          <nav className="flex items-center gap-10 text-base font-semibold">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`transition-colors ${
                    isActive ? "text-[#8055e1]" : "text-gray-900 hover:text-[#102c57]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex h-11 items-center gap-2 rounded-xl border border-gray-400 px-4 text-sm font-semibold text-gray-800 transition hover:border-[#8055e1] hover:bg-[#f1ebff] hover:text-[#8055e1]"
              >
                <span>{userName || "사용자"}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-300 bg-white shadow-lg overflow-hidden">
                  {userRole === "tutor" && (
                    <>
                      <Link
                        href="/resume"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        이력서
                      </Link>
                      <div className="border-t border-gray-200" />
                    </>
                  )}
                  <Link
                    href="/settings"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    설정
                  </Link>
                  <div className="border-t border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={`flex h-11 min-w-[104px] items-center justify-center rounded-xl border px-6 text-sm font-semibold transition ${
                  pathname.startsWith("/login")
                    ? "border-[#8055e1] bg-[#f1ebff] text-[#8055e1]"
                    : "border-gray-400 text-gray-800 hover:border-[#8055e1] hover:bg-[#f1ebff] hover:text-[#8055e1]"
                }`}
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className={`flex h-11 min-w-[104px] items-center justify-center rounded-xl border px-6 text-sm font-semibold transition ${
                  pathname.startsWith("/signup")
                    ? "border-[#8055e1] bg-[#f1ebff] text-[#8055e1]"
                    : "border-gray-400 text-gray-800 hover:border-[#8055e1] hover:bg-[#f1ebff] hover:text-[#8055e1]"
                }`}
              >
                회원 가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

