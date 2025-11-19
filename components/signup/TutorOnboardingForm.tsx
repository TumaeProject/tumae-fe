"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingForm, type OnboardingField } from "@/components/signup/OnboardingForm";
import {
  DAY_OPTIONS,
  LESSON_TYPE_ID_MAP,
  LEVEL_ID_MAP,
  LEVEL_OPTIONS,
  METHOD_OPTIONS,
  PURPOSE_ID_MAP,
  PURPOSE_OPTIONS,
  SUBJECT_ID_MAP,
  SUBJECT_OPTIONS,
  TIME_BAND_ID_MAP,
  TIME_OPTIONS,
} from "@/components/signup/onboardingOptions";

type TutorFormValues = {
  subjects: string[];
  purpose: string[];
  levels: string[];
  teachingMethod: string[];
  desiredPrice: string;
  days: string[];
  timeSlots: string[];
  education: string;
};

const INITIAL_TUTOR_FORM: TutorFormValues = {
  subjects: [],
  purpose: [],
  levels: [],
  teachingMethod: [],
  desiredPrice: "10000",
  days: [],
  timeSlots: [],
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
    key: "desiredPrice",
    label: "시간 당 희망 수업 가격",
    min: 10000,
    max: 300000,
    step: 5000,
    minLabel: "10,000원",
    maxLabel: "300,000원",
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

  if (!form.desiredPrice) {
    return "희망 수업 가격을 입력해주세요.";
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
      // 과목은 실제 DB ID로 매핑
      const tutorSubjects = form.subjects
        .map((subject) => SUBJECT_ID_MAP[subject])
        .filter((id): id is number => id !== undefined && id > 0);
      // 목적은 실제 DB ID로 매핑
      const tutorGoals = form.purpose
        .map((goal) => PURPOSE_ID_MAP[goal])
        .filter((id): id is number => id !== undefined && id > 0);
      // 수업 방식은 실제 DB ID로 매핑
      const tutorLessonTypes = form.teachingMethod
        .map((method) => LESSON_TYPE_ID_MAP[method])
        .filter((id): id is number => id !== undefined && id > 0);
      // 레벨은 실제 DB ID로 매핑
      const tutorSkillLevels = form.levels
        .map((level) => LEVEL_ID_MAP[level])
        .filter((id): id is number => id !== undefined && id > 0);

      const price = parseInt(form.desiredPrice, 10);
      
      // API 요청 데이터 구성
      const requestData = {
        user_id: parseInt(userId, 10),
        tutor_subjects: tutorSubjects,
        tutor_goals: tutorGoals,
        tutor_lesson_types: tutorLessonTypes,
        tutor_regions: [], // TODO: 지역 정보가 필요하면 추가
        tutor_availabilities: tutorAvailabilities,
        desired_price: price,
        tutor_skill_levels: tutorSkillLevels,
        education: form.education,
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
    />
  );
}


