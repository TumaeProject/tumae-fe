"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingForm, type OnboardingField } from "@/components/signup/OnboardingForm";
import {
  BUSAN_DISTRICT_ID_MAP,
  CHUNGBUK_DISTRICT_ID_MAP,
  CHUNGNAM_DISTRICT_ID_MAP,
  DAEJEON_DISTRICT_ID_MAP,
  DAEGU_DISTRICT_ID_MAP,
  DAY_OPTIONS,
  GANGWON_DISTRICT_ID_MAP,
  GYEONGBUK_DISTRICT_ID_MAP,
  GYEONGNAM_DISTRICT_ID_MAP,
  GYEONGGI_DISTRICT_ID_MAP,
  GWANGJU_DISTRICT_ID_MAP,
  INCHEON_DISTRICT_ID_MAP,
  JEJU_DISTRICT_ID_MAP,
  JEONBUK_DISTRICT_ID_MAP,
  JEONNAM_DISTRICT_ID_MAP,
  LESSON_TYPE_ID_MAP,
  LEVEL_ID_MAP,
  LEVEL_OPTIONS,
  METHOD_OPTIONS,
  PURPOSE_ID_MAP,
  PURPOSE_OPTIONS,
  REGION_ID_MAP,
  SEOUL_DISTRICT_ID_MAP,
  SUBJECT_ID_MAP,
  SUBJECT_OPTIONS,
  TIME_BAND_ID_MAP,
  TIME_OPTIONS,
  ULSAN_DISTRICT_ID_MAP,
} from "@/components/signup/onboardingOptions";
import { RegionSelector } from "@/components/signup/RegionSelector";

type TutorFormValues = {
  subjects: string[];
  purpose: string[];
  levels: string[];
  teachingMethod: string[];
  preferredPriceMin: string;
  preferredPriceMax: string;
  days: string[];
  timeSlots: string[];
  regions: string[];
  education: string;
};

const INITIAL_TUTOR_FORM: TutorFormValues = {
  subjects: [],
  purpose: [],
  levels: [],
  teachingMethod: [],
  preferredPriceMin: "20000",
  preferredPriceMax: "50000",
  days: [],
  timeSlots: [],
  regions: [],
  education: "",
};

const TUTOR_FIELDS: OnboardingField<TutorFormValues>[] = [
  {
    type: "multiSelect",
    key: "subjects",
    label: "과외 분야",
    options: SUBJECT_OPTIONS,
  },
  {
    type: "multiSelect",
    key: "purpose",
    label: "과외 목적",
    options: PURPOSE_OPTIONS,
  },
  {
    type: "multiSelect",
    key: "levels",
    label: "수강생 레벨",
    options: LEVEL_OPTIONS,
  },
  {
    type: "multiSelect",
    key: "teachingMethod",
    label: "수업 방식",
    options: METHOD_OPTIONS,
  },
  {
    type: "range",
    key: "preferredPriceMin",
    label: "시간 당 최소 희망 수업 가격",
    min: 20000,
    max: 50000,
    step: 5000,
    minLabel: "20,000원",
    maxLabel: "50,000원",
  },
  {
    type: "range",
    key: "preferredPriceMax",
    label: "시간 당 최대 희망 수업 가격",
    min: 20000,
    max: 50000,
    step: 5000,
    minLabel: "20,000원",
    maxLabel: "50,000원",
  },
  {
    type: "multiSelect",
    key: "days",
    label: "수업 요일",
    options: DAY_OPTIONS,
  },
  {
    type: "multiSelect",
    key: "timeSlots",
    label: "수업 시간대",
    options: TIME_OPTIONS,
  },
  {
    type: "textarea",
    key: "education",
    label: "학력",
    placeholder: "최종 학력을 입력해주세요",
    rows: 4,
  },
];

const validateTutorForm = (form: TutorFormValues) => {
  if (form.subjects.length === 0) {
    return "과외 분야를 최소 한 가지 이상 선택해주세요.";
  }

  if (form.teachingMethod.length === 0) {
    return "수업 방식을 선택해주세요.";
  }

  if (!form.preferredPriceMin || !form.preferredPriceMax) {
    return "희망 수업 가격을 설정해주세요.";
  }

  const minPrice = parseInt(form.preferredPriceMin, 10);
  const maxPrice = parseInt(form.preferredPriceMax, 10);

  if (minPrice > maxPrice) {
    return "최소 가격은 최대 가격보다 작거나 같아야 합니다.";
  }

  // 백엔드 제약 조건: 20000 ~ 50000
  if (minPrice < 20000 || minPrice > 50000) {
    return "최소 가격은 20,000원 이상 50,000원 이하여야 합니다.";
  }

  if (maxPrice < 20000 || maxPrice > 50000) {
    return "최대 가격은 20,000원 이상 50,000원 이하여야 합니다.";
  }

  return null;
};

// 요일을 숫자로 변환 (월=0, 화=1, ..., 일=6)
const dayToWeekday = (day: string): number => {
  return DAY_OPTIONS.indexOf(day);
};

// 시간대를 time_band_id로 변환 (실제 DB ID 사용)
const timeSlotToTimeBandId = (timeSlot: string): number => {
  return TIME_BAND_ID_MAP[timeSlot] || 0;
};

export function TutorOnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  const handleTutorSubmit = async (form: TutorFormValues) => {
    try {
      // user_id 확인
      if (!userId) {
        throw new Error("사용자 ID가 없습니다. 회원가입을 먼저 완료해주세요.");
      }

      // days와 timeSlots를 조합하여 tutor_availabilities 생성
      const tutorAvailabilities: Array<{ weekday: number; time_band_id: number }> = [];
      
      // 모든 요일과 시간대의 조합 생성
      form.days.forEach((day) => {
        form.timeSlots.forEach((timeSlot) => {
          tutorAvailabilities.push({
            weekday: dayToWeekday(day),
            time_band_id: timeSlotToTimeBandId(timeSlot),
          });
        });
      });

      // 문자열 선택 값을 백엔드에서 사용하는 ID로 매핑
      // 레벨은 실제 DB ID로 매핑 (각 과목에 적용할 스킬 레벨)
      const tutorSkillLevels = form.levels
        .map((level) => LEVEL_ID_MAP[level])
        .filter((id): id is number => id !== undefined && id > 0);
      
      // 선택된 레벨 중 첫 번째를 사용 (또는 모든 레벨을 각 과목에 적용)
      const skillLevelId = tutorSkillLevels[0] || 0;
      
      // 과목은 객체 배열로 변환 (tutor_subjects는 {subject_id: number, skill_level_id: number} 형식)
      const tutorSubjects = form.subjects
        .map((subject) => SUBJECT_ID_MAP[subject])
        .filter((id): id is number => id !== undefined && id > 0)
        .map((subjectId) => ({ 
          subject_id: subjectId,
          skill_level_id: skillLevelId
        }));
      
      // 목적은 실제 DB ID로 매핑
      const tutorGoals = form.purpose
        .map((goal) => PURPOSE_ID_MAP[goal])
        .filter((id): id is number => id !== undefined && id > 0);
      // 수업 방식은 실제 DB ID로 매핑
      const tutorLessonTypes = form.teachingMethod
        .map((method) => LESSON_TYPE_ID_MAP[method])
        .filter((id): id is number => id !== undefined && id > 0);

      // 지역을 DB ID로 매핑하여 정수 배열로 변환
      // 형태: "서울특별시 종로구" -> ID 추출
      const tutorRegions: number[] = form.regions
        .map((region) => {
          // "서울특별시 종로구" 형식에서 구 ID 추출
          const parts = region.split(" ");
          if (parts.length === 2) {
            const [sido, district] = parts;
            // 서울의 경우
            if (sido === "서울특별시" && SEOUL_DISTRICT_ID_MAP[district]) {
              return SEOUL_DISTRICT_ID_MAP[district];
            }
            // 부산의 경우
            if (sido === "부산광역시" && BUSAN_DISTRICT_ID_MAP[district]) {
              return BUSAN_DISTRICT_ID_MAP[district];
            }
            // 대구의 경우
            if (sido === "대구광역시" && DAEGU_DISTRICT_ID_MAP[district]) {
              return DAEGU_DISTRICT_ID_MAP[district];
            }
            // 인천의 경우
            if (sido === "인천광역시" && INCHEON_DISTRICT_ID_MAP[district]) {
              return INCHEON_DISTRICT_ID_MAP[district];
            }
            // 광주의 경우
            if (sido === "광주광역시" && GWANGJU_DISTRICT_ID_MAP[district]) {
              return GWANGJU_DISTRICT_ID_MAP[district];
            }
            // 대전의 경우
            if (sido === "대전광역시" && DAEJEON_DISTRICT_ID_MAP[district]) {
              return DAEJEON_DISTRICT_ID_MAP[district];
            }
            // 울산의 경우
            if (sido === "울산광역시" && ULSAN_DISTRICT_ID_MAP[district]) {
              return ULSAN_DISTRICT_ID_MAP[district];
            }
            // 경기의 경우
            if (sido === "경기도" && GYEONGGI_DISTRICT_ID_MAP[district]) {
              return GYEONGGI_DISTRICT_ID_MAP[district];
            }
            // 강원의 경우
            if (sido === "강원특별자치도" && GANGWON_DISTRICT_ID_MAP[district]) {
              return GANGWON_DISTRICT_ID_MAP[district];
            }
            // 충북의 경우
            if (sido === "충청북도" && CHUNGBUK_DISTRICT_ID_MAP[district]) {
              return CHUNGBUK_DISTRICT_ID_MAP[district];
            }
            // 충남의 경우
            if (sido === "충청남도" && CHUNGNAM_DISTRICT_ID_MAP[district]) {
              return CHUNGNAM_DISTRICT_ID_MAP[district];
            }
            // 전북의 경우
            if (sido === "전라북도" && JEONBUK_DISTRICT_ID_MAP[district]) {
              return JEONBUK_DISTRICT_ID_MAP[district];
            }
            // 전남의 경우
            if (sido === "전라남도" && JEONNAM_DISTRICT_ID_MAP[district]) {
              return JEONNAM_DISTRICT_ID_MAP[district];
            }
            // 경북의 경우
            if (sido === "경상북도" && GYEONGBUK_DISTRICT_ID_MAP[district]) {
              return GYEONGBUK_DISTRICT_ID_MAP[district];
            }
            // 경남의 경우
            if (sido === "경상남도" && GYEONGNAM_DISTRICT_ID_MAP[district]) {
              return GYEONGNAM_DISTRICT_ID_MAP[district];
            }
            // 제주의 경우
            if (sido === "제주특별자치도" && JEJU_DISTRICT_ID_MAP[district]) {
              return JEJU_DISTRICT_ID_MAP[district];
            }
            // 다른 시/도는 추후 추가
          }
          // 시/도만 선택된 경우
          if (REGION_ID_MAP[region]) {
            return REGION_ID_MAP[region];
          }
          return null;
        })
        .filter((id): id is number => id !== null && id > 0);

      const minPrice = parseInt(form.preferredPriceMin, 10);
      const maxPrice = parseInt(form.preferredPriceMax, 10);
      
      // API 요청 데이터 구성
      const requestData = {
        user_id: parseInt(userId, 10),
        tutor_subjects: tutorSubjects,
        tutor_lesson_types: tutorLessonTypes,
        tutor_availabilities: tutorAvailabilities,
        tutor_goals: tutorGoals,
        tutor_skill_levels: tutorSkillLevels,
        tutor_regions: tutorRegions,
        hourly_rate_min: minPrice,
        hourly_rate_max: maxPrice,
        education_level: form.education || "",
      };

      console.log("튜터 온보딩 API 요청 데이터:", requestData);

      const response = await fetch("/api/auth/tutors/details", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("튜터 온보딩 실패 응답:", {
          status: response.status,
          data,
        });

        // 에러 메시지 처리
        let message = "정보 저장에 실패했어요. 다시 시도해주세요.";
        
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

      // 성공 시 완료 페이지로 리다이렉트
      router.push("/signup/complete");
    } catch (error) {
      console.error("튜터 온보딩 제출 실패:", error);
      throw error;
    }
  };

  return (
    <OnboardingForm
      title="튜터 정보 입력"
      description="튜터 매칭을 위해 필요한 정보를 입력해주세요. 입력한 내용은 언제든지 수정할 수 있어요."
      fields={TUTOR_FIELDS}
      initialValues={INITIAL_TUTOR_FORM}
      validate={validateTutorForm}
      onSubmit={handleTutorSubmit}
      submitLabel="정보 저장하기"
      loadingLabel="저장 중..."
      renderCustomField={(formValues, setFormValues) => (
        <section className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">희망 지역</h3>
          <RegionSelector
            selectedRegions={(formValues.regions as string[]) || []}
            onChange={(regions) => {
              setFormValues({ ...formValues, regions } as TutorFormValues);
            }}
          />
        </section>
      )}
    />
  );
}


