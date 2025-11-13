"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingForm, type OnboardingField } from "@/components/signup/OnboardingForm";
import {
  DAY_OPTIONS,
  LEVEL_OPTIONS,
  METHOD_OPTIONS,
  PURPOSE_OPTIONS,
  SUBJECT_OPTIONS,
  TIME_OPTIONS,
} from "@/components/signup/onboardingOptions";

type StudentFormValues = {
  subjects: string[];
  purpose: string[];
  levels: string[];
  teachingMethod: string[];
  preferredPriceMin: string;
  preferredPriceMax: string;
  days: string[];
  timeSlots: string[];
  education: string;
};

const INITIAL_STUDENT_FORM: StudentFormValues = {
  subjects: [],
  purpose: [],
  levels: [],
  teachingMethod: [],
  preferredPriceMin: "10000",
  preferredPriceMax: "300000",
  days: [],
  timeSlots: [],
  education: "",
};

const STUDENT_FIELDS: OnboardingField<StudentFormValues>[] = [
  {
    type: "multiSelect",
    key: "subjects",
    label: "관심 과목",
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
    label: "현재 실력",
    options: LEVEL_OPTIONS,
  },
  {
    type: "multiSelect",
    key: "teachingMethod",
    label: "희망 수업 방식",
    options: METHOD_OPTIONS,
  },
  {
    type: "range",
    key: "preferredPriceMin",
    label: "시간 당 최소 희망 수업 예산",
    min: 10000,
    max: 300000,
    step: 5000,
    minLabel: "10,000원",
    maxLabel: "300,000원",
  },
  {
    type: "range",
    key: "preferredPriceMax",
    label: "시간 당 최대 희망 수업 예산",
    min: 10000,
    max: 300000,
    step: 5000,
    minLabel: "10,000원",
    maxLabel: "300,000원",
  },
  {
    type: "multiSelect",
    key: "days",
    label: "수업 가능 요일",
    options: DAY_OPTIONS,
  },
  {
    type: "multiSelect",
    key: "timeSlots",
    label: "수업 가능 시간대",
    options: TIME_OPTIONS,
  },
  {
    type: "textarea",
    key: "education",
    label: "현재 학력/상태",
    placeholder: "현재 학력이나 상황을 입력해주세요",
    rows: 4,
  },
];

const validateStudentForm = (form: StudentFormValues) => {
  if (form.subjects.length === 0) {
    return "관심 과목을 최소 한 가지 이상 선택해주세요.";
  }

  if (form.teachingMethod.length === 0) {
    return "희망 수업 방식을 선택해주세요.";
  }

  if (!form.preferredPriceMin || !form.preferredPriceMax) {
    return "희망 수업 예산을 설정해주세요.";
  }

  const minPrice = parseInt(form.preferredPriceMin, 10);
  const maxPrice = parseInt(form.preferredPriceMax, 10);

  if (minPrice > maxPrice) {
    return "최소 예산은 최대 예산보다 작거나 같아야 합니다.";
  }

  return null;
};

// 요일을 숫자로 변환 (월=0, 화=1, ..., 일=6)
const dayToWeekday = (day: string): number => {
  return DAY_OPTIONS.indexOf(day);
};

// 시간대를 time_band_id로 변환
const timeSlotToTimeBandId = (timeSlot: string): number => {
  const timeMap: Record<string, number> = {
    "오전 (09-12시)": 1,
    "오후 (13-17시)": 2,
    "저녁 (18-22시)": 3,
  };
  return timeMap[timeSlot] || 0;
};

export function StudentOnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  const handleStudentSubmit = async (form: StudentFormValues) => {
    try {
      // user_id 확인
      if (!userId) {
        throw new Error("사용자 ID가 없습니다. 회원가입을 먼저 완료해주세요.");
      }

      // days와 timeSlots를 조합하여 student_availabilities 생성
      const studentAvailabilities: Array<{ weekday: number; time_band_id: number }> = [];
      
      // 모든 요일과 시간대의 조합 생성
      form.days.forEach((day) => {
        form.timeSlots.forEach((timeSlot) => {
          studentAvailabilities.push({
            weekday: dayToWeekday(day),
            time_band_id: timeSlotToTimeBandId(timeSlot),
          });
        });
      });

      // 문자열 배열을 정수 배열로 변환 (인덱스 기반)
      // TODO: 백엔드 API에서 실제 ID 매핑이 필요할 수 있음
      const studentSubjects = form.subjects.map((_, index) => index);
      const studentGoals = form.purpose.map((_, index) => index);
      const studentLessonTypes = form.teachingMethod.map((_, index) => index);
      const studentSkillLevels = form.levels.map((_, index) => index);

      const minPrice = parseInt(form.preferredPriceMin, 10);
      const maxPrice = parseInt(form.preferredPriceMax, 10);
      
      // API 요청 데이터 구성
      const requestData = {
        user_id: parseInt(userId, 10),
        student_subjects: studentSubjects,
        student_goals: studentGoals,
        student_lesson_types: studentLessonTypes,
        student_regions: [], // TODO: 지역 정보가 필요하면 추가
        student_availabilities: studentAvailabilities,
        preferred_price_min: minPrice,
        preferred_price_max: maxPrice,
        student_skill_levels: studentSkillLevels,
      };

      console.log("학생 온보딩 API 요청 데이터:", requestData);

      const response = await fetch("/api/auth/students/details", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("학생 온보딩 실패 응답:", {
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
      console.error("학생 온보딩 제출 실패:", error);
      throw error;
    }
  };

  return (
    <OnboardingForm
      title="학생 정보 입력"
      description="원하는 튜터를 찾기 위해 필요한 정보를 입력해주세요. 입력한 내용은 언제든지 수정할 수 있어요."
      fields={STUDENT_FIELDS}
      initialValues={INITIAL_STUDENT_FORM}
      validate={validateStudentForm}
      onSubmit={handleStudentSubmit}
      submitLabel="정보 저장하기"
      loadingLabel="저장 중..."
    />
  );
}

