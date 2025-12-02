"use client";

import { useEffect, useState } from "react";
import { TutorMatchCard } from "@/components/tutors/TutorMatchCard";
import { TutorDetailModal } from "@/components/tutors/TutorDetailModal";
import { SUBJECT_ID_TO_NAME, PURPOSE_ID_TO_NAME } from "@/components/students/studentConstants";

type Tutor = {
  id?: number;
  name: string;
  tag: string;
  purposes: string[];
  subjects: string[];
  regions: string[];
  priceLabel: string;
  matchScore?: number;
};

type ApiTutor = {
  id?: number;
  name?: string;
  email?: string;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  subjects?: string[] | number[];
  regions?: string[] | number[];
  skill_level?: string;
  goals?: string[] | number[];
  lesson_types?: string[] | number[];
  match_score?: number;
};

function formatPriceLabel(minPrice?: number, maxPrice?: number): string {
  if (!minPrice && !maxPrice) return "가격 협의";
  if (minPrice && maxPrice) {
    return `시간 당 ${minPrice.toLocaleString()} ~ ${maxPrice.toLocaleString()}`;
  }
  if (minPrice) {
    return `시간 당 ${minPrice.toLocaleString()} 이상`;
  }
  return `시간 당 ${maxPrice?.toLocaleString()} 이하`;
}

function transformApiTutorToCard(apiTutor: ApiTutor): Tutor {
  const name = apiTutor.name || "이름 없음";
  
  // 목적 변환 - goals 배열 처리
  let purposes: string[] = [];
  if (apiTutor.goals && Array.isArray(apiTutor.goals)) {
    purposes = apiTutor.goals.map((goal: any) => {
      if (typeof goal === "string") {
        return goal;
      }
      if (typeof goal === "number") {
        return PURPOSE_ID_TO_NAME[goal] || `목적 #${goal}`;
      }
      return String(goal);
    }).filter(Boolean);
  }

  // 과목 변환 - subjects 배열 처리
  let subjects: string[] = [];
  if (apiTutor.subjects && Array.isArray(apiTutor.subjects)) {
    subjects = apiTutor.subjects.map((subject: any) => {
      if (typeof subject === "string") {
        return subject;
      }
      if (typeof subject === "number") {
        return SUBJECT_ID_TO_NAME[subject] || `과목 #${subject}`;
      }
      return String(subject);
    }).filter(Boolean);
  }

  // 지역 변환 - regions 배열 처리
  let regions: string[] = [];
  if (apiTutor.regions && Array.isArray(apiTutor.regions)) {
    regions = apiTutor.regions.map((region: any) => {
      if (typeof region === "string") {
        return region;
      }
      if (typeof region === "number") {
        return `지역 #${region}`;
      }
      return String(region);
    }).filter(Boolean);
  }

  const priceLabel = formatPriceLabel(
    apiTutor.hourly_rate_min,
    apiTutor.hourly_rate_max
  );

  return {
    id: apiTutor.id,
    name,
    tag: "선생님",
    purposes: purposes.length > 0 ? purposes : ["목적 없음"],
    subjects: subjects.length > 0 ? subjects : ["과목 없음"],
    regions: regions.length > 0 ? regions : [],
    priceLabel,
    matchScore: apiTutor.match_score,
  };
}

export default function TutorsPage() {
  const [perfectMatchTutors, setPerfectMatchTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutorId, setSelectedTutorId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllTutors, setShowAllTutors] = useState(false);

  // 모달 상태 디버깅
  useEffect(() => {
    console.log("모달 상태 변경:", { isModalOpen, selectedTutorId });
  }, [isModalOpen, selectedTutorId]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        // localStorage에서 user_id 가져오기
        const userId = localStorage.getItem("user_id");
        
        if (!userId) {
          setError("로그인이 필요합니다. 먼저 로그인해주세요.");
          setIsLoading(false);
          return;
        }

        // API 호출
        const queryParams = new URLSearchParams({
          user_id: userId,
          min_score: "50",
          limit: "20",
          offset: "0",
        });

        const response = await fetch(`/api/tutors?${queryParams.toString()}`);
        const data = await response.json();

        console.log("=== API 응답 전체 ===");
        console.log("status:", response.status);
        console.log("data:", JSON.stringify(data, null, 2));

        if (!response.ok) {
          console.error("API 호출 실패:", data);
          throw new Error(data?.message || "선생님 목록을 불러오는데 실패했습니다.");
        }

        // API 응답 데이터 처리
        let tutors: ApiTutor[] = [];
        if (Array.isArray(data)) {
          tutors = data;
          console.log("응답이 배열입니다. 길이:", tutors.length);
        } else if (Array.isArray(data.data)) {
          tutors = data.data;
          console.log("응답이 data 배열입니다. 길이:", tutors.length);
        } else if (data.tutors && Array.isArray(data.tutors)) {
          tutors = data.tutors;
          console.log("응답이 tutors 배열입니다. 길이:", tutors.length);
        } else if (data.results && Array.isArray(data.results)) {
          tutors = data.results;
          console.log("응답이 results 배열입니다. 길이:", tutors.length);
        } else {
          console.warn("응답 구조를 알 수 없습니다:", data);
          console.log("data 타입:", typeof data);
          console.log("data 키들:", Object.keys(data || {}));
        }
        
        console.log("추출된 선생님 목록:", tutors);
        console.log("선생님 수:", tutors.length);
        console.log("첫 번째 선생님:", tutors[0]);
        console.log("첫 번째 선생님 ID:", tutors[0]?.id);

        // API 데이터를 카드 형식으로 변환
        if (tutors.length === 0) {
          console.warn("선생님 데이터가 비어있습니다!");
          setPerfectMatchTutors([]);
        } else {
          // id가 있는 선생님만 필터링
          const validTutors = tutors.filter((t) => t.id !== undefined && t.id !== null);
          if (validTutors.length !== tutors.length) {
            console.warn(`${tutors.length - validTutors.length}명의 선생님이 id가 없어 제외되었습니다.`);
          }
          const transformedTutors = validTutors.map(transformApiTutorToCard);
          console.log("변환된 선생님 목록:", transformedTutors);
          console.log("변환된 선생님 수:", transformedTutors.length);
          setPerfectMatchTutors(transformedTutors);
        }
      } catch (err) {
        console.error("선생님 목록 조회 실패:", err);
        setError(err instanceof Error ? err.message : "선생님 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return (
    <>
      <TutorDetailModal
        tutorId={selectedTutorId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTutorId(null);
        }}
      />
      
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/65 to-white" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col gap-16 px-4 py-12">
        <header className="space-y-10 text-center md:text-left">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 text-gray-800 md:mx-0">
            <span className="mx-auto w-fit rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8055e1] shadow-sm md:mx-0">
              Tutor Matching
            </span>
            <h1 className="text-3xl font-bold leading-snug md:text-4xl">
              학습이 필요한 순간, <span className="text-[#8055e1]">튜매</span>가
              <br className="hidden md:block" /> 가장 잘 맞는 선생님을 연결해드릴게요.
            </h1>
            <p className="text-base text-gray-600 md:text-lg">
              학습 목적과 실력을 분석해 맞춤형 선생님을 추천해 드립니다.
              <br />
              원하는 수업 방식에 맞춰 지금 바로 상담을 시작해 보세요.
            </p>
          </div>
        </header>

        <section className="space-y-6 rounded-3xl bg-white/80 p-8 shadow-[0_30px_50px_rgba(128,85,225,0.08)] backdrop-blur">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">나와 딱 맞는 선생님</h2>
              <p className="text-sm text-gray-500">
                온보딩 정보를 기반으로 학생님과 가장 잘 맞는 선생님들을 추천했어요.
              </p>
            </div>
            {perfectMatchTutors.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllTutors(!showAllTutors)}
                className="w-full rounded-full border border-[#d7cbff] px-5 py-2 text-sm font-medium text-[#5a3dd8] transition hover:-translate-y-0.5 hover:border-[#8055e1] hover:text-[#8055e1] md:w-auto"
              >
                {showAllTutors ? "간략히 보기" : "더 많은 선생님 보기"}
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8055e1]"></div>
                <p className="text-sm text-gray-600">선생님 정보를 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
              <p className="font-semibold mb-2">에러 발생</p>
              <p>{error}</p>
            </div>
          ) : perfectMatchTutors.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                {(showAllTutors ? perfectMatchTutors : perfectMatchTutors.slice(0, 3)).map((tutor, index) => {
                  console.log("선생님 카드 렌더링:", { name: tutor.name, id: tutor.id, index });
                  return (
                    <TutorMatchCard
                      key={`${tutor.name}-${index}-perfect`}
                      tutorId={tutor.id}
                      {...tutor}
                      onDetailClick={(id) => {
                        console.log("onDetailClick 호출됨, id:", id);
                        console.log("현재 모달 상태:", isModalOpen);
                        setSelectedTutorId(id);
                        setIsModalOpen(true);
                        console.log("setIsModalOpen(true) 호출됨");
                        setTimeout(() => {
                          console.log("상태 업데이트 후:", { isModalOpen, selectedTutorId: id });
                        }, 0);
                      }}
                    />
                  );
                })}
              </div>
              {!showAllTutors && perfectMatchTutors.length > 3 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  총 {perfectMatchTutors.length}명의 선생님이 있어요
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
              아직 매칭되는 선생님이 없어요. 조건을 조정해보세요.
            </div>
          )}
        </section>

        {/* 추후 추가될 다른 섹션들을 위한 공간 */}
        <section className="space-y-6 rounded-3xl bg-white/70 p-8 shadow-[0_20px_45px_rgba(119,74,255,0.06)] backdrop-blur">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">지금 뜨는 선생님</h2>
              <p className="text-sm text-gray-500">
                교육 열정이 높고, 최근 많은 학생님들이 상담을 진행 중인 선생님들이에요.
              </p>
            </div>
            <button
              type="button"
              className="w-full rounded-full border border-[#d7cbff] px-5 py-2 text-sm font-medium text-[#5a3dd8] transition hover:-translate-y-0.5 hover:border-[#8055e1] hover:text-[#8055e1] md:w-auto"
            >
              추천 선생님 저장하기
            </button>
          </div>
          <div className="text-center text-gray-500">
            추후 추가 예정
          </div>
        </section>

        <section className="space-y-6 rounded-3xl bg-white/60 p-8 shadow-[0_20px_45px_rgba(119,74,255,0.05)] backdrop-blur">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">새로 등록된 선생님</h2>
              <p className="text-sm text-gray-500">
                이제 막 학생을 찾기 시작한 선생님이에요. 빠르게 상담을 제안해 보세요!
              </p>
            </div>
            <button
              type="button"
              className="w-full rounded-full border border-[#d7cbff] px-5 py-2 text-sm font-medium text-[#5a3dd8] transition hover:-translate-y-0.5 hover:border-[#8055e1] hover:text-[#8055e1] md:w-auto"
            >
              빠른 상담 제안
            </button>
          </div>
          <div className="text-center text-gray-500">
            추후 추가 예정
          </div>
        </section>
      </div>
    </>
  );
}

