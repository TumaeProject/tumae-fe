"use client";

type TutorMatchCardProps = {
  tutorId?: number;
  name: string;
  tag: string;
  purposes: string[];
  subjects: string[];
  regions: string[];
  priceLabel: string;
  matchScore?: number;
  onDetailClick?: (tutorId: number) => void;
};

export function TutorMatchCard({
  tutorId,
  name,
  tag,
  purposes,
  subjects,
  regions,
  priceLabel,
  matchScore,
  onDetailClick,
}: TutorMatchCardProps) {
  const handleDetailClick = () => {
    console.log("handleDetailClick 호출됨, tutorId:", tutorId, "onDetailClick:", onDetailClick);
    
    if (!tutorId) {
      console.error("tutorId가 없습니다. 상세 보기를 열 수 없습니다.");
      alert("선생님 정보를 불러올 수 없습니다. 페이지를 새로고침해주세요.");
      return;
    }
    
    if (onDetailClick) {
      console.log("상세 보기 클릭, tutorId:", tutorId);
      onDetailClick(tutorId);
    } else {
      console.error("onDetailClick 함수가 없습니다!");
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#ede6ff] via-white to-[#f8efff] p-[1px] shadow-[0_20px_40px_rgba(128,85,225,0.12)] transition duration-300 hover:-translate-y-1">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative flex h-full flex-col gap-6 rounded-[28px] bg-white/90 px-8 py-7 text-[#3a2f6d] backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8e6dff] to-[#5b3ad6] text-xl font-semibold text-white shadow-lg">
              {name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-[#2b2353]">{name}</p>
                {matchScore !== undefined && (
                  <span className="rounded-full bg-[#efe6ff] px-2 py-0.5 text-[11px] font-semibold text-[#7056d8] whitespace-nowrap">
                    매칭 {matchScore}점
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-[#7b6fae] whitespace-nowrap">{priceLabel}</p>
            </div>
          </div>
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

          {regions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8a7dd4]">지역</span>
              {regions.map((region) => (
                <span
                  key={region}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {region}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end text-xs text-[#8a80bd]">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("버튼 클릭 이벤트 발생!");
              handleDetailClick();
            }}
            className="rounded-full bg-[#7056d8] px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-[#5b43c1] z-10 relative"
          >
            상세 보기
          </button>
        </div>
      </div>
    </div>
  );
}

