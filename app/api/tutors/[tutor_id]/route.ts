import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tutor_id: string }> | { tutor_id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const tutorId = resolvedParams.tutor_id;

    if (!tutorId) {
      return NextResponse.json(
        { message: "tutor_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    const apiUrl = getApiUrl(`/api/tutors/${tutorId}`);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("선생님 상세 정보 조회 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(data, null, 2),
      });
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("선생님 상세 정보 조회 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

