"use client";

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
  desiredPrice: string;
  days: string[];
  timeSlots: string[];
  education: string;
};

const INITIAL_STUDENT_FORM: StudentFormValues = {
  subjects: [],
  purpose: [],
  levels: [],
  teachingMethod: [],
  desiredPrice: "10000",
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
    key: "desiredPrice",
    label: "시간 당 희망 수업 예산",
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

  if (!form.desiredPrice) {
    return "희망 수업 예산을 설정해주세요.";
  }

  return null;
};

const handleStudentSubmit = async (form: StudentFormValues) => {
  console.log("학생 온보딩 제출:", form);
  await new Promise((resolve) => setTimeout(resolve, 600));
};

export function StudentOnboardingForm() {
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

