import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 인증 토큰 가져오기 (선택 사항)
    const authHeader = request.headers.get("authorization");
    const accessToken = authHeader?.replace("Bearer ", "") || request.headers.get("x-access-token");

    // 헤더 구성
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Authorization 헤더 추가 (토큰이 있는 경우)
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(getApiUrl("/auth/logout"), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("로그아웃 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(data, null, 2),
      });
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("로그아웃 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

