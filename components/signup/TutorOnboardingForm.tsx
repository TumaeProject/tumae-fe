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

const handleTutorSubmit = async (form: TutorFormValues) => {
  console.log("튜터 온보딩 제출:", form);
  await new Promise((resolve) => setTimeout(resolve, 600));
};

export function TutorOnboardingForm() {
  return (
    <OnboardingForm
      title="튜터 정보 입력"
      description="튜터 매칭을 위해 필요한 정보를 입력해주세요. 입력한 내용은 언제든지 수정할 수 있어요."
      fields={TUTOR_FIELDS}
      initialValues={INITIAL_TUTOR_FORM}
      validate={validateTutorForm}
      onSubmit={handleTutorSubmit}
    />
  );
}


