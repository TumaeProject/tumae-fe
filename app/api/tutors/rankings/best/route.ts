import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "3";

    const apiUrl = `${getApiUrl("/api/tutors/rankings/best")}?limit=${limit}`;
    
    console.log("=== 채택 많이 받은 선생님 조회 API 라우트 ===");
    console.log("URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("채택 많이 받은 선생님 조회 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(result, null, 2),
      });
      return NextResponse.json(result, {
        status: response.status,
      });
    }

    // 성공 응답
    console.log("채택 많이 받은 선생님 조회 API 성공:", {
      status: response.status,
    });

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("채택 많이 받은 선생님 조회 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

