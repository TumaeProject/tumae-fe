/**
 * API 기본 URL
 * 환경 변수 NEXT_PUBLIC_API_URL이 설정되어 있으면 사용하고,
 * 없으면 기본값으로 Render 서버 URL을 사용합니다.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tumae-api.onrender.com";

/**
 * API 엔드포인트 URL 생성
 */
export function getApiUrl(endpoint: string): string {
  // endpoint가 이미 전체 URL인 경우 그대로 반환
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  // endpoint가 /로 시작하지 않으면 추가
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // API_BASE_URL이 이미 /로 끝나면 제거
  const baseUrl = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  return `${baseUrl}${normalizedEndpoint}`;
}

