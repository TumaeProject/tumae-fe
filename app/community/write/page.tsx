"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SUBJECT_OPTIONS, SUBJECT_ID_MAP } from "@/components/signup/onboardingOptions";
import { RegionSelector } from "@/components/signup/RegionSelector";
import {
  SEOUL_DISTRICT_ID_MAP,
  BUSAN_DISTRICT_ID_MAP,
  DAEGU_DISTRICT_ID_MAP,
  INCHEON_DISTRICT_ID_MAP,
  GWANGJU_DISTRICT_ID_MAP,
  DAEJEON_DISTRICT_ID_MAP,
  ULSAN_DISTRICT_ID_MAP,
  GYEONGGI_DISTRICT_ID_MAP,
  GANGWON_DISTRICT_ID_MAP,
  CHUNGBUK_DISTRICT_ID_MAP,
  CHUNGNAM_DISTRICT_ID_MAP,
  JEONBUK_DISTRICT_ID_MAP,
  JEONNAM_DISTRICT_ID_MAP,
  GYEONGBUK_DISTRICT_ID_MAP,
  GYEONGNAM_DISTRICT_ID_MAP,
  JEJU_DISTRICT_ID_MAP,
  REGION_OPTIONS,
} from "@/components/signup/onboardingOptions";

type PostFormValues = {
  title: string;
  body: string;
  subject: string;
  region: string;
  tags: string;
};

const INITIAL_FORM: PostFormValues = {
  title: "",
  body: "",
  subject: "",
  region: "",
  tags: "",
};

// 지역 문자열을 region_id로 변환
// regionString은 "서울특별시 강남구" 형식이거나 "강남구" 형식일 수 있음
function getRegionId(regionString: string): number | undefined {
  if (!regionString) return undefined;

  // "서울특별시 강남구" 같은 형식에서 "강남구" 부분만 추출
  const districtName = regionString.includes(" ") 
    ? regionString.split(" ").pop() || regionString
    : regionString;

  // 모든 지역 ID 맵을 하나로 합침
  const allDistrictMaps = {
    ...SEOUL_DISTRICT_ID_MAP,
    ...BUSAN_DISTRICT_ID_MAP,
    ...DAEGU_DISTRICT_ID_MAP,
    ...INCHEON_DISTRICT_ID_MAP,
    ...GWANGJU_DISTRICT_ID_MAP,
    ...DAEJEON_DISTRICT_ID_MAP,
    ...ULSAN_DISTRICT_ID_MAP,
    ...GYEONGGI_DISTRICT_ID_MAP,
    ...GANGWON_DISTRICT_ID_MAP,
    ...CHUNGBUK_DISTRICT_ID_MAP,
    ...CHUNGNAM_DISTRICT_ID_MAP,
    ...JEONBUK_DISTRICT_ID_MAP,
    ...JEONNAM_DISTRICT_ID_MAP,
    ...GYEONGBUK_DISTRICT_ID_MAP,
    ...GYEONGNAM_DISTRICT_ID_MAP,
    ...JEJU_DISTRICT_ID_MAP,
  };

  return allDistrictMaps[districtName];
}

export default function WritePostPage() {
  const router = useRouter();
  const [form, setForm] = useState<PostFormValues>(INITIAL_FORM);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 학생 권한 체크
  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      const userRole = localStorage.getItem("user_role");

      if (!accessToken) {
        router.push("/login");
        return;
      }

      if (userRole !== "student") {
        setErrorMessage("글 작성은 학생만 가능합니다.");
        // 에러 메시지를 보여준 후 커뮤니티 페이지로 리다이렉트
        setTimeout(() => {
          router.push("/community");
        }, 2000);
      }
    }
  }, [router]);

  const handleChange = (field: keyof PostFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!form.title.trim()) {
      setErrorMessage("제목을 입력해주세요.");
      return;
    }
    if (!form.body.trim()) {
      setErrorMessage("내용을 입력해주세요.");
      return;
    }
    if (!form.subject) {
      setErrorMessage("과목을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // localStorage에서 user_id 가져오기
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        throw new Error("로그인이 필요합니다. 먼저 로그인해주세요.");
      }

      // 과목 ID 매핑
      const subjectId = SUBJECT_ID_MAP[form.subject];
      if (!subjectId) {
        throw new Error("유효하지 않은 과목입니다.");
      }

      // 지역 ID 변환 (선택적)
      const regionId = selectedRegions.length > 0 
        ? getRegionId(selectedRegions[0]) 
        : undefined;

      // 태그 배열 변환 (쉼표로 구분된 문자열을 배열로)
      const tagsArray = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      // API 요청 데이터 구성
      const requestData: {
        author_id: number;
        title: string;
        body: string;
        subject_id: number;
        region_id?: number;
        tags?: string[];
      } = {
        author_id: parseInt(userId, 10),
        title: form.title.trim(),
        body: form.body.trim(),
        subject_id: subjectId,
      };

      if (regionId) {
        requestData.region_id = regionId;
      }

      if (tagsArray.length > 0) {
        requestData.tags = tagsArray;
      }

      console.log("글 작성 API 요청 데이터:", requestData);

      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("글 작성 실패 응답:", {
          status: response.status,
          data,
        });

        let message = "글 작성에 실패했어요. 다시 시도해주세요.";
        
        if (Array.isArray(data?.detail)) {
          message = data.detail
            .map((err: any) => {
              if (typeof err === "string") return err;
              if (err.msg) return `${err.loc?.join(".") || ""}: ${err.msg}`;
              return JSON.stringify(err);
            })
            .join(", ");
        } else if (typeof data?.detail === "string") {
          message = data.detail;
        } else if (typeof data?.message === "string") {
          message = data.message;
        }

        throw new Error(message);
      }

      // 성공 시 커뮤니티 페이지로 리다이렉트
      router.push("/community");
    } catch (error) {
      console.error("글 작성 실패:", error);
      setErrorMessage(error instanceof Error ? error.message : "글 작성에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/65 to-white" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col gap-8 px-4 py-12">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            새로운 글 작성하기
          </h1>
          <p className="mt-2 text-base text-gray-600 md:text-lg">
            궁금한 점이나 공유하고 싶은 내용을 작성해주세요.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl bg-white/80 p-8 shadow-[0_30px_50px_rgba(128,85,225,0.08)] backdrop-blur">
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {/* 제목 */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold text-gray-900">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="게시글 제목을 입력해주세요"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
              maxLength={200}
            />
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-semibold text-gray-900">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              value={form.body}
              onChange={(e) => handleChange("body", e.target.value)}
              placeholder="게시글 내용을 입력해주세요"
              rows={12}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20 resize-none"
            />
          </div>

          {/* 과목 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              과목 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {SUBJECT_OPTIONS.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => handleChange("subject", subject)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    form.subject === subject
                      ? "border-[#8055e1] bg-[#f1ebff] text-[#8055e1]"
                      : "border-gray-300 text-gray-700 hover:border-[#8055e1] hover:text-[#8055e1]"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* 지역 선택 (선택적) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              지역 <span className="text-gray-500 text-xs">(선택)</span>
            </label>
            <RegionSelector
              selectedRegions={selectedRegions}
              onChange={(regions) => {
                setSelectedRegions(regions);
                setForm((prev) => ({ ...prev, region: regions[0] || "" }));
              }}
            />
          </div>

          {/* 태그 */}
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-semibold text-gray-900">
              태그 <span className="text-gray-500 text-xs">(선택, 쉼표로 구분)</span>
            </label>
            <input
              type="text"
              id="tags"
              value={form.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="예: React, 초보자, 질문"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#8055e1] focus:outline-none focus:ring-2 focus:ring-[#8055e1]/20"
            />
            <p className="text-xs text-gray-500">여러 태그는 쉼표(,)로 구분해주세요.</p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-[#8055e1] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#6f48d8] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "작성 중..." : "작성하기"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

