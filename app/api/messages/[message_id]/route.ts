import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ message_id: string }> | { message_id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const messageId = resolvedParams.message_id;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");

    if (!messageId) {
      return NextResponse.json(
        { message: "message_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "user_id는 필수 쿼리 파라미터입니다." },
        { status: 400 }
      );
    }

    console.log("=== 쪽지 상세 조회 API 라우트 ===");
    console.log("message_id:", messageId);
    console.log("user_id:", userId);

    // Query parameter로 user_id 전달
    const queryParams = new URLSearchParams({
      user_id: String(userId),
    });

    const apiUrl = `${getApiUrl(`/messages/${messageId}`)}?${queryParams.toString()}`;
    console.log("백엔드 API 호출 URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("쪽지 상세 조회 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(result, null, 2),
      });
      return NextResponse.json(result, {
        status: response.status,
      });
    }

    // API 응답 구조: { message, status_code, data }
    // data 필드가 있으면 data를 반환, 없으면 원본 응답 반환
    if (result.data) {
      return NextResponse.json(result.data, {
        status: 200,
      });
    }

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("쪽지 상세 조회 API 프록시 오류:", error);
    return NextResponse.json(
      {
        message: "서버 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

