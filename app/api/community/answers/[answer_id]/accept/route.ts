import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ answer_id: string }> | { answer_id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const answerId = resolvedParams.answer_id;

    console.log("=== 답변 채택 API 라우트 ===");
    console.log("answer_id:", answerId);

    if (!answerId) {
      return NextResponse.json(
        { message: "answer_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("요청 본문:", body);

    if (!body.user_id) {
      return NextResponse.json(
        { message: "user_id는 필수 필드입니다." },
        { status: 400 }
      );
    }

    // Swagger 명세에 따르면 user_id는 query parameter로 전송해야 함
    const queryParams = new URLSearchParams({
      user_id: String(body.user_id),
    });

    const apiUrl = `${getApiUrl(`/community/answers/${answerId}/accept`)}?${queryParams.toString()}`;
    console.log("백엔드 API 호출 URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("답변 채택 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(result, null, 2),
      });
      return NextResponse.json(result, {
        status: response.status,
      });
    }

    // API 응답 구조: { message, status_code, data }
    // data 필드를 직접 반환하도록 수정
    if (result.data) {
      return NextResponse.json(result.data, {
        status: 200,
      });
    }

    // data 필드가 없는 경우 원본 응답 반환
    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("답변 채택 API 프록시 오류:", error);
    return NextResponse.json(
      { 
        message: "서버 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

