"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* 배경 그라데이션 */}
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/65 to-white" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col">
        {/* 히어로 섹션 (배너) */}
        <section className="relative overflow-hidden rounded-3xl bg-white mt-8 shadow-2xl border border-gray-100 min-h-[600px] md:min-h-[700px]">
          {/* 배경 그라데이션 레이어 */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8055e1]/5 via-[#9d7aff]/5 to-[#b89fff]/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(128,85,225,0.15),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(255,162,216,0.15),_transparent_50%)]" />
          
          <div className="relative z-10 flex h-full min-h-[600px] md:min-h-[700px] items-center px-8 py-16 md:px-16 md:py-32">
            <div className="mx-auto w-full max-w-5xl">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                {/* 텍스트 영역 */}
                <div className="text-center lg:text-left">
                  <div className="mb-4 inline-block rounded-full bg-[#8055e1]/10 px-4 py-2 text-sm font-semibold text-[#8055e1]">
                    🎓 튜터와 학생이 만나는 곳
                  </div>
                  <h1 className="mb-6 text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
                    <span className="block">당신의</span>
                    <span className="block bg-gradient-to-r from-[#8055e1] to-[#9d7aff] bg-clip-text text-transparent">
                      튜매
                    </span>
                  </h1>
                  <p className="mb-8 text-lg leading-relaxed text-gray-600 md:text-xl">
                    오늘도 성장하는 하루,
                    <br className="hidden md:block" />
                    당신의 공부 파트너를 튜매에서 만나보세요.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                    <Link
                      href="/students"
                      className="group flex-1 rounded-xl bg-[#8055e1] px-8 py-4 text-center text-base font-semibold text-white shadow-lg transition-all hover:bg-[#6f48d8] hover:shadow-xl hover:-translate-y-0.5 sm:flex-1 sm:min-w-[160px]"
                    >
                      학생 찾기
                      <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                    <Link
                      href="/tutors"
                      className="group flex-1 rounded-xl border-2 border-[#8055e1] bg-white px-8 py-4 text-center text-base font-semibold text-[#8055e1] transition-all hover:bg-[#8055e1]/5 hover:-translate-y-0.5 sm:flex-1 sm:min-w-[160px]"
                    >
                      선생님 찾기
                      <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
                
                {/* 일러스트 영역 */}
                <div className="relative hidden lg:block">
                  <div className="relative">
                    {/* 장식 원형 요소 */}
                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#8055e1]/20 to-[#9d7aff]/20 blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#ffa2d8]/20 to-[#ffc2e8]/20 blur-2xl" />
                    
                    {/* 일러스트 컨테이너 */}
                    <div className="relative overflow-hidden rounded-3xl bg-white p-10 shadow-2xl border border-gray-100">
                      {/* 배경 패턴 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#f1ebff]/50 via-white to-[#f8f0ff]/50" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(128,85,225,0.05),_transparent_70%)]" />
                      
                      <div className="relative z-10">
                        {/* 연결선 */}
                        <div className="relative mb-8 flex items-center justify-center">
                          <div className="absolute left-1/2 top-1/2 h-0.5 w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-[#8055e1]/30 to-transparent" />
                          
                          {/* 학생 아이콘 */}
                          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6] shadow-xl ring-4 ring-white">
                            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          
                          {/* 하트 아이콘 */}
                          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg">
                            <svg className="h-6 w-6 text-[#8055e1]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </div>
                          
                          {/* 선생님 아이콘 */}
                          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6] shadow-xl ring-4 ring-white">
                            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* 텍스트 */}
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">완벽한 매칭</p>
                          <p className="mt-2 text-sm text-gray-500">스마트 알고리즘으로<br />나에게 딱 맞는 파트너를 찾아드려요</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 주요 기능 소개 */}
        <section className="mt-20 px-4 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              튜매의 주요 기능
            </h2>
            <p className="text-lg text-gray-600">
              나에게 맞는 학습 파트너를 쉽게 찾아보세요
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* 학생 찾기 카드 */}
            <Link
              href="/students"
              className="group rounded-2xl bg-white/80 p-8 shadow-[0_4px_20px_rgba(128,85,225,0.08)] transition-all hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(128,85,225,0.15)]"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6]">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-[#8055e1] transition-colors">
                학생 찾기
              </h3>
              <p className="text-gray-600">
                튜터님을 찾는 학생들을 만나보세요. <br /> 다양한 학생들이 기다리고 있어요.
              </p>
            </Link>

            {/* 선생님 찾기 카드 */}
            <Link
              href="/tutors"
              className="group rounded-2xl bg-white/80 p-8 shadow-[0_4px_20px_rgba(128,85,225,0.08)] transition-all hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(128,85,225,0.15)]"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6]">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-[#8055e1] transition-colors">
                선생님 찾기
              </h3>
              <p className="text-gray-600">
                전문 튜터님들을 만나보세요. <br /> 나에게 맞는 선생님을 찾아 <br /> 더 효과적으로 학습하세요.
              </p>
            </Link>

            {/* 커뮤니티 카드 */}
            <Link
              href="/community"
              className="group rounded-2xl bg-white/80 p-8 shadow-[0_4px_20px_rgba(128,85,225,0.08)] transition-all hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(128,85,225,0.15)]"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6]">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-[#8055e1] transition-colors">
                커뮤니티
              </h3>
              <p className="text-gray-600">
                함께 성장할 수 있는 커뮤니티가 있어요. <br/> 질문하고 정보를 공유하며 소통해보세요.
              </p>
            </Link>
          </div>
        </section>

        {/* 서비스 특징 */}
        <section className="mt-20 px-4 md:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#f1ebff] to-white p-12 md:p-16">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                왜 튜매인가요?
              </h2>
              <p className="text-lg text-gray-600">
                튜매만의 특별한 장점을 확인해보세요
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#8055e1]/10">
                  <svg
                    className="h-8 w-8 text-[#8055e1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">정확한 매칭</h3>
                <p className="text-sm text-gray-600">
                  나에게 맞는 튜터와 학생을 <br /> 스마트하게 매칭해드려요
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#8055e1]/10">
                  <svg
                    className="h-8 w-8 text-[#8055e1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">유연한 스케줄</h3>
                <p className="text-sm text-gray-600">
                  언제 어디서나 <br /> 나에게 맞는 시간에 학습할 수 있어요
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#8055e1]/10">
                  <svg
                    className="h-8 w-8 text-[#8055e1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">활발한 커뮤니티</h3>
                <p className="text-sm text-gray-600">
                  함께 성장하는 학습자들과 <br /> 커뮤니티에서 정보를 공유해요
          </p>
        </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#8055e1]/10">
                  <svg
                    className="h-8 w-8 text-[#8055e1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">안전한 환경</h3>
                <p className="text-sm text-gray-600">
                  신뢰할 수 있는 튜터와 학생만 함께하는 안전한 플랫폼이에요
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="mt-20 mb-12 px-4 md:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#8055e1] to-[#9d7aff] px-8 py-16 text-center shadow-2xl">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              지금 바로 시작해보세요
            </h2>
            <p className="mb-8 text-lg text-white/90">
              튜매와 함께 성장하는 학습 여정을 시작하세요
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#8055e1] shadow-lg transition hover:bg-gray-50 hover:shadow-xl"
              >
                회원가입하기
              </Link>
              <Link
                href="/login"
                className="rounded-xl border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                로그인하기
              </Link>
            </div>
        </div>
        </section>
    </div>
    </>
  );
}
