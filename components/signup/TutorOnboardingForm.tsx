"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { FormInput } from "@/components/signup/FormInput";
import { FormTextarea } from "@/components/signup/FormTextarea";

const SUBJECT_OPTIONS = [
  "React",
  "React Native",
  "Spring",
  "데이터 베이스",
  "안드로이드 앱",
  "iOS 앱",
  "Python",
  "C 언어",
  "아두이노/라즈베리파이",
  "JAVA",
  "웹 기초",
  "블록코딩"
];

const LEVEL_OPTIONS = ["관련 지식 없음", "기초 언어만 앎", "기본 활용 가능", "실무 활용 가능"];

const METHOD_OPTIONS = ["개인 과외", "그룹 과외", "온라인 과외", "무관"];

const DAY_OPTIONS = ["월", "화", "수", "목", "금", "토", "일"];

const TIME_OPTIONS = ["오전 (09-12시)", "오후 (13-17시)", "저녁 (18-22시)"];

const PURPOSE_OPTIONS = ["취미/자기개발", "취업준비", "공모전/프로젝트", "학업관련"];

type FormState = {
  subjects: string[];
  levels: string[];
  teachingMethod: string[];
  desiredPrice: string;
  days: string[];
  timeSlots: string[];
  name: string;
  education: string;
};

const INITIAL_FORM: FormState = {
  subjects: [],
  levels: [],
  teachingMethod: [],
  desiredPrice: "10000",
  days: [],
  timeSlots: [],
  name: "",
  education: "",
};

export function TutorOnboardingForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleMultiSelect = (field: keyof Pick<FormState, "subjects" | "levels" | "teachingMethod" | "days" | "timeSlots">, value: string) => {
    setForm((prev) => {
      const current = prev[field];
      const exists = current.includes(value);
      const next = exists ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const handleInputChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      education: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.subjects.length === 0) {
      setErrorMessage("과외 분야를 최소 한 가지 이상 선택해주세요.");
      return;
    }

    if (form.teachingMethod.length === 0) {
      setErrorMessage("수업 방식을 선택해주세요.");
      return;
    }

    if (!form.desiredPrice) {
      setErrorMessage("희망 수업 가격을 입력해주세요.");
      return;
    }

    if (!form.name.trim()) {
      setErrorMessage("이름을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // TODO: API 연동 시 form 데이터를 서버로 전달하세요.
      console.log("튜터 온보딩 제출:", form);
      await new Promise((resolve) => setTimeout(resolve, 600));

      setSuccessMessage("정보가 성공적으로 저장되었어요!");
    } catch (error) {
      console.error("튜터 온보딩 제출 실패:", error);
      setErrorMessage("정보 제출에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCheckboxGroup = (
    options: string[],
    field: keyof Pick<FormState, "subjects" | "levels" | "teachingMethod" | "days" | "timeSlots">
  ) => (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {options.map((option) => {
        const isActive = form[field].includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggleMultiSelect(field, option)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-[#8055e1] bg-[#f1ebff] text-[#8055e1]"
                : "border-gray-300 text-gray-700 hover:border-[#8055e1] hover:text-[#8055e1]"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">튜터 정보 입력</h2>
        <p className="mt-2 text-sm text-gray-500">
          튜터 매칭을 위해 필요한 정보를 입력해주세요. 입력한 내용은 언제든지 수정할 수 있어요.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}
      {successMessage ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {successMessage}
        </div>
      ) : null}

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">과외 분야</h3>
        {renderCheckboxGroup(SUBJECT_OPTIONS, "subjects")}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">과외 목적</h3>
        {renderCheckboxGroup(PURPOSE_OPTIONS, "subjects")}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">수강생 레벨</h3>
        {renderCheckboxGroup(LEVEL_OPTIONS, "levels")}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">수업 방식</h3>
        {renderCheckboxGroup(METHOD_OPTIONS, "teachingMethod")}
      </section>


      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-lg font-semibold text-gray-900">시간 당 희망 수업 가격</label>
          <span className="text-sm font-semibold text-[#8055e1]">
            {form.desiredPrice ? Number(form.desiredPrice).toLocaleString("ko-KR") : "10,000"}원
          </span>
        </div>
        <input
          type="range"
          name="desiredPrice"
          min={10000}
          max={300000}
          step={5000}
          value={form.desiredPrice || "10000"}
          onChange={handleInputChange("desiredPrice")}
          className="w-full accent-[#8055e1]"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>10,000원</span>
          <span>300,000원</span>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">수업 요일</h3>
        {renderCheckboxGroup(DAY_OPTIONS, "days")}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">수업 시간대</h3>
        {renderCheckboxGroup(TIME_OPTIONS, "timeSlots")}
      </section>

      <FormTextarea
        label="학력"
        name="education"
        value={form.education}
        placeholder="최종 학력을 입력해주세요"
        rows={4}
        onChange={handleTextareaChange}
      />

      <button
        type="submit"
        className="w-full rounded-xl bg-[#8055e1] py-3 text-white font-semibold shadow-sm transition hover:bg-[#6f48d8] disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "저장 중..." : "정보 저장하기"}
      </button>
    </form>
  );
}


