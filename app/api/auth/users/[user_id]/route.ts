import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> | { user_id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const userId = resolvedParams.user_id;

    console.log("=== 회원탈퇴 API 라우트 ===");
    console.log("user_id:", userId);

    if (!userId) {
      return NextResponse.json(
        { message: "user_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    // 인증 토큰 가져오기
    const authHeader = request.headers.get("authorization");
    const accessToken = authHeader?.replace("Bearer ", "") || request.headers.get("x-access-token");

    if (!accessToken) {
      return NextResponse.json(
        { message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const apiUrl = getApiUrl(`/auth/users/${userId}`);
    console.log("백엔드 API 호출 URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("회원탈퇴 API 에러 응답:", {
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
    console.error("회원탈퇴 API 프록시 오류:", error);
    return NextResponse.json(
      { 
        message: "서버 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

