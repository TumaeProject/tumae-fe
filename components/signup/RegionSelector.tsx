"use client";

import { useState } from "react";
import { REGION_OPTIONS, REGION_ID_MAP, SEOUL_DISTRICTS, SEOUL_DISTRICT_ID_MAP, BUSAN_DISTRICTS, BUSAN_DISTRICT_ID_MAP, DAEGU_DISTRICTS, INCHEON_DISTRICTS, GWANGJU_DISTRICTS, DAEJEON_DISTRICTS, ULSAN_DISTRICTS, GYEONGGI_DISTRICTS, GANGWON_DISTRICTS, CHUNGBUK_DISTRICTS, CHUNGNAM_DISTRICTS, JEONBUK_DISTRICTS, JEONNAM_DISTRICTS, GYEONGBUK_DISTRICTS, GYEONGNAM_DISTRICTS, JEJU_DISTRICTS } from "@/components/signup/onboardingOptions";

type RegionSelectorProps = {
  selectedRegions: string[];
  onChange: (regions: string[]) => void;
};

/**
 * 지역 선택 컴포넌트 (2단계: 시/도 → 시/군/구)
 */
export function RegionSelector({ selectedRegions, onChange }: RegionSelectorProps) {
  const [selectedSido, setSelectedSido] = useState<string | null>(null);
  
  // 선택된 시/도에 해당하는 시/군/구 목록 반환
  const getDistrictsForSido = (sido: string): string[] => {
    // TODO: 백엔드에서 동적으로 가져오기
    // 현재는 서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원만 하드코딩
    if (sido === "서울특별시") {
      return SEOUL_DISTRICTS;
    }
    if (sido === "부산광역시") {
      return BUSAN_DISTRICTS;
    }
    if (sido === "대구광역시") {
      return DAEGU_DISTRICTS;
    }
    if (sido === "인천광역시") {
      return INCHEON_DISTRICTS;
    }
    if (sido === "광주광역시") {
      return GWANGJU_DISTRICTS;
    }
    if (sido === "대전광역시") {
      return DAEJEON_DISTRICTS;
    }
    if (sido === "울산광역시") {
      return ULSAN_DISTRICTS;
    }
    if (sido === "경기도") {
      return GYEONGGI_DISTRICTS;
    }
    if (sido === "강원특별자치도") {
      return GANGWON_DISTRICTS;
    }
    if (sido === "충청북도") {
      return CHUNGBUK_DISTRICTS;
    }
    if (sido === "충청남도") {
      return CHUNGNAM_DISTRICTS;
    }
    if (sido === "전라북도") {
      return JEONBUK_DISTRICTS;
    }
    if (sido === "전라남도") {
      return JEONNAM_DISTRICTS;
    }
    if (sido === "경상북도") {
      return GYEONGBUK_DISTRICTS;
    }
    if (sido === "경상남도") {
      return GYEONGNAM_DISTRICTS;
    }
    if (sido === "제주특별자치도") {
      return JEJU_DISTRICTS;
    }
    // 다른 시/도는 추후 백엔드에서 가져오기
    return [];
  };

  const handleSidoToggle = (sido: string) => {
    if (selectedSido === sido) {
      setSelectedSido(null);
    } else {
      setSelectedSido(sido);
    }
  };

  const handleDistrictToggle = (district: string) => {
    const fullName = selectedSido ? `${selectedSido} ${district}` : district;
    if (selectedRegions.includes(fullName)) {
      onChange(selectedRegions.filter((r) => r !== fullName));
    } else {
      onChange([...selectedRegions, fullName]);
    }
  };

  const isDistrictSelected = (district: string) => {
    const fullName = selectedSido ? `${selectedSido} ${district}` : district;
    return selectedRegions.includes(fullName);
  };

  return (
    <div className="space-y-4">
      {/* 시/도 선택 */}
      <div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {REGION_OPTIONS.map((sido) => (
            <button
              key={sido}
              type="button"
              onClick={() => handleSidoToggle(sido)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                selectedSido === sido
                  ? "border-[#8055e1] bg-[#f1ebff] text-[#8055e1]"
                  : "border-gray-300 text-gray-700 hover:border-[#8055e1] hover:text-[#8055e1]"
              }`}
            >
              {sido}
            </button>
          ))}
        </div>
      </div>

      {/* 시/군/구 선택 */}
      {selectedSido && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{selectedSido} 시/군/구를 선택해주세요</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {getDistrictsForSido(selectedSido).map((district) => (
              <button
                key={district}
                type="button"
                onClick={() => handleDistrictToggle(district)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  isDistrictSelected(district)
                    ? "border-[#8055e1] bg-[#f1ebff] text-[#8055e1]"
                    : "border-gray-300 text-gray-700 hover:border-[#8055e1] hover:text-[#8055e1]"
                }`}
              >
                {district}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 선택된 지역 표시 */}
      {selectedRegions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">선택된 지역 ({selectedRegions.length}개)</p>
          <div className="flex flex-wrap gap-2">
            {selectedRegions.map((region) => (
              <span
                key={region}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f1ebff] border border-[#8055e1] text-[#8055e1] rounded-lg text-sm font-medium"
              >
                {region}
                <button
                  type="button"
                  onClick={() => onChange(selectedRegions.filter((r) => r !== region))}
                  className="hover:text-[#6f48d8] transition text-base leading-none"
                  aria-label="삭제"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

