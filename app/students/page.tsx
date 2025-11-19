"use client";

import { StudentMatchCard } from "@/components/students/StudentMatchCard";

const PERFECT_MATCH_STUDENTS = [
  {
    name: "김철수",
    tag: "학생",
    purposes: ["공모전 / 프로젝트"],
    subjects: ["웹 개발"],
    priceLabel: "시간 당 20,000 이상",
  },
  {
    name: "홍길동",
    tag: "학생",
    purposes: ["취업준비"],
    subjects: ["Python"],
    priceLabel: "시간 당 30,000 이상",
  },
  {
    name: "김성신",
    tag: "학생",
    purposes: ["취미 / 자기개발"],
    subjects: ["JAVA / Spring"],
    priceLabel: "시간 당 30,000 이상",
  },
];

const TRENDING_STUDENTS = [
  {
    name: "박소연",
    tag: "학생",
    purposes: ["취업 포트폴리오"],
    subjects: ["UI/UX 디자인"],
    priceLabel: "시간 당 25,000 이상",
  },
  {
    name: "이도현",
    tag: "학생",
    purposes: ["대학 과제"],
    subjects: ["데이터 분석", "Python"],
    priceLabel: "시간 당 32,000 이상",
  },
  {
    name: "정민아",
    tag: "학생",
    purposes: ["취미 / 사이드 프로젝트"],
    subjects: ["React", "TypeScript"],
    priceLabel: "시간 당 27,000 이상",
  },
];

const FRESH_STUDENTS = [
  {
    name: "최다온",
    tag: "학생",
    purposes: ["기초 실력 다지기"],
    subjects: ["C 언어"],
    priceLabel: "시간 당 18,000 이상",
  },
  {
    name: "장하늘",
    tag: "학생",
    purposes: ["취업준비"],
    subjects: ["Spring", "JAVA"],
    priceLabel: "시간 당 35,000 이상",
  },
  {
    name: "서지후",
    tag: "학생",
    purposes: ["공모전 / 프로젝트"],
    subjects: ["머신러닝", "Python"],
    priceLabel: "시간 당 29,000 이상",
  },
];

const FILTERS = ["전체", "취업준비", "공모전", "취미", "기초 다지기", "실무 역량"];

export default function StudentsPage() {
  return (
    <>
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/65 to-white" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col gap-16 px-4 py-12">
        <header className="space-y-10 text-center md:text-left">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 text-gray-800 md:mx-0">
            <span className="mx-auto w-fit rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8055e1] shadow-sm md:mx-0">
              Student Matching
            </span>
            <h1 className="text-3xl font-bold leading-snug md:text-4xl">
              공부가 필요한 순간, <span className="text-[#8055e1]">튜매</span>가
              <br className="hidden md:block" /> 가장 잘 맞는 학생을 연결해드릴게요.
            </h1>
            <p className="text-base text-gray-600 md:text-lg">
              학습 목적과 실력을 분석해 맞춤형 학생을 추천해 드립니다. 원하는 수업 방식에 맞춰 지금 바로 상담을 시작해 보세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  filter === "전체"
                    ? "bg-[#8055e1] text-white"
                    : "bg-white/80 text-[#5b36d4] border border-[#e5dbff]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </header>

        <section className="space-y-6 rounded-3xl bg-white/80 p-8 shadow-[0_30px_50px_rgba(128,85,225,0.08)] backdrop-blur">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">나와 딱 맞는 학생</h2>
              <p className="text-sm text-gray-500">
                온보딩 정보를 기반으로 튜터님과 가장 잘 맞는 학생들을 추천했어요.
              </p>
            </div>
            <button
              type="button"
              className="w-full rounded-full border border-[#d7cbff] px-5 py-2 text-sm font-medium text-[#5a3dd8] transition hover:-translate-y-0.5 hover:border-[#8055e1] hover:text-[#8055e1] md:w-auto"
            >
              더 많은 학생 보기
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PERFECT_MATCH_STUDENTS.map((student) => (
              <StudentMatchCard key={`${student.name}-perfect`} {...student} />
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-3xl bg-white/70 p-8 shadow-[0_20px_45px_rgba(119,74,255,0.06)] backdrop-blur">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">지금 뜨는 학생</h2>
              <p className="text-sm text-gray-500">
                교육 열정이 높고, 최근 많은 튜터님들이 상담을 진행 중인 학생들이에요.
              </p>
            </div>
            <button
              type="button"
              className="w-full rounded-full border border-[#d7cbff] px-5 py-2 text-sm font-medium text-[#5a3dd8] transition hover:-translate-y-0.5 hover:border-[#8055e1] hover:text-[#8055e1] md:w-auto"
            >
              추천 학생 저장하기
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TRENDING_STUDENTS.map((student) => (
              <StudentMatchCard key={`${student.name}-trending`} {...student} />
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-3xl bg-white/60 p-8 shadow-[0_20px_45px_rgba(119,74,255,0.05)] backdrop-blur">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">새로 등록된 학생</h2>
              <p className="text-sm text-gray-500">
                이제 막 튜터를 찾기 시작한 학생이에요. 빠르게 상담을 제안해 보세요!
              </p>
            </div>
            <button
              type="button"
              className="w-full rounded-full border border-[#d7cbff] px-5 py-2 text-sm font-medium text-[#5a3dd8] transition hover:-translate-y-0.5 hover:border-[#8055e1] hover:text-[#8055e1] md:w-auto"
            >
              빠른 상담 제안
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {FRESH_STUDENTS.map((student) => (
              <StudentMatchCard key={`${student.name}-fresh`} {...student} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

