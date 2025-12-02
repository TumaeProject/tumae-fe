import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ post_id: string }> | { post_id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const postId = resolvedParams.post_id;

    console.log("=== 답변 등록 API 라우트 ===");
    console.log("post_id:", postId);

    if (!postId) {
      return NextResponse.json(
        { message: "post_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("요청 본문:", body);

    if (!body.author_id || !body.body) {
      return NextResponse.json(
        { message: "author_id와 body는 필수 필드입니다." },
        { status: 400 }
      );
    }

    // Swagger 명세에 따르면 author_id와 body는 query parameters로 전송해야 함
    const queryParams = new URLSearchParams({
      author_id: String(body.author_id),
      body: body.body,
    });

    const apiUrl = `${getApiUrl(`/community/posts/${postId}/answers`)}?${queryParams.toString()}`;
    console.log("백엔드 API 호출 URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("답변 등록 API 에러 응답:", {
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
        status: 201,
      });
    }

    // data 필드가 없는 경우 원본 응답 반환
    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("답변 등록 API 프록시 오류:", error);
    return NextResponse.json(
      { 
        message: "서버 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

