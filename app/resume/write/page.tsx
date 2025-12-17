"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BlockType = "career" | "project" | "certificate" | "portfolio";

type ResumeFormData = {
  block_type: BlockType;
  title: string;
  period: string;
  role: string;
  description: string;
  tech_stack: string;
  issuer: string;
  acquired_at: string;
  file_url: string;
  link_url: string;
};

const BLOCK_TYPES: { value: BlockType; label: string; description: string }[] = [
  { value: "career", label: "경력", description: "회사명, 기간, 역할, 설명을 입력해주세요" },
  { value: "project", label: "프로젝트", description: "프로젝트명, 기간, 기술 스택, 설명을 입력해주세요" },
  { value: "certificate", label: "자격증", description: "자격증명, 발행처, 취득일을 입력해주세요" },
  { value: "portfolio", label: "포트폴리오", description: "포트폴리오 링크와 제목을 입력해주세요" },
];

const INITIAL_FORM: ResumeFormData = {
  block_type: "career",
  title: "",
  period: "",
  role: "",
  description: "",
  tech_stack: "",
  issuer: "",
  acquired_at: "",
  file_url: "",
  link_url: "",
};

export default function ResumeWritePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forms, setForms] = useState<ResumeFormData[]>([
    { ...INITIAL_FORM, block_type: "career" },
    { ...INITIAL_FORM, block_type: "project" },
    { ...INITIAL_FORM, block_type: "certificate" },
    { ...INITIAL_FORM, block_type: "portfolio" },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      const role = localStorage.getItem("user_role");
      const id = localStorage.getItem("user_id");
      setIsLoggedIn(!!accessToken);
      setUserRole(role);
      setUserId(id);

      if (!accessToken) {
        router.push("/login");
      } else if (role !== "tutor") {
        router.push("/");
      }
    }
  }, [router]);

  const currentBlock = BLOCK_TYPES[currentStep];
  const currentForm = forms[currentStep];

  const handleChange = (field: keyof ResumeFormData, value: string) => {
    setForms((prev) => {
      const updated = [...prev];
      updated[currentStep] = { ...updated[currentStep], [field]: value };
      return updated;
    });
    setError(null);
  };

  const handleSubmit = async (skip: boolean = false) => {
    if (!userId) {
      setError("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    if (!skip) {
      // 필수 필드 검증
      if (!currentForm.title.trim()) {
        setError("제목을 입력해주세요.");
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("access_token");
      
      // 건너뛰기가 아닌 경우에만 API 호출
      if (!skip) {
        // 요청 데이터 구성 (빈 문자열은 null로 변환)
        const requestData: any = {
          block_type: currentForm.block_type,
          title: currentForm.title.trim() || null,
          period: currentForm.period.trim() || null,
          role: currentForm.role.trim() || null,
          description: currentForm.description.trim() || null,
          tech_stack: currentForm.tech_stack.trim() || null,
          issuer: currentForm.issuer.trim() || null,
          acquired_at: currentForm.acquired_at.trim() || null,
          file_url: currentForm.file_url.trim() || null,
          link_url: currentForm.link_url.trim() || null,
        };

        console.log("이력서 저장 요청 데이터:", JSON.stringify(requestData, null, 2));

        const response = await fetch(`/api/resume/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "이력서 블록을 저장하는데 실패했습니다.");
        }
      }

      // 다음 단계로 이동
      if (currentStep < BLOCK_TYPES.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // 모든 단계 완료
        router.push("/resume");
      }
    } catch (err) {
      console.error("이력서 저장 오류:", err);
      setError(err instanceof Error ? err.message : "이력서를 저장하는데 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn || userRole !== "tutor") {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl py-8 px-4">
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        {/* 진행 표시 */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">이력서 작성</h1>
            <span className="text-sm text-gray-500">
              {currentStep + 1} / {BLOCK_TYPES.length}
            </span>
          </div>
          <div className="flex gap-2">
            {BLOCK_TYPES.map((block, index) => (
              <div
                key={block.value}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? "bg-[#8055e1]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 현재 블록 정보 */}
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">{currentBlock.label}</h2>
          <p className="text-sm text-gray-600">{currentBlock.description}</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 폼 필드 */}
        <div className="space-y-6">
          {/* 제목 (모든 블록 타입 공통) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentForm.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder={
                currentForm.block_type === "career"
                  ? "예: 네이버 백엔드 인턴"
                  : currentForm.block_type === "project"
                  ? "예: AI 튜터 추천 시스템"
                  : currentForm.block_type === "certificate"
                  ? "예: 정보처리기사"
                  : "예: GitHub 포트폴리오"
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
            />
          </div>

          {/* 경력/프로젝트 공통 필드 */}
          {(currentForm.block_type === "career" || currentForm.block_type === "project") && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">기간</label>
                <input
                  type="text"
                  value={currentForm.period}
                  onChange={(e) => handleChange("period", e.target.value)}
                  placeholder="예: 2023.01 ~ 2023.06"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {currentForm.block_type === "career" ? "역할/직책" : "기여도"}
                </label>
                <input
                  type="text"
                  value={currentForm.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  placeholder={
                    currentForm.block_type === "career"
                      ? "예: 백엔드 개발 인턴"
                      : "예: 백엔드 API 개발 담당"
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">상세 설명</label>
                <textarea
                  value={currentForm.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="예: 로그인 API 개발 및 서버 운영"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">기술 스택</label>
                <input
                  type="text"
                  value={currentForm.tech_stack}
                  onChange={(e) => handleChange("tech_stack", e.target.value)}
                  placeholder="예: FastAPI, PostgreSQL, React"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
                <p className="mt-1 text-xs text-gray-500">쉼표로 구분하여 입력해주세요</p>
              </div>
            </>
          )}

          {/* 자격증 전용 필드 */}
          {currentForm.block_type === "certificate" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">발행처</label>
                <input
                  type="text"
                  value={currentForm.issuer}
                  onChange={(e) => handleChange("issuer", e.target.value)}
                  placeholder="예: 한국산업인력공단"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">취득일</label>
                <input
                  type="date"
                  value={currentForm.acquired_at}
                  onChange={(e) => handleChange("acquired_at", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">파일 URL (선택)</label>
                <input
                  type="url"
                  value={currentForm.file_url}
                  onChange={(e) => handleChange("file_url", e.target.value)}
                  placeholder="예: https://example.com/certificate.pdf"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
              </div>
            </>
          )}

          {/* 프로젝트 링크 필드 */}
          {currentForm.block_type === "project" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">프로젝트 링크</label>
              <input
                type="url"
                value={currentForm.link_url}
                onChange={(e) => handleChange("link_url", e.target.value)}
                placeholder="예: https://github.com/username/project"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
              />
            </div>
          )}

          {/* 포트폴리오 전용 필드 */}
          {currentForm.block_type === "portfolio" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">간단한 설명</label>
                <textarea
                  value={currentForm.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="예: 웹 서비스 모음"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">주요 기술</label>
                <input
                  type="text"
                  value={currentForm.tech_stack}
                  onChange={(e) => handleChange("tech_stack", e.target.value)}
                  placeholder="예: Python, FastAPI"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
                <p className="mt-1 text-xs text-gray-500">쉼표로 구분하여 입력해주세요</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">파일 URL (선택)</label>
                <input
                  type="url"
                  value={currentForm.file_url}
                  onChange={(e) => handleChange("file_url", e.target.value)}
                  placeholder="예: https://example.com/portfolio.pdf"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">포트폴리오 링크</label>
                <input
                  type="url"
                  value={currentForm.link_url}
                  onChange={(e) => handleChange("link_url", e.target.value)}
                  placeholder="예: https://github.com/username/project"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
                />
              </div>
            </>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            건너뛰기
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-[#8055e1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6f48d8] disabled:opacity-50"
          >
            {isSubmitting ? "저장 중..." : currentStep === BLOCK_TYPES.length - 1 ? "완료" : "다음으로"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/resume"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            취소하고 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

