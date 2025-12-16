"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ResumeBlock = {
  id: number;
  block_type: string;
  title: string;
  period?: string;
  role?: string;
  description?: string;
  tech_stack?: string;
  issuer?: string;
  acquired_at?: string;
  file_url?: string;
  link_url?: string;
  created_at: string;
  updated_at?: string | null;
};

export default function ResumePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resumeBlocks, setResumeBlocks] = useState<ResumeBlock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<ResumeBlock | null>(null);
  const [editForm, setEditForm] = useState<Partial<ResumeBlock>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      const name = localStorage.getItem("user_name");
      const role = localStorage.getItem("user_role");
      const id = localStorage.getItem("user_id");
      setIsLoggedIn(!!accessToken);
      setUserName(name);
      setUserRole(role);
      setUserId(id);

      if (!accessToken) {
        router.push("/login");
      } else if (role !== "tutor") {
        // 선생님이 아닌 경우 홈으로 리다이렉트
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [router]);

  // 이력서 조회 API 호출
  useEffect(() => {
    const fetchResume = async () => {
      if (!userId || !isLoggedIn || userRole !== "tutor") {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(`/api/resume/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        });

        // Content-Type 확인
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("이력서 조회 비-JSON 응답:", {
            status: response.status,
            contentType,
            text: text.substring(0, 200),
          });
          throw new Error("서버에서 올바르지 않은 응답을 받았습니다.");
        }

        const data = await response.json();

        console.log("이력서 조회 응답:", data);

        if (!response.ok) {
          if (response.status === 404) {
            // 이력서가 없는 경우 (정상)
            setResumeBlocks([]);
          } else {
            throw new Error(data?.message || "이력서를 불러오는데 실패했습니다.");
          }
        } else {
          // 성공 응답 처리
          if (data.message === "SUCCESS" && data.data) {
            // 응답이 객체 형태인 경우 (각 블록 타입별로 분리된 경우)
            if (typeof data.data === "object" && !Array.isArray(data.data)) {
              // 모든 블록 타입의 배열을 하나로 합치기 (block_type 추가)
              const allBlocks: ResumeBlock[] = [];
              if (Array.isArray(data.data.career)) {
                allBlocks.push(...data.data.career.map((block: any) => ({
                  ...block,
                  block_type: "career",
                  created_at: block.created_at || new Date().toISOString(),
                })));
              }
              if (Array.isArray(data.data.project)) {
                allBlocks.push(...data.data.project.map((block: any) => ({
                  ...block,
                  block_type: "project",
                  created_at: block.created_at || new Date().toISOString(),
                })));
              }
              if (Array.isArray(data.data.certificate)) {
                allBlocks.push(...data.data.certificate.map((block: any) => ({
                  ...block,
                  block_type: "certificate",
                  created_at: block.created_at || new Date().toISOString(),
                })));
              }
              if (Array.isArray(data.data.portfolio)) {
                allBlocks.push(...data.data.portfolio.map((block: any) => ({
                  ...block,
                  block_type: "portfolio",
                  created_at: block.created_at || new Date().toISOString(),
                })));
              }
              setResumeBlocks(allBlocks);
            } else if (Array.isArray(data.data)) {
              // 응답이 배열 형태인 경우
              setResumeBlocks(data.data);
            } else {
              setResumeBlocks([]);
            }
          } else {
            setResumeBlocks([]);
          }
        }
      } catch (err) {
        console.error("이력서 조회 오류:", err);
        setError(err instanceof Error ? err.message : "이력서를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && isLoggedIn && userRole === "tutor") {
      fetchResume();
    }
  }, [userId, isLoggedIn, userRole]);

  // 블록 타입별 한글 라벨
  const getBlockTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      career: "경력",
      project: "프로젝트",
      certificate: "자격증",
      portfolio: "포트폴리오",
    };
    return labels[type] || type;
  };

  // 블록 타입별 아이콘 색상
  const getBlockTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      career: "bg-blue-100 text-blue-600",
      project: "bg-purple-100 text-purple-600",
      certificate: "bg-green-100 text-green-600",
      portfolio: "bg-orange-100 text-orange-600",
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  // 블록 타입별 아이콘
  const getBlockTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactElement> = {
      career: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      project: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      certificate: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      portfolio: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    };
    return icons[type] || (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 이력서 블록 수정
  const handleUpdateBlock = async () => {
    if (!editingBlock) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        throw new Error("로그인이 필요합니다.");
      }
      
      // 수정할 필드만 포함 (빈 문자열은 null로 변환)
      const updateData: any = {};
      if (editForm.title !== undefined) updateData.title = editForm.title.trim() || null;
      if (editForm.period !== undefined) updateData.period = editForm.period.trim() || null;
      if (editForm.role !== undefined) updateData.role = editForm.role.trim() || null;
      if (editForm.description !== undefined) updateData.description = editForm.description.trim() || null;
      if (editForm.tech_stack !== undefined) updateData.tech_stack = editForm.tech_stack.trim() || null;
      if (editForm.issuer !== undefined) updateData.issuer = editForm.issuer.trim() || null;
      if (editForm.acquired_at !== undefined) updateData.acquired_at = editForm.acquired_at.trim() || null;
      if (editForm.file_url !== undefined) updateData.file_url = editForm.file_url.trim() || null;
      if (editForm.link_url !== undefined) updateData.link_url = editForm.link_url.trim() || null;

      console.log("이력서 블록 수정 요청:", {
        blockId: editingBlock.id,
        updateData,
      });

      const response = await fetch(`/api/resume/block/${editingBlock.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      console.log("이력서 블록 수정 응답:", {
        status: response.status,
        data,
      });

      if (!response.ok) {
        throw new Error(data?.message || data?.detail || "이력서 블록을 수정하는데 실패했습니다.");
      }

      // 성공 시 목록 새로고침
      const fetchResume = async () => {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(`/api/resume/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        });

        const data = await response.json();
        if (response.ok && data.message === "SUCCESS" && data.data) {
          if (typeof data.data === "object" && !Array.isArray(data.data)) {
            const allBlocks: ResumeBlock[] = [];
            if (Array.isArray(data.data.career)) {
              allBlocks.push(...data.data.career.map((block: any) => ({
                ...block,
                block_type: "career",
                created_at: block.created_at || new Date().toISOString(),
              })));
            }
            if (Array.isArray(data.data.project)) {
              allBlocks.push(...data.data.project.map((block: any) => ({
                ...block,
                block_type: "project",
                created_at: block.created_at || new Date().toISOString(),
              })));
            }
            if (Array.isArray(data.data.certificate)) {
              allBlocks.push(...data.data.certificate.map((block: any) => ({
                ...block,
                block_type: "certificate",
                created_at: block.created_at || new Date().toISOString(),
              })));
            }
            if (Array.isArray(data.data.portfolio)) {
              allBlocks.push(...data.data.portfolio.map((block: any) => ({
                ...block,
                block_type: "portfolio",
                created_at: block.created_at || new Date().toISOString(),
              })));
            }
            setResumeBlocks(allBlocks);
          } else if (Array.isArray(data.data)) {
            setResumeBlocks(data.data);
          }
        }
      };

      await fetchResume();
      setSuccessMessage("이력서가 성공적으로 수정되었습니다.");
      
      // 성공 메시지 표시 후 모달 닫기
      setTimeout(() => {
        setEditingBlock(null);
        setEditForm({});
        setSuccessMessage(null);
      }, 1000);
    } catch (err) {
      console.error("이력서 수정 오류:", err);
      setError(err instanceof Error ? err.message : "이력서를 수정하는데 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#8055e1] border-t-transparent"></div>
          <p className="mt-4 text-gray-500">이력서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || userRole !== "tutor") {
    return null;
  }

  return (
    <>
      {/* 배경 그라데이션 */}
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.12),_transparent_45%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/60 via-white/80 to-white" />
      
      <div className="mx-auto max-w-4xl py-8 px-4">
        <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-xl border border-white/50">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">이력서</h1>
          <p className="text-gray-600">내 이력서를 확인하고 관리할 수 있어요.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {resumeBlocks.length === 0 ? (
            /* 이력서가 없는 경우 */
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-4 text-lg font-semibold text-gray-900">이력서가 없어요</h3>
              <p className="mt-2 text-sm text-gray-500">
                이력서를 작성하면 더 나은 매칭을 받을 수 있어요.
              </p>
              <Link
                href="/resume/write"
                className="mt-6 inline-block rounded-lg bg-[#8055e1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6f48d8]"
              >
                이력서 작성하기
              </Link>
            </div>
          ) : (
            /* 이력서 블록 목록 */
            <div className="space-y-6">
              {resumeBlocks.map((block) => (
                <div
                  key={block.id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-sm transition-all hover:border-[#8055e1]/30 hover:shadow-xl"
                >
                  {/* 배경 그라데이션 */}
                  <div
                    className={`absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10 pointer-events-none ${
                      block.block_type === "career"
                        ? "bg-gradient-to-br from-blue-400 to-blue-600"
                        : block.block_type === "project"
                        ? "bg-gradient-to-br from-purple-400 via-[#8055e1] to-purple-600"
                        : block.block_type === "certificate"
                        ? "bg-gradient-to-br from-green-400 to-green-600"
                        : block.block_type === "portfolio"
                        ? "bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600"
                        : "bg-gradient-to-br from-purple-400 via-[#8055e1] to-purple-600"
                    }`}
                  />

                  {/* 왼쪽 그라데이션 바 */}
                  <div
                    className={`absolute left-0 top-0 h-full w-1.5 pointer-events-none ${
                      block.block_type === "career"
                        ? "bg-gradient-to-b from-blue-400 to-blue-600"
                        : block.block_type === "project"
                        ? "bg-gradient-to-b from-purple-400 via-[#8055e1] to-purple-600"
                        : block.block_type === "certificate"
                        ? "bg-gradient-to-b from-green-400 to-green-600"
                        : block.block_type === "portfolio"
                        ? "bg-gradient-to-b from-orange-400 via-amber-500 to-orange-600"
                        : "bg-gradient-to-b from-purple-400 via-[#8055e1] to-purple-600"
                    }`}
                  />

                  <div className="ml-4 relative z-10">
                    {/* 헤더 */}
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <div
                            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                              block.block_type === "career"
                                ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700"
                                : block.block_type === "project"
                                ? "bg-gradient-to-r from-purple-100 via-[#f1ebff] to-purple-200 text-purple-700"
                                : block.block_type === "certificate"
                                ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700"
                                : block.block_type === "portfolio"
                                ? "bg-gradient-to-r from-orange-100 via-amber-50 to-orange-200 text-orange-700"
                                : "bg-gradient-to-r from-purple-100 via-[#f1ebff] to-purple-200 text-purple-700"
                            }`}
                          >
                            {getBlockTypeIcon(block.block_type)}
                            {getBlockTypeLabel(block.block_type)}
                          </div>
                          {block.period && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {block.period}
                            </div>
                          )}
                        </div>
                        <h3 className="mb-1 text-xl font-bold text-gray-900">{block.title || "제목 없음"}</h3>
                        {block.role && (
                          <p className="text-sm font-medium text-gray-600">{block.role}</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setEditingBlock(block);
                          setEditForm({
                            title: block.title || "",
                            period: block.period || "",
                            role: block.role || "",
                            description: block.description || "",
                            tech_stack: block.tech_stack || "",
                            issuer: block.issuer || "",
                            acquired_at: block.acquired_at || "",
                            file_url: block.file_url || "",
                            link_url: block.link_url || "",
                          });
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#8055e1] hover:bg-[#8055e1]/5 hover:text-[#8055e1]"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        수정
                      </button>
                    </div>

                    {/* 본문 */}
                    <div className="space-y-4">
                      {/* 역할/기여도 - 경력/프로젝트에만 표시 */}
                      {(block.block_type === "career" || block.block_type === "project") && block.role && block.role.trim() !== "" && (
                        <div className="flex items-center gap-2 rounded-lg bg-gray-50/80 px-4 py-2.5">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{block.role}</span>
                        </div>
                      )}

                      {/* 상세 설명 */}
                      {block.description && block.description.trim() !== "" && (
                        <div className="rounded-lg bg-gradient-to-br from-gray-50/80 to-white/80 p-4 border border-gray-100">
                          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{block.description}</p>
                        </div>
                      )}

                      {/* 기술 스택 - 프로젝트에만 표시 */}
                      {block.block_type === "project" && block.tech_stack && block.tech_stack.trim() !== "" && (
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <svg className="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">기술 스택</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {block.tech_stack.split(",").map((tech, idx) => (
                              <span
                                key={idx}
                                className="rounded-lg bg-gradient-to-br from-purple-50 via-[#f1ebff] to-purple-100 px-3 py-1.5 text-xs font-medium text-purple-700 shadow-sm border border-purple-200/50"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 자격증 정보 - 자격증에만 표시 */}
                      {block.block_type === "certificate" && ((block.issuer && block.issuer.trim() !== "") || (block.acquired_at && block.acquired_at.trim() !== "")) && (
                        <div className="grid gap-3 rounded-lg bg-gradient-to-br from-green-50/50 to-white/80 p-4 border border-green-100">
                          {block.issuer && block.issuer.trim() !== "" && (
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500">발행처</p>
                                <p className="text-sm font-semibold text-gray-900">{block.issuer}</p>
                              </div>
                            </div>
                          )}
                          {block.acquired_at && block.acquired_at.trim() !== "" && (
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500">취득일</p>
                                <p className="text-sm font-semibold text-gray-900">{formatDate(block.acquired_at)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 링크 및 파일 - 모든 블록 타입에 표시 (null이 아니고 빈 문자열이 아닐 때만) */}
                      {(block.link_url || block.file_url) && (
                        <div className="flex flex-wrap gap-3 pt-1">
                          {block.link_url && block.link_url.trim() !== "" && (
                            <a
                              href={block.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8055e1]/10 via-purple-50 to-[#8055e1]/10 px-4 py-2.5 text-sm font-medium text-[#8055e1] transition hover:from-[#8055e1]/20 hover:via-purple-100 hover:to-[#8055e1]/20 shadow-sm border border-[#8055e1]/20"
                            >
                              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span>링크 보기</span>
                            </a>
                          )}
                          {block.file_url && block.file_url.trim() !== "" && (
                            <a
                              href={block.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:from-gray-200 hover:to-gray-300 shadow-sm border border-gray-300/50"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <span>파일 보기</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* 생성일 및 수정일 */}
                      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                        {block.created_at && (
                          <div className="flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-gray-400">
                              생성: {formatDate(block.created_at)}
                            </p>
                          </div>
                        )}
                        {block.updated_at && (
                          <div className="flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <p className="text-xs text-gray-400">
                              수정: {formatDate(block.updated_at)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            돌아가기
          </Link>
        </div>
      </div>
      </div>

      {/* 수정 모달 */}
      {editingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">이력서 수정</h2>
              <button
                onClick={() => {
                  setEditingBlock(null);
                  setEditForm({});
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">제목</label>
                <input
                  type="text"
                  value={editForm.title || ""}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder={
                    editingBlock.block_type === "career"
                      ? "예: 네이버 백엔드 인턴"
                      : editingBlock.block_type === "project"
                      ? "예: AI 튜터 추천 시스템"
                      : editingBlock.block_type === "certificate"
                      ? "예: 정보처리기사"
                      : "예: GitHub 포트폴리오"
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
              </div>

              {/* 경력/프로젝트 공통 필드 */}
              {(editingBlock.block_type === "career" || editingBlock.block_type === "project") && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">기간</label>
                    <input
                      type="text"
                      value={editForm.period || ""}
                      onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                      placeholder="예: 2023.01 ~ 2023.06"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {editingBlock.block_type === "career" ? "역할/직책" : "기여도"}
                    </label>
                    <input
                      type="text"
                      value={editForm.role || ""}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      placeholder={
                        editingBlock.block_type === "career"
                          ? "예: 백엔드 개발 인턴"
                          : "예: 백엔드 API 개발 담당"
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">상세 설명</label>
                    <textarea
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="예: 로그인 API 개발 및 서버 운영"
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                    />
                  </div>
                </>
              )}

              {/* 프로젝트 전용 필드 */}
              {editingBlock.block_type === "project" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">기술 스택</label>
                  <input
                    type="text"
                    value={editForm.tech_stack || ""}
                    onChange={(e) => setEditForm({ ...editForm, tech_stack: e.target.value })}
                    placeholder="예: FastAPI, PostgreSQL, React"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                  />
                  <p className="mt-1 text-xs text-gray-500">쉼표로 구분하여 입력해주세요</p>
                </div>
              )}

              {/* 자격증 전용 필드 */}
              {editingBlock.block_type === "certificate" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">발행처</label>
                    <input
                      type="text"
                      value={editForm.issuer || ""}
                      onChange={(e) => setEditForm({ ...editForm, issuer: e.target.value })}
                      placeholder="예: 한국산업인력공단"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">취득일</label>
                    <input
                      type="date"
                      value={editForm.acquired_at || ""}
                      onChange={(e) => setEditForm({ ...editForm, acquired_at: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">파일 URL (선택)</label>
                    <input
                      type="url"
                      value={editForm.file_url || ""}
                      onChange={(e) => setEditForm({ ...editForm, file_url: e.target.value })}
                      placeholder="예: https://example.com/certificate.pdf"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                    />
                  </div>
                </>
              )}

              {/* 포트폴리오 전용 필드 */}
              {editingBlock.block_type === "portfolio" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">포트폴리오 링크</label>
                  <input
                    type="url"
                    value={editForm.link_url || ""}
                    onChange={(e) => setEditForm({ ...editForm, link_url: e.target.value })}
                    placeholder="예: https://github.com/username/project"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                  />
                </div>
              )}

              {/* 경력/프로젝트 링크 필드 */}
              {(editingBlock.block_type === "career" || editingBlock.block_type === "project") && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">링크 URL (선택)</label>
                  <input
                    type="url"
                    value={editForm.link_url || ""}
                    onChange={(e) => setEditForm({ ...editForm, link_url: e.target.value })}
                    placeholder="예: https://github.com/username/project"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  setEditingBlock(null);
                  setEditForm({});
                }}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdateBlock}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-[#8055e1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6f48d8] disabled:opacity-50"
              >
                {isSubmitting ? "저장 중..." : "저장하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

