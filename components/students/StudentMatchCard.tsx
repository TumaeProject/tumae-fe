"use client";

type StudentMatchCardProps = {
  name: string;
  tag: string;
  purposes: string[];
  subjects: string[];
  priceLabel: string;
};

export function StudentMatchCard({
  name,
  tag,
  purposes,
  subjects,
  priceLabel,
}: StudentMatchCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#ede6ff] via-white to-[#f8efff] p-[1px] shadow-[0_20px_40px_rgba(128,85,225,0.12)] transition duration-300 hover:-translate-y-1">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative flex h-full flex-col gap-6 rounded-[28px] bg-white/90 px-8 py-7 text-[#3a2f6d] backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6] text-xl font-semibold text-white shadow-lg">
              {name.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold text-[#2b2353]">{name}</p>
              <p className="mt-1 text-sm text-[#7b6fae]">{priceLabel}</p>
            </div>
          </div>
          <span className="rounded-full bg-[#efe6ff] px-3 py-1 text-xs font-semibold text-[#7056d8]">
            {tag}
          </span>
        </div>

        <div className="flex flex-col gap-4 text-sm text-[#514874]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#8a7dd4]">목적</span>
            {purposes.map((purpose) => (
              <span
                key={purpose}
                className="rounded-full bg-[#f3edff] px-3 py-1 text-xs font-medium text-[#5f4bb0]"
              >
                {purpose}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#8a7dd4]">과목</span>
            {subjects.map((subject) => (
              <span
                key={subject}
                className="rounded-full bg-[#e7f0ff] px-3 py-1 text-xs font-medium text-[#3465d8]"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#8a80bd]">
          <span>최근 업데이트 · 2일 전</span>
          <button
            type="button"
            className="rounded-full bg-[#7056d8] px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-[#5b43c1]"
          >
            상세 보기
          </button>
        </div>
      </div>
    </div>
  );
}

