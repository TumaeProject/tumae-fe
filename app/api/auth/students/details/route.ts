import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // 요청 데이터 로깅 (디버깅용)
    console.log("학생 상세 정보 업데이트 요청:", JSON.stringify(body, null, 2));

    const response = await fetch(`${API_BASE_URL}/auth/students/details`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("학생 상세 정보 업데이트 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(data, null, 2),
      });
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("학생 상세 정보 업데이트 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

