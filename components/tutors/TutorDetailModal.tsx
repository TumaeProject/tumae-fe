"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SUBJECT_ID_TO_NAME, PURPOSE_ID_TO_NAME, LESSON_TYPE_ID_TO_NAME } from "../students/studentConstants";

type TutorDetail = {
  id: number;
  name: string;
  email: string;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  subjects?: string[] | number[];
  regions?: string[] | number[];
  skill_level?: string;
  goals?: string[] | number[];
  lesson_types?: string[] | number[];
  created_at?: string;
  signup_status?: string;
};

type TutorDetailModalProps = {
  tutorId: number | null;
  isOpen: boolean;
  onClose: () => void;
};

export function TutorDetailModal({ tutorId, isOpen, onClose }: TutorDetailModalProps) {
  const router = useRouter();
  const [tutor, setTutor] = useState<TutorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("TutorDetailModal useEffect:", { isOpen, tutorId });
    if (isOpen && tutorId) {
      console.log("모달이 열리고 선생님 정보를 가져옵니다:", tutorId);
      fetchTutorDetail(tutorId);
    } else {
      setTutor(null);
      setError(null);
    }
  }, [isOpen, tutorId]);

  const fetchTutorDetail = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/tutors/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "선생님 정보를 불러오는데 실패했습니다.");
      }

      setTutor(data);
    } catch (err) {
      console.error("선생님 상세 정보 조회 실패:", err);
      setError(err instanceof Error ? err.message : "선생님 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (min?: number, max?: number) => {
    if (!min && !max) return "협의 가능";
    if (min && max) {
      return `시간당 ${min.toLocaleString()}원 ~ ${max.toLocaleString()}원`;
    }
    if (min) {
      return `시간당 ${min.toLocaleString()}원 이상`;
    }
    return `시간당 ${max?.toLocaleString()}원 이하`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const convertArrayToStrings = (arr: any[] | undefined, idMap: Record<number, string>) => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "number") return idMap[item] || `항목 #${item}`;
      return String(item);
    });
  };

  if (!isOpen) {
    console.log("모달이 닫혀있습니다:", isOpen);
    return null;
  }

  console.log("모달 렌더링 중:", { isOpen, tutorId, isLoading, error });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/95 hover:bg-white shadow-lg text-gray-500 hover:text-gray-900 transition-all hover:scale-110"
          aria-label="닫기"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="animate-spin rounded-full h-14 w-14 border-3 border-[#8055e1] border-t-transparent" />
            <p className="text-sm text-gray-500">선생님 정보를 불러오는 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !isLoading && (
          <div className="p-8 text-center">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
              {error}
            </div>
          </div>
        )}

        {/* 선생님 상세 정보 */}
        {tutor && !isLoading && (
          <div className="overflow-y-auto max-h-[85vh]">
            {/* 헤더 */}
            <div className="relative bg-gradient-to-br from-[#8055e1] via-[#6f48d8] to-[#5b3ad6] px-8 pt-10 pb-14 text-white overflow-hidden">
              {/* 배경 장식 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative flex items-start gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-4xl font-bold shadow-xl border border-white/30">
                  {tutor.name.charAt(0)}
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-3xl font-bold mb-3 tracking-tight">{tutor.name}</h2>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-white/90 text-sm">{tutor.email}</p>
                  </div>
                  {tutor.signup_status && (
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold border border-white/30">
                      {tutor.signup_status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 내용 */}
            <div className="p-6 space-y-3">
              {/* 가격 정보 */}
              <div className="relative bg-gradient-to-br from-[#f3edff] via-[#f0e9ff] to-[#ede6ff] rounded-xl p-4 shadow-lg border border-[#e5dbff]/50 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-[#8055e1] to-[#6f48d8] rounded-full"></div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5b3ad6]">
                    수업료
                  </h3>
                </div>
                <p className="text-xl font-bold text-[#8055e1] tracking-tight">
                  {formatPrice(tutor.hourly_rate_min, tutor.hourly_rate_max)}
                </p>
              </div>

              {/* 목적 */}
              {tutor.goals && tutor.goals.length > 0 && (
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#8055e1] rounded-full"></span>
                    학습 목적
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {convertArrayToStrings(tutor.goals, PURPOSE_ID_TO_NAME).map((goal, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-[#f3edff] px-4 py-2 text-sm font-medium text-[#5f4bb0] shadow-sm hover:shadow-md transition-shadow"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 과목 */}
              {tutor.subjects && tutor.subjects.length > 0 && (
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#3465d8] rounded-full"></span>
                    학습 과목
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {convertArrayToStrings(tutor.subjects, SUBJECT_ID_TO_NAME).map((subject, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-[#e7f0ff] px-4 py-2 text-sm font-medium text-[#3465d8] shadow-sm hover:shadow-md transition-shadow"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 스킬 레벨 */}
              {tutor.skill_level && (
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#d97706] rounded-full"></span>
                    현재 실력
                  </h3>
                  <div className="inline-block rounded-full bg-[#fff5e6] px-4 py-2 text-sm font-semibold text-[#d97706] shadow-sm">
                    {tutor.skill_level}
                  </div>
                </div>
              )}

              {/* 수업 방식 */}
              {tutor.lesson_types && tutor.lesson_types.length > 0 && (
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#0369a1] rounded-full"></span>
                    선호 수업 방식
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {convertArrayToStrings(tutor.lesson_types, LESSON_TYPE_ID_TO_NAME).map((type, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-[#f0f9ff] px-4 py-2 text-sm font-medium text-[#0369a1] shadow-sm hover:shadow-md transition-shadow"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 지역 */}
              {tutor.regions && tutor.regions.length > 0 && (
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gray-500 rounded-full"></span>
                    선호 지역
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.regions.map((region, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {typeof region === "string" ? region : `지역 #${region}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 가입일 */}
              {tutor.created_at && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>가입일: <span className="text-gray-700 font-medium">{formatDate(tutor.created_at)}</span></span>
                  </div>
                </div>
              )}
            </div>

            {/* 하단 버튼 */}
            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-white/95 border-t border-gray-200 px-8 py-5 flex gap-3 backdrop-blur-sm">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border-2 border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  if (tutor) {
                    router.push(`/messages/compose?receiver_id=${tutor.id}&receiver_name=${encodeURIComponent(tutor.name)}`);
                    onClose();
                  }
                }}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#8055e1] to-[#6f48d8] px-6 py-3.5 text-sm font-semibold text-white hover:from-[#6f48d8] hover:to-[#5b3ad6] transition-all shadow-lg hover:shadow-xl"
              >
                상담 신청하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

