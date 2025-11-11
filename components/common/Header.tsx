"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "학생 찾기", href: "/students" },
  { label: "선생님 찾기", href: "/tutors" },
  { label: "커뮤니티", href: "/community" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-400 bg-white">
      <div className="flex h-20 w-full items-center justify-between px-10">
        <div className="flex items-center gap-12">
          <Link href="/" className="relative h-10 w-[137px]">
            <Image
              src="/header/header_logo.svg"
              alt="Tumae 로고"
              fill
              priority
              sizes="137px"
              className="object-contain"
            />
          </Link>

          <nav className="flex items-center gap-10 text-base font-semibold">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`transition-colors ${
                    isActive ? "text-[#8055e1]" : "text-gray-900 hover:text-[#102c57]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className={`flex h-11 min-w-[104px] items-center justify-center rounded-xl border px-6 text-sm font-semibold transition ${
              pathname.startsWith("/login")
                ? "border-[#8055e1] bg-[#f1ebff] text-[#8055e1]"
                : "border-gray-400 text-gray-800 hover:border-[#8055e1] hover:bg-[#f1ebff] hover:text-[#8055e1]"
            }`}
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className={`flex h-11 min-w-[104px] items-center justify-center rounded-xl border px-6 text-sm font-semibold transition ${
              pathname.startsWith("/signup")
                ? "border-[#8055e1] bg-[#f1ebff] text-[#8055e1]"
                : "border-gray-400 text-gray-800 hover:border-[#8055e1] hover:bg-[#f1ebff] hover:text-[#8055e1]"
            }`}
          >
            회원 가입
          </Link>
        </div>
      </div>
    </header>
  );
}

