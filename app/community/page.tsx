"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = ["전체", "질문하기", "정보공유", "자유게시판", "스터디 모집"];
const SORT_OPTIONS = ["최신순", "인기순", "댓글순"];

type Post = {
  id: number;
  title: string;
  author: string;
  category: string;
  content: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  isHot?: boolean;
};

// 더미 데이터 (추후 API 연동 시 제거)
const SAMPLE_POSTS: Post[] = [
  {
    id: 1,
    title: "React 학습 방법에 대해 조언 부탁드려요",
    author: "김학생",
    category: "질문하기",
    content: "React를 처음 배우기 시작했는데, 어떤 순서로 공부하는 게 좋을까요? 실무에서 자주 사용하는 패턴이 있다면 알려주세요!",
    views: 142,
    likes: 23,
    comments: 15,
    createdAt: "2시간 전",
    isHot: true,
  },
  {
    id: 2,
    title: "Spring Boot 프로젝트 구조 베스트 프랙티스",
    author: "박튜터",
    category: "정보공유",
    content: "실무에서 사용하는 Spring Boot 프로젝트 구조를 정리해봤어요. 레이어드 아키텍처 기반으로 설계했습니다.",
    views: 256,
    likes: 45,
    comments: 12,
    createdAt: "5시간 전",
    isHot: true,
  },
  {
    id: 3,
    title: "프론트엔드 개발자 모임 (온라인)",
    author: "이모임장",
    category: "스터디 모집",
    content: "주 2회 온라인으로 모여서 프로젝트를 함께 진행합니다. 관심 있으신 분들 환영해요!",
    views: 89,
    likes: 34,
    comments: 8,
    createdAt: "1일 전",
  },
  {
    id: 4,
    title: "코딩 테스트 준비 팁 공유합니다",
    author: "최준비생",
    category: "정보공유",
    content: "카카오 코딩테스트 합격 후기와 준비 방법을 공유합니다. 알고리즘 문제 풀이 전략 위주로 작성했어요.",
    views: 312,
    likes: 67,
    comments: 24,
    createdAt: "2일 전",
  },
  {
    id: 5,
    title: "TypeScript vs JavaScript 어떤 걸 배워야 할까요?",
    author: "정초보",
    category: "질문하기",
    content: "웹 개발을 시작하려고 하는데, TypeScript를 바로 배워야 할지 JavaScript부터 시작해야 할지 고민이에요.",
    views: 198,
    likes: 31,
    comments: 19,
    createdAt: "3일 전",
  },
];

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/community/${post.id}`}
      className="group block rounded-2xl bg-white/80 p-6 shadow-[0_4px_20px_rgba(128,85,225,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(128,85,225,0.15)]"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              post.category === "질문하기"
                ? "bg-[#fef3c7] text-[#d97706]"
                : post.category === "정보공유"
                ? "bg-[#dbeafe] text-[#2563eb]"
                : post.category === "스터디 모집"
                ? "bg-[#fce7f3] text-[#db2777]"
                : "bg-[#f3e8ff] text-[#8055e1]"
            }`}
          >
            {post.category}
          </span>
          {post.isHot && (
            <span className="rounded-full bg-[#fee2e2] px-2 py-1 text-xs font-semibold text-[#dc2626]">
              🔥 인기
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">{post.createdAt}</span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#8055e1] transition-colors line-clamp-2">
        {post.title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.content}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6] text-sm font-semibold text-white">
            {post.author.charAt(0)}
          </div>
          <span className="text-sm font-medium text-gray-700">{post.author}</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {post.views}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedSort, setSelectedSort] = useState("최신순");

  const filteredPosts = SAMPLE_POSTS.filter(
    (post) => selectedCategory === "전체" || post.category === selectedCategory
  );

  return (
    <>
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(128,85,225,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,162,216,0.18),_transparent_45%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/65 to-white" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col gap-8 px-4 py-12">
        {/* 헤더 */}
        <header className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-block rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8055e1] shadow-sm mb-4">
                Community
              </span>
              <h1 className="text-3xl font-bold leading-snug text-gray-900 md:text-4xl">
                함께 성장하는
                <br className="hidden md:block" />{" "}
                <span className="text-[#8055e1]">튜매</span> 커뮤니티
              </h1>
              <p className="mt-2 text-base text-gray-600 md:text-lg">
                학습 중 생긴 질문부터 정보 공유까지, 다양한 주제로 소통해요.
              </p>
            </div>
            <Link
              href="/community/write"
              className="w-full rounded-xl bg-[#8055e1] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#6f48d8] hover:shadow-xl md:w-auto"
            >
              글 작성하기
            </Link>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap items-center gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  selectedCategory === category
                    ? "bg-[#8055e1] text-white"
                    : "bg-white/80 text-[#5b36d4] border border-[#e5dbff]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 정렬 옵션 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              총 <span className="font-semibold text-[#8055e1]">{filteredPosts.length}</span>개의 게시글
            </span>
            <div className="flex items-center gap-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedSort(option)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    selectedSort === option
                      ? "bg-[#8055e1] text-white"
                      : "bg-white/80 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* 게시글 목록 */}
        <section className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="rounded-2xl bg-white/80 p-12 text-center shadow-[0_4px_20px_rgba(128,85,225,0.08)]">
              <p className="text-gray-500">등록된 게시글이 없어요.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

