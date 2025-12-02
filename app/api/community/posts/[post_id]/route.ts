import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ post_id: string }> | { post_id: string } }
) {
  try {
    // Next.js 15에서는 params가 Promise일 수 있음
    const resolvedParams = await Promise.resolve(params);
    const postId = resolvedParams.post_id;

    console.log("=== 게시글 상세 조회 API 라우트 ===");
    console.log("받은 params:", resolvedParams);
    console.log("추출된 post_id:", postId);

    if (!postId) {
      console.error("post_id가 없습니다. params:", resolvedParams);
      return NextResponse.json(
        { message: "post_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    const apiUrl = getApiUrl(`/community/posts/${postId}`);
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
      console.error("게시글 상세 조회 API 에러 응답:", {
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
    console.error("게시글 상세 조회 API 프록시 오류:", error);
    console.error("에러 상세:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { 
        message: "서버 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

